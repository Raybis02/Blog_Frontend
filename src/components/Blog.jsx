const Blog = ({ blog }) => {
  return (
    <li className="blog">
      Title: {blog.title} | Author: {blog.author} | likes: {blog.likes}
    </li>
  );
};

export default Blog;
