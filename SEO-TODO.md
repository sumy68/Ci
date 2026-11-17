# SEO-TODO – CI Dienstleistungen

Stand: 17.11.2026. Die Website ist technisch auf Profi-Niveau vorbereitet
(Lighthouse lokal: Performance Mobil 98–100 / Desktop 100, Barrierefreiheit 100,
Best Practices 100, SEO 100 auf allen indexierbaren Seiten). Folgende Punkte
brauchen **Angaben vom Kunden** oder passieren **außerhalb der Website**.

## 1. Angaben, die der Kunde liefern muss

Alle Stellen sind im Quelltext als `TODO` markiert und werden zentral in
`_src/data.mjs` bzw. `_src/pages/*.mjs` gepflegt (danach `npm run build`).

| # | Was fehlt | Wo es eingesetzt wird | Wirkung |
|---|---|---|---|
| 1 | **Öffnungszeiten / telefonische Erreichbarkeit** | Kontaktbereich, Schema `openingHoursSpecification` | Pflichtfeld für ein vollständiges Google-Unternehmensprofil, Rich Results |
| 2 | **Geo-Koordinaten** des Büros Benzstraße 20 (aus dem Google-Unternehmensprofil übernehmen) | Schema `geo` | Lokale Zuordnung in Google Maps |
| 3 | **Profil-Links** (Google-Unternehmensprofil, Instagram, Facebook, Branchenbücher) | Schema `sameAs`, ggf. Footer | Entitäts-Verknüpfung für Google und KI-Suche |
| 4 | **Echte Kennzahl(en)**, z. B. Jahre Erfahrung, betreute Objekte, Mitarbeitende | Kennzahlen-Abschnitt (derzeit nur Zahlen aus der Seite: 18 Leistungen, 3 Standorte, 40 km, 5 Abos) | Vertrauen, zitierfähige Fakten |
| 5 | **Mindestlaufzeit und Kündigungsfrist** der Abo-Modelle | FAQ „Wie funktionieren die Abo-Modelle?“ | Beantwortet häufige Suchfrage vollständig |
| 6 | **Richtpreise oder Mindestauftragswert** (optional) | FAQ „Was kostet …?“ | Höhere Klickrate, bessere AI-Overview-Chance |
| 7 | **Konkrete Reaktionszeit** (z. B. „innerhalb von 24 Stunden“) | FAQ „Wie schnell melden Sie sich …?“, Kontakt | Conversion |
| 8 | **Betriebshaftpflicht/Versicherung** (ja/nein, Deckungssumme) | Neue FAQ (bewusst noch nicht angelegt) | Vertrauen bei Gewerbekunden |
| 9 | **Ort bzw. Objektart je Kundenmeinung** + **Quelle der Bewertungen** (z. B. Google) | Kundenmeinungen | Erst mit überprüfbarer Quelle darf `AggregateRating`/`Review`-Schema ergänzt werden |
| 10 | **Orte im Einsatzgebiet bestätigen** (je Stadtseite 6 Orte im 40-km-Umkreis) | Stadt-Landingpages | Lokale Long-Tail-Suchen |
| 11 | **Echte Fotos** inkl. Vorher-/Nachher-Paare | siehe `BILDER-TODO.md` | Bilder-SEO, Vertrauen |

## 2. Rechtliches (vor dem nächsten Release prüfen lassen)

- Erledigt (17.11.2026): Impressum auf **§ 5 DDG**, **§§ 7–10 DDG** und **§ 18 Abs. 2 MStV** umgestellt; Datenschutz beschreibt jetzt den tatsächlichen Stand (Hosting GitHub Pages, Formspree, WhatsApp-Link, Google Maps nur als Link, lokale Schriften, keine Cookies/kein Tracking, TDDDG). Instagram-Abschnitt entfernt (kein Link vorhanden).
- **Offen – „TODO: Datenschutz prüfen“ (HTML-Kommentare in /datenschutz):** Vertragspartner/Drittlandübermittlung GitHub; Einordnung des sessionStorage-Werts nach § 25 TDDDG; AV-Vertrag, Drittlandübermittlung und Speicherdauer bei Formspree; Rechtsgrundlage/Hinweise WhatsApp-Nutzung; bestehende AV-Verträge nach Art. 28 DSGVO; aktuelle Anschrift des BayLDA.
- **Offen – Impressum:** EU-OS-Plattform wurde zum 20.07.2025 eingestellt – Hinweis/Link ggf. entfernen (rechtlich prüfen).
- Impressum: Zeilen „Unternehmensform: Einzelkaufmann“ und „Unternehmensgegenstand: Hausmeisterservice“ wurden entfernt (stammten aus dem Initial-Commit `6ba1742`). **Vom Kunden bestätigen:** Rechtsform, ggf. Handelsregister, ggf. Handwerkskammer/USt-IdNr. (als TODO-Kommentar im Impressum markiert).
- Impressum: Abschnitt **Bildnachweis** zu KI-generierten Symbolbildern ergänzt; Footer verlinkt darauf.

## 3. Nächste Schritte außerhalb der Website

1. **Google-Unternehmensprofil optimieren und verknüpfen**
   - Name exakt „CI Dienstleistungen“, Adresse „Benzstraße 20, 93053 Regensburg“, Telefon „0155 6858 1734“ – identisch zur Website (NAP-Konsistenz).
   - Hauptkategorie „Gebäudereinigungsdienst“, Zusatzkategorien „Hausmeisterdienst“, „Fensterreinigungsdienst“, „Gartenpflege“.
   - Einzugsgebiet: Regensburg, Kelheim, Landshut (+ Umland). Leistungen 1:1 aus der Website übernehmen.
   - Website-Link: `https://ci-dienstleistungen.com/`, Öffnungszeiten, 10+ echte Fotos (siehe `BILDER-TODO.md`).
   - Danach Profil-URL als `sameAs` im Schema ergänzen (Punkt 1.3).
2. **Google Search Console**
   - Domain-Property `ci-dienstleistungen.com` anlegen (DNS-Verifizierung).
   - Sitemap `https://ci-dienstleistungen.com/sitemap.xml` einreichen.
   - URL-Prüfung für `/`, `/gebaeudereinigung-regensburg`, `/gebaeudereinigung-kelheim`, `/gebaeudereinigung-landshut` → „Indexierung beantragen“.
   - Alte URL `/Datenschutzerkl%C3%A4rung.html` beobachten (leitet per Meta-Refresh auf `/datenschutz` weiter, siehe Punkt 4).
3. **Bewertungen sammeln**
   - Nach jedem abgeschlossenen Auftrag Bewertungslink des Google-Profils per WhatsApp/E-Mail senden (Kurzlink im Profil unter „Bewertungen erhalten“).
   - Auf jede Bewertung antworten. Ziel: 20+ Bewertungen in 6 Monaten.
   - Erst wenn Bewertungen mit Quelle auf der Website zitiert werden, `AggregateRating` im Schema ergänzen.
4. **Branchenverzeichnisse mit identischen NAP-Daten**
   Gelbe Seiten, Das Örtliche, Das Telefonbuch, 11880, Cylex, GoLocal, Yelp, Apple Business Connect (Apple Karten), Bing Places, MyHammer/Blauarbeit (optional), IHK-Firmenverzeichnis.
   Überall exakt: **CI Dienstleistungen · Benzstraße 20 · 93053 Regensburg · 0155 6858 1734 · https://ci-dienstleistungen.com/**
5. **KI-Suche**: `llms.txt` liegt im Root. Nach Ergänzung von Öffnungszeiten/Profilen neu bauen (`npm run build`).

## 4. Hosting-Einschränkungen (GitHub Pages)

GitHub Pages erlaubt **keine eigenen HTTP-Header und keine echten 301-Weiterleitungen**:

- **Cache-Header**: GitHub Pages setzt fest `Cache-Control: max-age=600`. Ein Jahr + `immutable` ist nur mit vorgeschaltetem CDN möglich. Empfehlung: Domain über **Cloudflare** (kostenlos) proxen und eine Cache-Regel anlegen:
  - Pfade `/assets/*`, `/favicon.ico` → Edge- und Browser-TTL 1 Jahr. CSS/JS werden vom Build bereits mit `?v=<hash>` versioniert, Bilder/Fonts ändern ihren Namen bei neuen Inhalten – damit ist `immutable` sicher.
  - Alternativ Umzug zu Netlify/Cloudflare Pages; dann `_headers`:
    ```
    /assets/*
      Cache-Control: public, max-age=31536000, immutable
    ```
- **Weiterleitung alte Datenschutz-URL**: `/Datenschutzerklärung.html` ist eine `noindex`-Seite mit Canonical, Meta-Refresh und JS-Weiterleitung auf `/datenschutz` (das ist das Maximum auf GitHub Pages; Google wertet das wie eine Weiterleitung). Mit Cloudflare zusätzlich eine echte 301-Regel anlegen:
  `ci-dienstleistungen.com/Datenschutzerkl%C3%A4rung.html` → `https://ci-dienstleistungen.com/datenschutz` (301).

## 5. Neue und geänderte URLs

| URL | Status |
|---|---|
| `/` | überarbeitet, indexierbar |
| `/gebaeudereinigung-regensburg` | **neu**, indexierbar, in Sitemap |
| `/gebaeudereinigung-kelheim` | **neu**, indexierbar, in Sitemap |
| `/gebaeudereinigung-landshut` | **neu**, indexierbar, in Sitemap |
| `/impressum` | neues Design, `noindex, follow` |
| `/datenschutz` | **neu** (ersetzt `/Datenschutzerklärung.html`), `noindex, follow` |
| `/Datenschutzerklärung.html` | Weiterleitung auf `/datenschutz` |
| `/404.html` | **neu**, eigene Fehlerseite |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/site.webmanifest` | neu bzw. aktualisiert |
