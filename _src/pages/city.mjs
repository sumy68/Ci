/** Stadt-Landingpages (/gebaeudereinigung-…) */
import { SITE, SERVICES, serviceById, locationById, CITIES } from '../data.mjs';
import { SERVICE_IMAGE_BY_ID } from '../image-config.mjs';
import { picture, preloadPicture, button, ICONS, arrowLink, overline } from '../lib/html.mjs';
import { sectionHead, serviceRow, faqList, radiusMap, locationAddress, mapsUrlFor } from '../lib/sections.mjs';
import { contactSection } from './home.mjs';
import { graph, localBusiness, serviceNodes, faqPage, breadcrumbs, webPage } from '../lib/schema.mjs';

const HEAD_SIZES = '(min-width: 1360px) 560px, (min-width: 900px) 42vw, calc(100vw - 40px)';
const ROW_SIZES = '(min-width: 1360px) 420px, (min-width: 900px) 32vw, 94vw';

function pageHead(city, loc) {
  const lead = serviceById(city.focus[0]);
  return `<section class="page-head page-head--city" aria-labelledby="page-title">
      <div class="nav-sentinel" data-nav-sentinel aria-hidden="true"></div>
      <div class="wrap page-head__grid">
        <div class="page-head__copy">
          <nav class="breadcrumb" aria-label="Brotkrümelnavigation">
            <ol><li><a href="/">Startseite</a></li><li><span aria-current="page">Gebäudereinigung ${city.city}</span></li></ol>
          </nav>
          ${overline('Einsatzgebiet')}
          <h1 class="h-display" id="page-title">${city.h1}</h1>
          <p class="page-head__lead">${city.lead}</p>
          <div class="hero__actions">
            ${button('#anfrage', `Angebot für ${city.city} anfragen`)}
            <a class="phone-link" href="tel:${SITE.phoneE164}">${ICONS.phone(18)}<span>${SITE.phoneDisplay}</span></a>
          </div>
        </div>
        <div class="page-head__media frame">
          ${picture(SERVICE_IMAGE_BY_ID[lead.id], { alt: `${lead.title} in ${city.city} – ${lead.alt} (Symbolbild)`, sizes: HEAD_SIZES, priority: true })}
        </div>
      </div>
    </section>`;
}

function story(city, loc) {
  return `<section class="section city-story" aria-labelledby="story-title">
      <div class="wrap grid12">
        <div class="city-story__copy">
          ${sectionHead({ label: `Gebäudereinigung ${city.city}`, id: 'story-title', title: `Reinigung und Betreuung für Ihr Objekt in ${city.city}` })}
          ${city.body.map((p) => `<p>${p}</p>`).join('\n          ')}
        </div>
        <aside class="city-story__aside" aria-label="Ihr Standort">
          <div class="loc-card">
            <p class="loc-card__label">${loc.label}</p>
            <p class="loc-card__address"><a class="contact-link" href="${mapsUrlFor(loc)}" target="_blank" rel="noopener">${loc.street}<br>${loc.zipCity}<span class="sr-only"> (Google Maps, öffnet neues Fenster)</span></a></p>
            <p class="loc-card__note">${loc.note}</p>
            <ul class="loc-card__contact">
              <li><span class="contact-list__label">Telefon</span><a class="contact-link" href="tel:${SITE.phoneE164}">${SITE.phoneDisplay}</a></li>
              <li><span class="contact-list__label">E-Mail</span><a class="contact-link" href="mailto:${SITE.email}">${SITE.email}</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </section>`;
}

function services(city) {
  const rows = city.focus.map((id, i) => serviceRow(serviceById(id), { index: i, sizes: ROW_SIZES, contactHref: '#anfrage', city: city.city })).join('\n          ');
  return `<section class="section city-services" aria-labelledby="services-title">
      <div class="wrap">
        ${sectionHead({ label: 'Leistungen', id: 'services-title', title: `Leistungen in ${city.city}`, lead: `Eine Auswahl aus unseren ${SERVICES.length} Leistungen – alle weiteren bieten wir in ${city.city} ebenso an.`, className: 'section-head--split' })}
        <div class="svc-rows">
          ${rows}
        </div>
        <p class="city-services__more">${arrowLink('/#leistungen', `Alle ${SERVICES.length} Leistungen ansehen`)}</p>
      </div>
    </section>`;
}

function area(city) {
  const others = CITIES.filter((c) => c.slug !== city.slug);
  return `<section class="section city-area" aria-labelledby="area-title">
      <div class="wrap grid12">
        <div class="areas__map" data-reveal="map">
          ${radiusMap({ highlight: city.location, idSuffix: city.location })}
        </div>
        <div class="city-area__copy">
          ${sectionHead({ label: 'Einsatzgebiet', id: 'area-title', title: `${city.city} und rund ${SITE.radiusKm}&nbsp;km Umgebung` })}
          <p>Wir sind in ${city.city} und im Umkreis von rund ${SITE.radiusKm}&nbsp;km im Einsatz, unter anderem in:</p>
          <!-- TODO: vom Kunden – Liste der Orte bestätigen bzw. ergänzen -->
          <ul class="inline-list">${city.places.map((p) => `<li>${p}</li>`).join('')}</ul>
          <p class="city-area__others">Weitere Einsatzgebiete: ${others.map((c) => `<a href="/${c.slug}">Gebäudereinigung ${c.city}</a>`).join(' und ')}.</p>
        </div>
      </div>
    </section>`;
}

function faq(city) {
  return `<section class="section faq-section" id="faq" aria-labelledby="faq-title">
      <div class="wrap grid12">
        <div class="faq-section__head">
          ${sectionHead({ label: 'Häufige Fragen', id: 'faq-title', title: `Fragen zur Gebäudereinigung in ${city.city}` })}
        </div>
        <div class="faq-section__list">
        ${faqList(city.faq)}
        </div>
      </div>
    </section>`;
}

export function cityPage(city) {
  const loc = locationById(city.location);
  const url = `${SITE.origin}/${city.slug}`;
  const focus = city.focus.map(serviceById);
  const heroSet = SERVICE_IMAGE_BY_ID[city.focus[0]];
  return {
    path: `/${city.slug}`,
    file: `${city.slug}.html`,
    title: city.title,
    description: city.description,
    priority: '0.8',
    preload: preloadPicture(heroSet, HEAD_SIZES),
    bodyClass: 'page-city',
    jsonLd: graph([
      webPage({ url, name: city.title, description: city.description }),
      localBusiness({ areas: [city.city], url }),
      ...serviceNodes(focus, [city.city], { long: true }),
      faqPage(city.faq, url),
      breadcrumbs([{ name: `Gebäudereinigung ${city.city}`, url }]),
    ]),
    main: [
      pageHead(city, loc),
      story(city, loc),
      services(city),
      area(city),
      faq(city),
      contactSection({
        id: 'anfrage',
        title: `Gebäudereinigung in ${city.city} anfragen`,
        lead: `Beschreiben Sie kurz Ihr Objekt in ${city.city} oder Umgebung – wir melden uns zeitnah mit einem individuellen Angebot. ${loc.label}: ${locationAddress(loc)}.`,
      }),
    ].join('\n\n    '),
  };
}
