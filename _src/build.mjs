import { GRIME_URL } from './lib/image-names.mjs';
/**
 * Statischer Seiten-Build. Erzeugt alle HTML-Seiten im Projekt-Root
 * (GitHub Pages liefert /impressum aus impressum.html usw.), dazu
 * sitemap.xml, robots.txt, site.webmanifest, llms.txt und die Schmutzfilm-Textur.
 *
 * Aufruf: npm run build
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, CITIES, SERVICE_GROUPS, servicesInGroup, ABOS, LOCATIONS } from './data.mjs';
import { documentHtml } from './lib/layout.mjs';
import { homePage } from './pages/home.mjs';
import { cityPage } from './pages/city.mjs';
import { impressumPage, datenschutzPage, notFoundPage, legacyRedirect } from './pages/legal.mjs';
import { grimeSvg } from './grime.mjs';
import { buildAllPairs } from './before-after.mjs';
import { protectBreaks } from './lib/nowrap.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TODAY = new Date().toISOString().slice(0, 10);

const LIMITS = Object.freeze({ title: [50, 60], description: [140, 155] });

const minifyCss = (css) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();

const hash = (content) => createHash('sha256').update(content).digest('hex').slice(0, 10);

async function write(rel, content) {
  const file = path.join(ROOT, rel);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content);
}

/** CSS minifizieren, Skripte versionieren (Cache-Busting über ?v=Hash). */
async function prepareAssets() {
  const mainCss = minifyCss(await readFile(path.join(ROOT, '_src/css/main.css'), 'utf8'));
  await write('assets/css/main.css', mainCss);
  const versioned = async (rel) => `/${rel}?v=${hash(await readFile(path.join(ROOT, rel)))}`;
  return {
    criticalCss: minifyCss(await readFile(path.join(ROOT, '_src/css/critical.css'), 'utf8')),
    assets: {
      css: `/assets/css/main.css?v=${hash(mainCss)}`,
      nav: await versioned('nav.js'),
      main: await versioned('assets/js/main.js'),
      motion: await versioned('assets/js/motion.js'),
    },
  };
}

function checkLengths(pages) {
  const warnings = [];
  for (const page of pages) {
    for (const [key, [min, max]] of Object.entries(LIMITS)) {
      const len = [...page[key]].length;
      if (len < min || len > max) warnings.push(`${page.path} ${key}: ${len} Zeichen (Soll ${min}–${max})`);
    }
  }
  const titles = new Set(pages.map((p) => p.title));
  if (titles.size !== pages.length) warnings.push('Titel sind nicht eindeutig');
  return warnings;
}

/** Bild-Sitemap: je Seite die Inhaltsbilder (page.images = URL-Pfade, ohne Duplikate). */
const imageTags = (p) =>
  [...new Set(p.images ?? [])].map((u) => `\n    <image:image><image:loc>${SITE.origin}${u}</image:loc></image:image>`).join('');

const sitemap = (pages) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .map((p) => `  <url>
    <loc>${SITE.origin}${p.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <priority>${p.priority}</priority>${imageTags(p)}
  </url>`)
  .join('\n')}
</urlset>
`;

const robots = () => `User-agent: *
Allow: /

Sitemap: ${SITE.origin}/sitemap.xml
`;

const manifest = () =>
  JSON.stringify(
    {
      name: SITE.name,
      short_name: 'CI',
      description: 'Gebäudereinigung und Hausmeisterservice in Regensburg, Kelheim und Landshut',
      start_url: '/',
      display: 'browser',
      background_color: '#FAFAF8',
      theme_color: '#16181B',
      lang: 'de',
      icons: [
        { src: '/assets/img/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/assets/img/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/assets/img/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2,
  );

function llmsTxt() {
  const groups = SERVICE_GROUPS.map((g) => `- ${g.title}: ${servicesInGroup(g.id).map((s) => s.title).join(', ')}`).join('\n');
  const locs = LOCATIONS.map((l) => `- ${l.label}: ${l.street}, ${l.zipCity}`).join('\n');
  return `# ${SITE.name}

> ${SITE.name} ist ein Dienstleister für Gebäudereinigung und Hausmeisterservice in Regensburg, Kelheim und Landshut (Bayern). Je Standort wird das Umland im Umkreis von rund ${SITE.radiusKm} km betreut; ${SITE.radiusNote.charAt(0).toLowerCase() + SITE.radiusNote.slice(1)} Inhaber: ${SITE.owner}.

## Kontakt
- Telefon: ${SITE.phoneDisplay} (${SITE.phoneE164})
- E-Mail: ${SITE.email}
- Adresse: ${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}

## Standorte
${locs}

## Leistungen
${groups}

## Abo-Modelle (Preis auf Anfrage)
${ABOS.map((a) => `- ${a.name}: ${a.text}`).join('\n')}

## Wichtige Seiten
- [Startseite mit allen Leistungen](${SITE.origin}/)
${CITIES.map((c) => `- [Gebäudereinigung ${c.city}](${SITE.origin}/${c.slug})`).join('\n')}
- [Kontakt](${SITE.origin}/#kontakt)
- [Impressum](${SITE.origin}/impressum)
`;
}

async function main() {
  const ctx = await prepareAssets();
  const pairs = await buildAllPairs();
  const missing = Object.entries(pairs).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) console.warn(`Vorher/Nachher ohne Bilder (Platzhalter): ${missing.join(', ')}`);
  const indexable = [homePage({ pairs }), ...CITIES.map(cityPage)];
  const pages = [...indexable, impressumPage(), datenschutzPage(), notFoundPage()];

  // Telefonnummern, E-Mails, PLZ+Ort usw. vor Zeilenumbrüchen schützen
  for (const page of pages) await write(page.file, protectBreaks(documentHtml(page, ctx)));
  await write('Datenschutzerklärung.html', legacyRedirect({ file: 'Datenschutzerklärung.html', target: '/datenschutz' }));
  await write('sitemap.xml', sitemap(indexable));
  await write('robots.txt', robots());
  await write('site.webmanifest', manifest());
  await write('llms.txt', llmsTxt());
  await write(GRIME_URL.replace(/^\//, ''), grimeSvg());

  console.log(`✓ ${pages.length} Seiten, Sitemap (${indexable.length} URLs), robots.txt, Manifest, llms.txt`);
  const warnings = checkLengths(pages);
  if (warnings.length) console.warn('\nHinweise:\n' + warnings.join('\n'));
}

main().catch((err) => {
  console.error('Build fehlgeschlagen:', err);
  process.exit(1);
});
