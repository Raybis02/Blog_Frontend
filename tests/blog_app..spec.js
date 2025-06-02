const { test, expect } = require('@playwright/test');
const { loginWith } = require('./helper');

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

  test.describe('Login', () => {
    test('successful login with correct credentials', async ({ page }) => {
      loginWith(page, 'Universe', 'steven');

      await expect(page.getByText('Logged in as Steven')).toBeVisible();
    });

    test('error on wrong credentials', async ({ page }) => {
      loginWith(page, 'Universe', 'wrong');
      const errorDiv = await page.locator('.notification.error');
      await expect(errorDiv).toContainText(
        'Login unsuccessful: Wrong Username or Password',
      );
    });
  });
});
