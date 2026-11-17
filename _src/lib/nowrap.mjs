/**
 * Verhindert Umbrüche in Telefonnummern, E-Mail-Adressen, „PLZ Ort“,
 * „Straße Nr.“, Mengen-/Preisangaben, Uhrzeiten und „24/7“.
 *
 * Arbeitet nur auf sichtbarem Text innerhalb von <body> – nie in Attributen,
 * <script> (JSON-LD), <style>, <title>, <option> oder <textarea>.
 * Telefonnummern und E-Mails werden in <span class="tel">/<span class="nowrap">
 * verpackt, alles andere bekommt geschützte Leerzeichen (&nbsp;).
 */
const SKIP_TAGS = new Set(['script', 'style', 'title', 'option', 'textarea']);

const RULES = Object.freeze([
  // Telefonnummern (national und international), z. B. 0155 6858 1734, +49 155 68581734
  [/(?:\+49[  ]?\d{2,4}|\b0\d{2,4})(?:[  ]\d{2,8}){1,3}/g,(m) => `<span class="tel">${m.replace(/ /g, '&nbsp;')}</span>`],
  // E-Mail-Adressen (Bindestrich in der Domain darf nicht umbrechen)
  [/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, (m) => `<span class="nowrap">${m}</span>`],
  // Postleitzahl + Ort
  [/\b(\d{5}) (?=[A-ZÄÖÜ])/g, '$1&nbsp;'],
  // Straße + Hausnummer
  [/((?:straße|str\.|ring|weg|platz|gasse)) (\d+[a-z]?)\b/gi, '$1&nbsp;$2'],
  // Zahl + Einheit (km, €, %, Uhr, h, Min.)
  [/(\d) (?=(?:km|€|%|Uhr|h\b|Min\.))/g, '$1&nbsp;'],
  // Paragraphen
  [/§ (\d)/g, '§&nbsp;$1'],
  // 24/7 und Uhrzeitspannen
  [/\b(\d{1,2}(?::\d{2})?) ?([–-]) ?(\d{1,2}(?::\d{2})?) (?=Uhr)/g, '$1$2$3&nbsp;'],
  [/24\/7/g, '<span class="nowrap">24/7</span>'],
]);

const applyRules = (text) => RULES.reduce((acc, [re, rep]) => acc.replace(re, rep), text);

export function protectBreaks(html) {
  const bodyStart = html.indexOf('<body');
  if (bodyStart < 0) return html;
  const head = html.slice(0, bodyStart);
  const parts = html.slice(bodyStart).split(/(<[^>]+>)/);
  let skip = null;
  const out = parts.map((part) => {
    if (part.startsWith('<')) {
      const m = part.match(/^<(\/?)([a-zA-Z0-9]+)/);
      if (m) {
        const [, closing, name] = m;
        const tag = name.toLowerCase();
        if (!closing && SKIP_TAGS.has(tag) && !part.endsWith('/>')) skip = tag;
        else if (closing && skip === tag) skip = null;
      }
      return part;
    }
    return skip || !part.trim() ? part : applyRules(part);
  });
  return head + out.join('');
}
