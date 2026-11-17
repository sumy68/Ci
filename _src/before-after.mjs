/**
 * Vorher/Nachher-Bilder: liest /assets/vorher-nachher/<id>-vorher.jpg und
 * <id>-nachher.jpg, schneidet beide Bilder eines Paares exakt gleich zu
 * (gemeinsame Größe, Mitte) und erzeugt AVIF/WebP/JPG in mehreren Breiten
 * nach /assets/img/vorher-nachher/. Läuft automatisch bei `npm run build`.
 *
 * Cache-Sicherheit: Jede Ausgabedatei trägt einen Inhalts-Hash der Quelle im
 * Namen (z. B. fassade-vorher.3f2a9c1b-768.avif). Ändert sich ein Bild, ändert
 * sich der Dateiname – Browser/CDN können nie eine alte Version liefern.
 * Veraltete Varianten desselben Bildes werden beim Build entfernt.
 *
 * Fehlt ein Paar, liefert buildPair() null und die Seite zeigt einen Platzhalter.
 */
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { readFile, readdir, unlink, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(ROOT, 'assets/vorher-nachher');
const OUT_DIR = path.join(ROOT, 'assets/img/vorher-nachher');
const TARGET_WIDTHS = Object.freeze([480, 768, 1200, 1920]);
const QUALITY = Object.freeze({ avif: 50, webp: 74, jpg: 78 });
const FORMATS = Object.freeze(['avif', 'webp', 'jpg']);

export const PAIRS = Object.freeze(['fassade', 'fenster', 'innen']);
export const SIDES = Object.freeze(['vorher', 'nachher']);

const exists = (file) => access(file).then(() => true, () => false);
const contentHash = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 8);

/** Breiten bis zur Quellgröße (kein Hochskalieren); die Quellbreite selbst kommt dazu. */
const widthsFor = (sourceWidth) => {
  const list = TARGET_WIDTHS.filter((w) => w < sourceWidth);
  return [...list, Math.min(sourceWidth, TARGET_WIDTHS.at(-1))];
};

async function commonSize(buffers) {
  const metas = await Promise.all(buffers.map((b) => sharp(b).metadata()));
  return { width: Math.min(...metas.map((m) => m.width)), height: Math.min(...metas.map((m) => m.height)) };
}

async function writeWidth(buffer, outBase, size, width) {
  const height = Math.round((size.height / size.width) * width);
  const base = sharp(buffer).rotate().resize({ width: size.width, height: size.height, fit: 'cover', position: 'centre' }).resize({ width, height });
  await base.clone().avif({ quality: QUALITY.avif, effort: 5 }).toFile(`${outBase}-${width}.avif`);
  await base.clone().webp({ quality: QUALITY.webp }).toFile(`${outBase}-${width}.webp`);
  await base.clone().jpeg({ quality: QUALITY.jpg, mozjpeg: true, progressive: true }).toFile(`${outBase}-${width}.jpg`);
}

/** Entfernt Varianten desselben Bildes mit anderem (veraltetem) bzw. ohne Hash. */
async function removeStale(prefix, currentName) {
  const files = await readdir(OUT_DIR).catch(() => []);
  const stale = files.filter((f) => f.startsWith(`${prefix}-`) || f.startsWith(`${prefix}.`)).filter((f) => !f.startsWith(`${currentName}-`));
  await Promise.all(stale.map((f) => unlink(path.join(OUT_DIR, f))));
  return stale.length;
}

/** Erzeugt alle Varianten eines Paares (falls nötig) und gibt Namen/Maße/Breiten zurück. */
export async function buildPair(id) {
  const files = SIDES.map((s) => path.join(SRC_DIR, `${id}-${s}.jpg`));
  if (!(await Promise.all(files.map(exists))).every(Boolean)) return null;
  const buffers = await Promise.all(files.map((f) => readFile(f)));
  const size = await commonSize(buffers);
  const widths = widthsFor(size.width);
  await mkdir(OUT_DIR, { recursive: true });
  const names = {};
  for (const [i, side] of SIDES.entries()) {
    const prefix = `${id}-${side}`;
    const name = `${prefix}.${contentHash(buffers[i])}`;
    names[side] = name;
    const outBase = path.join(OUT_DIR, name);
    const complete = (await Promise.all(widths.flatMap((w) => FORMATS.map((f) => exists(`${outBase}-${w}.${f}`))))).every(Boolean);
    if (!complete) for (const w of widths) await writeWidth(buffers[i], outBase, size, w);
    await removeStale(prefix, name);
  }
  return { id, names, width: size.width, height: size.height, widths };
}

export async function buildAllPairs() {
  const result = {};
  for (const id of PAIRS) result[id] = await buildPair(id);
  return result;
}
