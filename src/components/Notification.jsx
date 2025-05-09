import '../index.css';

const Notification = ({ message, color }) => {
  if (message === null) {
    return null;
  }

  const notifClass = `notification ${color === 'green' ? 'success' : 'error'}`;

  return (
    <div className={notifClass}>
      <h3>{message}</h3>
    </div>
  );
};

export default Notification;
