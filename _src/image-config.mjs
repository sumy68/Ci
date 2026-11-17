/**
 * Zentrale Bildkonfiguration – von der Bild-Pipeline (images.mjs)
 * und vom Seiten-Build (picture()-Helfer) gemeinsam genutzt.
 *
 * Dateinamen nach Schema Leistung + Ort (siehe lib/image-names.mjs), der
 * Inhalts-Hash wird automatisch ans Ende gesetzt.
 */
import { CITIES } from './data.mjs';

/** Ort eines Leistungsbildes = Stadtseite, auf der es erscheint (je Leistung genau eine). */
function cityOf(serviceId) {
  const city = CITIES.find((c) => c.focus.includes(serviceId));
  if (!city) throw new Error(`Leistung ${serviceId} ist keiner Stadtseite zugeordnet`);
  return city.city.toLowerCase();
}

const serviceImage = (id, src, topic) =>
  Object.freeze({ src: `leistungen/${src}`, name: `${topic}-${cityOf(id)}`, dir: 'leistungen', widths: [480, 768, 1000], budgetKb: 120, width: 1000, height: 666 });

/*
 * Glas-Hero (Art Direction): Desktop/Tablet quer, Mobil hoch.
 * Quellen liegen öffentlich unter /assets/hero/ (rootSrc = relativ zum Projekt-Root).
 * Breiten nie größer als das Original (1344 × 752 bzw. 752 × 1344).
 */
export const HERO_GLASS_DESKTOP = Object.freeze({
  rootSrc: 'assets/hero/gebaeudereinigung-regensburg-glasfassade-desktop.jpg',
  name: 'gebaeudereinigung-regensburg-glasfassade-desktop',
  dir: 'hero',
  widths: [768, 1200, 1344],
  budgetKb: 250,
  width: 1344,
  height: 752,
});

export const HERO_GLASS_MOBILE = Object.freeze({
  rootSrc: 'assets/hero/gebaeudereinigung-regensburg-glasfassade-mobil.jpg',
  name: 'gebaeudereinigung-regensburg-glasfassade-mobil',
  dir: 'hero',
  widths: [480, 752],
  budgetKb: 250,
  width: 752,
  height: 1344,
});

// Hinweis: Das frühere „Über uns“-Bild (_src/images/hero/hero-villa.jpg) wird nicht
// mehr verwendet und daher auch nicht mehr erzeugt (siehe BILDER-TODO.md).
export const IMAGE_SETS = Object.freeze([HERO_GLASS_DESKTOP, HERO_GLASS_MOBILE]);

/** Schlüssel = interne ID der Leistung (siehe data.mjs). */
export const SERVICE_IMAGE_BY_ID = Object.freeze({
  unterhaltsreinigung: serviceImage('unterhaltsreinigung', 'unterhaltsreinigung.jpg', 'unterhaltsreinigung-buero'),
  grundreinigung: serviceImage('grundreinigung', 'grundreinigung.jpg', 'grundreinigung'),
  sanitaer: serviceImage('sanitaer', 'sanitaer.jpg', 'sanitaerreinigung'),
  kueche: serviceImage('kueche', 'kueche.jpg', 'kuechenreinigung'),
  treppenhaus: serviceImage('treppenhaus', 'treppenhaus.jpg', 'treppenhausreinigung'),
  desinfektion: serviceImage('desinfektion', 'desinfektion.jpg', 'desinfektionsreinigung'),
  fenster: serviceImage('fenster', 'fenster.jpg', 'fensterreinigung'),
  fassade: serviceImage('fassade', 'fassade.jpg', 'fassadenreinigung'),
  stein: serviceImage('stein', 'stein_fugen.jpg', 'graffitientfernung-steinreinigung'),
  bau: serviceImage('bau', 'baureinigung.jpg', 'bauendreinigung'),
  objektkontrolle: serviceImage('objektkontrolle', 'objektkontrolle.jpg', 'objektkontrolle-hausmeisterservice'),
  reparaturen: serviceImage('reparaturen', 'kleinreparaturen.jpg', 'kleinreparaturen-hausmeisterservice'),
  aussenanlagen: serviceImage('aussenanlagen', 'aussenanlagen.jpg', 'gartenpflege-hausmeisterservice'),
  kehrdienst: serviceImage('kehrdienst', 'kehrdienst.jpg', 'kehrdienst-gehwegreinigung'),
  muell: serviceImage('muell', 'muelldienst.jpg', 'muelltonnenservice'),
  entruempeln: serviceImage('entruempeln', 'entruempeln.jpg', 'entruempelung'),
  winterdienst: serviceImage('winterdienst', 'winterdienst.jpg', 'winterdienst'),
  schluessel: serviceImage('schluessel', 'schluessel.jpg', 'schluesselservice-hausmeister'),
});

export const SERVICE_IMAGES = Object.freeze(Object.values(SERVICE_IMAGE_BY_ID));

/** Vorher/Nachher: Quell-ID -> SEO-Name (Leistung + Ort). */
export const PAIR_NAMES = Object.freeze({
  fassade: 'fassadenreinigung-regensburg',
  fenster: 'fensterreinigung-regensburg',
  innen: 'treppenhausreinigung-regensburg',
});
