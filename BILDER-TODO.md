# Bilder-TODO – echte Fotos statt KI-Bildern

Stand: 17.11.2026. Alle derzeit verwendeten Bilder wirken KI-generiert
(zu glatte Oberflächen, generische Personen ohne Gesicht/Firmenkleidung,
unrealistisch perfekte Lichtstimmung). Für Vertrauen und lokales SEO sollten
sie durch **eigene Fotos von echten Einsätzen** ersetzt werden.

## Dateinamen

Alle erzeugten Bilder heißen nach dem Schema **Leistung + Ort + Breite + Inhalts-Hash**,
z. B. `fensterreinigung-regensburg-1000.a1b2c3d4.jpg` (Leistungsbilder tragen den Ort der
Stadtseite, auf der sie erscheinen). Die Namen entstehen automatisch
(`_src/lib/image-names.mjs`, `_src/image-config.mjs`) – die Quelldateien in `_src/images`
behalten ihre Namen.

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

> Der Glas-Hero ist ein **KI-Symbolbild** (Alt-Text „Saubere Glasfassade – Gebäudereinigung Regensburg (Symbolbild)“). Nach dem Austausch `npm run images -- glasfassade` und `npm run build` ausführen.

| Bild | Quelle | Wirkt KI-generiert, weil … | Motiv-Vorschlag für echtes Foto |
|---|---|---|---|
| Glas-Hero Desktop/Tablet (**KI-Symbolbild**) | `assets/hero/gebaeudereinigung-regensburg-glasfassade-desktop.jpg` (1344 × 752) | KI-generiert, keine reale Fassade | Nahaufnahme einer echten, von CI gereinigten Glasfassade/Fensterfront in der Region, quer, ruhige helle Fläche **links** (dort liegt der Text), mind. 2400 px breit |
| Glas-Hero Mobil (**KI-Symbolbild**) | `assets/hero/gebaeudereinigung-regensburg-glasfassade-mobil.jpg` (752 × 1344) | KI-generiert, keine reale Fassade | Dasselbe Motiv im Hochformat, ruhige helle Fläche **oben** (dort liegt der Text), mind. 1200 px breit |
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

## Vorher-/Nachher-Slider

> **Vorher/Nachher-Bilder sind KI-Symbolbilder – durch echte Kundenfotos ersetzen.**
> Auf der Website sind sie als „Symbolbild“ bzw. „KI-generierte Symbolbilder“ gekennzeichnet
> (Hinweis im Abschnitt, Bildunterschrift, Alt-Texte, Footer und Bildnachweis im Impressum).

Die Originale liegen in `/assets/vorher-nachher/` (Anleitung: `assets/vorher-nachher/README.md`).
Dateien gleichnamig ersetzen und `npm run build` ausführen – Zuschnitt und AVIF/WebP/JPG
werden automatisch erzeugt.

**Aufnahmeregeln für Fotopaare:** gleicher Standpunkt (Stativ oder Markierung am
Boden), gleiche Brennweite, gleiches Licht, Querformat 16:9, mind. 1600 px breit.

| Slider | Dateien | Motiv-Vorschlag für echte Fotos |
|---|---|---|
| 1 – Fassade | `fassade-vorher.jpg`, `fassade-nachher.jpg` | Fassadenabschnitt mit Algen/Grauschleier → nach der Reinigung |
| 2 – Fenster/Glas | `fenster-vorher.jpg`, `fenster-nachher.jpg` | Glasfront mit Wasserflecken und verschmutzten Rahmen → klare Scheibe |
| 3 – Treppenhaus/Sanitär | `innen-vorher.jpg`, `innen-nachher.jpg` | Verschmutzte Stufen/Podest oder Sanitärbereich → nach der Reinigung |

Sobald echte Fotos vorliegen: Hinweis „KI-generierte Symbolbilder“ in `_src/pages/home.mjs`
(Funktion `beforeAfter`) sowie „(Symbolbild)“ in den Alt-Texten entfernen.
