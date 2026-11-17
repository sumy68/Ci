"""
Vorher/Nachher – Stufe b: deckungsgleiches Vorher-Bild aus dem Nachher-Bild.

Problem: Die KI-Paare sind global fast deckungsgleich, aber Details (Kanten,
Fensterrahmen, Bäume) sind lokal neu gemalt -> sichtbare Sprünge am Slider.
Lösung: Das Vorher-Bild besteht aus den Pixeln des Nachher-Bildes. Die
Verschmutzung wird als niederfrequente "Schmutzkarte" (Farb-/Helligkeits-
verhältnis vorher/nachher, weichgezeichnet) aus dem Original-Vorher-Bild
übertragen. Kanten und Geometrie bleiben dadurch exakt identisch.

Zusätzlich je Motiv eine dezente, prozedurale Feinstruktur (Staubkorn,
Wasserflecken auf Glas), damit es nicht wie ein Weichzeichner-Filter wirkt.

Aufruf:  python3 _src/tools/va_synth.py <original-ordner> <ziel-ordner>
"""
import sys
from pathlib import Path

import cv2
import numpy as np

# detail: Weichzeichnung auf glatten Flächen (klein = Fußspuren/Streifen bleiben scharf)
# base:   Weichzeichnung nahe Kanten (groß = keine Geisterkonturen bei lokalem Versatz)
# lo/hi:  Grenzen des Verhältnisses (verhindert Ausreißer)
CONFIG = {
    "fassade": {"detail": 1.6, "base": 7.0, "lo": 0.45, "hi": 1.12, "grain": 0.035, "spots": 0},
    "fenster": {"detail": 1.6, "base": 6.0, "lo": 0.40, "hi": 1.60, "grain": 0.025, "spots": 900},
    "innen": {"detail": 1.4, "base": 7.0, "lo": 0.35, "hi": 1.15, "grain": 0.04, "spots": 0},
}
EDGE_GROW_PX = 9      # Sicherheitszone um Kanten, in der nur die weiche Karte gilt
SEED = 20261117


def _ratio(vorher, nachher, sigma, lo, hi):
    v = cv2.GaussianBlur(vorher.astype(np.float32) + 1.0, (0, 0), sigma)
    n = cv2.GaussianBlur(nachher.astype(np.float32) + 1.0, (0, 0), sigma)
    return np.clip(v / n, lo, hi)


def edge_zone(vorher, nachher):
    """0..1-Maske: 1 nahe Kanten in einem der beiden Bilder (dort droht Versatz)."""
    def edges(img):
        g = cv2.GaussianBlur(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), (5, 5), 0)
        return cv2.Canny(g, 50, 140)
    both = cv2.bitwise_or(edges(vorher), edges(nachher))
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * EDGE_GROW_PX + 1,) * 2)
    zone = cv2.dilate(both, k).astype(np.float32) / 255.0
    return cv2.GaussianBlur(zone, (0, 0), EDGE_GROW_PX / 2)


def dirt_ratio(vorher, nachher, cfg):
    """Kantenabhängige Schmutzkarte: scharf auf Flächen, weich an Kanten."""
    sharp = _ratio(vorher, nachher, cfg["detail"], cfg["lo"], cfg["hi"])
    soft = _ratio(vorher, nachher, cfg["base"], cfg["lo"], cfg["hi"])
    w = edge_zone(vorher, nachher)[..., None]
    return sharp * (1.0 - w) + soft * w


def grain(shape, amount, rng):
    """Feine Staub-/Schmutzkörnung (niederfrequent moduliert, nicht gleichmäßig)."""
    h, w = shape[:2]
    fine = rng.normal(0.0, 1.0, (h, w)).astype(np.float32)
    fine = cv2.GaussianBlur(fine, (0, 0), 0.8)
    coarse = cv2.GaussianBlur(rng.normal(0.0, 1.0, (h, w)).astype(np.float32), (0, 0), 25)
    coarse = (coarse - coarse.min()) / (np.ptp(coarse) + 1e-6)
    return 1.0 - amount * np.abs(fine) * (0.4 + coarse)


def water_spots(shape, count, rng):
    """Eingetrocknete Wasserflecken: helle Ränder, leicht dunkler Kern (für Glas)."""
    h, w = shape[:2]
    layer = np.zeros((h, w), np.float32)
    for _ in range(count):
        x, y = int(rng.uniform(0, w)), int(rng.uniform(0, h))
        r = int(rng.uniform(2, 9) ** rng.uniform(0.8, 1.15))
        cv2.circle(layer, (x, y), r, float(rng.uniform(0.25, 0.6)), 1, cv2.LINE_AA)
        cv2.circle(layer, (x, y), max(1, r - 1), float(rng.uniform(-0.12, -0.03)), -1, cv2.LINE_AA)
    return cv2.GaussianBlur(layer, (0, 0), 0.7)


def synthesize(pid, vorher, nachher, rng):
    cfg = CONFIG[pid]
    ratio = dirt_ratio(vorher, nachher, cfg)
    out = nachher.astype(np.float32) * ratio
    out *= grain(out.shape, cfg["grain"], rng)[..., None]
    if cfg["spots"]:
        # Flecken nur dort, wo die Schmutzkarte Glas als "milchig" ausweist (Verhältnis > 1)
        milky = np.clip((ratio.mean(axis=2) - 1.0) * 3.0, 0.0, 1.0)
        spots = water_spots(out.shape, cfg["spots"], rng) * milky
        out += spots[..., None] * 255.0 * 0.5
    return np.clip(out, 0, 255).astype(np.uint8)


def main(src_dir, dst_dir):
    src_dir, dst_dir = Path(src_dir), Path(dst_dir)
    dst_dir.mkdir(parents=True, exist_ok=True)
    rng = np.random.default_rng(SEED)
    for pid in CONFIG:
        vorher = cv2.imread(str(src_dir / f"{pid}-vorher.jpg"))
        nachher = cv2.imread(str(src_dir / f"{pid}-nachher.jpg"))
        if vorher is None or nachher is None or vorher.shape != nachher.shape:
            raise SystemExit(f"{pid}: Bilder fehlen oder Größen unterschiedlich")
        result = synthesize(pid, vorher, nachher, rng)
        cv2.imwrite(str(dst_dir / f"{pid}-vorher.jpg"), result, [cv2.IMWRITE_JPEG_QUALITY, 90])
        cv2.imwrite(str(dst_dir / f"{pid}-nachher.jpg"), nachher, [cv2.IMWRITE_JPEG_QUALITY, 90])
        print(f"✓ {pid}: Vorher aus Nachher-Pixeln erzeugt ({result.shape[1]}×{result.shape[0]})")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit("Aufruf: va_synth.py <original-ordner> <ziel-ordner>")
    main(sys.argv[1], sys.argv[2])
