import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('/demo-site/');

  await page.getByRole('searchbox', { name: 'Search for:' }).fill('cap');
  await page.getByRole('searchbox', { name: 'Search for:' }).press('Enter');

  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.locator('#content').getByRole('link', { name: 'View cart ' }).click();

  await page.getByLabel('Remove this item').click();
  await page.getByRole('link', { name: 'Return to shop' }).click();

  await page.locator('#menu-item-42').getByRole('link', { name: 'Home' }).click();
});

//Chat GPT/Windows CoPilot
test('check if "I\'m Feeling Lucky" button is on Google home page', async ({ page }) => {
  await page.goto('https://www.google.com');
  
  // Accept cookies
  const acceptCookiesButton = page.locator('text=Agree');
  if (await acceptCookiesButton.isVisible()) {
    await acceptCookiesButton.click();
  }
  
  // Check for the "I'm Feeling Lucky" button
  const luckyButton = page.locator('input[value="I\'m Feeling Lucky"]');
  await expect(luckyButton).toBeVisible();
});




test('check for apple image', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/basicHtml.html');
  await expect(page.locator('img[src*="apple.jpg"]')).toBeVisible(); //This fails because there are 3 images
  
});
