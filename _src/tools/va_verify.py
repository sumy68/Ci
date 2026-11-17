"""
Verifikation der Deckungsgleichheit (Canny-Kantenvergleich Vorher vs. Nachher).

Kennzahlen je Paar:
  versatz_px  = lokale Verschiebung je Bildkachel (96 px) per Phasenkorrelation
                auf den Gradientenbildern, Subpixel-genau. Kriterium: Median ≤ 0,2 px
                und ≥ 99 % der Kacheln ≤ 1 px. (Rein farbliche Änderungen verschieben
                nichts; einzelne Kacheln mit kräftigem neuem Schmutz-Muster können die
                Korrelation leicht verzerren – deshalb Median + Perzentil statt Maximum.)
  verschoben  = Anteil der Vorher-Kanten, die 2–6 px neben einer Nachher-Kante
                liegen, aber NICHT innerhalb 1 px (= versetzte/springende Kante).
                Hinweis: Canny verschiebt Kantenpixel bei Kontraständerung um
                1–2 px (Schwellen-Jitter) – daher nur Zusatzindikator (< 3 %).
  erhalten    = Anteil der Nachher-Kanten, die im Vorher-Bild (±1 px) vorhanden sind.
  zusätzlich  = Vorher-Kanten ohne Nachher-Gegenstück (gewollter Schmutz).
Ausgabe: <ziel>/<id>-kanten.png (weiß = deckungsgleich, rot = nur vorher,
blau = nur nachher, gelb = verschoben). Exit-Code 1 bei Versatz.

Aufruf: python3 _src/tools/va_verify.py <bild-ordner> <ziel-ordner>
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np

MAX_SHIFT_PCT = 3.0      # Canny-Jitter-Toleranz
MAX_MEDIAN_SHIFT_PX = 0.2   # echte geometrische Verschiebung (Median)
MAX_TILES_OVER_1PX_PCT = 1.0  # Anteil Kacheln mit > 1 px
TILE = 96


def edges(gray):
    return cv2.Canny(cv2.GaussianBlur(gray, (5, 5), 0), 50, 140) > 0


def tile_shifts(a, b):
    """Subpixel-Verschiebung je Kachel (Phasenkorrelation der Gradientenbeträge)."""
    def grad(img):
        g = img.astype(np.float32)
        return cv2.magnitude(cv2.Sobel(g, cv2.CV_32F, 1, 0), cv2.Sobel(g, cv2.CV_32F, 0, 1))
    ga, gb = grad(a), grad(b)
    win = cv2.createHanningWindow((TILE, TILE), cv2.CV_32F)
    shifts = []
    h, w = a.shape
    for y in range(0, h - TILE + 1, TILE // 2):
        for x in range(0, w - TILE + 1, TILE // 2):
            ta, tb = ga[y:y + TILE, x:x + TILE], gb[y:y + TILE, x:x + TILE]
            if ta.std() < 8 or tb.std() < 8:  # strukturlose Kacheln (Himmel, Wand) überspringen
                continue
            (dx, dy), resp = cv2.phaseCorrelate(ta, tb, win)
            if resp > 0.1:
                shifts.append(float(np.hypot(dx, dy)))
    return np.array(shifts) if shifts else np.zeros(1)


def main(src, dst):
    src, dst = Path(src), Path(dst)
    dst.mkdir(parents=True, exist_ok=True)
    report, ok = {}, True
    for pid in ("fassade", "fenster", "innen"):
        v = cv2.imread(str(src / f"{pid}-vorher.jpg"), cv2.IMREAD_GRAYSCALE)
        n = cv2.imread(str(src / f"{pid}-nachher.jpg"), cv2.IMREAD_GRAYSCALE)
        if v is None or n is None or v.shape != n.shape:
            raise SystemExit(f"{pid}: Bilder fehlen oder Größen unterschiedlich")
        ev, en = edges(v), edges(n)
        dist_n = cv2.distanceTransform((~en).astype(np.uint8), cv2.DIST_L2, 3)
        dist_v = cv2.distanceTransform((~ev).astype(np.uint8), cv2.DIST_L2, 3)
        shifted = ev & (dist_n > 1.5) & (dist_n <= 6)
        kept = en & (dist_v <= 1.5)
        extra = ev & (dist_n > 6)
        ts = tile_shifts(v, n)
        res = {
            "versatz_px_max": round(float(ts.max()), 2),
            "versatz_px_median": round(float(np.median(ts)), 2),
            "kacheln_ueber_1px": int((ts > 1).sum()),
            "kacheln": int(ts.size),
            "verschoben_pct": round(100 * shifted.sum() / max(1, ev.sum()), 2),
            "erhalten_pct": round(100 * kept.sum() / max(1, en.sum()), 1),
            "zusaetzlich_pct": round(100 * extra.sum() / max(1, ev.sum()), 1),
        }
        over_pct = 100 * res["kacheln_ueber_1px"] / max(1, res["kacheln"])
        ok &= (res["versatz_px_median"] <= MAX_MEDIAN_SHIFT_PX and over_pct <= MAX_TILES_OVER_1PX_PCT
               and res["verschoben_pct"] < MAX_SHIFT_PCT)
        img = np.zeros(v.shape + (3,), np.uint8)
        img[en & ~kept] = (255, 150, 40)
        img[ev & (dist_n <= 1.5)] = (255, 255, 255)
        img[extra] = (60, 60, 255)
        img[shifted] = (0, 230, 255)
        cv2.imwrite(str(dst / f"{pid}-kanten.png"), img)
        report[pid] = res
    print(json.dumps(report, indent=2, ensure_ascii=False))
    print("✓ keine Kantenverschiebung" if ok else "✗ Kantenverschiebung gefunden")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit("Aufruf: va_verify.py <bild-ordner> <ziel-ordner>")
    main(sys.argv[1], sys.argv[2])
