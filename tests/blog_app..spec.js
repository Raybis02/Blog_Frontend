const { test, expect } = require('@playwright/test');

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await request.post('/api/users', {
      data: {
        name: 'Steven',
        username: 'Universe',
        password: 'steven',
      },
    });
    await page.goto('/');
  });

  test('Loginform is shown', async ({ page }) => {
    const loginformDiv = await page.locator('.LoginForm');
    await expect(loginformDiv).toBeVisible();
  });
});
