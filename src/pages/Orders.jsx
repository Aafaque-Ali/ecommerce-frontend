import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../component/navbar';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await API.get(`/orders/history/${user.id}`);
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch orders');
    }
    setLoading(false);
  };

  if (loading) return <div style={styles.loading}>Loading orders...</div>;

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Your Orders</h2>

        {orders.length === 0 ? (
          <div style={styles.empty}>
            <p>No orders yet.</p>
            <button
              style={styles.shopBtn}
              onClick={() => navigate('/products')}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div>
            {orders.map((order) => (
              <div key={order.id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <div>
                    <h3 style={styles.orderId}>Order #{order.id}</h3>
                    <p style={styles.orderDate}>
                      {new Date(order.orderDate).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div style={styles.orderRight}>
                    <span style={{
                      ...styles.status,
                      backgroundColor: order.status === 'PENDING' ? '#fff3cd' : '#d4edda',
                      color: order.status === 'PENDING' ? '#856404' : '#155724',
                    }}>
                      {order.status}
                    </span>
                    <p style={styles.orderTotal}>₹{order.totalAmount}</p>
                  </div>
                </div>

                <div style={styles.divider} />

                <div style={styles.itemsList}>
                  {order.items.map((item) => (
                    <div key={item.id} style={styles.orderItem}>
                      <span style={styles.itemName}>{item.product.name}</span>
                      <span style={styles.itemDetails}>
                        Qty: {item.quantity} × ₹{item.price}
                      </span>
                      <span style={styles.itemSubtotal}>
                        ₹{(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
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
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    color: '#2c3e50',
    marginBottom: '24px',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: {
    margin: 0,
    color: '#2c3e50',
    fontSize: '18px',
  },
  orderDate: {
    margin: '4px 0 0 0',
    color: '#666',
    fontSize: '13px',
  },
  orderRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '8px',
  },
  status: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  orderTotal: {
    margin: 0,
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#27ae60',
  },
  divider: {
    height: '1px',
    backgroundColor: '#eee',
    margin: '16px 0',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
  },
  itemName: {
    color: '#2c3e50',
    fontWeight: '500',
    flex: 2,
  },
  itemDetails: {
    color: '#666',
    flex: 2,
    textAlign: 'center',
  },
  itemSubtotal: {
    color: '#2c3e50',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    fontSize: '16px',
    marginTop: '60px',
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
  loading: {
    textAlign: 'center',
    marginTop: '100px',
    fontSize: '18px',
    color: '#666',
  },
};

export default Orders;