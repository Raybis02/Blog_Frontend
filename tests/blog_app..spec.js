const { test, expect } = require('@playwright/test');
const { loginWith } = require('./helper');
const { describe } = require('node:test');

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

  test('Login form is shown', async ({ page }) => {
    const loginformDiv = await page.locator('.LoginForm');
    await expect(loginformDiv).toBeVisible();
  });

  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      loginWith(page, 'Universe', 'steven');

      await expect(page.getByText('Logged in as Steven')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      loginWith(page, 'Universe', 'wrong');
      const errorDiv = await page.locator('.notification.error');
      await expect(errorDiv).toContainText(
        'Login unsuccessful: Wrong Username or Password',
      );
    });
  });

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      loginWith(page, 'Universe', 'steven');
    });

    test('a new blog can be created', async ({ page }) => {
      await page.getByText('add blog').click();
      await page.getByTestId('title').fill('test title');
      await page.getByTestId('author').fill('test author');
      await page.getByTestId('url').fill('test url');
      await page.getByText('create').click();

      const blogDiv = page.locator('.blogList');
      await expect(blogDiv).toContainText('test title');
    });
  });
});
