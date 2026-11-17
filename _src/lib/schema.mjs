/**
 * JSON-LD-Bausteine (Schema.org). NAP-Daten kommen ausschließlich aus SITE,
 * damit Footer, Kontakt und Schema garantiert identisch sind.
 *
 * Bewusst weggelassen (keine erfundenen Fakten):
 *  - openingHoursSpecification  -> TODO: vom Kunden
 *  - geo                        -> TODO: Koordinaten aus Google-Unternehmensprofil übernehmen
 *  - sameAs                     -> TODO: Profil-URLs (Google, Instagram …) vom Kunden
 *  - aggregateRating/review     -> keine Bewertungen mit überprüfbarer Quelle vorhanden
 */
import { SITE, SERVICES, SERVICE_GROUPS } from '../data.mjs';
import { HERO_GLASS_DESKTOP } from '../image-config.mjs';
import { imgUrl } from './html.mjs';

export const BUSINESS_ID = `${SITE.origin}/#organisation`;
const AREAS = ['Regensburg', 'Kelheim', 'Landshut'];

const areaServed = (cities = AREAS) => cities.map((name) => ({ '@type': 'City', name }));

export function localBusiness({ areas = AREAS, url = `${SITE.origin}/` } = {}) {
  return {
    '@type': 'HousekeepingService',
    '@id': BUSINESS_ID,
    name: SITE.name,
    description: 'Gebäudereinigung und Hausmeisterservice aus einer Hand in Regensburg, Kelheim und Landshut – je Standort mit rund 40 km Umkreis. ' + SITE.radiusNote,
    url,
    logo: `${SITE.origin}/assets/img/icons/icon-512.png`,
    image: `${SITE.origin}${imgUrl(HERO_GLASS_DESKTOP, 1344)}`,
    telephone: SITE.phoneE164,
    email: SITE.email,
    founder: { '@type': 'Person', name: SITE.owner },
    priceRange: SITE.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      postalCode: SITE.address.zip,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    areaServed: areaServed(areas),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Leistungen',
      itemListElement: SERVICE_GROUPS.map((g) => ({
        '@type': 'OfferCatalog',
        name: g.title,
        itemListElement: SERVICES.filter((s) => s.group === g.id).map((s) => ({
          '@type': 'Offer',
          itemOffered: { '@id': `${SITE.origin}/#leistung-${s.id}` },
        })),
      })),
    },
  };
}

/** long=true: ausführliche Beschreibung (Stadtseiten), sonst die sichtbare Kurzfassung (Startseite). */
export function serviceNodes(services = SERVICES, areas = AREAS, { long = false } = {}) {
  return services.map((s) => ({
    '@type': 'Service',
    '@id': `${SITE.origin}/#leistung-${s.id}`,
    name: s.title,
    description: long ? s.text : s.short,
    serviceType: s.title,
    provider: { '@id': BUSINESS_ID },
    areaServed: areaServed(areas),
  }));
}

export const website = () => ({
  '@type': 'WebSite',
  '@id': `${SITE.origin}/#website`,
  url: `${SITE.origin}/`,
  name: SITE.name,
  inLanguage: 'de-DE',
  publisher: { '@id': BUSINESS_ID },
});

export const faqPage = (items, url) => ({
  '@type': 'FAQPage',
  '@id': `${url}#faq`,
  mainEntity: items.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
});

/** crumbs: [{ name, url }] – die erste Ebene ist immer die Startseite. */
export const breadcrumbs = (crumbs) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Startseite', url: `${SITE.origin}/` }, ...crumbs].map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: c.url,
  })),
});

export const webPage = ({ url, name, description }) => ({
  '@type': 'WebPage',
  '@id': `${url}#webpage`,
  url,
  name,
  description,
  inLanguage: 'de-DE',
  isPartOf: { '@id': `${SITE.origin}/#website` },
  about: { '@id': BUSINESS_ID },
});

export const graph = (nodes) =>
  `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c')}</script>`;
