/** Impressum, Datenschutz, 404 und Weiterleitung der alten Datenschutz-URL. */
import { SITE, CITIES } from '../data.mjs';
import { button, arrowLink, overline } from '../lib/html.mjs';
import { graph, breadcrumbs, webPage } from '../lib/schema.mjs';

const BUILD_DATE = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
const tel = `<a class="contact-link" href="tel:${SITE.phoneE164}">${SITE.phoneDisplay}</a>`;
const mail = `<a class="contact-link" href="mailto:${SITE.email}">${SITE.email}</a>`;

function legalShell({ crumb, title, lead, body }) {
  return `<section class="page-head page-head--legal" aria-labelledby="page-title">
      <div class="nav-sentinel" data-nav-sentinel aria-hidden="true"></div>
      <div class="wrap">
        <nav class="breadcrumb" aria-label="Brotkrümelnavigation">
          <ol><li><a href="/">Startseite</a></li><li><span aria-current="page">${crumb}</span></li></ol>
        </nav>
        <h1 class="h-display" id="page-title">${title}</h1>
        <p class="page-head__lead">${lead}</p>
      </div>
    </section>
    <section class="section section--tight legal">
      <div class="wrap">
        <div class="prose">
${body}
        </div>
      </div>
    </section>`;
}

const IMPRESSUM_BODY = `
          <h2>Anbieterkennzeichnung</h2>
          <p><strong>${SITE.name}</strong><br>Inhaber: <strong>${SITE.owner}</strong><br>Büro: ${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}<br>Lager: Gewerbering 8, 84085 Langquaid</p>
          <h2>Unternehmensangaben</h2>
          <!-- Entfernt: „Unternehmensform: Einzelkaufmann“ und „Unternehmensgegenstand: Hausmeisterservice“
               (stammten aus dem Initial-Commit 6ba1742 vom 20.01.2026). -->
          <!-- TODO: vom Kunden bestätigen – Rechtsform (z. B. Einzelunternehmen, e. K.) -->
          <!-- TODO: vom Kunden bestätigen – ggf. Handelsregister (Registergericht, Registernummer) -->
          <!-- TODO: vom Kunden bestätigen – ggf. Handwerkskammer/Berufsbezeichnung, USt-IdNr. -->
          <p>Steuernummer: 211/232/12752</p>
          <h2>Kontakt</h2>
          <p>Telefon: ${tel}<br>E-Mail: ${mail}</p>
          <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p><strong>${SITE.owner}</strong>, Anschrift wie oben.</p>
          <h2>Hinweis auf EU-Streitschlichtung</h2>
          <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">https://ec.europa.eu/consumers/odr</a>. Wir sind weder verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
          <!-- TODO: rechtlich prüfen – die EU-OS-Plattform wurde zum 20.07.2025 eingestellt (VO (EU) 2024/3228); Hinweis und Link ggf. entfernen -->
          <h2>Haftung für Inhalte</h2>
          <p>Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten verantwortlich. Nach §§ 8 bis 10 DDG sind wir nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen. Eine Haftung ist erst ab Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden entfernen wir solche Inhalte umgehend.</p>
          <h2>Haftung für Links</h2>
          <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Daher können wir für diese fremden Inhalte keine Gewähr übernehmen. Verantwortlich ist stets der jeweilige Betreiber.</p>
          <h2>Urheberrecht</h2>
          <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung und Verbreitung außerhalb der Grenzen des Urheberrechtes bedürfen der Zustimmung des jeweiligen Autors.</p>
          <h2 id="bildnachweis">Bildnachweis</h2>
          <p>Einige Bilder auf dieser Website wurden mithilfe künstlicher Intelligenz erstellt und dienen als Symbolbilder. Sie zeigen keine konkreten Kundenprojekte.</p>`;

const DATENSCHUTZ_BODY = `
          <h2>1. Verantwortlicher</h2>
          <p><strong>${SITE.name}</strong><br>Inhaber: <strong>${SITE.owner}</strong><br>${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}<br>Telefon: ${tel}<br>E-Mail: ${mail}</p>
          <h2>2. Allgemeine Hinweise</h2>
          <p>Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Vorschriften (DSGVO, BDSG, TDDDG). Diese Hinweise informieren über Art, Umfang und Zwecke der Verarbeitung sowie über Ihre Rechte.</p>
          <h2>3. Hosting &amp; Server-Logfiles</h2>
          <p>Diese Website wird über GitHub Pages bereitgestellt (Anbieter: GitHub, Inc., USA).</p>
          <!-- TODO: Datenschutz prüfen – Vertragspartner (GitHub, Inc. bzw. GitHub B.V.), Auftragsverarbeitung und Drittlandübermittlung (z. B. EU-US Data Privacy Framework) bestätigen -->
          <p>Beim Aufruf werden automatisch sogenannte Server-Logfiles verarbeitet: IP-Adresse, Datum/Uhrzeit, URL, Referrer, übertragene Datenmenge, User-Agent. Die Verarbeitung erfolgt zur technischen Bereitstellung, Stabilität und Sicherheit (Art. 6 Abs. 1 lit. f DSGVO). Logdaten werden vom Hoster nach kurzer Zeit automatisch gelöscht, sofern keine sicherheitsrelevante Aufbewahrung erforderlich ist.</p>
          <h2>4. Cookies, lokale Speicherung &amp; kein Tracking</h2>
          <p>Diese Website setzt keine Cookies und verwendet keine Analyse- oder Tracking-Dienste.</p>
          <p>Für eine kurze Überblendung beim Wechsel zwischen unseren Seiten wird im Sitzungsspeicher Ihres Browsers (sessionStorage) vorübergehend ein technischer Wert abgelegt, der beim nächsten Seitenaufruf sofort wieder gelöscht wird. Personenbezogene Daten werden dabei nicht gespeichert.</p>
          <!-- TODO: Datenschutz prüfen – Einordnung des sessionStorage-Werts nach § 25 Abs. 2 Nr. 2 TDDDG (unbedingt erforderlich?) bestätigen oder Überblendung ohne Speicherung umsetzen -->
          <h2>5. Kontaktaufnahme (Formular, E-Mail, Telefon)</h2>
          <p>Angaben aus Ihrer Kontaktaufnahme verarbeiten wir zur Bearbeitung Ihres Anliegens und für Rückfragen (Art. 6 Abs. 1 lit. b DSGVO – vorvertragliche/vertragliche Maßnahmen; sowie lit. f – berechtigtes Interesse an effizienter Kommunikation). Die Daten werden gelöscht, wenn der Zweck entfällt und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</p>
          <p><em>Kontaktformular:</em> Wenn Sie das Kontaktformular nutzen, werden Ihre Angaben (Name, E-Mail-Adresse sowie – soweit angegeben – Telefonnummer, Adresse des Objekts, gewünschte Leistung und Ihre Nachricht) an den Formulardienst Formspree (Anbieter mit Sitz in den USA) übermittelt, der sie uns per E-Mail weiterleitet.</p>
          <!-- TODO: Datenschutz prüfen – Auftragsverarbeitungsvertrag mit Formspree, Drittlandübermittlung (DPF/Standardvertragsklauseln) und Speicherdauer bei Formspree ergänzen -->
          <h2>6. WhatsApp</h2>
          <p>Über einen Link bzw. den WhatsApp-Button können Sie uns per WhatsApp kontaktieren (Anbieter für Nutzer in der EU: WhatsApp Ireland Limited). Beim bloßen Besuch unserer Website werden keine Daten an WhatsApp übertragen. Erst wenn Sie den Link anklicken und WhatsApp nutzen, werden Daten an WhatsApp übermittelt; dafür gelten die Datenschutzhinweise von WhatsApp.</p>
          <!-- TODO: Datenschutz prüfen – Rechtsgrundlage und Hinweise zur geschäftlichen Nutzung von WhatsApp (z. B. WhatsApp Business, Speicherdauer der Nachrichten) ergänzen -->
          <h2>7. Google Maps (nur Link)</h2>
          <p>Unsere Adressangaben sind mit Google Maps verlinkt (Anbieter: Google Ireland Limited). Es ist keine Karte auf dieser Website eingebunden. Daten werden erst an Google übermittelt, wenn Sie einen solchen Link anklicken und Google Maps aufrufen; dort gelten die <a href="https://policies.google.com/privacy?hl=de" target="_blank" rel="noopener">Datenschutzhinweise von Google</a>.</p>
          <h2>8. Schriftarten und Programmbibliotheken</h2>
          <p>Schriftarten und Programmbibliotheken (z. B. für Animationen) werden ausschließlich von unserem eigenen Webserver geladen. Es besteht keine Verbindung zu Google Fonts oder anderen externen Content-Delivery-Netzwerken.</p>
          <!-- Entfernt: Abschnitt „Externe Profile/Links (Instagram)“ – auf der Website ist kein Instagram-Link vorhanden. TODO: Datenschutz prüfen – bei späterer Verlinkung eines Profils wieder ergänzen -->
          <h2>9. Empfänger / Auftragsverarbeiter</h2>
          <p>Empfänger personenbezogener Daten sind die oben genannten Dienstleister (Hosting, Formulardienst), soweit dies für den jeweiligen Zweck erforderlich ist.</p>
          <!-- TODO: Datenschutz prüfen – bestehende Auftragsverarbeitungsverträge nach Art. 28 DSGVO bestätigen -->
          <h2>10. Speicherdauer</h2>
          <p>Wir speichern personenbezogene Daten nur solange, wie es für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungsfristen bestehen. Danach werden die Daten gelöscht oder anonymisiert.</p>
          <h2>11. Ihre Rechte</h2>
          <p>Sie haben Rechte auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung (Art. 18), Datenübertragbarkeit (Art. 20) sowie Widerspruch gegen Verarbeitungen (Art. 21 DSGVO). Erteilte Einwilligungen können Sie jederzeit mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3 DSGVO).</p>
          <p>Zudem besteht ein Beschwerderecht bei einer Aufsichtsbehörde. Zuständig in Bayern ist u. a. das <em>Bayerische Landesamt für Datenschutzaufsicht (BayLDA), Promenade&nbsp;27, 91522&nbsp;Ansbach</em>.</p>
          <!-- TODO: Datenschutz prüfen – aktuelle Anschrift des BayLDA verifizieren (lda.bayern.de) -->
          <h2>12. Sicherheit (TLS/SSL)</h2>
          <p>Diese Website wird ausschließlich über eine verschlüsselte TLS/SSL-Verbindung (https) bereitgestellt.</p>
          <h2>13. Aktualität</h2>
          <p>Diese Datenschutzerklärung ist aktuell gültig (Stand: ${BUILD_DATE}). Wir behalten uns Anpassungen bei geänderter Rechtslage oder technischen Änderungen vor.</p>`;

const legalPage = ({ slug, crumb, title, description, h1, lead, body }) => {
  const url = `${SITE.origin}/${slug}`;
  return {
    path: `/${slug}`,
    file: `${slug}.html`,
    title,
    description,
    robots: 'noindex, follow',
    bodyClass: 'page-legal',
    motion: false,
    jsonLd: graph([webPage({ url, name: title, description }), breadcrumbs([{ name: crumb, url }])]),
    main: legalShell({ crumb, title: h1, lead, body }),
  };
};

export const impressumPage = () =>
  legalPage({
    slug: 'impressum',
    crumb: 'Impressum',
    title: 'Impressum | CI Dienstleistungen, Gebäudereinigung Regensburg',
    description: 'Impressum von CI Dienstleistungen, Inhaber Cetin Ilcin: Anbieterkennzeichnung, Kontakt und rechtliche Hinweise für Gebäudereinigung und Hausmeisterservice.',
    h1: 'Impressum',
    lead: 'Angaben gemäß § 5 DDG',
    body: IMPRESSUM_BODY,
  });

export const datenschutzPage = () =>
  legalPage({
    slug: 'datenschutz',
    crumb: 'Datenschutz',
    title: 'Datenschutzerklärung | CI Dienstleistungen Regensburg',
    description: 'Datenschutzerklärung von CI Dienstleistungen: Verarbeitung personenbezogener Daten, Rechtsgrundlagen, Speicherdauer und Ihre Rechte nach der DSGVO.',
    h1: 'Datenschutz&shy;erklärung',
    lead: 'Informationen zur Verarbeitung personenbezogener Daten nach DSGVO und TDDDG.',
    body: DATENSCHUTZ_BODY,
  });

export function notFoundPage() {
  const links = [
    ['/', 'Zur Startseite'],
    ['/#leistungen', 'Alle Leistungen'],
    ['/#abos', 'Abo-Modelle'],
    ...CITIES.map((c) => [`/${c.slug}`, `Gebäudereinigung ${c.city}`]),
  ];
  return {
    path: '/404',
    file: '404.html',
    title: 'Seite nicht gefunden | CI Dienstleistungen Regensburg',
    description: 'Diese Seite gibt es nicht mehr. Hier geht es zurück zur Startseite, zu allen Leistungen von CI Dienstleistungen und zu unseren drei Einsatzgebieten.',
    robots: 'noindex, follow',
    bodyClass: 'page-404',
    motion: false,
    sitemap: false,
    main: `<section class="page-head page-head--404" aria-labelledby="page-title">
      <div class="nav-sentinel" data-nav-sentinel aria-hidden="true"></div>
      <div class="wrap grid12">
        <div class="notfound__copy">
          ${overline('Fehler 404')}
          <h1 class="h-display" id="page-title">Diese Seite ist schon sauber – sie existiert nicht.</h1>
          <p class="page-head__lead">Vielleicht wurde sie verschoben oder die Adresse enthält einen Tippfehler. Von hier aus geht es weiter:</p>
          <div class="hero__actions">${button('/', 'Zur Startseite')}</div>
        </div>
        <ul class="notfound__links">
          ${links.map(([href, label]) => `<li>${arrowLink(href, label)}</li>`).join('\n          ')}
        </ul>
      </div>
    </section>`,
  };
}

/** GitHub Pages kennt keine 301: Weiterleitungsseite für die alte URL mit Umlaut. */
export function legacyRedirect({ file, target }) {
  const url = `${SITE.origin}${target}`;
  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>Weiterleitung zur Datenschutzerklärung | ${SITE.name}</title>
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="${url}">
  <meta http-equiv="refresh" content="0; url=${target}">
  <script>location.replace(${JSON.stringify(target)} + location.hash)</script>
</head>
<body>
  <p>Diese Seite ist umgezogen: <a href="${target}">${url}</a></p>
</body>
</html>
`;
}
