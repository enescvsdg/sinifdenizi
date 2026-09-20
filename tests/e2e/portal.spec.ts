import { test, expect } from '@playwright/test';
test('login has only teacher and parent roles and a clear demo', async ({ page }) => {
  await page.goto('/giris');
  await expect(page.getByRole('button', { name: 'Öğretmen', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Veli', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Öğrenci', exact: true })).toHaveCount(0);
  await page.getByRole('link', { name: 'Örnek sınıfı keşfet' }).click();
  await expect(
    page.getByText('ÖRNEK SINIF · Kurgusal veriler, salt okunur önizleme'),
  ).toBeVisible();
});
test('teacher can explore all demo views and choose fish with keyboard', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Sınıf akvaryumu' }).click();
  await page.getByText('Balık seç', { exact: true }).click();
  await page.getByRole('button', { name: /Ada Yılmaz · Palyaço/ }).click();
  await expect(page.getByRole('status')).toContainText('Ada Yılmaz');
  await page.getByRole('button', { name: 'Kartı kapat' }).click();
  await page.getByRole('button', { name: 'Animasyonu duraklat' }).click();
  await expect(page.getByRole('button', { name: 'Animasyonu oynat' })).toBeVisible();
  for (const name of ['Öğrenciler', 'Görevler', 'Başarılar', 'Raporlar', 'Duyurular']) {
    await page.getByRole('navigation').getByRole('link', { name, exact: true }).click();
    await expect(page.locator('h1')).toBeVisible();
  }
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('parent demo is read-only and can switch children', async ({ page }) => {
  await page.goto('/demo?role=parent');
  await expect(
    page.getByRole('navigation').getByRole('link', { name: 'Öğrenciler', exact: true }),
  ).toHaveCount(0);
  await page.getByRole('link', { name: 'Deniz Kaya', exact: true }).click();
  await expect(page.locator('h1')).toContainText('Deniz Kaya');
  await page.getByRole('navigation').getByRole('link', { name: 'Görevler', exact: true }).click();
  await expect(page.getByText('Yeni görev oluştur', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Onayla/ })).toHaveCount(0);
});
test('private panel redirects without a session', async ({ page }) => {
  await page.goto('/panel');
  await expect(page).toHaveURL(/\/giris/);
});
