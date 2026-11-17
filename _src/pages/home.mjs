/** Startseite */
import { SITE, SERVICE_GROUPS, SERVICES, servicesInGroup, ABOS, TESTIMONIALS, STEPS, FIGURES, FAQ_HOME, CITIES, LOCATIONS, ORBIT } from '../data.mjs';
import { HERO_WIDE, HERO_TALL, SERVICE_IMAGE_BY_ID } from '../image-config.mjs';
import { artPicture, preloadArt, picture, ICONS, button, overline, arrowLink, esc } from '../lib/html.mjs';
import { orbitIcon } from '../lib/orbit-icons.mjs';
import { sectionHead, serviceCard, faqList, radiusMap, contactList, locationAddress } from '../lib/sections.mjs';
import { graph, localBusiness, serviceNodes, website, faqPage, webPage } from '../lib/schema.mjs';

const HERO_ART = Object.freeze({
  wide: HERO_WIDE,
  tall: HERO_TALL,
  breakpoint: 900,
  wideSizes: 'calc(100vw - 40px)',
  tallSizes: '(min-width: 1360px) 520px, 40vw',
});

const CARD_SIZES = '(min-width: 1360px) 400px, (min-width: 900px) 30vw, (min-width: 600px) 46vw, calc(100vw - 40px)';

function hero() {
  return `<section class="hero" id="top" aria-labelledby="hero-title">
      <div class="nav-sentinel" data-nav-sentinel aria-hidden="true"></div>
      <div class="wrap hero__grid">
        <div class="hero__copy">
          <p class="overline">Regensburg, Kelheim und Landshut</p>
          <h1 class="h-display hero__title" id="hero-title">Gebäudereinigung &amp; Hausmeisterservice aus einer Hand</h1>
          <p class="hero__lead">Reinigung, Pflege und Kleinreparaturen für Büros, Praxen, Wohnanlagen und Privathäuser – in Regensburg, Kelheim, Landshut und rund 40&nbsp;km Umgebung.</p>
          <div class="hero__actions">
            ${button('#kontakt', 'Jetzt anfragen')}
            <a class="phone-link" href="tel:${SITE.phoneE164}">${ICONS.phone(18)}<span><span class="phone-link__hint">oder anrufen:</span> ${SITE.phoneDisplay}</span></a>
          </div>
        </div>
        ${wipeMedia()}
      </div>
      <p class="hero__scroll" aria-hidden="true" data-scroll-hint>Scrollen <span class="hero__scroll-arrow">${ICONS.arrow(14)}</span></p>
    </section>`;
}

/*
 * Signature-Motion „Abzieher-Wisch“: unten das saubere Bild (LCP, sofort sichtbar),
 * darüber dieselbe Datei als „schmutzige“ Ebene (CSS-Filter + SVG-Schlieren),
 * die per clip-path weggewischt wird. Ohne JS/bei reduced motion ausgeblendet.
 */
function wipeMedia() {
  return `<div class="hero__media wipe" data-wipe>
          <div class="wipe__clean">
            ${artPicture({ ...HERO_ART, alt: 'Moderne Glasfassade eines Bürogebäudes – Gebäudereinigung und Hausmeisterservice von CI Dienstleistungen' })}
          </div>
          <div class="wipe__dirty" aria-hidden="true" data-wipe-dirty>
            ${artPicture({ ...HERO_ART, decorative: true })}
            <span class="wipe__veil"></span>
            <img class="wipe__grime" src="/assets/img/hero/schmutzfilm.svg" alt="" width="600" height="750" decoding="async">
          </div>
          <span class="wipe__glint" aria-hidden="true" data-wipe-glint></span>
          <div class="wipe__tool" aria-hidden="true" data-wipe-tool>
            <span class="wipe__film"></span>
            ${squeegeeSvg()}
          </div>
        </div>`;
}

/** Selbst gezeichneter Abzieher: Gummilippe, Aluminiumschiene, Griff. */
function squeegeeSvg() {
  return `<svg class="wipe__squeegee" viewBox="0 0 160 640" xmlns="http://www.w3.org/2000/svg" focusable="false">
              <defs>
                <linearGradient id="sq-metal" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0" stop-color="#8E979F"/><stop offset=".3" stop-color="#EEF1F3"/><stop offset=".55" stop-color="#B9C0C6"/><stop offset=".8" stop-color="#E3E7EA"/><stop offset="1" stop-color="#7D868E"/>
                </linearGradient>
                <linearGradient id="sq-grip" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stop-color="#3B4046"/><stop offset=".45" stop-color="#22262A"/><stop offset="1" stop-color="#16181B"/>
                </linearGradient>
                <linearGradient id="sq-rubber" x1="0" x2="1">
                  <stop offset="0" stop-color="#0E1012"/><stop offset=".6" stop-color="#25292D"/><stop offset="1" stop-color="#121416"/>
                </linearGradient>
              </defs>
              <rect x="0" y="22" width="8" height="596" rx="2.5" fill="url(#sq-rubber)"/>
              <rect x="1.5" y="24" width="1" height="592" fill="#4A5056" opacity=".7"/>
              <rect x="7" y="14" width="17" height="612" rx="3.5" fill="url(#sq-metal)"/>
              <rect x="9" y="16" width="1.2" height="608" fill="#fff" opacity=".55"/>
              <rect x="6" y="10" width="19" height="9" rx="3" fill="#2A2E33"/>
              <rect x="6" y="621" width="19" height="9" rx="3" fill="#2A2E33"/>
              <path d="M22 286h18a8 8 0 0 1 8 8v52a8 8 0 0 1-8 8H22z" fill="#2A2E33"/>
              <circle cx="35" cy="320" r="5" fill="url(#sq-metal)"/>
              <circle cx="35" cy="320" r="1.6" fill="#2A2E33"/>
              <rect x="46" y="305" width="112" height="30" rx="15" fill="url(#sq-grip)"/>
              <rect x="56" y="305" width="5" height="30" fill="#2BB7A3"/>
              <g stroke="#0E1012" stroke-width="1.4" stroke-linecap="round" opacity=".55">
                <path d="M78 309v22M86 309v22M94 309v22M102 309v22M110 309v22M118 309v22M126 309v22"/>
              </g>
              <rect x="64" y="308" width="88" height="3" rx="1.5" fill="#fff" opacity=".12"/>
            </svg>`;
}

function marquee() {
  const words = ['Unterhaltsreinigung', 'Treppenhausreinigung', 'Fensterreinigung', 'Fassadenreinigung', 'Hausmeisterservice', 'Gartenpflege', 'Winterdienst', 'Regensburg', 'Kelheim', 'Landshut'];
  const row = words.map((w) => `<span class="marquee__item">${w}</span><span class="marquee__sep">${ICONS.roof(18)}</span>`).join('');
  return `<div class="marquee" aria-hidden="true">
      <div class="marquee__track">${row}${row}</div>
    </div>`;
}

function intro() {
  const rows = SERVICE_GROUPS.map((g) => {
    const count = servicesInGroup(g.id).length;
    // Aufzählung als Schlagwort-Badges statt Fließtext
    return `<li class="area-row">
              <p class="area-row__title"><a href="#${g.id}">${g.title}<span class="area-row__arrow">${ICONS.arrow(18)}</span></a></p>
              <span class="area-row__count">${count} Leistungen</span>
              <ul class="tags">${g.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
            </li>`;
  }).join('\n            ');
  return `<section class="section intro" aria-labelledby="intro-title">
      <div class="wrap grid12">
        <div class="intro__head">
          <h2 class="h-section" id="intro-title" data-reveal="lines">Sie haben ein Gebäude, aber keinen Alleskönner an der Hand?</h2>
        </div>
        <div class="intro__body">
          <p class="lead">Kein Problem – den haben wir! Wir kümmern uns um alles rund um Ihre Immobilie, innen wie außen. Lehnen Sie sich zurück – wir machen den Rest.</p>
          <ul class="area-list" data-reveal="stagger">
            ${rows}
          </ul>
        </div>
      </div>
    </section>`;
}

function serviceGroup(group) {
  const cards = servicesInGroup(group.id).map((s) => serviceCard(s, { sizes: CARD_SIZES })).join('\n          ');
  const count = servicesInGroup(group.id).length;
  return `<div class="service-group grid12" id="${group.id}">
        <header class="service-group__head">
          <h3 class="service-group__title">${group.title}</h3>
          <p class="service-group__count">${count} Leistungen</p>
        </header>
        <div class="card-grid" data-reveal="stagger">
          ${cards}
        </div>
      </div>`;
}

function services() {
  return `<section class="section services" id="leistungen" aria-labelledby="leistungen-title">
      <div class="wrap">
        ${sectionHead({
          label: 'Leistungen',
          id: 'leistungen-title',
          title: 'Gebäudereinigung und Hausmeisterservice im Detail',
          lead: `${SERVICES.length} Leistungen in drei Bereichen – einzeln beauftragt oder als Abo, in Regensburg, Kelheim und Landshut.`,
        })}
        ${SERVICE_GROUPS.map(serviceGroup).join('\n        ')}
      </div>
    </section>`;
}

/* Vorher/Nachher: vorhandene Bilder als Platzhalter (Vorher-Look per CSS-Filter). */
const COMPARISONS = Object.freeze([
  { id: 'treppenhaus', label: 'Treppenhaus', text: 'Stufen, Podeste und Geländer in einer Wohnanlage.' },
  { id: 'stein', label: 'Graffiti an Klinker', text: 'Graffiti-Entfernung mit untergrundgerechter Technik.' },
  { id: 'grundreinigung', label: 'Bodenbelag', text: 'Grundreinigung eines Fliesenbodens vor dem Einzug.' },
]);

function comparisonFigure(item, index) {
  const set = SERVICE_IMAGE_BY_ID[item.id];
  const sizes = '(min-width: 1360px) 820px, (min-width: 900px) 62vw, calc(100vw - 40px)';
  const pic = (alt, cls) => picture(set, { alt, sizes, className: cls });
  return `<figure class="compare" id="vergleich-${item.id}" data-compare${index === 0 ? '' : ' hidden'}>
            <!-- TODO: vom Kunden – echtes Vorher-/Nachher-Fotopaar „${item.label}“ (siehe BILDER-TODO.md) -->
            <div class="compare__stage" data-compare-stage style="--pos: 50%">
              ${pic(`${item.label} vor der Reinigung (Symbolbild)`, 'compare__img compare__img--before')}
              ${pic(`${item.label} nach der Reinigung (Symbolbild)`, 'compare__img compare__img--after')}
              <span class="compare__tag compare__tag--before" aria-hidden="true">Vorher</span>
              <span class="compare__tag compare__tag--after" aria-hidden="true">Nachher</span>
              <div class="compare__handle" role="slider" tabindex="0" aria-label="Vorher-Nachher-Vergleich ${item.label}" aria-orientation="horizontal" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-valuetext="50 Prozent Nachher sichtbar" data-compare-handle>
                <span class="compare__knob">${ICONS.arrow(14)}${ICONS.arrow(14)}</span>
              </div>
            </div>
          </figure>`;
}

function beforeAfter() {
  const tabs = COMPARISONS.map(
    (c, i) => `<li><button class="compare-tab" type="button" aria-controls="vergleich-${c.id}" aria-pressed="${i === 0}" data-compare-tab>
              <span class="compare-tab__label">${c.label}</span>
              <span class="compare-tab__text">${c.text}</span>
            </button></li>`,
  ).join('\n            ');
  return `<section class="section compare-section" id="vorher-nachher" aria-labelledby="compare-title">
      <div class="wrap grid12">
        <div class="compare-section__aside">
          ${sectionHead({ label: 'Vorher und nachher', id: 'compare-title', title: 'Der Unterschied liegt im Detail', lead: 'Ziehen Sie den Regler, um zu vergleichen – mit Maus, Finger oder den Pfeiltasten.' })}
          <ul class="compare-tabs">
            ${tabs}
          </ul>
          <p class="compare-section__note">Symbolbilder. Fotos aus echten Projekten folgen.</p>
        </div>
        <div class="compare-section__stage">
          ${COMPARISONS.map(comparisonFigure).join('\n          ')}
        </div>
      </div>
    </section>`;
}

/*
 * „Rundum-Paket“-Orbit: Ring rotiert per CSS (nur transform), Icons bleiben
 * durch Gegenrotation aufrecht. Beschriftungen sind echtes HTML (Google-lesbar),
 * Icons aria-hidden. Mobil: 2×3-Raster ohne Rotation.
 */
function orbit() {
  const items = ORBIT.map(
    (o, i) => `<li class="orbit__item" style="--i:${i}">
              <a class="orbit__link" href="${o.href}"><span class="orbit__badge">${orbitIcon(o.icon)}</span><span class="orbit__label">${o.label}</span></a>
            </li>`,
  ).join('\n            ');
  return `<div class="orbit" data-autoplay>
          <span class="orbit__ring" aria-hidden="true"></span>
          <p class="orbit__center">Alles aus einer&nbsp;Hand</p>
          <ul class="orbit__list" aria-label="Leistungen im Rundum-Paket">
            ${items}
          </ul>
        </div>`;
}

function about() {
  const figures = FIGURES.map(
    (f) => `<div class="figure">
            <p class="figure__value">${f.prefix}<span data-count="${f.value}">${f.value}</span>${f.suffix}</p>
            <p class="figure__label">${f.label}</p>
          </div>`,
  ).join('\n          ');
  return `<section class="section section--night about" id="ueber-uns" aria-labelledby="about-title">
      <div class="wrap grid12 about__grid">
        <div class="about__copy">
          ${overline('Über uns')}
          <h2 class="h-section" id="about-title" data-reveal="lines">Rundum-Paket für Gebäudereinigung &amp; Hausmeisterservice</h2>
          <p class="lead">${SITE.name} verbindet Gebäudereinigung und Hausmeisterservice aus einer Hand – mit festem Ansprechpartner, klaren Standards und transparenter Dokumentation. Aktiv in Regensburg, Kelheim und Landshut, je Standort mit rund 40&nbsp;km Umland.</p>
          ${button('#kontakt', 'Jetzt anfragen', { variant: 'accent' })}
        </div>
        <div class="about__orbit">
          ${orbit()}
        </div>
      </div>
      <div class="wrap">
        <div class="figures" aria-label="Fakten">
          ${figures}
          <!-- TODO: echte Zahl vom Kunden – z. B. Jahre Erfahrung, betreute Objekte oder Mitarbeitende -->
        </div>
      </div>
    </section>`;
}

function process() {
  const steps = STEPS.map(
    (s, i) => `<li class="step" data-step="${i}">
              <span class="step__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
              <h3 class="step__title">${s.title}</h3>
              <p>${s.text}</p>
            </li>`,
  ).join('\n            ');
  return `<section class="section process" id="ablauf" aria-labelledby="process-title" data-process>
      <div class="wrap grid12">
        <div class="process__aside">
          <div class="process__sticky">
            ${sectionHead({ label: 'Ablauf', id: 'process-title', title: 'So arbeiten wir', lead: 'Vier Schritte von der ersten Nachricht bis zum dokumentierten Ergebnis.' })}
            <p class="process__counter" aria-hidden="true"><span data-step-current>01</span><span class="process__total">/ ${String(STEPS.length).padStart(2, '0')}</span></p>
            <div class="process__bar" aria-hidden="true"><span data-step-bar></span></div>
          </div>
        </div>
        <ol class="process__steps">
            ${steps}
        </ol>
      </div>
    </section>`;
}

const aboCell = (value) => {
  if (value === true) return `<span class="abo__yes">${ICONS.check()}<span class="sr-only">enthalten</span></span>`;
  if (value === 'oder') return '<span class="abo__or">wahlweise</span>';
  return `<span class="abo__no">${ICONS.dash()}<span class="sr-only">nicht enthalten</span></span>`;
};

function abos() {
  const cards = ABOS.map(
    (a) => `<article class="abo${a.recommended ? ' abo--recommended' : ''}">
            ${a.recommended ? '<p class="abo__badge">Unsere Empfehlung</p>' : ''}
            <h3 class="abo__name">${a.name}</h3>
            <div class="abo__meter" role="img" aria-label="Leistungsumfang ${a.percent} Prozent">
              <span class="abo__percent">${a.percent}&thinsp;%</span>
              <span class="abo__bar"><span style="--p:${a.percent / 100}"></span></span>
            </div>
            <dl class="abo__list">
              <div><dt>Gartenpflege</dt><dd>${aboCell(a.garten)}</dd></div>
              <div><dt>Hausmeisterservice</dt><dd>${aboCell(a.hausmeister)}</dd></div>
              <div><dt>Gebäudereinigung</dt><dd>${aboCell(a.reinigung)}</dd></div>
              <div><dt>Intervall</dt><dd>${a.interval}</dd></div>
            </dl>
            <p class="abo__price">Preis auf Anfrage</p>
            <a class="link-arrow abo__link" href="#kontakt" data-service="${esc(a.name)}"><span>Abo anfragen<span class="sr-only">: ${a.name}</span></span>${ICONS.arrow()}</a>
          </article>`,
  ).join('\n          ');
  return `<section class="section abos" id="abos" aria-labelledby="abos-title">
      <div class="wrap">
        ${sectionHead({ label: 'Abo-Modelle', id: 'abos-title', title: 'Regelmäßige Betreuung im Abo', lead: 'Preis auf Anfrage – der Leistungsumfang ist als Prozent dargestellt.', className: 'section-head--split' })}
        <div class="abo-grid" data-reveal="stagger">
          ${cards}
        </div>
      </div>
    </section>`;
}

function testimonials() {
  const [first, ...rest] = TESTIMONIALS;
  const stars = `<span class="stars" role="img" aria-label="5 von 5 Sternen">${ICONS.star().repeat(5)}</span>`;
  const quote = (t, big) => `<figure class="quote${big ? ' quote--big' : ''}">
            ${stars}
            <blockquote><p>${t.text}</p></blockquote>
            <figcaption><span class="quote__name">${t.name}</span><span class="quote__topic">${t.topic}</span><!-- TODO: vom Kunden – Ort ergänzen --></figcaption>
          </figure>`;
  return `<section class="section testimonials" id="kundenmeinungen" aria-labelledby="testimonials-title">
      <div class="wrap">
        ${sectionHead({ label: 'Kundenmeinungen', id: 'testimonials-title', title: 'Was unsere Kunden sagen' })}
        <div class="quotes">
          ${quote(first, true)}
          <div class="quotes__row">
          ${rest.map((t) => quote(t, false)).join('\n          ')}
          </div>
        </div>
      </div>
    </section>`;
}

function areas() {
  const rows = CITIES.map((c) => {
    const loc = LOCATIONS.find((l) => l.id === c.location);
    return `<li class="area-city">
              <h3 class="area-city__name">${c.city}</h3>
              <p class="area-city__loc">${ICONS.pin(16)}<span>${loc.label}: ${locationAddress(loc)}</span></p>
              ${arrowLink(`/${c.slug}`, `Gebäudereinigung ${c.city === 'Kelheim' ? 'im Landkreis Kelheim' : `in ${c.city}`}`)}
            </li>`;
  }).join('\n            ');
  return `<section class="section areas" id="einsatzgebiete" aria-labelledby="areas-title">
      <div class="wrap grid12">
        <div class="areas__map" data-reveal="map">
          ${radiusMap()}
        </div>
        <div class="areas__copy" id="standort">
          ${sectionHead({ label: 'Einsatzgebiete', id: 'areas-title', title: 'Ganz in Ihrer Nähe', lead: `Wir sind in Regensburg, Kelheim und Landshut im Einsatz – je Standort mit Umland im Umkreis von rund ${SITE.radiusKm}&nbsp;km.` })}
          <ul class="area-cities">
            ${rows}
          </ul>
        </div>
      </div>
    </section>`;
}

function faq() {
  return `<section class="section faq-section" id="faq" aria-labelledby="faq-title">
      <div class="wrap grid12">
        <div class="faq-section__head">
          ${sectionHead({ label: 'Häufige Fragen', id: 'faq-title', title: 'Gut zu wissen' })}
          <p class="faq-section__more">Ihre Frage ist nicht dabei? Rufen Sie uns an: <a href="tel:${SITE.phoneE164}">${SITE.phoneDisplay}</a></p>
          <!-- TODO: vom Kunden – Angaben zur Betriebshaftpflicht/Versicherung, dann als FAQ ergänzen -->
        </div>
        <div class="faq-section__list">
        ${faqList(FAQ_HOME)}
        </div>
      </div>
    </section>`;
}

const field = ({ id, label, type = 'text', required = false, autocomplete, extra = '', hint }) => `<div class="field">
              <label for="${id}">${label}${required ? '' : ' <span class="field__opt">(optional)</span>'}</label>
              <input id="${id}" name="${id}" type="${type}"${required ? ' required' : ''}${autocomplete ? ` autocomplete="${autocomplete}"` : ''}${extra} aria-describedby="${id}-error">
              ${hint ? `<p class="field__hint">${hint}</p>` : ''}
              <p class="field__error" id="${id}-error" data-error-for="${id}"></p>
            </div>`;

export function contactForm() {
  const options = [...SERVICES.map((s) => s.title), ...ABOS.map((a) => a.name)]
    .map((t) => `<option value="${esc(t)}">${t}</option>`)
    .join('');
  return `<form class="form" id="contactForm" action="${SITE.formAction}" method="POST" novalidate data-form>
            <input type="hidden" name="_subject" value="Neue Anfrage über ci-dienstleistungen.com">
            <div class="form__hp" aria-hidden="true"><label for="_gotcha">Bitte leer lassen</label><input id="_gotcha" type="text" name="_gotcha" tabindex="-1" autocomplete="off"></div>
            <div class="form__row">
              ${field({ id: 'name', label: 'Vorname, Nachname', required: true, autocomplete: 'name' })}
              ${field({ id: 'email', label: 'E-Mail-Adresse', type: 'email', required: true, autocomplete: 'email' })}
            </div>
            <div class="form__row">
              ${field({ id: 'phone', label: 'Telefonnummer', type: 'tel', autocomplete: 'tel', extra: ' pattern="[0-9+\\(\\)\\/\\s\\-]{6,}"' })}
              ${field({ id: 'address', label: 'Adresse des Objekts', autocomplete: 'street-address' })}
            </div>
            <div class="field">
              <label for="service">Leistung <span class="field__opt">(optional)</span></label>
              <select id="service" name="service"><option value="">Bitte wählen</option>${options}</select>
            </div>
            <div class="field">
              <label for="message">Ihr Anliegen</label>
              <textarea id="message" name="message" rows="5" required aria-describedby="message-error"></textarea>
              <p class="field__error" id="message-error" data-error-for="message"></p>
            </div>
            <p class="form__legal">Mit dem Absenden verarbeiten wir Ihre Angaben zur Bearbeitung der Anfrage. Mehr dazu in der <a href="/datenschutz">Datenschutzerklärung</a>.</p>
            <button class="btn btn--ink btn--block" type="submit" data-magnetic><span class="btn__label">Anfrage senden</span><span class="btn__icon">${ICONS.arrow()}</span></button>
            <p class="form__status" role="status" aria-live="polite" data-form-status></p>
          </form>`;
}

export function contactSection({ id = 'kontakt', title = 'Erzählen Sie uns von Ihrem Objekt', lead = 'Bereit für die Verwirklichung Ihrer Ideen? Teilen Sie uns kurz Ihr Vorhaben mit – wir melden uns zeitnah zurück.' } = {}) {
  return `<section class="section contact" id="${id}" aria-labelledby="${id}-title">
      <div class="wrap grid12">
        <div class="contact__aside">
          ${sectionHead({ label: 'Kontakt', id: `${id}-title`, title, lead })}
          ${contactList()}
        </div>
        <div class="contact__form">
          ${contactForm()}
        </div>
      </div>
    </section>`;
}

export function homePage() {
  const url = `${SITE.origin}/`;
  const title = 'Gebäudereinigung & Hausmeisterservice Regensburg | CI';
  const description = 'Gebäudereinigung & Hausmeisterservice aus einer Hand in Regensburg, Kelheim und Landshut: Reinigung, Pflege, Reparaturen. Jetzt unverbindlich anfragen.';
  return {
    path: '/',
    file: 'index.html',
    title,
    ogTitle: 'Gebäudereinigung & Hausmeisterservice in Regensburg, Kelheim und Landshut',
    description,
    priority: '1.0',
    preload: preloadArt(HERO_ART),
    bodyClass: 'page-home',
    jsonLd: graph([website(), webPage({ url, name: title, description }), localBusiness(), ...serviceNodes(), faqPage(FAQ_HOME, url)]),
    main: [hero(), marquee(), intro(), services(), beforeAfter(), about(), process(), abos(), testimonials(), areas(), faq(), contactSection()].join('\n\n    '),
  };
}
