import { expect, test } from '@playwright/test';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

test('login, create an event, publish it, and see it in the dashboard', async ({
  page,
  request,
}) => {
  const email = `organizer+${Date.now()}@example.com`;
  const password = 'password123';
  const eventName = `Playwright Conference ${Date.now()}`;

  const registerResponse = await request.post(`${apiUrl}/auth/register`, {
    data: { name: 'Playwright Organizer', email, password },
  });
  expect(registerResponse.ok()).toBe(true);

  await page.goto('/login');
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto('/events/new');
  await page.getByLabel('Name').fill(eventName);

  const now = new Date();
  const start = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const end = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  const toDateTimeLocal = (date: Date) => date.toISOString().slice(0, 16);

  await page.getByLabel('Start date').fill(toDateTimeLocal(start));
  await page.getByLabel('End date').fill(toDateTimeLocal(end));
  await page.getByLabel('Capacity').fill('100');

  await page.getByRole('button', { name: 'Create event' }).click();

  await expect(page).toHaveURL(/\/events\/[^/]+$/);
  await expect(page.getByRole('heading', { name: eventName })).toBeVisible();

  await page.getByRole('button', { name: 'Publish' }).click();
  await expect(page.getByText('PUBLISHED')).toBeVisible();

  await page.goto('/dashboard');
  await expect(page.getByText(eventName, { exact: true })).toBeVisible();
});
