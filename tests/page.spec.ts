import { test, expect } from '@playwright/test'

test('Check basic elements of the index page', async ({ page }) => {
  await page.goto('https://yelp-next-app.vercel.app/')

  // Expect a title to contain the text "Yelp Next App - GuruHotel Challenge"
  await expect(page).toHaveTitle('Yelp Next App - GuruHotel Challenge')

  // Expect the navbar to contain Yelp Next App
  await expect(page.locator('text="Yelp Next App"')).toBeVisible()

  // Expect the page to have a button element with the text "Search"
  await expect(page.locator('button:text("Search")')).toBeVisible()
})
