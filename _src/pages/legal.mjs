/** Impressum, Datenschutz, 404 und Weiterleitung der alten Datenschutz-URL. */
import { SITE, CITIES } from '../data.mjs';
import { button, arrowLink, overline } from '../lib/html.mjs';
import { graph, breadcrumbs, webPage } from '../lib/schema.mjs';

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

// Datenschutzerklärung: Vorlage (Abschnitte 1–5, Wortlaut unverändert, Verantwortlicher angepasst)
// plus ergänzte Abschnitte 6–8 (Hosting, Formspree, WhatsApp). Stand fest, nicht automatisch.
const DATENSCHUTZ_BODY = `
          <h2>1) Einleitung und Kontaktdaten des Verantwortlichen</h2>
          <p><strong>1.1</strong> Wir freuen uns, dass Sie unsere Website besuchen und bedanken uns für Ihr Interesse. Im Folgenden informieren wir Sie über den Umgang mit Ihren personenbezogenen Daten bei der Nutzung unserer Website. Personenbezogene Daten sind hierbei alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
          <p><strong>1.2</strong> Verantwortlicher für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist ${SITE.name}, Inhaber ${SITE.owner}, ${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}, Deutschland, Tel.: ${tel}, E-Mail: ${mail}. Der für die Verarbeitung von personenbezogenen Daten Verantwortliche ist diejenige natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet.</p>
          <h2>2) Datenerfassung beim Besuch unserer Website</h2>
          <p><strong>2.1</strong> Bei der bloß informatorischen Nutzung unserer Website, also wenn Sie sich nicht registrieren oder uns anderweitig Informationen übermitteln, erheben wir nur solche Daten, die Ihr Browser an den Seitenserver übermittelt (sog. „Server-Logfiles"). Wenn Sie unsere Website aufrufen, erheben wir die folgenden Daten, die für uns technisch erforderlich sind, um Ihnen die Website anzuzeigen:</p>
          <p>Unsere besuchte Website<br>Datum und Uhrzeit zum Zeitpunkt des Zugriffes<br>Menge der gesendeten Daten in Byte<br>Quelle/Verweis, von welchem Sie auf die Seite gelangten<br>Verwendeter Browser<br>Verwendetes Betriebssystem<br>Verwendete IP-Adresse (ggf. in anonymisierter Form)</p>
          <p>Die Verarbeitung erfolgt gemäß Art. 6 Abs. 1 lit. f DSGVO auf Basis unseres berechtigten Interesses an der Verbesserung der Stabilität und Funktionalität unserer Website. Eine Weitergabe oder anderweitige Verwendung der Daten findet nicht statt. Wir behalten uns allerdings vor, die Server-Logfiles nachträglich zu überprüfen, sollten konkrete Anhaltspunkte auf eine rechtswidrige Nutzung hinweisen.</p>
          <p><strong>2.2</strong> Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung personenbezogener Daten und anderer vertraulicher Inhalte (z. B. Bestellungen oder Anfragen an den Verantwortlichen) eine SSL- bzw. TLS-Verschlüsselung. Sie können eine verschlüsselte Verbindung an der Zeichenfolge „https://" und dem Schloss-Symbol in Ihrer Browserzeile erkennen.</p>
          <h2>3) Kontaktaufnahme</h2>
          <p>Im Rahmen der Kontaktaufnahme mit uns (z. B. per Kontaktformular oder E-Mail) werden personenbezogene Daten erhoben. Welche Daten im Falle der Nutzung eines Kontaktformulars erhoben werden, ist aus dem jeweiligen Kontaktformular ersichtlich. Diese Daten werden ausschließlich zum Zweck der Beantwortung Ihres Anliegens bzw. für die Kontaktaufnahme und die damit verbundene technische Administration gespeichert und verwendet.</p>
          <p>Rechtsgrundlage für die Verarbeitung dieser Daten ist unser berechtigtes Interesse an der Beantwortung Ihres Anliegens gemäß Art. 6 Abs. 1 lit. f DSGVO. Zielt Ihre Kontaktierung auf den Abschluss eines Vertrages ab, so ist zusätzliche Rechtsgrundlage für die Verarbeitung Art. 6 Abs. 1 lit. b DSGVO. Ihre Daten werden nach abschließender Bearbeitung Ihrer Anfrage gelöscht. Dies ist der Fall, wenn sich aus den Umständen entnehmen lässt, dass der betroffene Sachverhalt abschließend geklärt ist und sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</p>
          <h2>4) Rechte des Betroffenen</h2>
          <p><strong>4.1</strong> Das geltende Datenschutzrecht gewährt Ihnen gegenüber dem Verantwortlichen hinsichtlich der Verarbeitung Ihrer personenbezogenen Daten die nachstehenden Betroffenenrechte (Auskunfts- und Interventionsrechte), wobei für die jeweiligen Ausübungsvoraussetzungen auf die angeführte Rechtsgrundlage verwiesen wird:</p>
          <p>Auskunftsrecht gemäß Art. 15 DSGVO;<br>Recht auf Berichtigung gemäß Art. 16 DSGVO;<br>Recht auf Löschung gemäß Art. 17 DSGVO;<br>Recht auf Einschränkung der Verarbeitung gemäß Art. 18 DSGVO;<br>Recht auf Unterrichtung gemäß Art. 19 DSGVO;<br>Recht auf Datenübertragbarkeit gemäß Art. 20 DSGVO;<br>Recht auf Widerruf erteilter Einwilligungen gemäß Art. 7 Abs. 3 DSGVO;<br>Recht auf Beschwerde gemäß Art. 77 DSGVO.</p>
          <p><strong>4.2 Widerspruchsrecht</strong><br>Wenn wir im Rahmen einer Interessenabwägung Ihre personenbezogenen Daten aufgrund unseres überwiegenden berechtigten Interesses verarbeiten, haben Sie das jederzeitige Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, gegen diese Verarbeitung Widerspruch mit Wirkung für die Zukunft einzulegen.</p>
          <p>Machen Sie von Ihrem Widerspruchsrecht Gebrauch, beenden wir die Verarbeitung der betroffenen Daten. Eine Weiterverarbeitung bleibt aber vorbehalten, wenn wir zwingende schutzwürdige Gründe für die Verarbeitung nachweisen können, die Ihre Interessen, Grundrechte und Grundfreiheiten überwiegen, oder wenn die Verarbeitung der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen dient.</p>
          <p>Werden Ihre personenbezogenen Daten von uns verarbeitet, um Direktwerbung zu betreiben, haben Sie das Recht, jederzeit Widerspruch gegen die Verarbeitung Sie betreffender personenbezogener Daten zum Zwecke derartiger Werbung einzulegen. Sie können den Widerspruch wie oben beschrieben ausüben.</p>
          <p>Machen Sie von Ihrem Widerspruchsrecht Gebrauch, beenden wir die Verarbeitung der betroffenen Daten zu Direktwerbezwecken.</p>
          <h2>5) Dauer der Speicherung personenbezogener Daten</h2>
          <p>Die Dauer der Speicherung von personenbezogenen Daten bemisst sich anhand der jeweiligen Rechtsgrundlage, am Verarbeitungszweck und – sofern einschlägig – zusätzlich anhand der jeweiligen gesetzlichen Aufbewahrungsfrist (z. B. handels- und steuerrechtliche Aufbewahrungsfristen).</p>
          <p>Bei der Verarbeitung von personenbezogenen Daten auf Grundlage einer ausdrücklichen Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO werden die betroffenen Daten so lange gespeichert, bis Sie Ihre Einwilligung widerrufen.</p>
          <p>Existieren gesetzliche Aufbewahrungsfristen für Daten, die im Rahmen rechtsgeschäftlicher bzw. rechtsgeschäftsähnlicher Verpflichtungen auf der Grundlage von Art. 6 Abs. 1 lit. b DSGVO verarbeitet werden, werden diese Daten nach Ablauf der Aufbewahrungsfristen routinemäßig gelöscht, sofern sie nicht mehr zur Vertragserfüllung oder Vertragsanbahnung erforderlich sind und/oder unsererseits kein berechtigtes Interesse an der Weiterspeicherung fortbesteht.</p>
          <p>Bei der Verarbeitung von personenbezogenen Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO werden diese Daten so lange gespeichert, bis Sie Ihr Widerspruchsrecht nach Art. 21 Abs. 1 DSGVO ausüben, es sei denn, wir können zwingende schutzwürdige Gründe für die Verarbeitung nachweisen, die Ihre Interessen, Rechte und Freiheiten überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.</p>
          <p>Bei der Verarbeitung von personenbezogenen Daten zum Zwecke der Direktwerbung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO werden diese Daten so lange gespeichert, bis Sie Ihr Widerspruchsrecht nach Art. 21 Abs. 2 DSGVO ausüben.</p>
          <p>Sofern sich aus den sonstigen Informationen dieser Erklärung über spezifische Verarbeitungssituationen nichts anderes ergibt, werden gespeicherte personenbezogene Daten im Übrigen dann gelöscht, wenn sie für die Zwecke, für die sie erhoben oder auf sonstige Weise verarbeitet wurden, nicht mehr notwendig sind.</p>
          <h2>6) Hosting</h2>
          <p>Unsere Website wird über den Dienst GitHub Pages der GitHub Inc., USA, bereitgestellt. Beim Aufruf unserer Website verarbeitet GitHub die unter Ziffer 2.1 genannten Server-Logfiles einschließlich Ihrer IP-Adresse. Die Verarbeitung erfolgt gemäß Art. 6 Abs. 1 lit. f DSGVO auf Basis unseres berechtigten Interesses an einer sicheren und zuverlässigen Bereitstellung unserer Website. Die Übermittlung von Daten in die USA erfolgt auf Grundlage des EU-US Data Privacy Framework.</p>
          <h2>7) Kontaktformular über Formspree</h2>
          <p>Für unser Kontaktformular nutzen wir den Dienst Formspree, USA. Ihre Formulareingaben werden über Formspree an uns übermittelt. Rechtsgrundlage für die Verarbeitung ist – wie unter Ziffer 3 beschrieben – Art. 6 Abs. 1 lit. f DSGVO bzw. Art. 6 Abs. 1 lit. b DSGVO. Dabei werden Ihre Daten in die USA übermittelt.</p>
          <h2>8) WhatsApp</h2>
          <p>Auf unserer Website bieten wir Ihnen die Möglichkeit, uns über WhatsApp zu kontaktieren. Beim Klick auf den WhatsApp-Button werden Sie zu WhatsApp (Meta) weitergeleitet. Erst dann werden Daten an WhatsApp übermittelt; beim bloßen Besuch unserer Website findet keine Übermittlung statt.</p>
          <p>Stand: 7. September 2026</p>`;

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
    lead: 'Informationen zur Verarbeitung personenbezogener Daten nach DSGVO.',
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
