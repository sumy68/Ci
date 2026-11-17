"""
Vorher/Nachher-Bildregistrierung (Stufe a).

Richtet das Vorher-Bild per SIFT-Merkmalen + Homographie (RANSAC) exakt auf das
Nachher-Bild aus und misst die verbleibende Abweichung:
  edge_px = mittlerer Abstand (px) der Vorher-Kanten zur nächsten Nachher-Kante.
Zusätzlich werden Prüfbilder (Slider bei 25/50/75 %, Differenzbild) geschrieben.

Aufruf:  python3 _src/tools/va_align.py <eingabe-ordner> <ausgabe-ordner>
Eingabe: <id>-vorher.jpg / <id>-nachher.jpg (id = fassade, fenster, innen)
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np

PAIRS = ("fassade", "fenster", "innen")
RATIO = 0.75          # Lowe-Ratio-Test
MIN_MATCHES = 40


def edge_misalignment(moving, reference, mask=None):
    """Mittlerer Abstand der Kanten von `moving` zur nächsten Kante in `reference`."""
    e_ref = cv2.Canny(cv2.GaussianBlur(reference, (5, 5), 0), 60, 160)
    e_mov = cv2.Canny(cv2.GaussianBlur(moving, (5, 5), 0), 60, 160)
    dist = cv2.distanceTransform(255 - e_ref, cv2.DIST_L2, 3)
    sel = e_mov > 0
    if mask is not None:
        sel &= mask > 0
    return float(np.mean(dist[sel])) if sel.any() else float("nan")


def inner_rect(mask):
    """Größtes achsenparalleles Rechteck, in dem die Maske vollständig gültig ist (Schrumpfen vom Rand)."""
    h, w = mask.shape
    top, bottom, left, right = 0, h - 1, 0, w - 1
    while top < bottom and left < right:
        sub = mask[top:bottom + 1, left:right + 1]
        if sub.all():
            return top, bottom + 1, left, right + 1
        rows_bad = [(~sub[0]).sum(), (~sub[-1]).sum()]
        cols_bad = [(~sub[:, 0]).sum(), (~sub[:, -1]).sum()]
        worst = int(np.argmax(rows_bad + cols_bad))
        if worst == 0:
            top += 1
        elif worst == 1:
            bottom -= 1
        elif worst == 2:
            left += 1
        else:
            right -= 1
    raise ValueError("kein gültiger Bereich")


def register(vorher, nachher):
    g1 = cv2.cvtColor(vorher, cv2.COLOR_BGR2GRAY)
    g2 = cv2.cvtColor(nachher, cv2.COLOR_BGR2GRAY)
    sift = cv2.SIFT_create(nfeatures=6000)
    k1, d1 = sift.detectAndCompute(g1, None)
    k2, d2 = sift.detectAndCompute(g2, None)
    matches = cv2.BFMatcher(cv2.NORM_L2).knnMatch(d1, d2, k=2)
    good = [m for m, n in (p for p in matches if len(p) == 2) if m.distance < RATIO * n.distance]
    if len(good) < MIN_MATCHES:
        raise ValueError(f"zu wenige Merkmale ({len(good)})")
    src = np.float32([k1[m.queryIdx].pt for m in good]).reshape(-1, 1, 2)
    dst = np.float32([k2[m.trainIdx].pt for m in good]).reshape(-1, 1, 2)
    H, inl = cv2.findHomography(src, dst, cv2.RANSAC, 3.0)
    h, w = nachher.shape[:2]
    warped = cv2.warpPerspective(vorher, H, (w, h), flags=cv2.INTER_CUBIC)
    valid = cv2.warpPerspective(np.full(vorher.shape[:2], 255, np.uint8), H, (w, h)) > 250
    return warped, valid, int(inl.sum()), len(good)


def slider_preview(before, after, out):
    """Prüfbild: Slider-Stellungen 25/50/75 % untereinander + Differenzbild."""
    h, w = after.shape[:2]
    rows = []
    for pos in (0.25, 0.5, 0.75):
        x = int(w * pos)
        img = after.copy()
        img[:, :x] = before[:, :x]
        cv2.line(img, (x, 0), (x, h), (255, 255, 255), 2)
        rows.append(img)
    diff = cv2.applyColorMap(cv2.absdiff(cv2.cvtColor(before, cv2.COLOR_BGR2GRAY), cv2.cvtColor(after, cv2.COLOR_BGR2GRAY)), cv2.COLORMAP_INFERNO)
    rows.append(diff)
    sheet = np.vstack(rows)
    cv2.imwrite(str(out), cv2.resize(sheet, (w // 2, sheet.shape[0] // 2)), [cv2.IMWRITE_JPEG_QUALITY, 80])


def main(src_dir, out_dir):
    src_dir, out_dir = Path(src_dir), Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    report = {}
    for pid in PAIRS:
        vorher = cv2.imread(str(src_dir / f"{pid}-vorher.jpg"))
        nachher = cv2.imread(str(src_dir / f"{pid}-nachher.jpg"))
        g_v = cv2.cvtColor(vorher, cv2.COLOR_BGR2GRAY)
        g_n = cv2.cvtColor(nachher, cv2.COLOR_BGR2GRAY)
        entry = {"edge_px_original": round(edge_misalignment(g_v, g_n), 2)}
        try:
            warped, valid, inliers, good = register(vorher, nachher)
            t, b, l, r = inner_rect(valid)
            wv, wn = warped[t:b, l:r], nachher[t:b, l:r]
            entry.update({
                "inliers": inliers, "matches": good, "crop": [l, t, r - l, b - t],
                "edge_px_registriert": round(edge_misalignment(cv2.cvtColor(wv, cv2.COLOR_BGR2GRAY), cv2.cvtColor(wn, cv2.COLOR_BGR2GRAY)), 2),
            })
            cv2.imwrite(str(out_dir / f"{pid}-vorher-registriert.jpg"), wv, [cv2.IMWRITE_JPEG_QUALITY, 92])
            cv2.imwrite(str(out_dir / f"{pid}-nachher-registriert.jpg"), wn, [cv2.IMWRITE_JPEG_QUALITY, 92])
            slider_preview(wv, wn, out_dir / f"{pid}-pruefung-registriert.jpg")
        except ValueError as err:
            entry["fehler"] = str(err)
        slider_preview(vorher, nachher, out_dir / f"{pid}-pruefung-original.jpg")
        report[pid] = entry
    print(json.dumps(report, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit("Aufruf: va_align.py <eingabe-ordner> <ausgabe-ordner>")
    main(sys.argv[1], sys.argv[2])
