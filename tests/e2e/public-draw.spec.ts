import { expect, test } from '@playwright/test'

test('opens a food case and reveals a dish', async ({ page }) => {
  test.skip(!process.env.DATABASE_URL, 'Set DATABASE_URL and run the Prisma seed before the database-backed flow.')

  const response = await page.request.post('/api/draw', { data: { categories: [] } })
  expect(response.ok()).toBeTruthy()
  const result = await response.json()
  expect(result.selectedDish.name).toBeTruthy()

  await page.goto('/')
  await expect(page.getByRole('heading', { name: /để chiếc hòm quyết định/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /mở hòm/i })).toBeEnabled()
})
