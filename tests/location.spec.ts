import { test, expect } from '@playwright/test'

test('Check the user flow for the location test', async ({ page }) => {
  await page.goto('https://guruhotel-yelp-app.vercel.app/')

  // Check that there is a button with the text "Allow location access":
  await expect(
    page.locator('button:text("Allow location access")')
  ).toBeVisible()

  // After click the button check that the browsers asks for location access:
  await page.click('button:text("Allow location access")')

  // Grant location access to the browser:
  await page.context().grantPermissions(['geolocation'])
})
