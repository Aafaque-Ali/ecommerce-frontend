import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../component/navbar';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await API.get('/products/all');
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch products');
    }
    setLoading(false);
  };

  const addToCart = async (productId) => {
    try {
      await API.post(`/cart/add?userId=${user.id}&productId=${productId}&quantity=1`);
      setMessage('Item added to cart!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Failed to add to cart');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  if (loading) return <div style={styles.loading}>Loading products...</div>;

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Products</h2>

        {message && <p style={styles.message}>{message}</p>}

        {products.length === 0 ? (
          <p style={styles.empty}>No products available.</p>
        ) : (
          <div style={styles.grid}>
            {products.map((product) => (
              <div key={product.id} style={styles.card}>
                <h3 style={styles.productName}>{product.name}</h3>
                <p style={styles.description}>{product.description}</p>
                <p style={styles.price}>₹{product.price}</p>
                <p style={styles.stock}>In Stock: {product.stock}</p>
                <button
                  style={styles.button}
                  onClick={() => addToCart(product.id)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    color: '#2c3e50',
    marginBottom: '24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  productName: {
    margin: 0,
    color: '#2c3e50',
    fontSize: '18px',
  },
  description: {
    color: '#666',
    fontSize: '14px',
    margin: 0,
  },
  price: {
    color: '#27ae60',
    fontWeight: 'bold',
    fontSize: '18px',
    margin: 0,
  },
  stock: {
    color: '#999',
    fontSize: '12px',
    margin: 0,
  },
  button: {
    padding: '10px',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '8px',
  },
  message: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '16px',
  },
  loading: {
    textAlign: 'center',
    marginTop: '100px',
    fontSize: '18px',
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    fontSize: '16px',
  },
};

export default Products;