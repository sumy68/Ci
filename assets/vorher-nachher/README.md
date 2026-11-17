# Vorher/Nachher-Bilder

Dieser Ordner enthält die Originale für die drei Vorher/Nachher-Slider im
Abschnitt „Gebäudereinigung im Detail“ auf der Startseite.

| Slider | Dateien |
|---|---|
| 1 – Fassade (→ fassadenreinigung-regensburg-…) | `fassade-vorher.jpg`, `fassade-nachher.jpg` |
| 2 – Fenster/Glas (→ fensterreinigung-regensburg-…) | `fenster-vorher.jpg`, `fenster-nachher.jpg` |
| 3 – Treppenhaus/Sanitär (→ treppenhausreinigung-regensburg-…) | `innen-vorher.jpg`, `innen-nachher.jpg` |

**Derzeit:** KI-generierte Symbolbilder (auf der Seite als „Symbolbild“ gekennzeichnet).
Bitte durch echte Kundenfotos ersetzen – siehe `BILDER-TODO.md`.

## Anforderungen an echte Fotos

- **Gleiche Perspektive**: gleicher Standpunkt (Stativ oder Markierung am Boden),
  gleiche Brennweite, gleicher Bildausschnitt, möglichst gleiches Licht.
- **Querformat**, idealerweise 16:9 bis 16:10.
- **Mindestens 1600 px breit** (besser 2000 px und mehr).
- Dateiname exakt wie oben, Format JPG.

## Umwandlung

Einfach die Dateien hier ersetzen und `npm run build` ausführen. Der Build
schneidet Vorher- und Nachher-Bild eines Paares automatisch exakt gleich zu
(deckungsgleich für den Slider) und erzeugt AVIF, WebP und JPG in den Breiten
480/768/1200/1920 px (nie größer als das Original) nach
`/assets/img/vorher-nachher/`. Fehlt ein Paar, zeigt die Seite einen neutralen
Platzhalter.

## Deckungsgleichheit (aktuelle Symbolbilder)

Die KI-generierten Paare waren nicht deckungsgleich (Details lokal neu gemalt,
Fenster/Kanten sprangen an der Slider-Linie). Deshalb besteht jedes
**Vorher-Bild ausschließlich aus den Pixeln des Nachher-Bildes** plus
prozedural erzeugter Verschmutzung – keine Geometrie aus anderen Bildern:

- Erzeugung: `_src/tools/va_dirt.py` (Grauschleier, Witterungsstreifen, Algen,
  Wasserflecken/Schlieren, Staub/Fußspuren – reine Farboperationen)
- Prüfung: `_src/tools/va_verify.py` (Canny-Kantenvergleich + Phasenkorrelation
  je Bildkachel; Ergebnis neu: Median-Versatz 0,04–0,10 px)
- KI-Originale (nur noch als Nachher-Quelle): `_src/images/vorher-nachher-original/`

Bei **echten** Fotopaaren ist das nicht nötig – einfach die Dateien ersetzen.

## Cache-Sicherheit

Die erzeugten Dateien tragen einen Inhalts-Hash am Ende des Namens
und sind nach Leistung + Ort benannt
(z. B. `fassadenreinigung-regensburg-vorher-768.5d6439b3.avif`). Neues Bild = neuer Dateiname,
Browser und CDN können keine veraltete Version ausliefern.
