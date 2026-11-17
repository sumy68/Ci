/**
 * Zentrale Bildkonfiguration – von der Bild-Pipeline (images.mjs)
 * und vom Seiten-Build (picture()-Helfer) gemeinsam genutzt.
 */

const serviceImage = (src, name) =>
  Object.freeze({ src: `leistungen/${src}`, name, dir: 'leistungen', widths: [480, 768, 1000], budgetKb: 120, width: 1000, height: 666 });

export const HERO_WIDE = Object.freeze({
  src: 'hero/ci-hero-desktop-2.png',
  name: 'gebaeudereinigung-glasfassade',
  dir: 'hero',
  widths: [480, 768, 1200, 1920],
  budgetKb: 250,
  width: 1920,
  height: 1072,
});

export const HERO_TALL = Object.freeze({
  src: 'hero/ci-hero-mobile-2.png',
  name: 'gebaeudereinigung-glasfassade-hochformat',
  dir: 'hero',
  widths: [480, 768, 1200],
  budgetKb: 250,
  aspect: 4 / 5,
  width: 1200,
  height: 1500,
});

export const ABOUT_IMAGE = Object.freeze({
  src: 'hero/hero-villa.jpg',
  name: 'hausmeisterservice-wohnhaus',
  dir: 'hero',
  widths: [480, 768, 1200, 1600],
  budgetKb: 120,
  width: 1600,
  height: 1066,
});

export const IMAGE_SETS = Object.freeze([HERO_WIDE, HERO_TALL, ABOUT_IMAGE]);

/** Schlüssel = interne ID der Leistung (siehe data.mjs). */
export const SERVICE_IMAGE_BY_ID = Object.freeze({
  unterhaltsreinigung: serviceImage('unterhaltsreinigung.jpg', 'unterhaltsreinigung-buero'),
  grundreinigung: serviceImage('grundreinigung.jpg', 'grundreinigung-bodenpflege'),
  sanitaer: serviceImage('sanitaer.jpg', 'sanitaerreinigung-entkalkung'),
  kueche: serviceImage('kueche.jpg', 'kuechenreinigung-teekueche'),
  treppenhaus: serviceImage('treppenhaus.jpg', 'treppenhausreinigung'),
  desinfektion: serviceImage('desinfektion.jpg', 'desinfektionsreinigung'),
  fenster: serviceImage('fenster.jpg', 'fensterreinigung-glasreinigung'),
  fassade: serviceImage('fassade.jpg', 'fassadenreinigung'),
  stein: serviceImage('stein_fugen.jpg', 'steinreinigung-graffitientfernung'),
  bau: serviceImage('baureinigung.jpg', 'bauendreinigung'),
  objektkontrolle: serviceImage('objektkontrolle.jpg', 'objektkontrolle-hausmeister'),
  reparaturen: serviceImage('kleinreparaturen.jpg', 'kleinreparaturen-hausmeisterservice'),
  aussenanlagen: serviceImage('aussenanlagen.jpg', 'gartenpflege-aussenanlagen'),
  kehrdienst: serviceImage('kehrdienst.jpg', 'kehrdienst-gehwege'),
  muell: serviceImage('muelldienst.jpg', 'muelltonnenservice-containerdienst'),
  entruempeln: serviceImage('entruempeln.jpg', 'entruempelung-transporte'),
  winterdienst: serviceImage('winterdienst.jpg', 'winterdienst-koordination'),
  schluessel: serviceImage('schluessel.jpg', 'schluesselservice-zutritt'),
});

export const SERVICE_IMAGES = Object.freeze(Object.values(SERVICE_IMAGE_BY_ID));
