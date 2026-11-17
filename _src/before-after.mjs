/**
 * Vorher/Nachher-Bilder: liest /assets/vorher-nachher/<id>-vorher.jpg und
 * <id>-nachher.jpg, schneidet beide Bilder eines Paares exakt gleich zu
 * (gemeinsame Größe, Mitte) und erzeugt AVIF/WebP/JPG in mehreren Breiten
 * nach /assets/img/vorher-nachher/. Läuft automatisch bei `npm run build`
 * und überspringt Paare, deren Ausgabe aktueller ist als die Quelle.
 *
 * Fehlt ein Paar, liefert pairInfo() null und die Seite zeigt einen Platzhalter.
 */
import sharp from 'sharp';
import { stat, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(ROOT, 'assets/vorher-nachher');
const OUT_DIR = path.join(ROOT, 'assets/img/vorher-nachher');
const TARGET_WIDTHS = Object.freeze([480, 768, 1200, 1920]);
const QUALITY = Object.freeze({ avif: 50, webp: 74, jpg: 78 });

export const PAIRS = Object.freeze(['fassade', 'fenster', 'innen']);

const mtime = (file) => stat(file).then((s) => s.mtimeMs, () => null);

/** Breiten bis zur Quellgröße (kein Hochskalieren); die Quellbreite selbst kommt dazu. */
const widthsFor = (sourceWidth) => {
  const list = TARGET_WIDTHS.filter((w) => w < sourceWidth);
  return [...list, Math.min(sourceWidth, TARGET_WIDTHS.at(-1))];
};

async function commonSize(files) {
  const metas = await Promise.all(files.map((f) => sharp(f).metadata()));
  return { width: Math.min(...metas.map((m) => m.width)), height: Math.min(...metas.map((m) => m.height)) };
}

async function writeWidth(file, outBase, size, width) {
  const height = Math.round((size.height / size.width) * width);
  const base = sharp(file).rotate().resize({ width: size.width, height: size.height, fit: 'cover', position: 'centre' }).resize({ width, height });
  await base.clone().avif({ quality: QUALITY.avif, effort: 5 }).toFile(`${outBase}-${width}.avif`);
  await base.clone().webp({ quality: QUALITY.webp }).toFile(`${outBase}-${width}.webp`);
  await base.clone().jpeg({ quality: QUALITY.jpg, mozjpeg: true, progressive: true }).toFile(`${outBase}-${width}.jpg`);
}

/** Erzeugt alle Varianten eines Paares (falls nötig) und gibt Maße/Breiten zurück. */
export async function buildPair(id) {
  const files = ['vorher', 'nachher'].map((s) => path.join(SRC_DIR, `${id}-${s}.jpg`));
  const times = await Promise.all(files.map(mtime));
  if (times.includes(null)) return null;
  const size = await commonSize(files);
  const widths = widthsFor(size.width);
  await mkdir(OUT_DIR, { recursive: true });
  for (const [i, file] of files.entries()) {
    const outBase = path.join(OUT_DIR, `${id}-${i === 0 ? 'vorher' : 'nachher'}`);
    const newest = await mtime(`${outBase}-${widths.at(-1)}.jpg`);
    if (newest && newest > times[i]) continue;
    for (const w of widths) await writeWidth(file, outBase, size, w);
  }
  return { id, width: size.width, height: size.height, widths };
}

export async function buildAllPairs() {
  const result = {};
  for (const id of PAIRS) result[id] = await buildPair(id);
  return result;
}
