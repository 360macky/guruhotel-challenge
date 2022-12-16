import { test, expect } from '@playwright/test';

test('Check visible elements in a result page', async ({ page }) => {

  // Go to the result page of "Burger King" in "New York"
  await page.goto('https://yelp-next-app.vercel.app/results/QDRMxE9anxw6hvva4r-ZTw');

  // Expect the page to have a h1 title with the text "Burger King"
  await expect(page.locator('h1:text("Burger King")')).toBeVisible();

  // Expect the page to have an a elemnt with the text "Call (212) 566-5132"
  await expect(page.locator('a:text("Call (212) 566-5132")')).toBeVisible();

  // Expect the page to have an a element with the text "Open in Google Maps"
  await expect(page.locator('a:text("Open in Google Maps")')).toBeVisible();

});
