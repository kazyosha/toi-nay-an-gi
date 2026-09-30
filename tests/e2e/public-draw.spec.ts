import { expect, test } from '@playwright/test'

test('opens a food case and reveals a dish', async ({ page }) => {
  test.skip(!process.env.DATABASE_URL, 'Set DATABASE_URL and run the Prisma seed before the database-backed flow.')

  await page.goto('/')
  await expect(page.getByRole('heading', { name: /để chiếc hòm quyết định/i })).toBeVisible()

  const drawButton = page.getByRole('button', { name: /mở hòm/i })
  await expect(drawButton).toBeEnabled()
  await drawButton.click()

  await expect(page.getByText(/bạn nhận được/i)).toBeVisible({ timeout: 15_000 })
})
