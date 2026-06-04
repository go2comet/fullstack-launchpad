import { test, expect } from '@playwright/test'

// These tests require a seeded test user. Set credentials in env:
// PLAYWRIGHT_TEST_EMAIL / PLAYWRIGHT_TEST_PASSWORD
const TEST_EMAIL = process.env.PLAYWRIGHT_TEST_EMAIL ?? 'test@example.com'
const TEST_PASSWORD = process.env.PLAYWRIGHT_TEST_PASSWORD ?? 'testpassword123'

test.describe('Task management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill(TEST_EMAIL)
    await page.getByLabel(/password/i).fill(TEST_PASSWORD)
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })
  })

  test('tasks page renders the task form', async ({ page }) => {
    await page.goto('/dashboard/tasks')
    await expect(page.getByLabel(/new task/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /add task/i })).toBeVisible()
  })

  test('creates a task and it appears in the list', async ({ page }) => {
    await page.goto('/dashboard/tasks')
    const title = `E2E task ${Date.now()}`

    await page.getByLabel(/new task/i).fill(title)
    await page.getByRole('button', { name: /add task/i }).click()

    await expect(page.getByText(title)).toBeVisible({ timeout: 8_000 })
  })

  test('marks a task complete', async ({ page }) => {
    await page.goto('/dashboard/tasks')
    const title = `Complete me ${Date.now()}`

    await page.getByLabel(/new task/i).fill(title)
    await page.getByRole('button', { name: /add task/i }).click()
    await expect(page.getByText(title)).toBeVisible({ timeout: 8_000 })

    const taskItem = page.locator('li').filter({ hasText: title })
    await taskItem.getByRole('button', { name: /mark complete/i }).click()

    await expect(taskItem).toHaveCSS('opacity', /0\.[0-9]+/)
  })
})
