const Blog = ({ blog }) => {
  return (
    <li className="blog">
      <em>Title</em>: <strong>{blog.title}</strong> | <em>Author:</em>{' '}
      <strong>{blog.author}</strong> | <em>Likes:</em>{' '}
      <strong>{blog.likes}</strong>
    </li>
  );
};

export default Blog;
