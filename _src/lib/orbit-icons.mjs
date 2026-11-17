/**
 * Einheitliche Linien-Icons für den „Rundum-Paket“-Orbit.
 * 24er-Raster, 1,5 px Strich, runde Enden, Farbe über currentColor.
 * Kein Text im SVG – Beschriftungen stehen als echtes HTML daneben.
 */
const PATHS = Object.freeze({
  // Gebäude mit Glanzpunkt (Gebäudereinigung)
  building: '<path d="M4 20.5V8.5l7-4 7 4v12"/><path d="M2.5 20.5h16"/><path d="M9 20.5v-4h4v4"/><path d="M8 10.5h1.5M12.5 10.5H14M8 13.5h1.5M12.5 13.5H14"/><path d="M20 3v3M18.5 4.5h3"/>',
  // Schraubenschlüssel (Hausmeisterservice)
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.2 5.2L3.8 17.2a1.6 1.6 0 0 0 2.3 2.3l5.7-5.7a4 4 0 0 0 5.2-5.2l-2.5 2.5-2.1-.4-.4-2.1z"/>',
  // Zwei Blätter am Stiel (Gartenpflege)
  leaf: '<path d="M12 21v-9"/><path d="M12 12c0-4.4 3-7.5 8-7.5 0 5-3 7.5-8 7.5z"/><path d="M12 15c0-3.3-2.3-5.5-6.5-5.5 0 3.6 2.3 5.5 6.5 5.5z"/><path d="M8 21h8"/>',
  // Schneekristall (Winterdienst)
  snow: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/><path d="M9.8 4.8 12 6.5l2.2-1.7M9.8 19.2 12 17.5l2.2 1.7M4.6 10.4l2.6-.4-1-2.5M19.4 13.6l-2.6.4 1 2.5M4.6 13.6l2.6.4-1 2.5M19.4 10.4l-2.6-.4 1-2.5"/>',
  // Fenster mit Abzieher-Spur (Fensterreinigung)
  window: '<rect x="4" y="3.5" width="16" height="17" rx="1.5"/><path d="M12 3.5v17M4 12h16"/><path d="M6.5 9.5l3-3M14.5 17.5l3-3"/>',
  // Klemmbrett mit Haken (Dokumentation)
  clipboard: '<rect x="5" y="4.5" width="14" height="16.5" rx="2"/><path d="M9 4.5V3.5h6v1"/><path d="M9 4.5h6v2.5H9z"/><path d="m8.8 13.8 2.2 2.2 4.2-4.5"/>',
});

export function orbitIcon(name) {
  const body = PATHS[name];
  if (!body) throw new Error(`Unbekanntes Orbit-Icon: ${name}`);
  return `<svg class="orbit__icon" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
}
