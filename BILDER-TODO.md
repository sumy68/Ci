# Bilder-TODO – echte Fotos statt KI-Bildern

Stand: 17.11.2026. Alle derzeit verwendeten Bilder wirken KI-generiert
(zu glatte Oberflächen, generische Personen ohne Gesicht/Firmenkleidung,
unrealistisch perfekte Lichtstimmung). Für Vertrauen und lokales SEO sollten
sie durch **eigene Fotos von echten Einsätzen** ersetzt werden.

## So tauschen Sie ein Bild aus

1. Originalfoto (mind. 2000 px breit, Querformat 3:2, außer wo anders angegeben)
   unter dem **gleichen Dateinamen** in `_src/images/…` ablegen (Spalte „Quelle“).
2. `npm run images` und `npm run build` ausführen – alle Größen und Formate
   (AVIF, WebP, JPG) werden automatisch erzeugt, Dateinamen bleiben gleich.
3. Alt-Text bei Bedarf in `_src/data.mjs` anpassen.

**Allgemeine Fotohinweise:** Firmenkleidung mit Logo sichtbar, echte Objekte
aus Regensburg/Kelheim/Landshut (mit Einverständnis der Eigentümer), natürliches
Tageslicht, keine erkennbaren Kfz-Kennzeichen/Hausnummern Dritter, Personen nur
mit schriftlicher Einwilligung.

## Hero und große Bilder

| Bild | Quelle | Wirkt KI-generiert, weil … | Motiv-Vorschlag für echtes Foto |
|---|---|---|---|
| Hero (Glasfassade, quer) | `_src/images/hero/ci-hero-desktop-2.png` | Fantasie-Bürogebäude, perfekter Himmel, keine Menschen | Eine echte, von CI betreute Glasfassade oder ein großes Fenster in der Region, frontal und leicht seitlich, ruhiger Hintergrund. **Wichtig für den Wisch-Effekt:** viel Glasfläche, gleichmäßiges Licht |
| Hero (Glasfassade, hoch) | `_src/images/hero/ci-hero-mobile-2.png` | wie oben | Dasselbe Motiv im Hochformat (4:5) |
| Wohnhaus (derzeit **nicht verwendet** – „Über uns“ zeigt jetzt den Rundum-Paket-Orbit) | `_src/images/hero/hero-villa.jpg` | Rendering-Look, grünstichige Nachbearbeitung | Team vor dem Firmenfahrzeug oder vor einem betreuten Wohnhaus, Abendlicht, Gesichter erkennbar – eignet sich z. B. als Bild für eine Stadtseite |

## Leistungen (18 Bilder, je 3:2)

| Leistung | Quelle (`_src/images/leistungen/`) | Motiv-Vorschlag |
|---|---|---|
| Unterhaltsreinigung & Büroreinigung | `unterhaltsreinigung.jpg` | Mitarbeiterin in Firmenkleidung beim Saugen in einem echten Kundenbüro, Reinigungswagen im Bild |
| Grundreinigung / Start-Clean | `grundreinigung.jpg` | Einscheibenmaschine auf einem Fliesen- oder Linoleumboden, sichtbarer Glanzunterschied |
| Sanitärhygiene & Entkalkung | `sanitaer.jpg` | Entkalken einer Armatur in einem Gewerbe-WC, Farbsystem der Tücher sichtbar |
| Küchen- & Hygienereinigung | `kueche.jpg` | Teeküche in einem Büro, Abwischen der Arbeitsplatte, Kaffeemaschine im Hintergrund |
| Treppenhausreinigung | `treppenhaus.jpg` | Echtes Treppenhaus einer Wohnanlage, Wischen der Stufen, Warnschild „Rutschgefahr“ |
| Desinfektionsreinigung | `desinfektion.jpg` | Desinfektion von Kontaktflächen (Türklinke, Empfangstresen) in Praxis oder Kita |
| Fensterreinigung, Wintergarten, Jalousien | `fenster.jpg` | Abzieher an einer großen Fensterfront, Schaum halb abgezogen |
| Fassadenreinigung | `fassade.jpg` | Hubarbeitsbühne oder Teleskopstange an einer Fassade |
| Stein-, Fugenreinigung & Graffiti | `stein_fugen.jpg` | Hochdruckreinigung eines Pflasters mit sichtbarer Sauber/Schmutzig-Kante |
| Bau- & Bauendreinigung | `baureinigung.jpg` | Leerer Neubau-Raum nach der Endreinigung, Industriesauger, Folienreste werden entfernt |
| Objektkontrollen | `objektkontrolle.jpg` | Hausmeister mit Tablet/Checkliste im Technikraum oder am Briefkasten-Bereich |
| Kleinreparaturen & Maler-Ausbesserungen | `kleinreparaturen.jpg` | Ausbessern einer Wandstelle mit Rolle, oder Nachstellen eines Türbeschlags |
| Außenanlagenpflege & Gartenpflege | `aussenanlagen.jpg` | Heckenschnitt oder Rasenmähen auf einer betreuten Anlage |
| Kehrdienst & Wege | `kehrdienst.jpg` | Laub kehren auf Gehweg vor einem Mehrfamilienhaus |
| Müll- & Containerdienst | `muelldienst.jpg` | Mülltonnen werden an die Straße gestellt bzw. gereinigt |
| Entrümpeln & Transporte | `entruempeln.jpg` | Eigener Transporter mit Firmenlogo beim Beladen |
| Winterdienst-Koordination | `winterdienst.jpg` | Geräumter, gestreuter Gehweg am Morgen, Streuwagen |
| Schlüssel & Zutritt | `schluessel.jpg` | Schlüsselübergabe mit Protokoll, Schlüsselkasten |

## Vorher-/Nachher-Slider (neu)

Derzeit werden **Platzhalter** verwendet: dasselbe Foto, für „Vorher“ per CSS-Filter
gealtert, und als „Symbolbilder“ gekennzeichnet. Benötigt werden echte Fotopaare.

**Aufnahmeregeln für Fotopaare:** gleicher Standpunkt (Stativ oder Markierung am
Boden), gleiche Brennweite, gleiches Licht, Querformat 16:10, mind. 2000 px breit.

| Vergleich | Platzhalter-ID | Motiv-Vorschlag |
|---|---|---|
| Treppenhaus | `treppenhaus` | Verschmutzte Stufen/Podest (Straßenschmutz, Streusalzränder) → nach der Reinigung |
| Graffiti an Klinker | `stein` | Wand mit Graffiti → nach der Entfernung |
| Bodenbelag | `grundreinigung` | Matter, fleckiger Boden → nach Grundreinigung und Pflege |
| Optional: Fenster | – | Verschmutzte Scheibe mit Wasserflecken → klare Scheibe (passt zum Hero) |
| Optional: Pflaster | – | Bemooste Terrasse → nach Hochdruckreinigung |

Technisch: Die Vorher-Bilder werden in `_src/pages/home.mjs` (Funktion
`comparisonFigure`) eingebunden; nach Lieferung echter Paare den CSS-Filter
`.compare__img--before img` in `_src/css/main.css` entfernen und den Hinweis
„Symbolbilder“ streichen.
