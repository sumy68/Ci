# Vorher/Nachher-Bilder

Dieser Ordner enthält die Originale für die drei Vorher/Nachher-Slider im
Abschnitt „Gebäudereinigung im Detail“ auf der Startseite.

| Slider | Dateien |
|---|---|
| 1 – Fassade | `fassade-vorher.jpg`, `fassade-nachher.jpg` |
| 2 – Fenster/Glas | `fenster-vorher.jpg`, `fenster-nachher.jpg` |
| 3 – Treppenhaus/Sanitär (innen) | `innen-vorher.jpg`, `innen-nachher.jpg` |

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
