/**
 * Zentrale Bildkonfiguration – von der Bild-Pipeline (images.mjs)
 * und vom Seiten-Build (picture()-Helfer) gemeinsam genutzt.
 */

const serviceImage = (src, name) =>
  Object.freeze({ src: `leistungen/${src}`, name, dir: 'leistungen', widths: [480, 768, 1000], budgetKb: 120, width: 1000, height: 666 });

/*
 * Glas-Hero (Art Direction): Desktop/Tablet quer, Mobil hoch.
 * Quellen liegen öffentlich unter /assets/hero/ (rootSrc = relativ zum Projekt-Root).
 * Breiten nie größer als das Original (1344 × 752 bzw. 752 × 1344).
 */
export const HERO_GLASS_DESKTOP = Object.freeze({
  rootSrc: 'assets/hero/hero-glas-desktop.jpg',
  name: 'hero-glas-desktop',
  dir: 'hero',
  widths: [768, 1200, 1344],
  budgetKb: 250,
  width: 1344,
  height: 752,
});

export const HERO_GLASS_MOBILE = Object.freeze({
  rootSrc: 'assets/hero/hero-glas-mobil.jpg',
  name: 'hero-glas-mobil',
  dir: 'hero',
  widths: [480, 752],
  budgetKb: 250,
  width: 752,
  height: 1344,
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

export const IMAGE_SETS = Object.freeze([HERO_GLASS_DESKTOP, HERO_GLASS_MOBILE, ABOUT_IMAGE]);

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
