import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../component/navbar';

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await API.get(`/cart/${user.id}`);
      setCart(response.data);
    } catch (err) {
      console.error('Failed to fetch cart');
    }
    setLoading(false);
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await API.delete(`/cart/remove/${cartItemId}?userId=${user.id}`);
      setMessage('Item removed!');
      setTimeout(() => setMessage(''), 2000);
      fetchCart();
    } catch (err) {
      setMessage('Failed to remove item');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
        removeFromCart(cartItemId);
        return;
    }
    try {
        await API.put(`/cart/update/${cartItemId}?quantity=${newQuantity}`);
        fetchCart();
    } catch (err) {
        setMessage('Failed to update quantity');
        setTimeout(() => setMessage(''), 2000);
    }
  };

  const placeOrder = async () => {
    try {
      await API.post(`/orders/place/${user.id}`);
      setMessage('Order placed successfully!');
      setTimeout(() => {
        setMessage('');
        navigate('/orders');
      }, 2000);
      fetchCart();
    } catch (err) {
      setMessage('Failed to place order');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0).toFixed(2);
  };

  if (loading) return <div style={styles.loading}>Loading cart...</div>;

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Your Cart</h2>

        {message && <p style={styles.message}>{message}</p>}

        {!cart || cart.items.length === 0 ? (
          <div style={styles.empty}>
            <p>Your cart is empty.</p>
            <button style={styles.shopBtn} onClick={() => navigate('/products')}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div>
            {cart.items.map((item) => (
              <div key={item.id} style={styles.cartItem}>              
                <div style={styles.itemInfo}>
                <h3 style={styles.itemName}>{item.product.name}</h3>
                <p style={styles.itemPrice}>₹{item.product.price}</p>
                <div style={styles.quantityControl}>
                    <button
                    style={styles.qtyBtn}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                    -
                    </button>
                    <span style={styles.qtyNumber}>{item.quantity}</span>
                    <button
                    style={styles.qtyBtn}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                    +
                    </button>
                </div>
                <p style={styles.itemTotal}>
                    Subtotal: ₹{(item.product.price * item.quantity).toFixed(2)}
                </p>
                </div>
                <button
                style={styles.removeBtn}
                onClick={() => removeFromCart(item.id)}
                >
                Remove
                </button>
              </div>
            ))}

            <div style={styles.summary}>
              <h3 style={styles.total}>Total: ₹{calculateTotal()}</h3>
              <button style={styles.orderBtn} onClick={placeOrder}>
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '24px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    color: '#2c3e50',
    marginBottom: '24px',
  },
  cartItem: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  itemName: {
    margin: 0,
    color: '#2c3e50',
  },
  itemPrice: {
    margin: 0,
    color: '#27ae60',
    fontWeight: 'bold',
  },
  itemQuantity: {
    margin: 0,
    color: '#666',
    fontSize: '14px',
  },
  itemTotal: {
    margin: 0,
    color: '#2c3e50',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  removeBtn: {
    padding: '8px 16px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  summary: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '16px',
  },
  total: {
    margin: 0,
    color: '#2c3e50',
    fontSize: '20px',
  },
  orderBtn: {
    padding: '12px 24px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  shopBtn: {
    padding: '12px 24px',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '16px',
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    fontSize: '16px',
    marginTop: '60px',
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
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '4px 0',
  },
  qtyBtn: {
    width: '28px',
    height: '28px',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
   },
   qtyNumber: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2c3e50',
   },
};

export default Cart;