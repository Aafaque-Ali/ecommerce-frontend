import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={styles.navbar}>
      <h2 style={styles.logo} onClick={() => navigate('/products')}>
        🛒 ShopEase
      </h2>
      <div style={styles.navLinks}>
        {user && (
          <>
            <span style={styles.welcome}>Hi, {user.name}</span>
            <button style={styles.cartBtn} onClick={() => navigate('/cart')}>
              Cart
            </button>
            <button style={styles.cartBtn} onClick={() => navigate('/orders')}>
              Orders
            </button>
            <button style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#2c3e50',
    color: 'white',
  },
  logo: {
    margin: 0,
    cursor: 'pointer',
    color: 'white',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  welcome: {
    color: '#ecf0f1',
    fontSize: '14px',
  },
  cartBtn: {
    padding: '8px 16px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default Navbar;