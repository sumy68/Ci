"""
Vorher/Nachher: Vorher-Bild AUSSCHLIESSLICH aus den Pixeln des Nachher-Bildes
plus prozedural erzeugter Verschmutzung. Keine Geometrie aus anderen Bildern.

Alle Effekte sind reine Farb-/Helligkeitsoperationen (Multiplizieren,
Überblenden) auf festen Bildbereichen -> Kanten bleiben exakt an ihrer Stelle.

  fassade : Grauschleier, Witterungsstreifen unter Fensterbänken, Algen im Sockel,
            stumpfe Scheiben, verschmutztes Pflaster
  fenster : Milchiger Film, Wasserflecken, Schlieren/Tropfspuren, Schmutzrand
            unten, staubige Fensterbank
  innen   : Staubfilm auf Stufen und Boden, Fußspuren, Schmutz in Ecken,
            Scheuerspuren an der Wand

Aufruf: python3 _src/tools/va_dirt.py <nachher-ordner> <ziel-ordner>
Bereiche sind in Prozent der Bildbreite/-höhe angegeben (fest für diese Motive).
"""
import sys
from pathlib import Path

import cv2
import numpy as np

SEED = 20261117


# ---------------------------------------------------------------- Hilfsfunktionen
def fbm(shape, rng, scales=(160, 60, 22, 8), weights=(0.5, 0.28, 0.15, 0.07)):
    """Fraktales Rauschen 0..1 (mehrere Oktaven weichgezeichnetes Zufallsrauschen)."""
    h, w = shape
    acc = np.zeros((h, w), np.float32)
    for s, wt in zip(scales, weights):
        n = rng.random((h, w)).astype(np.float32)
        n = cv2.GaussianBlur(n, (0, 0), s / 3)
        n = (n - n.min()) / (np.ptp(n) + 1e-6)
        acc += wt * n
    return (acc - acc.min()) / (np.ptp(acc) + 1e-6)


def poly_mask(shape, pts_pct, feather=4.0):
    """Polygon in Prozent -> weiche Maske 0..1."""
    h, w = shape
    pts = np.array([[x * w / 100, y * h / 100] for x, y in pts_pct], np.int32)
    m = np.zeros((h, w), np.uint8)
    cv2.fillPoly(m, [pts], 255)
    m = m.astype(np.float32) / 255
    return cv2.GaussianBlur(m, (0, 0), feather) if feather else m


def ramp_y(shape, y0, y1):
    """Vertikaler Verlauf 0 (bei y0 %) -> 1 (bei y1 %)."""
    h, w = shape
    y = np.linspace(0, 100, h, dtype=np.float32)[:, None]
    r = np.clip((y - y0) / (y1 - y0), 0, 1)
    return np.repeat(r * r * (3 - 2 * r), w, axis=1)


def multiply(img, mask, factor):
    """Abdunkeln/Einfärben: img * (1 - m + m*factor) je Kanal (factor = BGR 0..1)."""
    f = np.array(factor, np.float32)[None, None, :]
    m = mask[..., None]
    return img * (1 - m + m * f)


def blend(img, mask, color):
    """Überblenden Richtung Farbe (Schleier/Film)."""
    c = np.array(color, np.float32)[None, None, :]
    m = mask[..., None]
    return img * (1 - m) + c * m


def luminance(img):
    return cv2.cvtColor(np.clip(img, 0, 255).astype(np.uint8), cv2.COLOR_BGR2GRAY).astype(np.float32)


def streaks_below(seed, length_px, rng, decay_jitter=0.35):
    """Vertikale Ablaufspuren: von Saatpunkten nach unten auslaufend (spaltenweise Zufall)."""
    h, w = seed.shape
    base = np.exp(-1.0 / max(4.0, length_px))
    col_decay = np.clip(base + (rng.random(w).astype(np.float32) - 0.5) * decay_jitter * (1 - base), 0.80, 0.995)
    col_gain = cv2.GaussianBlur(rng.random((1, w)).astype(np.float32), (0, 0), 2.0)[0]
    col_gain = (col_gain - col_gain.min()) / (np.ptp(col_gain) + 1e-6)
    out = np.zeros_like(seed)
    run = np.zeros(w, np.float32)
    for y in range(h):
        run = np.maximum(seed[y] * (0.4 + 0.6 * col_gain), run * col_decay)
        out[y] = run
    return cv2.GaussianBlur(out, (0, 0), 1.1)


def ring_spots(shape, mask, count, rng, rmin=2, rmax=10):
    """Eingetrocknete Wasserflecken: heller Rand, minimal dunkler Kern."""
    h, w = shape
    light = np.zeros((h, w), np.float32)
    dark = np.zeros((h, w), np.float32)
    ys, xs = np.nonzero(mask > 0.5)
    if len(xs) == 0:
        return light, dark
    idx = rng.integers(0, len(xs), count)
    for i in idx:
        x, y = int(xs[i]), int(ys[i])
        r = int(rmin + (rmax - rmin) * rng.random() ** 2.2)
        cv2.ellipse(light, (x, y), (r, int(r * rng.uniform(0.8, 1.15))), 0, 0, 360, float(rng.uniform(0.35, 0.8)), 1, cv2.LINE_AA)
        cv2.circle(dark, (x, y), max(1, r - 1), float(rng.uniform(0.04, 0.12)), -1, cv2.LINE_AA)
    return cv2.GaussianBlur(light, (0, 0), 0.6), cv2.GaussianBlur(dark, (0, 0), 0.8)


def drip_lines(shape, mask, count, rng):
    """Schlieren/Tropfspuren auf Glas: leicht gewellte, nach unten auslaufende Linien."""
    h, w = shape
    layer = np.zeros((h, w), np.float32)
    ys, xs = np.nonzero(mask > 0.6)
    if len(xs) == 0:
        return layer
    for i in rng.integers(0, len(xs), count):
        x, y = float(xs[i]), float(ys[i])
        length = rng.uniform(0.06, 0.25) * h
        amp = rng.uniform(0.8, 3.0)
        pts = []
        for t in np.linspace(0, 1, 24):
            pts.append([x + amp * np.sin(t * rng.uniform(4, 9)), y + t * length])
        cv2.polylines(layer, [np.array(pts, np.int32)], False, float(rng.uniform(0.25, 0.6)), int(rng.integers(1, 3)), cv2.LINE_AA)
    return cv2.GaussianBlur(layer, (0, 0), 0.9)


def footprints(shape, mask, count, rng, scale=1.0):
    """Schuhabdrücke (Sohle + Absatz) mit Profilstreifen, zufällig gedreht."""
    h, w = shape
    layer = np.zeros((h, w), np.float32)
    ys, xs = np.nonzero(mask > 0.7)
    if len(xs) == 0:
        return layer
    for i in rng.integers(0, len(xs), count):
        cx, cy = float(xs[i]), float(ys[i])
        L = rng.uniform(16, 26) * scale
        ang = rng.uniform(-35, 35)
        stamp = np.zeros((h, w), np.float32)
        cv2.ellipse(stamp, (int(cx), int(cy)), (int(L * 0.55), int(L * 0.24)), ang, 0, 360, 1.0, -1, cv2.LINE_AA)
        hx = cx - np.cos(np.radians(ang)) * L * 0.85
        hy = cy - np.sin(np.radians(ang)) * L * 0.85
        cv2.ellipse(stamp, (int(hx), int(hy)), (int(L * 0.26), int(L * 0.2)), ang, 0, 360, 1.0, -1, cv2.LINE_AA)
        tread = (np.sin(np.arange(w, dtype=np.float32)[None, :] * 1.4 + np.arange(h, dtype=np.float32)[:, None] * 0.6) > 0.1).astype(np.float32)
        layer = np.maximum(layer, stamp * (0.55 + 0.45 * tread) * rng.uniform(0.45, 0.85))
    return cv2.GaussianBlur(layer, (0, 0), 0.9)


def scuffs(shape, mask, count, rng):
    """Kurze dunkle Scheuer-/Kratzspuren an Wänden."""
    h, w = shape
    layer = np.zeros((h, w), np.float32)
    ys, xs = np.nonzero(mask > 0.7)
    if len(xs) == 0:
        return layer
    for i in rng.integers(0, len(xs), count):
        x, y = float(xs[i]), float(ys[i])
        ang = np.radians(rng.uniform(-25, 25))
        L = rng.uniform(18, 60)
        p2 = (int(x + np.cos(ang) * L), int(y + np.sin(ang) * L))
        cv2.line(layer, (int(x), int(y)), p2, float(rng.uniform(0.3, 0.6)), int(rng.integers(2, 5)), cv2.LINE_AA)
    return cv2.GaussianBlur(layer, (0, 0), 0.8)


# ---------------------------------------------------------------- Motive
def dirty_fassade(img, rng):
    shape = img.shape[:2]
    out = img.astype(np.float32)
    L = luminance(out)
    sat = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)[..., 1].astype(np.float32)
    facade = poly_mask(shape, [(7, 0), (100, 0), (100, 89), (7, 89)], 2)
    stone = facade * np.clip((L - 120) / 40, 0, 1) * np.clip((70 - sat) / 40, 0, 1)
    stone = cv2.GaussianBlur(stone, (0, 0), 1.2)
    glass = facade * (1 - stone)

    # 1) Grauschleier: Stein wird stumpf, leicht bräunlich-grau, wolkig
    veil = stone * (0.55 + 0.45 * fbm(shape, rng))
    out = multiply(out, veil, (0.80, 0.83, 0.86))

    # 2) Witterungsstreifen unter Fensterbänken: Kante dunkel (oben) -> hell (unten)
    gy = cv2.Sobel(cv2.GaussianBlur(L, (0, 0), 1.0), cv2.CV_32F, 0, 1, ksize=3)
    seed = np.clip(gy / 120.0, 0, 1) * (stone > 0.5)
    seed = (seed > 0.2).astype(np.float32)
    seed *= (rng.random(seed.shape) > 0.1)
    streak = streaks_below(seed, length_px=0.16 * shape[0], rng=rng) * stone
    streak *= 0.6 + 0.4 * fbm(shape, rng, scales=(40, 12, 4, 2))
    out = multiply(out, np.clip(streak * 1.1, 0, 0.85), (0.50, 0.53, 0.56))

    # 3) Algen/Grünbelag im Sockel
    algae = ramp_y(shape, 60, 86) * stone * np.clip(fbm(shape, rng, scales=(90, 30, 10, 4)) * 1.8 - 0.3, 0, 1)
    out = multiply(out, algae * 0.9, (0.52, 0.72, 0.60))

    # 4) Scheiben stumpf/staubig
    out = blend(out, glass * 0.18 * fbm(shape, rng), (205, 205, 200))

    # 5) Pflaster vor dem Gebäude verschmutzt
    ground = poly_mask(shape, [(0, 89), (100, 89), (100, 100), (0, 100)], 3)
    out = multiply(out, ground * fbm(shape, rng, scales=(60, 20, 6, 2)) * 0.6, (0.72, 0.74, 0.76))
    return out


def dirty_fenster(img, rng):
    shape = img.shape[:2]
    out = img.astype(np.float32)
    panes = np.maximum.reduce([
        poly_mask(shape, [(16.3, 10.5), (31.4, 10), (31.4, 82.5), (16.3, 82.5)], 1.5),
        poly_mask(shape, [(37.4, 7.2), (52.5, 0), (87.6, 0), (87.6, 86), (37.4, 83.5)], 1.5),
        poly_mask(shape, [(96.2, 0), (100, 0), (100, 90), (96.2, 90)], 1.5),
    ])
    film = fbm(shape, rng)
    # 1) Milchiger Film (ungleichmäßig, zu den Rändern stärker)
    edge = 1 - cv2.GaussianBlur(cv2.erode((panes > 0.5).astype(np.uint8), np.ones((25, 25), np.uint8)).astype(np.float32), (0, 0), 30)
    haze = panes * np.clip(0.30 + 0.30 * film + 0.25 * edge, 0, 0.78)
    out = blend(out, haze, (222, 226, 228))
    # 2) Gelblich-brauner Schmutzrand unten in den Scheiben
    rim = panes * ramp_y(shape, 62, 84) * (0.5 + 0.5 * fbm(shape, rng, scales=(40, 14, 5, 2)))
    out = multiply(out, rim * 0.55, (0.66, 0.78, 0.86))
    # 3) Wasserflecken und 4) Schlieren
    light, dark = ring_spots(shape, panes, 420, rng, rmin=1, rmax=6)
    light *= panes
    dark *= panes
    out = out * (1 - dark[..., None]) + light[..., None] * 255 * 0.2
    drips = drip_lines(shape, panes, 90, rng) * (panes > 0.9)
    out = blend(out, drips * 0.45, (238, 240, 241))
    # Wischspuren: große, weiche hellere Bögen im Film
    smear = panes * np.clip(fbm(shape, rng, scales=(70, 25, 8, 3)) * 2.2 - 1.1, 0, 1)
    out = blend(out, smear * 0.25, (232, 234, 235))
    # 5) Staub auf der Fensterbank
    sill = poly_mask(shape, [(6, 86), (95, 87), (95, 93), (6, 92)], 2)
    out = blend(out, sill * 0.35 * fbm(shape, rng, scales=(30, 10, 4, 2)), (170, 168, 162))
    return out


def dirty_innen(img, rng):
    shape = img.shape[:2]
    out = img.astype(np.float32)
    # Stufen: rechte Kante folgt der Treppenwange (keine Spuren an der Wand)
    stairs = poly_mask(shape, [(51, 0), (82, 0), (90, 30), (97, 40), (100, 50), (100, 100), (52, 100), (56, 62)], 3)
    floor = poly_mask(shape, [(27, 74), (56, 74), (56, 100), (27, 100)], 3)
    walls = np.maximum(poly_mask(shape, [(0, 0), (27, 0), (27, 100), (0, 100)], 3),
                       poly_mask(shape, [(27, 0), (51, 0), (51, 73), (27, 73)], 3))
    walkable = np.maximum(stairs, floor)
    # 1) Staub-/Schmutzfilm auf Stufen und Boden (Glanz geht verloren)
    dust = walkable * (0.45 + 0.55 * fbm(shape, rng))
    out = multiply(out, dust * 0.65, (0.78, 0.80, 0.83))
    out = blend(out, dust * 0.16, (150, 146, 140))
    out = blend(out, floor * 0.22 * fbm(shape, rng, scales=(50, 16, 5, 2)), (160, 156, 150))
    # 2) Fußspuren (Laufweg: Treppenmitte und Boden)
    walk_path = walkable * np.clip(fbm(shape, rng, scales=(120, 40, 12, 4)) * 1.8 - 0.4, 0, 1)
    prints = footprints(shape, walk_path, 60, rng)
    out = multiply(out, prints, (0.50, 0.51, 0.53))
    # 3) Schmutz in Ecken/Kanten (Wand-Boden-Übergang)
    corner = cv2.GaussianBlur(cv2.dilate((walls > 0.5).astype(np.uint8), np.ones((9, 9), np.uint8)).astype(np.float32), (0, 0), 8) * walkable
    out = multiply(out, corner * 0.5, (0.70, 0.72, 0.74))
    # 4) Wände: leichter Grauschleier + Scheuerspuren in Griff-/Fußhöhe
    out = multiply(out, walls * 0.45 * fbm(shape, rng), (0.90, 0.91, 0.92))
    marks = scuffs(shape, walls * ramp_y(shape, 84, 96), 10, rng)
    marks = cv2.GaussianBlur(marks, (0, 0), 2.2)
    out = multiply(out, marks * 0.55, (0.62, 0.63, 0.65))
    return out


MOTIFS = {"fassade": dirty_fassade, "fenster": dirty_fenster, "innen": dirty_innen}
SEED_OFFSET = {"fassade": 1, "fenster": 2, "innen": 3}


def main(src_dir, dst_dir):
    src_dir, dst_dir = Path(src_dir), Path(dst_dir)
    dst_dir.mkdir(parents=True, exist_ok=True)
    for pid, fn in MOTIFS.items():
        nachher = cv2.imread(str(src_dir / f"{pid}-nachher.jpg"))
        if nachher is None:
            raise SystemExit(f"{pid}: Nachher-Bild fehlt")
        rng = np.random.default_rng(SEED + SEED_OFFSET[pid])
        vorher = np.clip(fn(nachher, rng), 0, 255).astype(np.uint8)
        cv2.imwrite(str(dst_dir / f"{pid}-vorher.jpg"), vorher, [cv2.IMWRITE_JPEG_QUALITY, 90])
        cv2.imwrite(str(dst_dir / f"{pid}-nachher.jpg"), nachher, [cv2.IMWRITE_JPEG_QUALITY, 90])
        print(f"✓ {pid}: Vorher prozedural aus Nachher-Pixeln ({vorher.shape[1]}×{vorher.shape[0]})")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit("Aufruf: va_dirt.py <nachher-ordner> <ziel-ordner>")
    main(sys.argv[1], sys.argv[2])
