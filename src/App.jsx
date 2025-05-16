import { useEffect, useState, useRef } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import blogService from './services/blogs';
import loginService from './services/login';
import Blog from './components/Blog';
import LoggedInfo from './components/LoggedInfo';
import CreateForm from './components/CreateForm';
import Notification from './components/Notification';
import Toggle from './components/Toggle';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState(null);
  const [color, setColor] = useState(null);

  const blogFormRef = useRef();

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
        const initialBlogs = await blogService.getAll();
        const sortedBlogs = initialBlogs.sort((a, b) => b.likes - a.likes);
        setBlogs(sortedBlogs);
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

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));
      setMessage(
        `Blog '${blogObject.title}' from ${blogObject.author} created succesfully`,
      );
      setColor('green');
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (error) {
      console.log(error);
      setMessage('All Fields need a Value');
      setColor('red');
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleLike = async (blogObject) => {
    try {
      await blogService.send(blogObject);
      const initialBlogs = await blogService.getAll();
      const sortedBlogs = initialBlogs.sort((a, b) => b.likes - a.likes);
      setBlogs(sortedBlogs);
      setMessage('Like succesful');
      setColor('green');
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (error) {
      console.log(error);
      setMessage('Like unsuccesful');
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
        <Toggle buttonLabel="add Blog" ref={blogFormRef}>
          <CreateForm handleBlog={addBlog} />
        </Toggle>
      </div>
      <div>
        <ul>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} handleLike={handleLike} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
