/**
 * Erzeugt die Schmutzfilm-Textur für den Hero-Wisch-Effekt als SVG:
 * Wasserschlieren, Tropfen mit Lichtreflex und feiner Staub.
 * Deterministisch (fester Seed), damit sich die Datei nur bei Änderungen ändert.
 */
const W = 600;
const H = 750;
const MAX_BYTES = 30 * 1024;

/** Mulberry32 – kleiner, deterministischer Zufallsgenerator. */
function prng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n) => Math.round(n * 10) / 10;

function streaks(rand, count) {
  return Array.from({ length: count }, () => {
    const x = rand() * W;
    const y = rand() * H * 0.7;
    const len = 60 + rand() * 260;
    const sway = (rand() - 0.5) * 14;
    const w = r1(0.8 + rand() * 3.2);
    const o = r1(0.06 + rand() * 0.14);
    return `<path d="M${r1(x)} ${r1(y)}q${r1(sway)} ${r1(len / 2)} ${r1(sway / 3)} ${r1(len)}" stroke-width="${w}" stroke-opacity="${o}"/>`;
  }).join('');
}

function drops(rand, count) {
  return Array.from({ length: count }, () => {
    const x = r1(rand() * W);
    const y = r1(rand() * H);
    const r = r1(1.4 + Math.pow(rand(), 2.2) * 7);
    const ry = r1(r * (1 + rand() * 0.35));
    const hx = r1(x - r * 0.35);
    const hy = r1(y - ry * 0.4);
    return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${ry}" fill="url(#d)"/><circle cx="${hx}" cy="${hy}" r="${r1(Math.max(0.5, r * 0.22))}" fill="#fff" fill-opacity=".7"/>`;
  }).join('');
}

function dust(rand, count) {
  return Array.from({ length: count }, () => `<circle cx="${r1(rand() * W)}" cy="${r1(rand() * H)}" r="${r1(0.4 + rand() * 0.9)}"/>`).join('');
}

export function grimeSvg() {
  const rand = prng(20261117);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">` +
    '<defs><radialGradient id="d" cx=".42" cy=".38" r=".62"><stop offset="0" stop-color="#fff" stop-opacity=".35"/>' +
    '<stop offset=".55" stop-color="#E9EEF2" stop-opacity=".12"/><stop offset=".85" stop-color="#3A4249" stop-opacity=".28"/>' +
    '<stop offset="1" stop-color="#22282D" stop-opacity=".45"/></radialGradient></defs>' +
    `<g fill="none" stroke="#F4F6F7" stroke-linecap="round">${streaks(rand, 40)}</g>` +
    `<g fill="#5E5848" fill-opacity=".28">${dust(rand, 170)}</g>` +
    drops(rand, 120) +
    '</svg>';
  const bytes = Buffer.byteLength(svg);
  if (bytes > MAX_BYTES) throw new Error(`Schmutzfilm-SVG zu groß: ${bytes} Bytes`);
  return svg;
}
