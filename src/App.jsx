import { useEffect, useState } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import blogService from './services/blogs';
import loginService from './services/login';
import Blog from './components/Blog';
import LoggedInfo from './components/LoggedInfo';
import CreateForm from './components/CreateForm';
import Notification from './components/Notification';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState(null);
  const [color, setColor] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const initialNotes = await blogService.getAll();
        setBlogs(initialNotes);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
      setMessage('Logged in succesfully');
      setColor('green');
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (exception) {
      console.log(exception);
      setMessage('Login unsuccessful: Wrong Username or Password');
      setColor('red');
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
    setMessage('Logged out succesfully');
    setColor('green');
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const handleBlog = async (event) => {
    event.preventDefault();
    const newBlog = {
      title: title,
      author: author,
      url: url,
    };
    try {
      const returnedBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(returnedBlog));
      setMessage(`Blog '${title}' from ${author} created succesfully`);
      setColor('green');
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      setAuthor('');
      setTitle('');
      setUrl('');
    } catch (error) {
      console.log(error);
      setMessage('All Fields need a Value');
      setColor('red');
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  if (!user) {
    return (
      <div className="login-page">
        <h2>Log in to access page</h2>
        <Notification message={message} color={color} />
        <div>
          <LoginForm
            username={username}
            setUsername={setUsername}
            handleLogin={handleLogin}
            password={password}
            setPassword={setPassword}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="logged-in">
      <div>
        <h1>Blogs</h1>
        <Notification message={message} color={color} />
        <LoggedInfo user={user} handleLogout={handleLogout} />
      </div>
      <div>
        <CreateForm
          blogHandler={handleBlog}
          title={title}
          author={author}
          url={url}
          setTitle={setTitle}
          setAuthor={setAuthor}
          setUrl={setUrl}
        />
      </div>
      <div>
        <ul>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
