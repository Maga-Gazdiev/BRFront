import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
const token = 'm96-e2e-only-test-token-32-characters';
const headers = { Authorization: `Bearer ${token}` };
const seed = JSON.parse(
  readFileSync(new URL('../../backend/data/content.json', import.meta.url), 'utf8'),
);
test.beforeEach(async ({ request }) => {
  const current = await (await request.get('/api/content')).json();
  const saved = await request.put('/api/admin/content', {
    headers,
    data: { ...seed, revision: current.revision },
  });
  expect(saved.ok()).toBeTruthy();
});
test('desktop: categories, booking, gallery, images and keyboard dismissal', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Ваше время. Ваше пространство.',
  );
  await page.getByRole('button', { name: 'Барбер', exact: true }).click();
  await expect(page.locator('.service-row')).toHaveCount(2);
  await page.getByRole('button', { name: 'Записаться: Мужская стрижка', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Онлайн-запись скоро откроется');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Открыть фото: Спокойствие в каждой детали' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Следующее фото' }).click();
  await expect(page.getByRole('dialog')).toContainText('2/3');
  await page.getByRole('button', { name: 'Закрыть', exact: true }).click();
  await page.locator('footer').scrollIntoViewIfNeeded();
  await page.evaluate(async () => {
    await Promise.all([...document.images].map((img) => img.decode().catch(() => undefined)));
  });
  expect(
    await page
      .locator('img')
      .evaluateAll((images) => images.every((img) => (img as HTMLImageElement).naturalWidth > 0)),
  ).toBeTruthy();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
  expect(errors).toEqual([]);
});
test('mobile: no overflow, menu navigation and booking', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Открыть меню' }).click();
  await page.getByRole('dialog').getByRole('link', { name: 'Услуги' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('#services')).toBeInViewport();
  await page.locator('.mobile-book button').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  for (const width of [360, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBeTruthy();
  }
});
test('admin: authenticate, edit price, upload image and persist on reload', async ({
  page,
  request,
}) => {
  expect((await request.put('/api/admin/content', { data: seed })).status()).toBe(401);
  await page.goto('/admin');
  await page.getByLabel('Ключ доступа').fill('wrong');
  await page.getByRole('button', { name: 'Войти', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Неверный ключ');
  await page.getByLabel('Ключ доступа').fill(token);
  await page.getByRole('button', { name: 'Войти', exact: true }).click();
  await page.getByRole('button', { name: 'Услуги', exact: false }).click();
  await page.getByLabel('Цена, ₽').first().fill('2190');
  await page.getByRole('button', { name: 'Опубликовать' }).click();
  await expect(page.getByText('Изменения опубликованы. Сайт обновлён.')).toBeVisible();
  await page.getByRole('button', { name: 'Основное', exact: false }).click();
  await page.locator('input[type=file]').first().setInputFiles('public/images/hero.jpg');
  await expect(page.getByLabel('Фото главного экрана')).toHaveValue(/\/uploads\//);
  await page.getByRole('button', { name: 'Опубликовать' }).click();
  await expect(page.getByText('Изменения опубликованы. Сайт обновлён.')).toBeVisible();
  await page.goto('/');
  await expect(page.locator('.service-row').first()).toContainText('2 190 ₽');
  await expect(page.locator('.hero-image')).toHaveAttribute('src', /\/uploads\//);
});
test('stale editor cannot overwrite another edit', async ({ request }) => {
  const current = await (await request.get('/api/content')).json();
  expect(
    (
      await request.put('/api/admin/content', {
        headers,
        data: { ...current, brand: 'M96 edited' },
      })
    ).status(),
  ).toBe(200);
  expect((await request.put('/api/admin/content', { headers, data: current })).status()).toBe(409);
});
test('configured YCLIENTS link and consent-gated analytics', async ({ page, request }) => {
  const current = await (await request.get('/api/content')).json();
  await request.put('/api/admin/content', {
    headers,
    data: {
      ...current,
      settings: {
        ...current.settings,
        bookingUrl: 'https://n123.yclients.com/',
        metrikaId: '12345678',
      },
    },
  });
  let analyticsRequests = 0;
  await page.route('https://mc.yandex.ru/**', async (route) => {
    analyticsRequests++;
    await route.fulfill({ contentType: 'text/javascript', body: '/* mocked analytics */' });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Выбрать время', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Перейти к записи' })).toHaveAttribute(
    'href',
    'https://n123.yclients.com/',
  );
  await page.keyboard.press('Escape');
  expect(analyticsRequests).toBe(0);
  await page.getByRole('button', { name: 'Разрешить', exact: true }).click();
  await expect.poll(() => analyticsRequests).toBe(1);
  await page.getByRole('button', { name: 'Настройки аналитики' }).click();
  await page.getByRole('button', { name: 'Отклонить' }).click();
  await expect(page.getByRole('complementary', { name: 'Согласие на аналитику' })).toHaveCount(0);
});
