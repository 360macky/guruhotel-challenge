import { test, expect } from '@playwright/test';

test('Check the user flow of a search', async ({ page }) => {
  await page.goto('https://yelp-next-app.vercel.app/');

  // Enter "Pizza" inside the input element with the placeholder "Search for restaurants, bars, coffee, and more"
  await page.fill('input[placeholder="Search for restaurants, bars, coffee, and more"]', 'Pizza');

  // Enter "New York" inside the input element with the placeholder "City"
  await page.fill('input[placeholder="City"]', 'New York');

  // Click the button element with the text "Search"
  await page.click('button:text("Search")');

  // Expect the page to have a div with the id of "search-results" after the click
  await expect(page.locator('#search-results')).toBeVisible();

});
