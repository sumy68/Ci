/** Wiederverwendbare Abschnitte für Start- und Unterseiten. */
import { SITE, LOCATIONS } from '../data.mjs';
import { SERVICE_IMAGE_BY_ID } from '../image-config.mjs';
import { esc, picture, ICONS, button, overline } from './html.mjs';
import { accordionParts } from './accordion.mjs';

/** Kopf eines Abschnitts: Overline, H2 (maskierte Zeilen-Animation), optional Lead. */
export const sectionHead = ({ label, title, lead, id, className = '' }) => `<div class="section-head ${className}">
        ${label ? overline(label) : ''}
        <h2 class="h-section"${id ? ` id="${id}"` : ''} data-reveal="lines">${title}</h2>
        ${lead ? `<p class="lead">${lead}</p>` : ''}
      </div>`;

/** Natürlicher Alt-Text: Bildbeschreibung + Ort, ohne doppelte Keywords; KI-Bild = Symbolbild. */
export const serviceAlt = (service, city) => `${service.alt} in ${city} (Symbolbild)`;

/**
 * Editoriale Leistungszeile (Stadtseiten): Nummer, Bild, Titel, ausführlicher
 * Text und Anfrage-Link – statt eines Rasters identischer Karten.
 */
export function serviceRow(service, { index, sizes, contactHref = '#kontakt', city }) {
  const set = SERVICE_IMAGE_BY_ID[service.id];
  // Zugeklappt: Nummer + Titel (Keyword). Aufgeklappt: Bild, ausführlicher Text, Anfrage-Link.
  const acc = accordionParts({
    id: `leistung-${service.id}`,
    label: service.title,
    level: 3,
    titleClass: 'svc-row__title',
    prefix: `<span class="svc-row__num" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>`,
    content: `<div class="svc-row__detail">
                <div class="svc-row__media frame">${picture(set, { alt: serviceAlt(service, city), sizes })}</div>
                <div class="svc-row__body">
                  <p>${service.text}</p>
                  <a class="link-arrow" href="${contactHref}" data-service="${esc(service.title)}"><span>Anfragen<span class="sr-only">: ${service.title}</span></span>${ICONS.arrow()}</a>
                </div>
              </div>`,
  });
  return `<article class="svc-row acc" id="leistung-${service.id}">
            ${acc.trigger}
            ${acc.panel}
          </article>`;
}

export function faqList(items) {
  return `<div class="faq" data-faq>
${items
  .map(
    (item) => `          <details class="faq__item">
            <summary class="faq__q"><span>${item.q}</span><span class="faq__icon" aria-hidden="true"></span></summary>
            <div class="faq__a"><p>${item.a}</p>${item.todo ? `<!-- ${item.todo} -->` : ''}</div>
          </details>`,
  )
  .join('\n')}
        </div>`;
}

/*
 * Schematische Radius-Karte. Koordinaten in km relativ zu 48,8° N / 12,0° O
 * (x = Ost, y = Süd), Radius je Standort 40 km laut bisheriger Website.
 */
const CITY_POINTS = Object.freeze({
  regensburg: { x: 7.4, y: -23.7, label: 'Regensburg', lx: 12, ly: -27 },
  kelheim: { x: -8.3, y: -13.1, label: 'Kelheim', lx: -35, ly: -9 },
  landshut: { x: 11.1, y: 29.2, label: 'Landshut', lx: 15.5, ly: 35.5 },
});
const OFFICES = Object.freeze([
  { x: 9.2, y: -22.2, name: 'Büro Regensburg' },
  { x: 3.7, y: -2.4, name: 'Standort Langquaid' },
  { x: 15.1, y: 24.5, name: 'Standort Ergolding' },
]);

export function radiusMap({ highlight = null, idSuffix = 'home' } = {}) {
  const circles = Object.entries(CITY_POINTS)
    .map(([id, p]) => {
      const state = highlight === null || highlight === id ? 'is-on' : 'is-off';
      return `<circle class="map__radius ${state}" cx="${p.x}" cy="${p.y}" r="40" pathLength="1" data-draw/>`;
    })
    .join('');
  const labels = Object.entries(CITY_POINTS)
    .map(([id, p]) => `<g class="map__city${highlight === id ? ' is-active' : ''}"><circle cx="${p.x}" cy="${p.y}" r="1.1"/><text x="${p.lx}" y="${p.ly}">${p.label}</text></g>`)
    .join('');
  const offices = OFFICES.map((o) => `<rect class="map__office" x="${o.x - 1.4}" y="${o.y - 1.4}" width="2.8" height="2.8" transform="rotate(45 ${o.x} ${o.y})"><title>${o.name}</title></rect>`).join('');
  return `<figure class="map">
          <svg class="map__svg" viewBox="-54 -70 116 146" role="img" aria-labelledby="map-title-${idSuffix} map-desc-${idSuffix}">
            <title id="map-title-${idSuffix}">Einsatzgebiete von ${SITE.name}</title>
            <desc id="map-desc-${idSuffix}">Schematische Karte mit je rund 40 Kilometern Radius um Regensburg, Kelheim und Landshut sowie den Standorten Regensburg, Langquaid und Ergolding.</desc>
            <path class="map__river" d="M-54 6 C-40 4 -25 -6 -8.3 -13.1 S 3 -15 7.4 -23.7 S 30 -14 41.7 -8.9 S 54 -2 62 2"/>
            <path class="map__river" d="M-10 44 C-4 36 4 32 11.1 29.2 S 28 22 36.6 18.9 S 52 12 62 9"/>
            <text class="map__river-label" x="-44" y="-1">Donau</text>
            <text class="map__river-label" x="40" y="24">Isar</text>
            ${circles}
            ${labels}
            ${offices}
          </svg>
          <figcaption class="map__caption"><span class="map__key map__key--office" aria-hidden="true"></span> Unsere Standorte <span class="map__key map__key--radius" aria-hidden="true"></span> rund ${SITE.radiusKm} km Einsatzradius (schematisch)</figcaption>
        </figure>`;
}

export const locationAddress = (loc) => `${loc.street}, ${loc.zipCity}`;

/** Google-Maps-Suche für einen Standort (keine Einbettung, nur Link). */
export const mapsUrlFor = (loc) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationAddress(loc))}`;

export function contactList() {
  const main = LOCATIONS[0];
  // Alle vier Einträge identisch: Label + Link, einheitlicher Hover, keine Icon-Kacheln
  const row = (label, href, text, external = false) =>
    `<li><span class="contact-list__label">${label}</span><a class="contact-link" href="${href}"${external ? ' target="_blank" rel="noopener"' : ''}>${text}${external ? '<span class="sr-only"> (öffnet neues Fenster)</span>' : ''}</a></li>`;
  return `<ul class="contact-list">
          ${row('Telefon', `tel:${SITE.phoneE164}`, SITE.phoneDisplay)}
          ${row('WhatsApp', SITE.whatsapp, 'Nachricht schreiben', true)}
          ${row('E-Mail', `mailto:${SITE.email}`, SITE.email)}
          ${row('Büro', SITE.mapsUrl, locationAddress(main), true)}
        </ul>
        <!-- TODO: vom Kunden – Öffnungszeiten / telefonische Erreichbarkeit ergänzen -->`;
}

/** Dunkles Abschluss-Band mit Handlungsaufforderung (Unterseiten). */
export function ctaBand({ title, text, href = '/#kontakt' }) {
  return `<section class="cta-band section--night" aria-labelledby="cta-title">
      <div class="wrap cta-band__inner">
        <h2 class="h-section" id="cta-title" data-reveal="lines">${title}</h2>
        <div class="cta-band__side">
          <p>${text}</p>
          <div class="cta-band__actions">
            ${button(href, 'Jetzt anfragen', { variant: 'accent' })}
            <a class="phone-link phone-link--light" href="tel:${SITE.phoneE164}">${ICONS.phone(18)}<span>${SITE.phoneDisplay}</span></a>
          </div>
        </div>
      </div>
    </section>`;
}
