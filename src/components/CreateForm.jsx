import { useState } from 'react';

const CreateForm = ({ handleBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = (event) => {
    event.preventDefault();
    handleBlog({
      title: title,
      author: author,
      url: url,
    });
    setAuthor('');
    setTitle('');
    setUrl('');
  };

  return (
    <div className="CreateForm">
      <h2>add new a blog:</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            placeholder="title"
            value={title}
            title="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            placeholder="author"
            value={author}
            title="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            placeholder="url"
            value={url}
            title="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default CreateForm;
