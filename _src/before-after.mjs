/**
 * Vorher/Nachher-Bilder: liest /assets/vorher-nachher/<id>-vorher.jpg und
 * <id>-nachher.jpg, schneidet beide Bilder eines Paares exakt gleich zu
 * (gemeinsame Größe, Mitte) und erzeugt AVIF/WebP/JPG in mehreren Breiten
 * nach /assets/img/vorher-nachher/. Läuft automatisch bei `npm run build`.
 *
 * Dateinamen: SEO-Name (Leistung + Ort) + Breite + Inhalts-Hash am Ende,
 * z. B. fassadenreinigung-regensburg-vorher-768.3f2a9c1b.avif (Cache-Busting). Ändert sich ein Bild, ändert
 * sich der Dateiname – Browser/CDN können nie eine alte Version liefern.
 * Veraltete Varianten desselben Bildes werden beim Build entfernt.
 *
 * Fehlt ein Paar, liefert buildPair() null und die Seite zeigt einen Platzhalter.
 */
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { readFile, readdir, unlink, mkdir, access } from 'node:fs/promises';
import { PAIR_NAMES } from './image-config.mjs';
import { variantFile } from './lib/image-names.mjs';
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

async function writeWidth(buffer, set, size, width) {
  const height = Math.round((size.height / size.width) * width);
  const base = sharp(buffer).rotate().resize({ width: size.width, height: size.height, fit: 'cover', position: 'centre' }).resize({ width, height });
  const file = (ext) => path.join(OUT_DIR, variantFile(set, width, ext));
  await base.clone().avif({ quality: QUALITY.avif, effort: 5 }).toFile(file('avif'));
  await base.clone().webp({ quality: QUALITY.webp }).toFile(file('webp'));
  await base.clone().jpeg({ quality: QUALITY.jpg, mozjpeg: true, progressive: true }).toFile(file('jpg'));
}

/** Entfernt alle Dateien im Ausgabeordner, die nicht zur aktuellen Ausgabe gehören (alte Namen/Hashes). */
async function removeStale(keep) {
  const files = await readdir(OUT_DIR).catch(() => []);
  const stale = files.filter((f) => !keep.has(f));
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
  const sides = {};
  for (const [i, side] of SIDES.entries()) {
    // Bildset im Format von image-names.mjs: Name = Leistung + Ort + Seite, Hash = Inhalt
    const set = { dir: 'vorher-nachher', name: `${PAIR_NAMES[id]}-${side}`, hash: contentHash(buffers[i]), widths, width: size.width, height: size.height };
    sides[side] = set;
    const files = widths.flatMap((w) => FORMATS.map((f) => path.join(OUT_DIR, variantFile(set, w, f))));
    if (!(await Promise.all(files.map(exists))).every(Boolean)) for (const w of widths) await writeWidth(buffers[i], set, size, w);
  }
  return { id, sides, width: size.width, height: size.height, widths };
}

export async function buildAllPairs() {
  const result = {};
  for (const id of PAIRS) result[id] = await buildPair(id);
  // Veraltete Dateien (alte Namen/Hashes) aus dem Ausgabeordner entfernen
  const keep = new Set(Object.values(result).filter(Boolean).flatMap((p) => Object.values(p.sides).flatMap((set) => p.widths.flatMap((w) => FORMATS.map((f) => variantFile(set, w, f))))));
  const removed = await removeStale(keep);
  if (removed) console.log(`  Vorher/Nachher: ${removed} veraltete Dateien entfernt`);
  return result;
}
