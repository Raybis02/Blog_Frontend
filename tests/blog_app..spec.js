const { test, expect } = require('@playwright/test');
const { loginWith, addBlog } = require('./helper');

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
      await loginWith(page, 'Universe', 'steven');

      await expect(page.getByText('Logged in as Steven')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'Universe', 'wrong');
      const errorDiv = await page.locator('.notification.error');
      await expect(errorDiv).toContainText(
        'Login unsuccessful: Wrong Username or Password',
      );
    });
  });

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, 'Universe', 'steven');
      await addBlog(page, 'test title', 'test author', 'test url');
    });

    test('a new blog can be created', async ({ page }) => {
      const blogsDiv = await page.locator('.blogList');
      await expect(blogsDiv).toContainText('test title');
    });

    test('a blog can be liked', async ({ page }) => {
      await page.getByText('expand').click();
      const blogDiv = await page.locator('.blog');
      await expect(blogDiv).toContainText('Likes: 0');
      await page.locator('.like').click();
      await expect(blogDiv).toContainText('Likes: 1');
    });

    test('a blog can be deleted', async ({ page }) => {
      page.on('dialog', async (dialog) => {
        expect(dialog.type()).toBe('confirm');
        expect(dialog.message()).toBe(
          'Delete blog "test title" by test author?',
        );
        await dialog.accept();
      });
      await page.getByText('expand').click();
      await page.getByText('delete').click();
      const blogsDiv = await page.locator('.blogList');
      await expect(blogsDiv).not.toContainText('test title');
    });

    test('delete button invisible for other user', async ({
      page,
      request,
    }) => {
      await request.post('/api/users', {
        data: {
          name: 'Levi',
          username: 'Levi',
          password: 'levi',
        },
      });
      await page.getByText('Logout').click();
      await loginWith(page, 'Levi', 'levi');
      await page.getByText('expand').click();
      const blogDiv = await page.locator('.blog');
      await expect(blogDiv).not.toContainText('delete');
    });
  });
});
