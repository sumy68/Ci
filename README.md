# ci-dienstleistungen.com

Statische Website, gehostet auf GitHub Pages. Alle Seiten werden aus
`_src/` erzeugt – **HTML im Root nicht direkt bearbeiten**.

## Befehle

```bash
npm install          # einmalig
npm run images       # Bilder aus _src/images -> assets/img (AVIF/WebP/JPG)
npm run vendor       # GSAP, Lenis, Schriften nach assets/ kopieren
npm run build        # alle Seiten, Sitemap, robots.txt, llms.txt erzeugen
npm run check        # SEO-/Qualitätsprüfung (H1, Meta, Alt, JSON-LD, Links)
npm run serve        # lokaler Server wie GitHub Pages: http://127.0.0.1:8080
```

## Wo steht was?

- `_src/data.mjs` – alle Inhalte und Fakten (NAP, Leistungen, Abos, FAQ, Städte)
- `_src/pages/` – Seitenaufbau (Startseite, Stadtseiten, Rechtliches, 404)
- `_src/css/critical.css` – wird inline eingesetzt; `_src/css/main.css` – Rest
- `nav.js`, `assets/js/main.js`, `assets/js/motion.js` – Verhalten und Animation
- `BILDER-TODO.md`, `SEO-TODO.md` – offene Punkte für den Kunden
