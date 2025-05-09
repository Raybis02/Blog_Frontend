const LoggedInfo = ({ user, handleLogout }) => {
  return (
    <div>
      <p>Logged in as {user.name}</p>
      <div className="but">
        <form onSubmit={handleLogout}>
          <button type="submit">Logout</button>
        </form>
      </div>
    </div>
  );
};

export default LoggedInfo;
