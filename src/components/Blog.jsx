import { useState } from 'react';

const Blog = ({ blog, handleLike }) => {
  const [view, setView] = useState(false);

  const addLike = (event) => {
    event.preventDefault();
    handleLike({
      user: blog.user.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      id: blog.id,
    });
  };

  if (!view) {
    return (
      <div className="blog">
        <li>
          <strong>{blog.title}</strong>
          <button className="view" onClick={() => setView(true)}>
            expand
          </button>
        </li>
        <hr />
      </div>
    );
  }

  if (view) {
    return (
      <div className="blog">
        <li>
          <ul className="expand">
            <li>
              <em>Title</em>: <strong>{blog.title}</strong>
            </li>
            <li>
              <em>url:</em> <strong>{blog.url}</strong>
            </li>
            <li>
              <em>Author:</em> <strong>{blog.author}</strong>
            </li>
            <li>
              <form onSubmit={addLike}>
                <em>Likes:</em> <strong>{blog.likes}</strong>{' '}
                <button className="like" type="submit">
                  like
                </button>
              </form>
            </li>
          </ul>
          <button className="hide" onClick={() => setView(false)}>
            hide
          </button>
        </li>
        <hr />
      </div>
    );
  }
};

export default Blog;
