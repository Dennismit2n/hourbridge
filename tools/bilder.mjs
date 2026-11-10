// Bildschirmfotos für die READMEs (docs/screens-de.png, docs/screens-en.png) und das
// Vorschaubild für Links (og.png, 1200×630). Braucht den Vorschau-Server auf Port 8625
// (Startkonfiguration „repos-static“) und Playwright aus dem Nachbar-Repo collective-calc.
//
//   node tools/bilder.mjs
//
// Danach: python tools/webp.py  (macht aus den PNG-Fotos WebP)

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { chromium } = require(path.join(WURZEL, '..', 'collective-calc', 'node_modules', 'playwright'));
const URL = 'http://localhost:8625/hourbridge/#z=UTC,Europe/Berlin,America/New_York,Asia/Tokyo&t=20270320T1400Z';

fs.mkdirSync(path.join(WURZEL, 'docs'), { recursive: true });
const browser = await chromium.launch();

for (const lang of ['de', 'en']) {
  const page = await browser.newPage({ viewport: { width: 1180, height: 760 }, deviceScaleFactor: 2, colorScheme: 'dark', locale: lang === 'de' ? 'de-DE' : 'en-GB', timezoneId: 'Europe/Berlin' });
  await page.addInitScript(l => { try { localStorage.setItem('hourbridge.lang', l); localStorage.setItem('hourbridge.h12', '0'); } catch (e) {} }, lang);
  await page.goto(URL);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(WURZEL, 'docs', `screens-${lang}.png`) });
  await page.close();
}

// Vorschaubild: eigene kleine Seite, gleiche Farben wie die App, nichts aus dem Netz.
const icon = fs.readFileSync(path.join(WURZEL, 'favicon.svg'), 'utf8');
const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await og.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
  body { margin: 0; width: 1200px; height: 630px; background: #0E171F; color: #B7B1D7; font-family: "Segoe UI", system-ui, sans-serif; display: flex; flex-direction: column; justify-content: center; padding: 0 90px; box-sizing: border-box; position: relative; overflow: hidden; }
  .band { position: absolute; left: 0; right: 0; bottom: 0; height: 26px; display: flex; }
  .band i { flex: 1; }
  .kopf { display: flex; align-items: center; gap: 28px; }
  .kopf svg { width: 120px; height: 120px; }
  h1 { margin: 0; font-size: 92px; color: #D8D1E2; font-weight: 700; letter-spacing: .01em; }
  .satz { margin: 34px 0 0; font-size: 44px; color: #D8D1E2; font-weight: 300; }
  .satz b { font-weight: 600; } .satz span { color: #B699C1; font-weight: 500; }
  .de { margin: 14px 0 0; font-size: 30px; color: #8C88AC; }
  .fuss { margin-top: 46px; font-size: 26px; color: #7EB39D; }
</style></head><body>
  <div class="kopf">${icon}<h1>Hourbridge</h1></div>
  <p class="satz"><b>14:00</b> <span>UTC</span> is <b>15:00</b> <span>CET</span> in Berlin</p>
  <p class="de">UTC und deutsche Zeit, Zeitumstellungen inklusive.</p>
  <p class="fuss">Free · no cookies · no ads · offline after the first visit</p>
  <div class="band">${Array.from({ length: 24 }, (_, h) => `<i style="background:${h >= 9 && h < 17 ? '#2C5045' : h >= 8 && h < 18 ? '#29405A' : h >= 6 && h < 22 ? '#262A47' : '#0F1A2B'}"></i>`).join('')}</div>
</body></html>`);
await og.screenshot({ path: path.join(WURZEL, 'og.png') });
await browser.close();
console.log('ok');
