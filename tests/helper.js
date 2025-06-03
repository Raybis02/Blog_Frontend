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
  await page.getByText('create').click();
};

export { loginWith, addBlog };
