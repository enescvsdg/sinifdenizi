const { chromium } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");
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
  await page.goto(process.env.APP_URL || "http://127.0.0.1:4173", {
    waitUntil: "networkidle",
  });
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
  await page.getByRole("dialog").waitFor();
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
  await page.getByRole("button", { name: "Öğrenciler", exact: true }).click();
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
  await page
    .getByLabel("Profil fotoğrafı (isteğe bağlı)")
    .setInputFiles(path.join(__dirname, "../public/assets/aquarium.png"));
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
  await page.getByRole("button", { name: "Sınıftan çıkar", exact: true }).click();
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
  await page.getByRole("button", { name: "Veli görünümü" }).click();
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
    .getByRole("button", { name: "Öğretmen görünümü", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Dekorasyonlar", exact: true })
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
  await page.reload({ waitUntil: "networkidle" });
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
  await page.getByRole("button", { name: "Menüyü aç" }).click();
  await page
    .getByRole("button", { name: "Görevler", exact: false })
    .first()
    .click();
  const sampleTasks = await page.evaluate(
    () => JSON.parse(localStorage.getItem("sinifdenizi-v2")).tasks.length,
  );
  if ((await page.locator(".task-card").count()) !== sampleTasks)
    throw Error("Mobile navigation failed");
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page
    .getByRole("button", { name: "Sınıf akvaryumu", exact: true })
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
    .evaluateAll((nodes) => nodes.map((n) => n.style.left + n.style.top));
  await page.waitForTimeout(300);
  const after = await page
    .locator(".swimmer")
    .evaluateAll((nodes) => nodes.map((n) => n.style.left + n.style.top));
  if (JSON.stringify(positions) !== JSON.stringify(after))
    throw Error("Reduced motion ignored");
  if (errors.length) throw Error(errors.join("\n"));
  console.log(
    "PASS: aquarium selection, task creation/approval, student creation/search, photo shrinking, student edit/removal, save rollback, parent read-only, persistence, mobile navigation, no page errors",
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
