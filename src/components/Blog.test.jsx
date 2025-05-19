import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import CreateForm from './CreateForm';

test('renders Blog title and author by default', () => {
  const blog = {
    title: 'test',
    author: 'me',
    url: 'url',
    likes: 2,
  };
  render(<Blog blog={blog} />);

  const title = screen.getByText('test');
  expect(title).toBeDefined();

  const author = screen.getByText('me');
  expect(author).toBeDefined();

  const url = screen.queryByText('url');
  expect(url).toBeNull();

  const likes = screen.queryByText('2');
  expect(likes).toBeNull();
});

test('renders likes and url after expanding view', async () => {
  const blog = {
    title: 'test',
    author: 'me',
    url: 'url',
    likes: 2,
    user: {
      username: 'username',
      name: 'name',
    },
  };

  render(<Blog blog={blog} />);

  const user = userEvent.setup();
  const button = screen.getByText('expand');
  await user.click(button);

  const title = screen.getByText('test');
  expect(title).toBeDefined();

  const author = screen.getByText('me');
  expect(author).toBeDefined();

  const url = screen.getByText('url');
  expect(url).toBeDefined();

  const likes = screen.getByText('2');
  expect(likes).toBeDefined();
});

test('pressing like twice calls event handler twice', async () => {
  const blog = {
    title: 'test',
    author: 'me',
    url: 'url',
    likes: 2,
    user: {
      username: 'username',
      name: 'name',
    },
  };

  const handleLike = vi.fn();

  render(<Blog blog={blog} handleLike={handleLike} />);

  const user = userEvent.setup();
  const button = screen.getByText('expand');
  await user.click(button);

  const like = screen.getByText('like');
  await user.click(like);
  await user.click(like);

  expect(handleLike.mock.calls).toHaveLength(2);
});

test('CreateForm', async () => {
  const user = userEvent.setup();
  const handleBlog = vi.fn();

  render(<CreateForm handleBlog={handleBlog} />);

  const button = screen.getByText('create');

  const titleInput = screen.getByPlaceholderText('title');
  const authorInput = screen.getByPlaceholderText('author');
  const urlInput = screen.getByPlaceholderText('url');

  await userEvent.type(titleInput, 'adding Title');
  await userEvent.type(authorInput, 'adding Author');
  await userEvent.type(urlInput, 'adding Url');

  await user.click(button);

  expect(handleBlog.mock.calls).toHaveLength(1);
  expect(handleBlog.mock.calls[0][0].title).toBe('adding Title');
  expect(handleBlog.mock.calls[0][0].author).toBe('adding Author');
  expect(handleBlog.mock.calls[0][0].url).toBe('adding Url');
});
