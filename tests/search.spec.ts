import { test, expect } from '@playwright/test'

test('Check the searchbar flow', async ({ page }) => {
  await page.goto('https://guruhotel-yelp-app.vercel.app/')

  // Click on Search button without entering text
  await page.click('button:text("Search")')

  // Check that input of type search is focused because not text was entered
  await expect(page.locator('input[type="search"]')).toBeFocused()

  // Enter "Pizza" inside the input element with the placeholder "Search for restaurants and more"
  await page.fill(
    'input[placeholder="Search for restaurants and more"]',
    'Pizza'
  )

  // Click the button element with the text "Search" without entering city
  await page.click('button:text("Search")')

  // Check that an alert error window is shown
  page.on('dialog', async (dialog) => {
    // Verify message of alert
    expect(dialog.message()).toContain(`You can't search without location`)

    // Click on alert ok button
    await dialog.accept()
  })
})
