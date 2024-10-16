import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/demo-site/');

  await page.getByRole('searchbox', { name: 'Search for:' }).fill('cap');
  await page.getByRole('searchbox', { name: 'Search for:' }).press('Enter');

  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.locator('#content').getByRole('link', { name: 'View cart ' }).click();

  await page.getByLabel('Remove this item').click();
  await page.getByRole('link', { name: 'Return to shop' }).click();

  await page.locator('#menu-item-42').getByRole('link', { name: 'Home' }).click();
});

