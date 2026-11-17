/**
 * Ein-/ausklappbare Einträge (Disclosure-Muster nach WAI-ARIA APG).
 *
 * - Trigger = <button aria-expanded aria-controls> in einer Überschrift.
 * - Zustand steht AUSSCHLIESSLICH in aria-expanded; das CSS liest ihn per :has()
 *   und animiert grid-template-rows 0fr ↔ 1fr (kehrt bei erneutem Klick vom
 *   aktuellen Wert um).
 * - Der Detailtext steht vollständig im HTML (SEO), ohne Inline-display:none.
 * - Klick-Handling: ACCORDION_SCRIPT (inline im <head>, Event-Delegation,
 *   idempotent, sofort aktiv – kein Warten auf DOMContentLoaded/Idle).
 */

/**
 * @param {object} o
 * @param {string} o.id        eindeutige Basis-ID (z. B. "leistung-fenster")
 * @param {string} o.label     sichtbarer Titel (enthält die Keywords)
 * @param {string} o.content   HTML des Detailbereichs
 * @param {number} o.level     Überschriften-Ebene des Titels (3 oder 4)
 * @param {string} [o.prefix]  optionales HTML vor dem Titel (z. B. Nummer)
 * @param {string} [o.titleClass]
 */
export function accordionParts({ id, label, content, level, prefix = '', titleClass = '' }) {
  const h = `h${level}`;
  const trigger = `<${h} class="acc__title${titleClass ? ` ${titleClass}` : ''}"><button class="acc__trigger" type="button" id="${id}-btn" aria-expanded="false" aria-controls="${id}-panel" data-acc-trigger>${prefix}<span class="acc__label">${label}</span><span class="acc__icon" aria-hidden="true"></span></button></${h}>`;
  const panel = `<div class="acc__panel" id="${id}-panel" aria-labelledby="${id}-btn"><div class="acc__inner">${content}</div></div>`;
  return { trigger, panel };
}

/*
 * Inline-Skript (im <head>): registriert die Klick-Delegation sofort.
 * - Umschalten liest/schreibt nur aria-expanded -> jeder Klick schaltet sicher um.
 * - Anker auf einen Eintrag (#leistung-…) öffnen ihn – per Hash beim Laden,
 *   bei hashchange und beim Klick auf einen In-Page-Link (auch mit Lenis).
 */
export const ACCORDION_SCRIPT = `<script>(function(w,d){if(w.__ciAcc)return;w.__ciAcc=1;
function set(b,o){b.setAttribute('aria-expanded',o?'true':'false')}
function openTarget(id){if(!id)return;var el=d.getElementById(id);if(!el)return;var b=el.matches('[data-acc-trigger]')?el:el.querySelector('[data-acc-trigger]');if(b)set(b,true)}
d.addEventListener('click',function(e){var t=e.target;if(!t||!t.closest)return;var b=t.closest('[data-acc-trigger]');if(b){set(b,b.getAttribute('aria-expanded')!=='true');return}var a=t.closest('a[href^="#"]');if(a)openTarget(decodeURIComponent(a.getAttribute('href').slice(1)))});
function fromHash(){openTarget(decodeURIComponent(location.hash.slice(1)))}
d.addEventListener('DOMContentLoaded',fromHash);w.addEventListener('hashchange',fromHash)})(window,document)</script>`;
