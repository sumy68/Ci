/**
 * Bild-Pipeline: erzeugt aus den Originalen in _src/images responsive
 * AVIF/WebP/JPG-Varianten mit sprechenden Dateinamen, das OG-Bild,
 * das Favicon-Set und die Logo-Varianten.
 *
 * Aufruf: npm run images
 */
import sharp from 'sharp';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { IMAGE_SETS, SERVICE_IMAGES } from './image-config.mjs';
import { variantFile, sourcePath, logoUrl, LOGO_WIDTHS, LOGO_SCHEMA_URL, OG_IMAGE_URL } from './lib/image-names.mjs';

/** URL (/assets/img/…) -> absoluter Dateipfad im Projekt */
const urlToPath = (url) => path.join(ROOT, url.replace(/^\//, ''));

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, '_src/images');
const OUT = path.join(ROOT, 'assets/img');

const QUALITY = Object.freeze({ avif: 48, webp: 72, jpg: 74 });
const INK = '#16181B';

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

/** Schreibt eine Breite in drei Formaten und prüft das Größenbudget. fileFor(ext) -> Zielpfad */
async function writeVariants(pipeline, fileFor, budgetKb) {
  const jobs = [
    ['avif', (p, q) => p.avif({ quality: q, effort: 6 }), QUALITY.avif],
    ['webp', (p, q) => p.webp({ quality: q }), QUALITY.webp],
    ['jpg', (p, q) => p.jpeg({ quality: q, mozjpeg: true, progressive: true }), QUALITY.jpg],
  ];
  const MIN_QUALITY = 50;
  const warnings = [];
  for (const [ext, encode, startQuality] of jobs) {
    const file = fileFor(ext);
    // Qualität schrittweise senken, bis das Budget eingehalten wird
    for (let q = startQuality; ; q -= 6) {
      await encode(pipeline.clone(), q).toFile(file);
      const { size } = await stat(file);
      if (size <= budgetKb * 1024) break;
      if (q - 6 < MIN_QUALITY) {
        warnings.push(`${path.relative(ROOT, file)}: ${kb(size)} > ${budgetKb} KB`);
        break;
      }
    }
  }
  return warnings;
}

async function buildSet(set) {
  const { src, dir, widths, budgetKb, aspect } = set;
  const outDir = path.join(OUT, dir);
  await ensureDir(outDir);
  // Quelle: rootSrc (relativ zum Projekt-Root, z. B. /assets/hero) oder unter _src/images
  const base = sharp(sourcePath(set)).rotate();
  const meta = await base.metadata();
  const warnings = [];
  for (const width of widths) {
    if (width > meta.width) throw new Error(`${src}: ${width}px würde hochskaliert (${meta.width}px)`);
    const height = aspect ? Math.round(width / aspect) : undefined;
    const resized = base.clone().resize({ width, height, fit: 'cover', position: 'attention' });
    // SEO-Name + Inhalts-Hash am Ende (lib/image-names.mjs)
    warnings.push(...(await writeVariants(resized, (ext) => path.join(outDir, variantFile(set, width, ext)), budgetKb)));
  }
  return warnings;
}

/** Logo: weiße Vorlage, einmal hell (Original) und einmal anthrazit eingefärbt. */
async function buildLogos() {
  const outDir = path.join(OUT, 'logo');
  await ensureDir(outDir);
  const src = path.join(SRC, 'logo/logo-weiss.png');
  const widths = LOGO_WIDTHS;
  const variants = { hell: null, dunkel: INK };
  for (const [variant, tint] of Object.entries(variants)) {
    for (const width of widths) {
      let p = sharp(src).resize({ width });
      if (tint) p = p.ensureAlpha().tint(tint).linear(0.05, 0);
      // ci-dienstleistungen-logo-<variante>-<breite>.<hash>.<format>
      await p.clone().png({ compressionLevel: 9, palette: true }).toFile(urlToPath(logoUrl(variant, width, 'png')));
      await p.clone().webp({ quality: 90, alphaQuality: 100 }).toFile(urlToPath(logoUrl(variant, width, 'webp')));
      await p.clone().avif({ quality: 60 }).toFile(urlToPath(logoUrl(variant, width, 'avif')));
    }
  }
}

/** Logo zentriert auf anthrazitfarbener Fläche (für Favicons/Touch-Icons). */
async function iconOnInk(size, logoRatio) {
  const logoWidth = Math.round(size * logoRatio);
  const logo = await sharp(path.join(SRC, 'logo/logo-weiss.png')).resize({ width: logoWidth }).toBuffer();
  const { height } = await sharp(logo).metadata();
  return sharp({ create: { width: size, height: size, channels: 4, background: INK } })
    .composite([{ input: logo, left: Math.round((size - logoWidth) / 2), top: Math.round((size - height) / 2) }])
    .png({ compressionLevel: 9 });
}

/** ICO-Container mit eingebetteten PNGs (von allen Browsern unterstützt). */
function packIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const entries = pngs.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

async function buildIcons() {
  const outDir = path.join(OUT, 'icons');
  await ensureDir(outDir);
  const plan = [
    ['apple-touch-icon.png', 180, 0.62],
    ['icon-192.png', 192, 0.62],
    ['icon-512.png', 512, 0.62],
    ['icon-maskable-512.png', 512, 0.5],
    ['favicon-32.png', 32, 0.78],
  ];
  for (const [file, size, ratio] of plan) {
    await (await iconOnInk(size, ratio)).toFile(path.join(outDir, file));
  }
  // Quadratisches Logo für Schema.org (fester, sprechender Name)
  await ensureDir(path.join(OUT, 'logo'));
  await (await iconOnInk(512, 0.62)).toFile(urlToPath(LOGO_SCHEMA_URL));
  const ico = await Promise.all(
    [16, 32, 48].map(async (size) => ({ size, data: await (await iconOnInk(size, 0.8)).toBuffer() })),
  );
  await writeFile(path.join(ROOT, 'favicon.ico'), packIco(ico));
}

/** Open-Graph-Bild 1200×630: Fassadenfoto mit hellem Logo unten links. */
async function buildOgImage() {
  const W = 1200;
  const H = 630;
  const photo = await sharp(path.join(ROOT, 'assets/hero/gebaeudereinigung-regensburg-glasfassade-desktop.jpg'))
    .resize({ width: W, height: H, fit: 'cover', position: 'attention' })
    .toBuffer();
  const shade = Buffer.from(
    `<svg width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0.45" stop-color="${INK}" stop-opacity="0"/><stop offset="1" stop-color="${INK}" stop-opacity="0.72"/>` +
      `</linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/></svg>`,
  );
  const logo = await sharp(path.join(SRC, 'logo/logo-weiss.png')).resize({ width: 150 }).toBuffer();
  await sharp(photo)
    .composite([{ input: shade }, { input: logo, left: 64, top: H - 64 - 103 }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(urlToPath(OG_IMAGE_URL));
}

async function main() {
  await ensureDir(OUT);
  const warnings = [];
  // Optionaler Filter: npm run images -- hero  (nur Sets, deren Name den Text enthält)
  const only = process.argv[2];
  const sets = [...IMAGE_SETS, ...SERVICE_IMAGES].filter((s) => !only || s.name.includes(only));
  for (const set of sets) {
    warnings.push(...(await buildSet(set)));
    console.log(`✓ ${set.dir}/${set.name}`);
  }
  await buildLogos();
  await buildIcons();
  await buildOgImage();
  console.log('✓ Logos, Icons, OG-Bild');
  if (warnings.length) {
    console.warn('\nBudget überschritten:\n' + warnings.join('\n'));
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('Bild-Pipeline fehlgeschlagen:', err);
  process.exit(1);
});
