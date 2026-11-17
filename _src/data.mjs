/**
 * Einzige Datenquelle für alle Seiten (NAP, Leistungen, Abos, FAQ, Städte).
 * Alle Fakten stammen aus der bisherigen Website. Fehlende Angaben sind
 * als TODO markiert und werden NICHT erfunden.
 */

export const SITE = Object.freeze({
  origin: 'https://ci-dienstleistungen.com',
  name: 'CI Dienstleistungen',
  owner: 'Cetin Ilcin',
  phoneDisplay: '0155 6858 1734',
  phoneE164: '+4915568581734',
  whatsapp: 'https://wa.me/4915568581734',
  email: 'info@ci-dienstleistungen.com',
  formAction: 'https://formspree.io/f/xqayqdyy',
  priceRange: '€€',
  radiusKm: 40,
  // Ergänzung überall, wo der Radius genannt wird
  radiusNote: 'Größere Projekte auch weiter entfernt nach Absprache.',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Benzstra%C3%9Fe%2020%2C%2093053%20Regensburg',
  address: Object.freeze({
    street: 'Benzstraße 20',
    zip: '93053',
    city: 'Regensburg',
    region: 'Bayern',
    country: 'DE',
  }),
});

export const LOCATIONS = Object.freeze([
  { id: 'regensburg', label: 'Büro Regensburg', street: 'Benzstraße 20', zipCity: '93053 Regensburg', note: 'Wir freuen uns über Ihre Kontaktaufnahme und garantieren individuelle Kundenbetreuung.' },
  { id: 'landshut', label: 'Standort Ergolding', street: 'Alte Regensburger Str. 24', zipCity: '84030 Ergolding', note: 'Ihr Ansprechpartner für Landshut und Umgebung.' },
  { id: 'kelheim', label: 'Standort Langquaid', street: 'Gewerbering 8', zipCity: '84085 Langquaid', note: 'Von hier betreuen wir Langquaid und den Landkreis Kelheim.' },
]);

export const SERVICE_GROUPS = Object.freeze([
  { id: 'innen', title: 'Gebäudereinigung innen', tags: ['Unterhaltsreinigung', 'Grundreinigung', 'Sanitär', 'Küche', 'Treppenhaus', 'Desinfektion'], short: 'Von Unterhalts- bis Grundreinigung, Sanitärhygiene, Küchen und Treppenhäusern.' },
  { id: 'aussen', title: 'Gebäudereinigung außen', tags: ['Fenster', 'Fassade', 'Stein & Fugen', 'Graffiti', 'Bauendreinigung'], short: 'Glas- und Fassadenpflege, Stein- & Fugenreinigung, Graffiti-Entfernung und Bauendreinigung.' },
  { id: 'hausmeister', title: 'Hausmeisterservice', tags: ['Objektkontrolle', 'Kleinreparaturen', 'Gartenpflege', 'Müll & Container', 'Winterdienst'], short: 'Objektkontrollen, Kleinreparaturen, Außenanlagenpflege, Müll- & Containerdienst, Winterdienste.' },
]);

/**
 * text  = ausführliche Beschreibung (Original der bisherigen Website) –
 *         erscheint auf genau einer Stadt-Landingpage (siehe CITIES.focus).
 * short = Kurzfassung (1 Satz) für die Leistungskarten der Startseite.
 */
const SERVICES_RAW = [
  { id: 'unterhaltsreinigung', group: 'innen', title: 'Unterhaltsreinigung & Büroreinigung', alt: 'Reinigungskraft saugt den Teppichboden in einem Büro', text: 'Büro, Praxis, Kita, Handel & privat – planbar nach Intervall. Wir übernehmen die laufende Reinigung aller nutzungsrelevanten Bereiche und sorgen für dauerhaft gepflegte Oberflächen, hygienische Sanitärbereiche und frische Räume. Reinigungspläne werden individuell abgestimmt, damit Abläufe nicht gestört werden und alles zuverlässig sauber bleibt.' },
  { id: 'grundreinigung', group: 'innen', title: 'Grundreinigung / Start-Clean', alt: 'Einscheibenmaschine bei der Grundreinigung eines Fliesenbodens', text: 'Tiefenreinigung vor Start oder turnusmäßig – inklusive Detailarbeiten. Wir entfernen hartnäckige Verschmutzungen, setzen Böden instand und reinigen schwer zugängliche Zonen, damit Flächen wieder neuwertig wirken. Ideal nach Umbauten, Einzügen oder als frischer Reset für Bestandsflächen.' },
  { id: 'sanitaer', group: 'innen', title: 'Sanitärhygiene & Entkalkung', alt: 'Waschbecken und Armatur werden mit Handschuhen gereinigt', text: 'Sanitärgrundreinigung, Kalkentfernung & Hygienekonzepte: Wir entkalken Armaturen, reinigen Fugen und Oberflächen porentief und stellen eine dauerhaft angenehme, keimarme Umgebung sicher. Auf Wunsch mit dokumentierten Hygieneplänen.' },
  { id: 'kueche', group: 'innen', title: 'Küchen- & Hygienereinigung', alt: 'Arbeitsfläche einer Teeküche wird abgewischt', text: 'Teeküchen & Sozialräume inklusive Geräte- und Oberflächenpflege. Wir reinigen Arbeitsflächen, Griffe, Fronten, Spülen und Kleingeräte sorgfältig – für hygienische Pausenbereiche, in denen sich alle wohlfühlen.' },
  { id: 'treppenhaus', group: 'innen', title: 'Treppenhausreinigung', alt: 'Treppenhausreinigung mit Wischmopp in einem Mehrparteienhaus', text: 'WEG, Wohnanlagen & Gewerbe – sicher & rutschhemmend. Wir reinigen Stufen, Podeste, Geländer und Eingangsbereiche gründlich und achten auf gepflegte, repräsentative Auftritte für Bewohner und Besucher.' },
  { id: 'desinfektion', group: 'innen', title: 'Desinfektionsreinigung', alt: 'Desinfektion einer Schreibtischoberfläche', text: 'Für Kitas, Praxen & sensible Bereiche nach Vorgabe. Wir setzen geeignete Verfahren ein, dokumentieren die Ausführung und reduzieren Keimlasten dort, wo besondere Hygiene zählt.' },
  { id: 'fenster', group: 'aussen', title: 'Fensterreinigung, Wintergarten, Jalousien & Rollläden', alt: 'Fensterreinigung mit Abzieher an einer Glasfront', text: 'Glas- und Rahmenreinigung innen & außen – inklusive Rahmen, Falzen und Lichtbändern. Jalousien und Rollläden reinigen wir lamellenschonend und kümmern uns um die Mechanik. So bleibt die Durchsicht klar und die Technik langlebig.' },
  { id: 'fassade', group: 'aussen', title: 'Fassadenreinigung', alt: 'Fassadenreinigung mit Wasserlanze an einer Glas- und Steinfassade', text: 'Glas, Metall, Stein – wir wählen materialschonende Verfahren gegen Schmutz, Algen und Umweltablagerungen. Ziel: ein sauberes, gepflegtes Erscheinungsbild ohne die Oberfläche zu beschädigen.' },
  { id: 'stein', group: 'aussen', title: 'Stein-, Fugenreinigung & Graffiti-Entfernung', alt: 'Graffiti wird mit Hochdruck von einer Klinkerwand entfernt', text: 'Flächenreinigung von Wegen, Plätzen und Mauern inklusive Fugenpflege. Unschöne Graffiti entfernen wir fachgerecht – je nach Untergrund mit passender Technik.' },
  { id: 'bau', group: 'aussen', title: 'Bau- & Bauendreinigung', alt: 'Bauendreinigung eines leeren Neubaus mit Industriesauger', text: 'Zwischen- & Endreinigung für eine bezugsfertige Übergabe. Wir beseitigen Bauschmutz, Staub und Verpackungsreste und bereiten alle Flächen für die endgültige Nutzung vor.' },
  { id: 'objektkontrolle', group: 'hausmeister', title: 'Objektkontrollen', alt: 'Hausmeister dokumentiert eine Objektkontrolle auf dem Klemmbrett', text: 'Planmäßige Rundgänge, Sichtprüfungen und Dokumentation. Wir erkennen Mängel frühzeitig, koordinieren Maßnahmen und halten Sie stets auf dem Laufenden – für einen zuverlässigen Betrieb.' },
  { id: 'reparaturen', group: 'hausmeister', title: 'Kleinreparaturen & Maler-Ausbesserungen', alt: 'Türbeschlag wird mit dem Schraubendreher nachgestellt', text: 'Leuchtmittel tauschen, Beschläge nachstellen, Türen/Fenster prüfen – wir übernehmen kleine Instandsetzungen schnell und fachgerecht, bevor daraus große Themen werden. Dazu gehören auch kleine Malerarbeiten wie das Ausbessern von Wandschäden und Nachstreichen einzelner Stellen (keine kompletten Anstriche).' },
  { id: 'aussenanlagen', group: 'hausmeister', title: 'Außenanlagenpflege & Gartenpflege', alt: 'Heckenschnitt mit der Heckenschere im Garten', text: 'Rasenmähen, Heckenschnitt, Beetpflege und saisonale Arbeiten – einzeln beauftragt oder im Abo. Wir erhalten das gepflegte Gesamtbild Ihrer Anlage das ganze Jahr.' },
  { id: 'kehrdienst', group: 'hausmeister', title: 'Kehrdienst & Wege', alt: 'Laub wird mit dem Besen von einem gepflasterten Weg gekehrt', text: 'Saubere Gehwege, Zufahrten und Allgemeinflächen – mit Laubentfernung und regelmäßiger Kontrolle. Für ein ordentliches Erscheinungsbild und sichere Wege.' },
  { id: 'muell', group: 'hausmeister', title: 'Müll- & Containerdienst', alt: 'Mülltonnen werden mit dem Hochdruckreiniger gesäubert', text: 'Bereitstellen, Reinigen und Rücktransport – pünktlich und zuverlässig. Wir achten auf saubere Müllbereiche und funktionierende Abläufe an Entsorgungstagen.' },
  { id: 'entruempeln', group: 'hausmeister', title: 'Entrümpeln & Transporte', alt: 'Transporter wird bei einer Entrümpelung mit Möbeln und Kartons beladen', text: 'Keller, Dachboden, Gewerbeflächen oder Sperrmüll – wir räumen professionell und übernehmen auf Wunsch den Transport und die fachgerechte Entsorgung.' },
  { id: 'winterdienst', group: 'hausmeister', title: 'Winterdienst-Koordination', alt: 'Schneeschaufel und Streuwagen auf einem geräumten Gehweg', text: 'Wir organisieren und überwachen externe Winterdienste, kontrollieren die Ausführung und dokumentieren Einsätze – für sichere Wege und Zufahrten bei Schnee und Eis.' },
  { id: 'schluessel', group: 'hausmeister', title: 'Schlüssel & Zutritt', alt: 'Schlüssel steckt im Schloss einer Haustür', text: 'Übergaben, Protokoll und sicheres Handling. Wir managen Schlüssel und Zutrittsrechte nach Absprache und sorgen für nachvollziehbare Prozesse.' },
];

const SERVICE_SHORT = {
  unterhaltsreinigung: 'Laufende Reinigung für Büro, Praxis, Kita, Handel und privat – planbar nach Intervall.',
  grundreinigung: 'Tiefenreinigung vor dem Start oder turnusmäßig, inklusive Detailarbeiten.',
  sanitaer: 'Kalkentfernung, porentief saubere Fugen und auf Wunsch dokumentierte Hygienepläne.',
  kueche: 'Teeküchen und Sozialräume inklusive Geräte- und Oberflächenpflege.',
  treppenhaus: 'Für WEG, Wohnanlagen und Gewerbe – gründlich, sicher und rutschhemmend.',
  desinfektion: 'Für Kitas, Praxen und sensible Bereiche nach Vorgabe, mit Dokumentation.',
  fenster: 'Glas und Rahmen innen und außen, Jalousien und Rollläden lamellenschonend.',
  fassade: 'Materialschonend für Glas, Metall und Stein – gegen Schmutz, Algen und Ablagerungen.',
  stein: 'Wege, Plätze und Mauern inklusive Fugenpflege; Graffiti entfernen wir je nach Untergrund.',
  bau: 'Zwischen- und Endreinigung für eine bezugsfertige Übergabe.',
  objektkontrolle: 'Planmäßige Rundgänge, Sichtprüfungen und Dokumentation.',
  reparaturen: 'Kleine Instandsetzungen und Maler-Ausbesserungen – keine kompletten Anstriche.',
  aussenanlagen: 'Rasen, Hecken, Beete und saisonale Arbeiten – einzeln oder im Abo.',
  kehrdienst: 'Saubere Gehwege und Zufahrten, inklusive Laubentfernung.',
  muell: 'Bereitstellen, Reinigen und Rücktransport – pünktlich an jedem Entsorgungstag.',
  entruempeln: 'Keller, Dachboden oder Gewerbefläche – auf Wunsch mit Transport und Entsorgung.',
  winterdienst: 'Wir organisieren, überwachen und dokumentieren externe Winterdienste.',
  schluessel: 'Übergaben mit Protokoll und sicheres Schlüssel- und Zutrittsmanagement.',
};

export const SERVICES = Object.freeze(
  SERVICES_RAW.map((s) => {
    if (!SERVICE_SHORT[s.id]) throw new Error(`Kurztext fehlt: ${s.id}`);
    return Object.freeze({ ...s, short: SERVICE_SHORT[s.id] });
  }),
);

export const servicesInGroup = (groupId) => SERVICES.filter((s) => s.group === groupId);
export const serviceById = (id) => {
  const found = SERVICES.find((s) => s.id === id);
  if (!found) throw new Error(`Unbekannte Leistung: ${id}`);
  return found;
};

/** Leistungsumfang in Prozent wie auf der bisherigen Seite. */
export const ABOS = Object.freeze([
  { name: 'SchnupperAbo Home', percent: 30, interval: 'einmal pro Monat', garten: 'oder', hausmeister: 'oder', reinigung: false, text: 'Basisleistungen im Bereich Gartenpflege oder Hausmeisterservice, einmal pro Monat.' },
  { name: 'BasisAbo Home', percent: 50, interval: 'zweimal im Monat', garten: 'oder', hausmeister: 'oder', reinigung: false, text: 'Regelmäßige Gartenpflege oder Hausmeisterservice zweimal im Monat.' },
  { name: 'KombiAbo Home', percent: 70, interval: 'zweimal monatlich', garten: true, hausmeister: true, reinigung: false, recommended: true, text: 'Kombination aus Gartenpflege und Hausmeisterservice, zweimal monatlich.' },
  { name: 'PremiumAbo Home', percent: 90, interval: 'einmal pro Woche', garten: true, hausmeister: true, reinigung: true, text: 'Umfassende Betreuung mit Gartenpflege, Hausmeisterservice und regelmäßiger Gebäudereinigung, einmal pro Woche.' },
  { name: 'PremiumAbo Villa', percent: 100, interval: 'flexible Intervalle', garten: true, hausmeister: true, reinigung: true, text: 'Maximaler Leistungsumfang: Gartenpflege, Hausmeisterservice und Gebäudereinigung in flexiblen Intervallen – perfekt für höchste Ansprüche.' },
]);

/** TODO: vom Kunden – Ort bzw. Objektart je Kundenmeinung ergänzen; Quelle der Bewertungen angeben. */
export const TESTIMONIALS = Object.freeze([
  { name: 'Sabine M.', topic: 'Büroreinigung', text: 'Top Service! Unser Bürogebäude wurde nach der Reinigung in perfektem Zustand übergeben. Die Terminabsprachen liefen reibungslos und das Team war super freundlich. Wir werden die Firma definitiv wieder beauftragen.' },
  { name: 'Andreas K.', topic: 'Treppenhausreinigung', text: 'Sehr zuverlässig und gründlich! Besonders die Treppenhausreinigung überzeugt uns jedes Mal. Es wird auf jedes Detail geachtet und selbst kurzfristige Wünsche werden berücksichtigt. Absolute Empfehlung!' },
  { name: 'Melanie R.', topic: 'Hausmeisterservice', text: 'Wir haben den Hausmeisterservice gebucht und sind begeistert. Ob kleine Reparaturen, Winterdienst oder Außenanlagenpflege – alles läuft zuverlässig und professionell. Vielen Dank für die tolle Arbeit!' },
]);

export const STEPS = Object.freeze([
  { title: 'Anfrage', text: 'Per Formular, Telefon oder WhatsApp – wir melden uns zeitnah.' },
  { title: 'Abstimmung', text: 'Umfang, Intervall und Reinigungsplan passend zu Ihrem Objekt, mit festem Ansprechpartner.' },
  { title: 'Ausführung', text: 'Nach klaren Standards, mit Sorgfalt und Blick fürs Detail – innen wie außen.' },
  { title: 'Kontrolle & Dokumentation', text: 'Planmäßige Rundgänge und transparente Dokumentation – Sie sind immer informiert.' },
]);

/** Nur Fakten, die bereits auf der Seite stehen (Standorte, Radius, fester Ansprechpartner). */
export const FIGURES = Object.freeze([
  { value: LOCATIONS.length, prefix: '', suffix: '', label: 'Standorte' },
  { value: SITE.radiusKm, prefix: '+', suffix: ' km', label: 'Radius je Standort – darüber hinaus nach Absprache' },
  { value: 1, prefix: '', suffix: '', label: 'fester Ansprechpartner' },
]);

/**
 * „Rundum-Paket“-Orbit: nur Leistungen, die CI laut Website anbietet.
 * icon = Schlüssel in ORBIT_ICONS (_src/lib/orbit-icons.mjs), href = Sprungziel.
 */
export const ORBIT = Object.freeze([
  { label: 'Gebäudereinigung', icon: 'building', href: '#innen' },
  { label: 'Hausmeisterservice', icon: 'wrench', href: '#hausmeister' },
  { label: 'Gartenpflege', icon: 'leaf', href: '#leistung-aussenanlagen' },
  { label: 'Winterdienst', icon: 'snow', href: '#leistung-winterdienst' },
  { label: 'Fensterreinigung', icon: 'window', href: '#leistung-fenster' },
  { label: 'Dokumentation', icon: 'clipboard', href: '#ablauf' },
]);

export const FAQ_HOME = Object.freeze([
  {
    q: 'Was kostet eine Gebäudereinigung oder ein Hausmeisterservice?',
    a: 'Der Preis richtet sich nach Objekt, Leistungsumfang und Intervall. Sie erhalten deshalb ein individuelles Angebot – das gilt auch für unsere Abo-Modelle: Preis auf Anfrage.',
    todo: 'TODO: vom Kunden – ggf. Richtpreise oder Mindestauftragswert ergänzen',
  },
  {
    // Ausführlicher Text aus „Über uns“ und Intro der bisherigen Startseite
    q: 'Was bedeutet „alles aus einer Hand“ bei CI Dienstleistungen?',
    a: 'Wir kombinieren Gebäudereinigung und Hausmeisterservice zu einem verlässlichen Rundum-Paket – mit festen Ansprechpartnern, klaren Standards und transparenter Dokumentation. Ob Reparaturen, Reinigung oder zuverlässige Betreuung: Wir kümmern uns mit Erfahrung, Sorgfalt und einem wachen Auge für jedes Detail um alles rund um Ihre Immobilie. Unser Anspruch sind hygienisch saubere Innenräume, gepflegte Außenanlagen und ein reibungsloser Gebäudebetrieb.',
  },
  {
    q: 'In welchen Orten sind Sie im Einsatz?',
    a: 'Wir sind in Regensburg, Kelheim und Landshut aktiv – je Standort mit Umland im Umkreis von rund 40 km; größere Projekte übernehmen wir nach Absprache auch weiter entfernt. Unser Büro liegt in der Benzstraße 20 in Regensburg, für Landshut ist unser Standort in Ergolding zuständig, für den Landkreis Kelheim unser Standort in Langquaid.',
  },
  {
    q: 'Welche Leistungen bieten Sie an?',
    a: 'Gebäudereinigung innen (Unterhalts- und Büroreinigung, Grundreinigung, Sanitär, Küchen, Treppenhäuser, Desinfektion), Gebäudereinigung außen (Fenster- und Glasreinigung, Fassadenreinigung, Stein- und Fugenreinigung, Graffiti-Entfernung, Bauendreinigung) und Hausmeisterservice (Objektkontrollen, Kleinreparaturen, Außenanlagenpflege, Kehrdienst, Müll- und Containerdienst, Entrümpelung, Winterdienst-Koordination, Schlüsselmanagement).',
  },
  {
    q: 'Wie funktionieren die Abo-Modelle?',
    a: 'Es gibt fünf Abo-Modelle – vom SchnupperAbo Home mit Gartenpflege oder Hausmeisterservice einmal pro Monat bis zum PremiumAbo Villa mit Gartenpflege, Hausmeisterservice und Gebäudereinigung in flexiblen Intervallen. Laufzeit und Preis legen wir im persönlichen Angebot fest.',
    todo: 'TODO: vom Kunden – Mindestlaufzeit und Kündigungsfrist der Abo-Modelle ergänzen',
  },
  {
    q: 'Wie schnell melden Sie sich nach einer Anfrage?',
    a: 'Wir melden uns zeitnah zurück. Am schnellsten erreichen Sie uns telefonisch unter 0155 6858 1734 oder per WhatsApp.',
    todo: 'TODO: vom Kunden – konkrete Reaktionszeit (z. B. innerhalb von 24 Stunden) bestätigen',
  },
  {
    q: 'Übernehmen Sie auch den Winterdienst?',
    a: 'Wir organisieren und überwachen externe Winterdienste, kontrollieren die Ausführung und dokumentieren die Einsätze – für sichere Wege und Zufahrten bei Schnee und Eis.',
  },
  {
    q: 'Führen Sie auch Malerarbeiten aus?',
    a: 'Im Rahmen der Kleinreparaturen übernehmen wir kleine Malerarbeiten wie das Ausbessern von Wandschäden und das Nachstreichen einzelner Stellen. Komplette Anstriche bieten wir nicht an.',
  },
  {
    q: 'Wird die Arbeit dokumentiert?',
    a: 'Ja. Objektkontrollen, Desinfektionsreinigungen und Winterdienst-Einsätze dokumentieren wir; für Sanitärbereiche erstellen wir auf Wunsch Hygienepläne. So bleibt jederzeit nachvollziehbar, was erledigt wurde.',
  },
]);

/** Stadt-Landingpages – jeweils eigener Text, kein reiner Ortsnamen-Tausch. */
export const CITIES = Object.freeze([
  {
    slug: 'gebaeudereinigung-regensburg',
    city: 'Regensburg',
    title: 'Gebäudereinigung in Regensburg | CI Dienstleistungen',
    description: 'Gebäudereinigung und Hausmeisterservice in Regensburg und 40 km Umkreis: Büro-, Treppenhaus- und Fensterreinigung aus einer Hand. Jetzt Angebot anfragen.',
    h1: 'Gebäudereinigung in Regensburg',
    lead: 'CI Dienstleistungen reinigt und betreut Gebäude in Regensburg und im Umkreis von rund 40 km – vom Büro über die Praxis bis zur Wohnanlage. Ausgangspunkt ist unser Büro in der Benzstraße 20; größere Projekte auch weiter entfernt nach Absprache.',
    body: [
      'Wo täglich gearbeitet, behandelt und gewohnt wird, muss die Reinigung vor allem eines: zuverlässig nach Plan laufen, ohne den Betrieb zu stören. Deshalb stimmen wir Intervalle und Reinigungspläne individuell ab und arbeiten mit festen Ansprechpartnern.',
      'Neben der Unterhalts- und Büroreinigung übernehmen wir in Regensburg die Treppenhausreinigung für Eigentümergemeinschaften und Wohnanlagen, die Fenster- und Glasreinigung sowie Desinfektionsreinigungen für Kitas und Praxen. Dazu kommen die Reinigung von Teeküchen und Sozialräumen und – wer mehr als Sauberkeit braucht – planmäßige Objektkontrollen durch unseren Hausmeisterservice.',
    ],
    location: 'regensburg',
    // Jede Leistung steht ausführlich auf genau einer Stadtseite (6/6/6) – kein Duplicate Content
    focus: ['unterhaltsreinigung', 'treppenhaus', 'fenster', 'desinfektion', 'kueche', 'objektkontrolle'],
    places: ['Regensburg', 'Neutraubling', 'Lappersdorf', 'Pentling', 'Regenstauf', 'Obertraubling'],
    faq: [
      { q: 'Wo befindet sich CI Dienstleistungen in Regensburg?', a: 'Unser Büro liegt in der Benzstraße 20, 93053 Regensburg. Telefonisch erreichen Sie uns unter 0155 6858 1734.' },
      { q: 'Reinigen Sie Treppenhäuser für Hausverwaltungen und Eigentümergemeinschaften?', a: 'Ja. Wir reinigen Treppenhäuser in WEG, Wohnanlagen und Gewerbeobjekten – Stufen, Podeste, Geländer und Eingangsbereiche, sicher und rutschhemmend.' },
      { q: 'Kommen Sie auch ins Regensburger Umland?', a: 'Ja, wir sind in Regensburg und im Umkreis von rund 40 km im Einsatz. Größere Projekte übernehmen wir nach Absprache auch weiter entfernt – fragen Sie einfach mit Ihrer Adresse an.' },
    ],
  },
  {
    slug: 'gebaeudereinigung-kelheim',
    city: 'Kelheim',
    title: 'Gebäudereinigung im Landkreis Kelheim | CI Dienstleistungen',
    description: 'Gebäudereinigung, Hausmeisterservice und Gartenpflege im Landkreis Kelheim – vom Standort Langquaid aus, im Umkreis von 40 km. Jetzt unverbindlich anfragen',
    h1: 'Gebäudereinigung im Landkreis Kelheim',
    lead: 'Im Landkreis Kelheim sind wir von unserem Standort in Langquaid aus im Einsatz – für Gebäudereinigung, Hausmeisterservice und die Pflege von Außenanlagen, im Umkreis von rund 40 km – größere Projekte auch weiter entfernt nach Absprache.',
    body: [
      'Bei Wohnhäusern, Gewerbeobjekten und Anlagen mit Grünflächen fällt ein großer Teil der Arbeit draußen an: Rasen und Hecken, Wege und Zufahrten, Mülltonnen, Laub im Herbst und Schnee im Winter. Diese Aufgaben bündeln wir mit der Reinigung im Gebäude – einzeln beauftragt oder als Abo mit festem Intervall.',
      'So haben Sie für Kelheim, Langquaid und Umgebung einen Dienstleister, der Fassade, Pflaster und Mauern ebenso im Blick hat wie die Außenanlage – bis hin zur fachgerechten Graffiti-Entfernung.',
    ],
    location: 'kelheim',
    focus: ['aussenanlagen', 'kehrdienst', 'muell', 'winterdienst', 'fassade', 'stein'],
    places: ['Kelheim', 'Langquaid', 'Abensberg', 'Bad Abbach', 'Saal an der Donau', 'Mainburg'],
    faq: [
      { q: 'Von wo aus betreuen Sie den Landkreis Kelheim?', a: 'Von unserem Standort am Gewerbering 8 in 84085 Langquaid. Von hier betreuen wir Langquaid und den Landkreis Kelheim im Umkreis von rund 40 km, größere Projekte nach Absprache auch darüber hinaus.' },
      { q: 'Kann ich Gartenpflege und Hausmeisterservice kombinieren?', a: 'Ja. Das KombiAbo Home verbindet Gartenpflege und Hausmeisterservice zweimal monatlich; die Premium-Abos schließen zusätzlich die Gebäudereinigung ein.' },
      { q: 'Kümmern Sie sich auch um den Winterdienst?', a: 'Wir organisieren und überwachen externe Winterdienste, kontrollieren die Ausführung und dokumentieren die Einsätze.' },
    ],
  },
  {
    slug: 'gebaeudereinigung-landshut',
    city: 'Landshut',
    title: 'Gebäudereinigung Landshut & Ergolding | CI Dienstleistungen',
    description: 'Gebäudereinigung und Hausmeisterservice in Landshut vom Standort Ergolding: Bauendreinigung, Grundreinigung, Entrümpelung und mehr. Jetzt Angebot anfragen.',
    h1: 'Gebäudereinigung in Landshut',
    lead: 'Für Landshut und Umgebung ist unser Standort in Ergolding zuständig, direkt vor den Toren der Stadt. Von dort übernehmen wir Gebäudereinigung und Hausmeisterservice im Umkreis von rund 40 km – größere Projekte auch weiter entfernt nach Absprache.',
    body: [
      'Neben der laufenden Betreuung übernehmen wir in Landshut auch einmalige Einsätze: die Bauendreinigung nach Neu- oder Umbau für eine bezugsfertige Übergabe, die Grundreinigung vor dem Einzug oder die Entrümpelung von Keller, Dachboden und Gewerbeflächen – auf Wunsch samt Transport und fachgerechter Entsorgung.',
      'Für Büros, Praxen und Wohnanlagen bieten wir Sanitärhygiene mit dokumentierten Hygieneplänen, Kleinreparaturen und Maler-Ausbesserungen sowie ein geordnetes Schlüssel- und Zutrittsmanagement.',
    ],
    location: 'landshut',
    focus: ['bau', 'grundreinigung', 'entruempeln', 'sanitaer', 'reparaturen', 'schluessel'],
    places: ['Landshut', 'Ergolding', 'Altdorf', 'Essenbach', 'Kumhausen', 'Tiefenbach'],
    faq: [
      { q: 'Wer ist mein Ansprechpartner für Landshut?', a: 'Unser Standort in der Alten Regensburger Str. 24, 84030 Ergolding, ist Ihr Ansprechpartner für Landshut und Umgebung. Telefonisch erreichen Sie uns unter 0155 6858 1734.' },
      { q: 'Übernehmen Sie Bauendreinigungen in Landshut?', a: 'Ja. Wir übernehmen Zwischen- und Endreinigungen, beseitigen Bauschmutz, Staub und Verpackungsreste und bereiten alle Flächen für die Übergabe vor.' },
      { q: 'Entsorgen Sie bei einer Entrümpelung auch?', a: 'Ja. Wir räumen Keller, Dachböden, Gewerbeflächen oder Sperrmüll und übernehmen auf Wunsch den Transport und die fachgerechte Entsorgung.' },
    ],
  },
]);

export const locationById = (id) => {
  const found = LOCATIONS.find((l) => l.id === id);
  if (!found) throw new Error(`Unbekannter Standort: ${id}`);
  return found;
};
