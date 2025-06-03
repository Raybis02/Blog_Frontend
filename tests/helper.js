const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByText('login').click();
};

const addBlog = async (page, title, author, url) => {
  await page.getByText('add blog').click();
  await page.getByTestId('title').fill(title);
  await page.getByTestId('author').fill(author);
  await page.getByTestId('url').fill(url);
  await page.getByRole('button', { name: 'create' }).click();
};

const likeBlog = async (blog, amount) => {
  await blog.getByText('expand').click();
  for (let i = 0; i < amount; i++) {
    const currentLikes = i;
    await blog.locator('.like').click();
    await blog
      .getByText(`Likes: ${currentLikes + 1}`)
      .waitFor({ timeout: 1000 });
  }
};

export { loginWith, addBlog, likeBlog };
