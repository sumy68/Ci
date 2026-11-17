/**
 * Kopiert Bibliotheken und Schriften aus node_modules in /assets,
 * damit alles selbst gehostet ausgeliefert wird.
 * Aufruf: npm run vendor
 */
import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NM = path.join(ROOT, 'node_modules');

const FILES = [
  ['gsap/dist/gsap.min.js', 'assets/js/vendor/gsap.min.js'],
  ['gsap/dist/ScrollTrigger.min.js', 'assets/js/vendor/ScrollTrigger.min.js'],
  ['gsap/dist/SplitText.min.js', 'assets/js/vendor/SplitText.min.js'],
  ['lenis/dist/lenis.min.js', 'assets/js/vendor/lenis.min.js'],
  ['@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2', 'assets/fonts/instrument-serif-400.woff2'],
  ['@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2', 'assets/fonts/manrope-variable.woff2'],
];

for (const [from, to] of FILES) {
  const dest = path.join(ROOT, to);
  await mkdir(path.dirname(dest), { recursive: true });
  await copyFile(path.join(NM, from), dest);
  console.log(`✓ ${to}`);
}
