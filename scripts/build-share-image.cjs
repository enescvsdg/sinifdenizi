// Draws the link preview image (app/opengraph-image.jpg) in a browser, with
// the app's own fonts and artwork. Run `npm run share-image`. It uses
// Microsoft Edge by default; BROWSER_CHANNEL=chromium picks Playwright's
// Chromium and CHROMIUM_PATH any other Chromium executable.
const path = require("node:path");
const { chromium } = require("@playwright/test");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const origin = "http://share.local";
const fish = (id, style) =>
  `<img class="fish" src="/public/assets/creatures/${id}.webp" style="${style}" alt="">`;

const html = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="/node_modules/@fontsource/nunito/800.css">
<link rel="stylesheet" href="/node_modules/@fontsource/nunito/900.css">
<link rel="stylesheet" href="/node_modules/@fontsource/dm-sans/500.css">
<style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; }
  .card {
    position: relative; width: 100%; height: 100%; color: #fff;
    font-family: Nunito, sans-serif;
    background: #0b6ef3 url(/public/assets/aquarium.webp) center / cover;
  }
  .card::before {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(90deg, #04284ff5 0%, #04284fd9 40%, #04284f00 70%);
  }
  .text {
    position: absolute; left: 72px; top: 0; bottom: 0; width: 620px;
    display: flex; flex-direction: column; justify-content: center;
  }
  .brand { display: flex; align-items: center; gap: 24px; }
  .brand img { width: 108px; height: 108px; border-radius: 24px; box-shadow: 0 10px 30px #0006; }
  h1 { font-size: 90px; font-weight: 900; letter-spacing: -2px; line-height: 1; }
  h1 span { color: #7dd3fc; }
  .slogan { margin-top: 30px; font-size: 36px; font-weight: 800; letter-spacing: 1px; color: #facc15; }
  p { margin-top: 16px; font: 500 30px/1.35 "DM Sans", sans-serif; color: #e0f2fe; }
  .fish { position: absolute; filter: drop-shadow(0 12px 16px #00224466); }
</style>
</head>
<body>
<div class="card">
  ${fish(8, "left: 842px; top: 36px; width: 300px")}
  ${fish(2, "left: 716px; top: 196px; width: 150px")}
  ${fish(6, "left: 1090px; top: 236px; width: 92px")}
  ${fish(0, "left: 790px; top: 330px; width: 250px")}
  ${fish(1, "left: 1010px; top: 404px; width: 170px")}
  <div class="text">
    <div class="brand">
      <img src="/public/icons/icon-512.png" alt="">
      <h1>Sınıf<span>Denizi</span></h1>
    </div>
    <div class="slogan">Öğren. Kazan. Büyüt.</div>
    <p>Her sınıfın bir denizi var. Öğretmen ve veli için oyunlaştırılmış sınıf akvaryumu.</p>
  </div>
</div>
</body>
</html>`;

(async () => {
  const executablePath = process.env.CHROMIUM_PATH;
  const browser = await chromium.launch(
    executablePath
      ? { executablePath }
      : { channel: process.env.BROWSER_CHANNEL || "msedge" },
  );
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  // Serve the page and the repository's files from a made-up origin, so no
  // server or file:// access is needed.
  await page.route(`${origin}/**`, (route) => {
    const { pathname } = new URL(route.request().url());
    if (pathname === "/")
      return route.fulfill({ contentType: "text/html", body: html });
    const file = path.join(root, decodeURIComponent(pathname));
    if (!file.startsWith(root + path.sep)) return route.abort();
    return route.fulfill({ path: file });
  });
  await page.goto(`${origin}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const png = await page.screenshot({ type: "png" });
  await browser.close();
  const output = path.join(root, "app/opengraph-image.jpg");
  await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(output);
  console.log(`Wrote ${path.relative(root, output)}`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
