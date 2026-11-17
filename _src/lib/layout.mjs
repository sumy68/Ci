import { logoUrl, LOGO_WIDTHS, OG_IMAGE_URL } from './image-names.mjs';
/** Seitenrahmen: <head>, Header, Footer, WhatsApp-Button, Skripte. */
import { SITE, SERVICE_GROUPS, CITIES } from '../data.mjs';
import { esc, ICONS, button } from './html.mjs';
import { ACCORDION_SCRIPT } from './accordion.mjs';

const YEAR = new Date().getFullYear();

const logo = (variant, alt) => {
  const set = (ext) => LOGO_WIDTHS.map((w, i) => `${logoUrl(variant, w, ext)} ${i + 1}x`).join(', ');
  return `<picture>
      <source type="image/avif" srcset="${set('avif')}">
      <source type="image/webp" srcset="${set('webp')}">
      <img src="${logoUrl(variant, 116, 'png')}" srcset="${set('png')}" alt="${esc(alt)}" width="58" height="40" decoding="async">
    </picture>`;
};

/** Inline-Skript im <head>: setzt JS-/Motion-Klassen vor dem ersten Rendern. */
const BOOT_SCRIPT = `<script>(function(d){var c=d.classList;c.add('js');try{if(sessionStorage.getItem('ci-fade')){c.add('is-entering');sessionStorage.removeItem('ci-fade')}}catch(e){}if(!matchMedia('(prefers-reduced-motion: reduce)').matches){c.add('js-motion');setTimeout(function(){if(!c.contains('motion-on'))c.add('motion-off')},2500)}})(document.documentElement)</script>`;

export function head(page, { criticalCss, assets }) {
  const url = `${SITE.origin}${page.path}`;
  const ogImage = `${SITE.origin}${OG_IMAGE_URL}`;
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.description)}">
  <link rel="canonical" href="${url}">
  <meta name="robots" content="${page.robots ?? 'index, follow, max-image-preview:large'}">
  <meta name="theme-color" content="#FAFAF8">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/assets/img/icons/favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="/assets/img/icons/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="de_DE">
  <meta property="og:site_name" content="${SITE.name}">
  <meta property="og:title" content="${esc(page.ogTitle ?? page.title)}">
  <meta property="og:description" content="${esc(page.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Glasfassade eines Bürogebäudes mit dem Logo von CI Dienstleistungen (Symbolbild)">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(page.ogTitle ?? page.title)}">
  <meta name="twitter:description" content="${esc(page.description)}">
  <meta name="twitter:image" content="${ogImage}">
  <link rel="preload" href="/assets/fonts/schibsted-grotesk-700.woff2" as="font" type="font/woff2" crossorigin>
  ${page.preload ?? ''}
  ${BOOT_SCRIPT}
  ${ACCORDION_SCRIPT}
  <style>${criticalCss}</style>
  <link rel="preload" href="${assets.css}" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="${assets.css}"></noscript>
  ${page.jsonLd ?? ''}
</head>`;
}

const NAV_ITEMS = [
  ['leistungen', 'Leistungen'],
  ['abos', 'Abo-Modelle'],
  ['ueber-uns', 'Über uns'],
  ['kontakt', 'Kontakt'],
];

export function header({ isHome }) {
  const base = isHome ? '' : '/';
  const links = NAV_ITEMS.map(([id, label]) => `<li><a class="nav-link" href="${base}#${id}">${label}</a></li>`).join('\n          ');
  return `<a class="skip-link" href="#inhalt">Zum Inhalt springen</a>
  <header class="site-header" data-header>
    <div class="site-header__bar">
      <a class="brand" href="${isHome ? '#top' : '/'}" aria-label="${SITE.name} – zur Startseite">
        ${logo('dunkel', SITE.name)}
      </a>
      <nav class="nav-menu" id="site-menu" aria-label="Hauptmenü">
        <ul class="nav-links">
          ${links}
        </ul>
        <div class="nav-actions">
          <a class="nav-phone" href="tel:${SITE.phoneE164}">${ICONS.phone(17)}<span>${SITE.phoneDisplay}</span></a>
          ${button(`${base}#kontakt`, 'Jetzt anfragen', { magnetic: true, extra: ' data-size="small"' })}
        </div>
        <p class="nav-menu__meta"><a class="contact-link" href="${SITE.mapsUrl}" target="_blank" rel="noopener">${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}<span class="sr-only"> (Google Maps, öffnet neues Fenster)</span></a><br><a class="contact-link" href="mailto:${SITE.email}">${SITE.email}</a></p>
      </nav>
      <a class="nav-wa-icon" href="${SITE.whatsapp}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp-Nachricht schreiben (öffnet neues Fenster)">${ICONS.waLine(22)}</a>
      <a class="nav-phone-icon" href="tel:${SITE.phoneE164}" aria-label="Anrufen: ${SITE.phoneDisplay}">${ICONS.phoneLine(22)}</a>
      <button class="burger" type="button" data-burger aria-controls="site-menu" aria-expanded="false" aria-label="Menü öffnen">
        <span aria-hidden="true"></span>
      </button>
    </div>
  </header>`;
}

/* Linkgruppe: Desktop mit festem Titel; mobil (< 768 px) als geschlossene Klappgruppe
   (Button nutzt das Akkordeon-Skript, Zustand nur in aria-expanded). */
const footerList = (id, title, items) => `<div class="footer__col footer__col--${id}">
        <p class="footer__title">${title}</p>
        <button class="footer__toggle" type="button" aria-expanded="false" aria-controls="footer-${id}" data-acc-trigger>${title}<span class="acc__icon" aria-hidden="true"></span></button>
        <ul id="footer-${id}">${items.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul>
      </div>`;

export function footer({ isHome, currentPath }) {
  const base = isHome ? '' : '/';
  const mark = (href, label) => [href, href === currentPath ? `<span aria-current="page">${label}</span>` : label];
  // Mobil: Impressum/Datenschutz in der Fußzeile statt eigener Spalte (gleiche Links)
  const legal = [mark('/impressum', 'Impressum'), mark('/datenschutz', 'Datenschutz')];
  return `<footer class="footer" data-footer>
    <div class="wrap footer__grid">
      <div class="footer__brand">
        <a class="footer__logo" href="/" aria-label="${SITE.name} – zur Startseite">${logo('hell', SITE.name)}</a>
        <p class="footer__claim">Gebäudereinigung und Hausmeisterservice aus einer Hand – in Regensburg, Kelheim und Landshut.</p>
        <address class="footer__nap">
          <strong>${SITE.name}</strong><br>
          <a class="contact-link" href="tel:${SITE.phoneE164}">${SITE.phoneDisplay}</a><br>
          <a class="contact-link" href="mailto:${SITE.email}">${SITE.email}</a>
        </address>
        <div class="footer__contact">
          <p class="footer__contact-title">${SITE.name}</p>
          <ul>
            <li><a class="contact-link" href="tel:${SITE.phoneE164}">${ICONS.phoneLine(16)}<span>${SITE.phoneDisplay}</span></a></li>
            <li><a class="contact-link" href="mailto:${SITE.email}">${ICONS.mailLine(16)}<span>${SITE.email}</span></a></li>
            <li><a class="contact-link" href="${SITE.whatsapp}" target="_blank" rel="noopener noreferrer">${ICONS.waLine(16)}<span>WhatsApp<span class="sr-only"> (öffnet neues Fenster)</span></span></a></li>
            <li><a class="contact-link" href="${SITE.mapsUrl}" target="_blank" rel="noopener">${ICONS.pinLine(16)}<span>${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}<span class="sr-only"> (Google Maps, öffnet neues Fenster)</span></span></a></li>
          </ul>
        </div>
      </div>
      ${footerList('leistungen', 'Leistungen', [...SERVICE_GROUPS.map((g) => [`${base}#${g.id}`, g.title]), [`${base}#abos`, 'Abo-Modelle']])}
      ${footerList('einsatzgebiete', 'Einsatzgebiete', CITIES.map((c) => mark(`/${c.slug}`, `Gebäudereinigung ${c.city}`)))}
      ${footerList('unternehmen', 'Unternehmen', [[`${base}#ueber-uns`, 'Über uns'], [`${base}#kundenmeinungen`, 'Kundenmeinungen'], [`${base}#standort`, 'Standort'], [`${base}#faq`, 'Häufige Fragen'], [`${base}#kontakt`, 'Kontakt']])}
      ${footerList('rechtliches', 'Rechtliches', [mark('/impressum', 'Impressum'), mark('/datenschutz', 'Datenschutz')])}
    </div>
    <div class="wrap footer__bottom">
      <p class="footer__legal">${legal.map(([href, label]) => (label.startsWith('<span') ? label : `<a href="${href}">${label}</a>`)).join(' <span aria-hidden="true">·</span> ')}</p>
      <p class="footer__copy">© ${YEAR} ${SITE.name}, Inhaber ${SITE.owner}</p>
      <p class="footer__ai"><a href="/impressum#bildnachweis">Teilweise KI-generierte Symbolbilder</a></p>
    </div>
  </footer>`;
}

export const whatsappFab = () =>
  `<a class="wa-fab" href="${SITE.whatsapp}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp-Nachricht an ${SITE.name} schreiben (öffnet neues Fenster)" data-wa-fab>${ICONS.whatsapp(28)}</a>`;

export function scripts(assets, { motion }) {
  const base = [`<script src="${assets.nav}" defer></script>`, `<script src="${assets.main}" defer></script>`];
  if (!motion) return base.join('\n  ');
  const vendor = ['gsap.min.js', 'ScrollTrigger.min.js', 'SplitText.min.js', 'lenis.min.js'].map(
    (f) => `<script src="/assets/js/vendor/${f}" defer></script>`,
  );
  return [...base, ...vendor, `<script src="${assets.motion}" defer></script>`].join('\n  ');
}

/** Komplettes Dokument. */
export function documentHtml(page, ctx) {
  const isHome = page.path === '/';
  return `<!doctype html>
<html lang="de">
${head(page, ctx)}
<body class="${page.bodyClass ?? ''}">
  ${header({ isHome })}
  <main id="inhalt" tabindex="-1">
${page.main}
  </main>
  ${footer({ isHome, currentPath: page.path })}
  ${whatsappFab()}
  ${scripts(ctx.assets, { motion: page.motion !== false })}
</body>
</html>
`;
}
