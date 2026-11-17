/**
 * Zentrale, SEO-optimierte Bild-Dateinamen.
 *
 * Schema:  <leistung>-<ort>[-<variante>]-<breite>.<hash>.<format>
 *          z. B. fassadenreinigung-regensburg-vorher-768.3f2a9c1b.avif
 * - kleingeschrieben, Bindestriche, keine Umlaute
 * - <hash> = erste 8 Zeichen des SHA-256 der Quelldatei (Cache-Busting):
 *   neues Bild -> neuer Dateiname, Browser/CDN liefern nie eine alte Version
 *
 * Pipeline (images.mjs, before-after.mjs), HTML-Helfer, Layout, Schema und
 * Sitemap verwenden ausschließlich diese Funktionen.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const IMG_URL = '/assets/img';

const hashCache = new Map();

/** Inhalts-Hash einer Datei (8 Zeichen), gecacht pro Build. */
export function fileHash(absPath) {
  if (!hashCache.has(absPath)) {
    hashCache.set(absPath, createHash('sha256').update(readFileSync(absPath)).digest('hex').slice(0, 8));
  }
  return hashCache.get(absPath);
}

/** Absoluter Pfad der Quelldatei eines Bildsets (rootSrc = relativ zum Projekt, src = unter _src/images). */
export const sourcePath = (set) => (set.rootSrc ? path.join(ROOT, set.rootSrc) : path.join(ROOT, '_src/images', set.src));

/** Dateiname einer Variante, z. B. gebaeudereinigung-regensburg-glasfassade-desktop-1344.ab12cd34.avif */
export const variantFile = (set, width, ext) => `${set.name}-${width}.${set.hash ?? fileHash(sourcePath(set))}.${ext}`;

/** Öffentliche URL einer Variante. */
export const variantUrl = (set, width, ext) => `${IMG_URL}/${set.dir}/${variantFile(set, width, ext)}`;

/* ---------------- Feste Namen (nicht aus Bildsets) ---------------- */

export const LOGO_SOURCE = path.join(ROOT, '_src/images/logo/logo-weiss.png');
export const LOGO_WIDTHS = Object.freeze([58, 116, 174]);
/** Logo-Varianten: ci-dienstleistungen-logo-dunkel-116.<hash>.png */
export const logoUrl = (variant, width, ext) =>
  `${IMG_URL}/logo/ci-dienstleistungen-logo-${variant}-${width}.${fileHash(LOGO_SOURCE)}.${ext}`;
/** Quadratisches Logo (512 px) für Schema.org „logo“ – fester Name, da extern referenziert. */
export const LOGO_SCHEMA_URL = `${IMG_URL}/logo/ci-dienstleistungen-logo.png`;

/** OG-/Social-Bild – fester Name (Plattformen cachen per URL). */
export const OG_IMAGE_URL = `${IMG_URL}/ci-dienstleistungen-gebaeudereinigung-hausmeisterservice.jpg`;

/** Schmutzfilm-Textur des Wisch-Effekts (dekorativ). */
export const GRIME_URL = `${IMG_URL}/hero/fensterreinigung-schmutzfilm-textur.svg`;

/**
 * Alte Bild-URLs, die extern verlinkt sein könnten (OG-Vorschau, Schema-Bild).
 * Sie bleiben unter altem Namen abrufbar (GitHub Pages kennt keine 301),
 * werden aber nirgends mehr verlinkt.
 */
export const LEGACY_KEEP = Object.freeze([
  'assets/img/og-ci-dienstleistungen.jpg',
  'assets/img/hero/hero-glas-desktop-1344.jpg',
  'assets/img/icons/icon-512.png',
]);
