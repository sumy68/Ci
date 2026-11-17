/**
 * Automatisierter Test: Ein-/Ausklappen (Leistungsverzeichnis + Stadtseiten).
 * Chrome + WebKit (Safari-Engine), Desktop + Mobil.
 *
 * Aufruf: npm test   (startet einen eigenen lokalen Server, Build vorher: npm run build)
 * Optional: CHROME_PATH=/pfad/zu/chrome   (sonst installiertes Google Chrome)
 */
import { chromium, webkit } from 'playwright';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PORT = 8099;
const BASE = `http://127.0.0.1:${PORT}`;
const ANIM_MS = 350;
const SETTLE = ANIM_MS + 250;

const failures = [];
let passed = 0;
const check = (name, cond, detail = '') => {
  if (cond) passed++;
  else failures.push(`✗ ${name}${detail ? ` – ${detail}` : ''}`);
};

function startServer() {
  const proc = spawn('python3', [path.join(ROOT, '_src/serve.py'), String(PORT)], { stdio: 'ignore' });
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + 8000;
    const ping = () =>
      fetch(BASE + '/').then(() => resolve(proc), () => (Date.now() > deadline ? reject(new Error('Server startet nicht')) : setTimeout(ping, 150)));
    ping();
  });
}

/** Zustand eines Eintrags: aria-expanded, Panel-Höhe, Sichtbarkeit, Icon-Rotation. */
const stateOf = (page, sel) =>
  page.evaluate((s) => {
    const btn = document.querySelector(s);
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    const after = getComputedStyle(btn.querySelector('.acc__icon'), '::after').transform;
    return {
      expanded: btn.getAttribute('aria-expanded'),
      height: Math.round(panel.getBoundingClientRect().height),
      visible: getComputedStyle(panel).visibility,
      plus: after !== 'none' && after !== 'matrix(1, 0, 0, 1, 0, 0)', // um 90° gedreht = Plus
    };
  }, sel);

async function testPage(page, url, label) {
  // Klick unmittelbar nach dem Parsen (vor load / vor den deferred Skripten-Effekten)
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const first = page.locator('[data-acc-trigger]').first();
  const firstSel = `#${await first.getAttribute('id')}`;
  await first.click();
  await page.waitForTimeout(SETTLE);
  let st = await stateOf(page, firstSel);
  check(`${label}: Klick direkt nach dem Laden öffnet`, st.expanded === 'true' && st.height > 0 && st.visible === 'visible' && !st.plus, JSON.stringify(st));

  // Neu laden: Ausgangszustand alle zu, Text trotzdem im HTML
  await page.goto(url, { waitUntil: 'load' });
  const all = await page.evaluate(() => [...document.querySelectorAll('[data-acc-trigger]')].map((b) => {
    const p = document.getElementById(b.getAttribute('aria-controls'));
    return { exp: b.getAttribute('aria-expanded'), h: Math.round(p.getBoundingClientRect().height), text: p.textContent.trim().length, inline: p.getAttribute('style') };
  }));
  check(`${label}: alle Einträge anfangs geschlossen`, all.every((a) => a.exp === 'false' && a.h === 0), JSON.stringify(all.filter((a) => a.exp !== 'false' || a.h !== 0)));
  check(`${label}: Detailtext im HTML vorhanden, kein Inline-Style`, all.every((a) => a.text > 20 && !a.inline));

  const btns = page.locator('[data-acc-trigger]');
  const sel = async (i) => `#${await btns.nth(i).getAttribute('id')}`;
  const a = await sel(0);
  const b = await sel(1);
  await btns.nth(0).scrollIntoViewIfNeeded();

  // Schnelle Mehrfachklicks (auch mitten in der Animation)
  for (const [clicks, expected] of [[2, 'false'], [3, 'true'], [5, 'true'], [4, 'false']]) {
    await page.goto(url, { waitUntil: 'load' });
    await btns.nth(0).scrollIntoViewIfNeeded();
    for (let i = 0; i < clicks; i++) {
      await btns.nth(0).click({ delay: 0 });
      await page.waitForTimeout(40); // < Animationsdauer -> Umkehr mitten in der Animation
    }
    await page.waitForTimeout(SETTLE);
    st = await stateOf(page, a);
    const consistent = expected === 'true' ? st.height > 0 && st.visible === 'visible' && !st.plus : st.height === 0 && st.visible === 'hidden' && st.plus;
    check(`${label}: ${clicks} schnelle Klicks -> ${expected === 'true' ? 'offen' : 'zu'}`, st.expanded === expected && consistent, JSON.stringify(st));
  }

  // Mehrere gleichzeitig offen
  await page.goto(url, { waitUntil: 'load' });
  await btns.nth(0).click();
  await btns.nth(1).click();
  await page.waitForTimeout(SETTLE);
  const [sa, sb] = [await stateOf(page, a), await stateOf(page, b)];
  check(`${label}: mehrere Einträge gleichzeitig offen`, sa.expanded === 'true' && sb.expanded === 'true' && sa.height > 0 && sb.height > 0);

  // Tastatur: Enter öffnet, Leertaste schließt, Fokus sichtbar
  await page.goto(url, { waitUntil: 'load' });
  await btns.nth(0).focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(SETTLE);
  check(`${label}: Enter öffnet`, (await stateOf(page, a)).expanded === 'true');
  await page.keyboard.press('Space');
  await page.waitForTimeout(SETTLE);
  check(`${label}: Leertaste schließt`, (await stateOf(page, a)).expanded === 'false');
  const outline = await page.evaluate((s) => { const c = getComputedStyle(document.querySelector(s)); return c.outlineStyle !== 'none' && parseFloat(c.outlineWidth) >= 2; }, a);
  check(`${label}: sichtbarer Fokus-Stil`, outline);
  // Tab springt nicht in geschlossene Panels (Link im Panel nicht fokussierbar)
  await page.keyboard.press('Tab');
  const focusedInsideClosed = await page.evaluate((s) => {
    const panel = document.getElementById(document.querySelector(s).getAttribute('aria-controls'));
    return panel.contains(document.activeElement);
  }, a);
  check(`${label}: geschlossenes Panel nicht per Tab erreichbar`, !focusedInsideClosed);

  // Kein Öffnen per Hover
  await page.goto(url, { waitUntil: 'load' });
  await btns.nth(0).hover();
  await page.waitForTimeout(SETTLE);
  check(`${label}: Hover öffnet nicht`, (await stateOf(page, a)).expanded === 'false');

  // Anker-Deep-Link öffnet den Eintrag
  const itemId = await page.evaluate((s) => document.querySelector(s).closest('.acc').id, a);
  await page.goto('about:blank');
  await page.goto(`${url}#${itemId}`, { waitUntil: 'load' });
  await page.waitForTimeout(SETTLE);
  check(`${label}: Deep-Link #${itemId} öffnet Eintrag`, (await stateOf(page, a)).expanded === 'true');
}

async function testReducedMotion(browser, url, label) {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load' });
  const btn = page.locator('[data-acc-trigger]').first();
  await btn.click();
  const dur = await page.evaluate(() => getComputedStyle(document.querySelector('.acc__panel')).transitionDuration);
  check(`${label}: reduced motion ohne Animation`, dur.split(',').every((d) => parseFloat(d) === 0), dur);
  await ctx.close();
}

const server = await startServer();
try {
  const engines = [
    ['Chrome', chromium, process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' }],
    ['WebKit', webkit, {}],
  ];
  for (const [engine, type, opts] of engines) {
    const browser = await type.launch(opts);
    for (const [device, viewport, hasTouch] of [['Desktop', { width: 1440, height: 900 }, false], ['Mobil', { width: 390, height: 844 }, true]]) {
      const ctx = await browser.newContext({ viewport, hasTouch });
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      for (const [url, name] of [[`${BASE}/`, 'Startseite'], [`${BASE}/gebaeudereinigung-kelheim`, 'Stadtseite']]) {
        await testPage(page, url, `${engine}/${device}/${name}`);
      }
      check(`${engine}/${device}: keine JS-Fehler`, errors.length === 0, errors.join(' | '));
      await ctx.close();
    }
    await testReducedMotion(browser, `${BASE}/`, `${engine}`);
    await browser.close();
  }
} finally {
  server.kill();
}

console.log(`${passed} bestanden, ${failures.length} fehlgeschlagen`);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
