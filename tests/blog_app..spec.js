const { test, expect } = require('@playwright/test');
const { loginWith, addBlog, likeBlog } = require('./helper');

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
      await addBlog(page, 'title1', 'author1', 'url1');
    });

    test('a new blog can be created', async ({ page }) => {
      await addBlog(page, 'title2', 'author2', 'url2');
      const blogsDiv = await page.locator('.blogList');
      await expect(blogsDiv).toContainText('title2');
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
        expect(dialog.message()).toBe('Delete blog "title1" by author1?');
        await dialog.accept();
      });
      await page.getByText('expand').click();
      await page.getByText('delete').click();
      const blogsDiv = await page.locator('.blogList');
      await expect(blogsDiv).not.toContainText('title1');
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

    test('blogs ordered by likes', async ({ page }) => {
      await addBlog(page, 'title2', 'author2', 'url2');
      await addBlog(page, 'title3', 'author3', 'url3');
      const blog1 = await page.locator('.blog', { hasText: 'title1' });
      const blog2 = await page.locator('.blog', { hasText: 'title2' });
      const blog3 = await page.locator('.blog', { hasText: 'title3' });
      await likeBlog(blog2, 1);
      await likeBlog(blog3, 2);
      await blog1.getByRole('button', { name: 'expand' }).click();

      const blogList = await page.locator('.blog').all();
      const likeCountFirstElement = await blogList[0]
        .getByTestId('likeCount')
        .innerText();

      const likeCountSecondElement = await blogList[1]
        .getByTestId('likeCount')
        .innerText();

      const likeCountThirdElement = await blogList[2]
        .getByTestId('likeCount')
        .innerText();

      await expect(parseInt(likeCountFirstElement)).toBeGreaterThan(
        parseInt(likeCountSecondElement),
      );
      await expect(parseInt(likeCountSecondElement)).toBeGreaterThan(
        parseInt(likeCountThirdElement),
      );
    });
  });
});
