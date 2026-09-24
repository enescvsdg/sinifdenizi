const { chromium } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");
// Visible text in the page that is smaller than 12 px or below WCAG AA
// contrast (4.5:1, 3:1 for large text). Gradients count by their worst
// colour stop; text over the aquarium painting has its own dark backing
// and is checked by design, not here.
function readabilityProblems() {
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const v = m[1]
      .split(/[ ,/]+/)
      .filter(Boolean)
      .map(Number);
    return [v[0], v[1], v[2], v[3] ?? 1];
  };
  const over = (top, bottom) =>
    [0, 1, 2].map((i) => top[i] * top[3] + bottom[i] * (1 - top[3])).concat(1);
  const lum = (c) => {
    const f = (x) =>
      (x /= 255) <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  };
  function backgrounds(el) {
    const layers = [];
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage.includes("url(")) return null;
      const stops = [...cs.backgroundImage.matchAll(/rgba?\([^)]+\)/g)].map(
        (m) => parse(m[0]),
      );
      const color = parse(cs.backgroundColor);
      layers.push({ stops, color });
      if ((color && color[3] === 1) || stops.some((c) => c[3] === 1)) break;
    }
    let base = [[255, 255, 255, 1]];
    for (const { stops, color } of layers.reverse()) {
      if (color && color[3] > 0) base = base.map((b) => over(color, b));
      if (stops.length)
        base = stops.flatMap((c) => base.map((b) => over(c, b)));
    }
    return base;
  }
  const problems = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode());) {
    const text = n.textContent.trim();
    const el = n.parentElement;
    if (!text || !el.getBoundingClientRect().width) continue;
    let opacity = 1,
      shown = true;
    for (let a = el; a; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if (cs.display === "none" || cs.visibility === "hidden") shown = false;
      opacity *= Number(cs.opacity);
    }
    if (!shown || !opacity) continue;
    const cs = getComputedStyle(el),
      size = parseFloat(cs.fontSize);
    if (size > 0 && size < 12) problems.push(`${size}px: ${text.slice(0, 30)}`);
    if (!size || el.closest(":disabled, .locked, .aquarium, .welcome-art"))
      continue;
    const fg = parse(cs.color),
      bgs = backgrounds(el);
    if (!fg || !bgs) continue;
    fg[3] *= opacity;
    const worst = Math.min(...bgs.map((b) => ratio(over(fg, b), b)));
    const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700);
    if (worst < (large ? 3 : 4.5))
      problems.push(`${worst.toFixed(2)}:1 ${cs.color}: ${text.slice(0, 30)}`);
  }
  return [...new Set(problems)];
}
(async () => {
  const channel = process.env.BROWSER_CHANNEL || "msedge";
  const screenshotDir = process.env.SCREENSHOT_DIR || "test-results";
  fs.mkdirSync(screenshotDir, { recursive: true });
  const browser = await chromium.launch({ channel, headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1050 },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const appUrl = (process.env.APP_URL || "http://127.0.0.1:4173").replace(
    /\/?$/,
    "/",
  );
  await page.goto(appUrl, { waitUntil: "networkidle" });
  // Link previews point at the share image under the site's base path.
  const shareImage = await page.getAttribute(
    'meta[property="og:image"]',
    "content",
  );
  const sharePath = new URL(shareImage).pathname;
  if (sharePath !== new URL(appUrl).pathname + "opengraph-image.jpg")
    throw Error(`Share image address is wrong: ${shareImage}`);
  if (!(await page.request.get(new URL(sharePath, appUrl).href)).ok())
    throw Error("Share image is missing from the build");
  await page.screenshot({
    path: path.join(screenshotDir, "sinifdenizi-desktop.png"),
    fullPage: true,
  });
  console.log(
    JSON.stringify({
      title: await page.title(),
      swimmers: await page.locator(".swimmer").count(),
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      errors,
    }),
  );
  for (const address of [
    "",
    "gorevler/",
    "dekorasyonlar/",
    "veli/",
    "giris/",
  ]) {
    await page.goto(new URL(address, appUrl).href, {
      waitUntil: "networkidle",
    });
    const problems = await page.evaluate(readabilityProblems);
    if (problems.length)
      throw Error(`Hard to read on /${address}:\n${problems.join("\n")}`);
  }
  await page.goto(appUrl, { waitUntil: "networkidle" });
  const swimPositions = () =>
    page
      .locator(".swimmer")
      .evaluateAll((nodes) => nodes.map((n) => n.style.transform));
  const start = await swimPositions();
  await page.waitForTimeout(500);
  if (JSON.stringify(start) === JSON.stringify(await swimPositions()))
    throw Error("Fish do not swim");
  await page.getByRole("button", { name: "Yüzmeyi duraklat" }).click();
  await page.getByRole("button", { name: "Tam ekran", exact: true }).click();
  await page.waitForFunction(
    () =>
      document.querySelector(".aquarium").getBoundingClientRect().width >=
      innerWidth - 1,
  );
  await page
    .getByRole("button", { name: "Tam ekrandan çık", exact: true })
    .first()
    .click();
  const feedBefore = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("sinifdenizi-v2")).students.reduce(
      (n, s) => n + s.feed,
      0,
    ),
  );
  await page
    .getByRole("button", { name: "Balıkları besle", exact: true })
    .click();
  await page.waitForFunction(
    (before) =>
      JSON.parse(localStorage.getItem("sinifdenizi-v2")).students.reduce(
        (n, s) => n + s.feed,
        0,
      ) ===
      before - 24,
    feedBefore,
  );
  await page.locator(".swimmer").first().click({ force: true });
  await page.getByRole("dialog", { name: "Öğrencinin hikâyesi" }).waitFor();
  await page.getByRole("button", { name: "Kapat", exact: true }).click();
  await page.getByRole("button", { name: "Yeni görev", exact: true }).click();
  await page
    .getByLabel("Görev başlığı", { exact: true })
    .fill("Test: deniz araştırması");
  await page
    .getByRole("button", { name: "Görevi oluştur", exact: true })
    .click();
  const task = page
    .locator(".task-card")
    .filter({ hasText: "Test: deniz araştırması" });
  await task.locator("summary").click();
  await task.getByRole("button", { name: "Görevi onayla" }).first().click();
  if ((await task.getByText("1/24 öğrenci tamamladı").count()) !== 1)
    throw Error("Approval missing");
  // An approval can be taken back, and the task edited and deleted.
  await task
    .getByRole("button", { name: /onayı geri al$/ })
    .first()
    .click();
  await task.getByText("0/24 öğrenci tamamladı").waitFor();
  await task.getByRole("button", { name: "Görevi onayla" }).first().click();
  await task.getByText("1/24 öğrenci tamamladı").waitFor();
  await task.getByRole("button", { name: "Düzenle", exact: true }).click();
  await page
    .getByLabel("Görev başlığı", { exact: true })
    .fill("Test: deniz araştırması (güncel)");
  await page
    .getByRole("button", { name: "Değişiklikleri kaydet", exact: true })
    .click();
  await page
    .locator(".task-card h3", { hasText: "Test: deniz araştırması (güncel)" })
    .waitFor();
  const xpBeforeDelete = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("sinifdenizi-v2")).students.reduce(
      (n, s) => n + s.xp,
      0,
    ),
  );
  await task.getByRole("button", { name: "Sil", exact: true }).click();
  await task
    .getByRole("button", { name: "Evet, görevi sil", exact: true })
    .click();
  await page.waitForFunction((before) => {
    const s = JSON.parse(localStorage.getItem("sinifdenizi-v2"));
    return (
      !s.tasks.some((t) => t.title.startsWith("Test: deniz")) &&
      s.students.reduce((n, x) => n + x.xp, 0) === before - 50
    );
  }, xpBeforeDelete);
  await page.getByRole("link", { name: "Öğrenciler", exact: true }).click();
  await page.waitForURL(/\/ogrenciler\/$/);
  await page.goBack();
  await page.waitForURL(/\/gorevler\/$/);
  if ((await page.locator(".task-card").count()) < 1)
    throw Error("Back button did not return to tasks");
  await page.getByRole("link", { name: "Öğrenciler", exact: true }).click();
  await page.waitForURL(/\/ogrenciler\/$/);
  await page.getByRole("button", { name: "Öğrenci ekle", exact: true }).click();
  await page.getByLabel("Ad soyad", { exact: true }).fill("Test Deniz");
  await page
    .getByRole("button", { name: "Öğrenciyi ekle", exact: true })
    .click();
  await page.getByRole("textbox", { name: "Öğrenci ara" }).fill("Test Deniz");
  if ((await page.locator(".student-card").count()) !== 1)
    throw Error("Student not added");
  // A 2.4 MB photo is stored as a small square, so storage does not fill up.
  await page.getByRole("button", { name: "Öğrenci ekle", exact: true }).click();
  await page.getByLabel("Ad soyad", { exact: true }).fill("Foto Deniz");
  const photoInput = page.getByLabel("Profil fotoğrafı (isteğe bağlı)");
  const bigPhoto = path.join(__dirname, "../assets-src/aquarium.png");
  // An unusable file chosen while a photo is still loading must not leave
  // the dialog's save button disabled.
  await photoInput.setInputFiles(bigPhoto);
  await photoInput.setInputFiles({
    name: "notlar.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("not a photo"),
  });
  await page
    .getByText("En fazla 10 MB boyutunda JPG, PNG veya WebP seçin.")
    .waitFor();
  await page
    .waitForFunction(
      () => !document.querySelector("dialog form button.primary").disabled,
      null,
      { timeout: 5000 },
    )
    .catch(() => {
      throw Error("Save button stayed disabled after an unusable file");
    });
  await photoInput.setInputFiles(bigPhoto);
  await page.getByAltText("Seçilen profil fotoğrafı").waitFor();
  await page
    .getByRole("button", { name: "Öğrenciyi ekle", exact: true })
    .click();
  const photoLength = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("sinifdenizi-v2")).students.find(
        (s) => s.name === "Foto Deniz",
      )?.photo?.length ?? 0,
  );
  if (!(photoLength > 0 && photoLength < 100000))
    throw Error(`Photo not shrunk: ${photoLength} characters`);
  await page.locator(".student-card").first().click();
  await page.getByRole("button", { name: "Bilgileri düzenle" }).click();
  await page.getByLabel("Ad soyad", { exact: true }).fill("Test Deniz Kaya");
  await page
    .getByRole("button", { name: "Değişiklikleri kaydet", exact: true })
    .click();
  await page.waitForFunction(() =>
    localStorage.getItem("sinifdenizi-v2").includes("Test Deniz Kaya"),
  );
  await page.getByRole("button", { name: "Kapat", exact: true }).click();
  await page.getByRole("textbox", { name: "Öğrenci ara" }).fill("Foto Deniz");
  await page.locator(".student-card").first().click();
  await page
    .getByRole("button", { name: "Sınıftan çıkar", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Evet, sınıftan çıkar", exact: true })
    .click();
  await page.waitForFunction(
    () => !localStorage.getItem("sinifdenizi-v2").includes("Foto Deniz"),
  );
  if ((await page.locator(".student-card").count()) !== 0)
    throw Error("Student not removed");
  // A change that no longer fits in storage is undone on screen too.
  await page.evaluate(() => {
    let low = 0,
      high = 12000000;
    while (low < high) {
      const mid = Math.ceil((low + high) / 2);
      try {
        localStorage.setItem("e2e-filler", "x".repeat(mid));
        low = mid;
      } catch {
        high = mid - 1;
      }
    }
    localStorage.setItem("e2e-filler", "x".repeat(low));
  });
  await page.getByRole("button", { name: "Öğrenci ekle", exact: true }).click();
  await page.getByLabel("Ad soyad", { exact: true }).fill("Sığmayan Öğrenci");
  await page
    .getByRole("button", { name: "Öğrenciyi ekle", exact: true })
    .click();
  await page.getByText("Değişiklik kaydedilemedi ve geri alındı").waitFor();
  await page.getByRole("textbox", { name: "Öğrenci ara" }).fill("Sığmayan");
  if ((await page.locator(".student-card").count()) !== 0)
    throw Error("Unsaved student kept on screen");
  await page.evaluate(() => localStorage.removeItem("e2e-filler"));
  await page.getByRole("link", { name: "Veli görünümü" }).click();
  await page.getByLabel("Çocuk seç").selectOption("student-1");
  if ((await page.getByLabel("Çocuk seç").inputValue()) !== "student-1")
    throw Error("Child selection failed");
  await page.screenshot({
    path: path.join(screenshotDir, "sinifdenizi-parent.png"),
    fullPage: true,
  });
  if (await page.getByRole("button", { name: "Onayla", exact: true }).count())
    throw Error("Parent approval leaked");
  await page
    .getByRole("link", { name: "Öğretmen görünümü", exact: true })
    .click();
  await page
    .getByRole("link", { name: "Dekorasyonlar", exact: true })
    .first()
    .click();
  await page.screenshot({
    path: path.join(screenshotDir, "sinifdenizi-decorations.png"),
    fullPage: true,
  });
  const coral = page
    .locator(".decor-card")
    .filter({ hasText: "Mercan bahçesi" });
  await coral.getByRole("button").click();
  if (
    (await coral.getByRole("button", { name: "Akvaryuma ekle" }).count()) !== 1
  )
    throw Error("Decoration toggle failed");
  if (
    !(await page
      .locator(".decor-card")
      .filter({ hasText: "Sualtı kalesi" })
      .getByRole("button")
      .isDisabled())
  )
    throw Error("Locked decoration enabled");
  await page.goto(new URL("ogrenciler/", appUrl).href, {
    waitUntil: "networkidle",
  });
  await page
    .getByRole("textbox", { name: "Öğrenci ara" })
    .fill("Test Deniz Kaya");
  if ((await page.locator(".student-card").count()) !== 1)
    throw Error("Direct link did not show saved students");
  await page
    .getByRole("link", { name: "Sınıf akvaryumu", exact: true })
    .click();
  await page.waitForURL((url) => !url.pathname.includes("ogrenciler"));
  if ((await page.locator(".swimmer").count()) !== 25)
    throw Error("Student not persisted");
  if (
    !(await page.evaluate(() =>
      localStorage.getItem("sinifdenizi-v2").includes("Test Deniz Kaya"),
    ))
  )
    throw Error("Edit not persisted");
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForFunction(
    () => document.querySelector(".sidebar").getBoundingClientRect().right <= 0,
  );
  await page.screenshot({
    path: path.join(screenshotDir, "sinifdenizi-mobile.png"),
    fullPage: true,
  });
  if (
    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  )
    throw Error("Mobile horizontal overflow");
  const mobileProblems = await page.evaluate(readabilityProblems);
  if (mobileProblems.length)
    throw Error(`Hard to read on a phone:\n${mobileProblems.join("\n")}`);
  await page.keyboard.press("Tab");
  if (await page.evaluate(() => !!document.activeElement.closest(".sidebar")))
    throw Error("Closed mobile menu takes keyboard focus");
  const toggle = page.getByRole("button", { name: "Menüyü aç" });
  await toggle.click();
  if ((await toggle.getAttribute("aria-expanded")) !== "true")
    throw Error("Menu button does not report the open menu");
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () => document.querySelector(".sidebar").getBoundingClientRect().right <= 0,
  );
  if ((await toggle.getAttribute("aria-expanded")) !== "false")
    throw Error("Escape did not close the menu");
  await page.getByRole("button", { name: "Menüyü aç" }).click();
  await page
    .getByRole("link", { name: "Görevler", exact: false })
    .first()
    .click();
  await page.waitForURL(/\/gorevler\/$/);
  await page.locator(".task-card").first().waitFor();
  // The menu slides closed once the new page is shown.
  await page.waitForFunction(
    () => document.querySelector(".sidebar").getBoundingClientRect().right <= 0,
    null,
    { timeout: 3000 },
  );
  const sampleTasks = await page.evaluate(
    () => JSON.parse(localStorage.getItem("sinifdenizi-v2")).tasks.length,
  );
  if ((await page.locator(".task-card").count()) !== sampleTasks)
    throw Error("Mobile navigation failed");
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page
    .getByRole("link", { name: "Sınıf akvaryumu", exact: true })
    .click();
  await page.screenshot({
    path: path.join(screenshotDir, "sinifdenizi-smartboard.png"),
    fullPage: true,
  });
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem("sinifdenizi-v2"));
    while (s.students.length < 40) {
      const i = s.students.length;
      s.students.push({
        ...s.students[i % 24],
        id: "stress-" + i,
        name: "Test Öğrenci " + i,
        fish: i % 12,
      });
    }
    localStorage.setItem("sinifdenizi-v2", JSON.stringify(s));
  });
  await page.reload({ waitUntil: "networkidle" });
  if ((await page.locator(".swimmer").count()) !== 40)
    throw Error("40-student aquarium failed");
  await page.screenshot({
    path: path.join(screenshotDir, "sinifdenizi-40-students.png"),
    fullPage: true,
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "networkidle" });
  const positions = await page
    .locator(".swimmer")
    .evaluateAll((nodes) => nodes.map((n) => n.style.transform));
  await page.waitForTimeout(300);
  const after = await page
    .locator(".swimmer")
    .evaluateAll((nodes) => nodes.map((n) => n.style.transform));
  if (!positions.every(Boolean))
    throw Error("Fish were not placed while motion is reduced");
  if (JSON.stringify(positions) !== JSON.stringify(after))
    throw Error("Reduced motion ignored");
  if (errors.length) throw Error(errors.join("\n"));
  console.log(
    "PASS: aquarium selection, task creation/approval, student creation/search, photo shrinking, student edit/removal, save rollback, parent read-only, persistence, mobile navigation, readable text, keyboard-safe menu, no page errors",
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
