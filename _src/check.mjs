/**
 * SEO-/Qualitätsprüfung der gebauten Seiten (ohne externe Abhängigkeiten).
 * Prüft: genau eine H1, Title/Description vorhanden + eindeutig, Canonical,
 * Alt-Texte, gültiges JSON-LD, Heading-Sprünge, interne Links und Anker,
 * referenzierte Dateien, Sitemap-Einträge. Exit-Code 1 bei Fehlern.
 *
 * Aufruf: npm run check
 */
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = ['index.html', 'gebaeudereinigung-regensburg.html', 'gebaeudereinigung-kelheim.html', 'gebaeudereinigung-landshut.html', 'impressum.html', 'datenschutz.html', '404.html'];

const errors = [];
const fail = (page, msg) => errors.push(`✗ ${page}: ${msg}`);
const all = (re, html) => [...html.matchAll(re)];
const exists = (p) => access(p).then(() => true, () => false);

/** URL-Pfad -> lokale Datei (wie GitHub Pages: /impressum -> impressum.html). */
async function resolveLocal(urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  if (clean === '/' || clean === '') return path.join(ROOT, 'index.html');
  const direct = path.join(ROOT, clean);
  if (await exists(direct) && path.extname(direct)) return direct;
  if (await exists(`${direct}.html`)) return `${direct}.html`;
  return null;
}

async function checkPage(file, seen) {
  const html = await readFile(path.join(ROOT, file), 'utf8');
  const h1 = all(/<h1[\s>]/g, html).length;
  if (h1 !== 1) fail(file, `${h1} H1-Überschriften (Soll: 1)`);

  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const desc = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  if (!title) fail(file, 'Title fehlt');
  if (!desc) fail(file, 'Description fehlt');
  if (seen.titles.has(title)) fail(file, `Title doppelt: ${title}`);
  if (seen.descs.has(desc)) fail(file, 'Description doppelt');
  seen.titles.add(title);
  seen.descs.add(desc);
  if (!/<link rel="canonical" href="https:\/\/ci-dienstleistungen\.com[^"]*">/.test(html)) fail(file, 'Canonical fehlt');
  if (!/<html lang="de">/.test(html)) fail(file, 'lang="de" fehlt');

  for (const [tag] of all(/<img\b[^>]*>/g, html)) {
    if (!/\balt="/.test(tag)) fail(file, `Bild ohne alt: ${tag.slice(0, 80)}`);
  }

  for (const [, json] of all(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, html)) {
    try {
      const data = JSON.parse(json);
      if (data['@context'] !== 'https://schema.org') fail(file, 'JSON-LD ohne @context');
    } catch (err) {
      fail(file, `JSON-LD ungültig: ${err.message}`);
    }
  }

  // Heading-Hierarchie: keine Sprünge um mehr als eine Ebene nach unten
  const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
  let last = 0;
  for (const [, lvl] of all(/<h([1-6])[\s>]/g, main)) {
    const n = Number(lvl);
    if (last && n > last + 1) fail(file, `Heading-Sprung h${last} -> h${n}`);
    last = n;
  }

  const ids = new Set(all(/\sid="([^"]+)"/g, html).map((m) => m[1]));
  const refs = [...all(/\s(?:href|src)="([^"]+)"/g, html), ...all(/\ssrcset="([^"]+)"/g, html).flatMap((m) => m[1].split(',').map((s) => [null, s.trim().split(' ')[0]]))];
  for (const [, ref] of refs) {
    if (/^(https?:|tel:|mailto:|data:)/.test(ref)) continue;
    if (ref.startsWith('#')) {
      if (ref.length > 1 && !ids.has(ref.slice(1))) fail(file, `Anker fehlt: ${ref}`);
      continue;
    }
    const target = await resolveLocal(ref);
    if (!target) fail(file, `Link/Datei nicht gefunden: ${ref}`);
    else if (ref.includes('#') && target.endsWith('.html')) {
      const anchor = ref.split('#')[1];
      const targetHtml = await readFile(target, 'utf8');
      if (anchor && !targetHtml.includes(`id="${anchor}"`)) fail(file, `Anker fehlt auf Zielseite: ${ref}`);
    }
  }
}

async function checkSitemap() {
  const xml = await readFile(path.join(ROOT, 'sitemap.xml'), 'utf8');
  for (const [, loc] of all(/<loc>https:\/\/ci-dienstleistungen\.com([^<]*)<\/loc>/g, xml)) {
    const file = await resolveLocal(loc || '/');
    if (!file) fail('sitemap.xml', `URL ohne Seite: ${loc}`);
    else if (/noindex/.test(await readFile(file, 'utf8'))) fail('sitemap.xml', `noindex-Seite in Sitemap: ${loc}`);
  }
}

const seen = { titles: new Set(), descs: new Set() };
for (const page of PAGES) await checkPage(page, seen);
await checkSitemap();

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`✓ ${PAGES.length} Seiten geprüft: H1, Title/Description, Canonical, Alt-Texte, JSON-LD, Headings, Links, Sitemap`);
