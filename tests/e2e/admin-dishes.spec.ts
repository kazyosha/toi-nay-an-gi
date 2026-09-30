import { expect, test } from '@playwright/test'

test('admin can sign in and open the dish form', async ({ page }) => {
  test.skip(!process.env.ADMIN_PASSWORD, 'Set ADMIN_PASSWORD for the authenticated E2E flow.')

  await page.goto('/admin')
  await page.getByLabel('Mật khẩu quản trị').fill(process.env.ADMIN_PASSWORD ?? '')
  await page.getByRole('button', { name: /đăng nhập/i }).click()

  await expect(page).toHaveURL(/\/admin$/)
  await page.getByRole('link', { name: /mở danh sách món/i }).click()
  await page.getByRole('link', { name: /thêm món/i }).click()
  await expect(page.getByRole('heading', { name: /thêm món$/i })).toBeVisible()
  await expect(page.getByLabel('Tên món')).toBeVisible()
})
