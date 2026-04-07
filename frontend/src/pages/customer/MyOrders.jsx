import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { BACKEND_URL } from '../../services/api';

const STATUS_STYLES = {
  completed: { bg: 'rgba(74,222,128,0.15)', border: 'rgba(74,222,128,0.3)', color: '#4ade80', label: '✅ Completed' },
  pending:   { bg: 'rgba(251,191,36,0.15)',  border: 'rgba(251,191,36,0.3)',  color: '#fbbf24', label: '⏳ Pending' },
  failed:    { bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.3)',   color: '#f87171', label: '❌ Failed' },
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/marketplace/orders/my-orders')
      .then(r => setOrders(r.data))
      .catch(() => setError('Could not load your orders. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => setExpanded(prev => prev === id ? null : id);

  return (
    <div className="container mt-8 animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.25rem' }}>📋 My Orders</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
          Your complete purchase history from the AgroPortal marketplace.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '1rem 1.25rem', color: '#fca5a5', marginBottom: '1.5rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="page-loading"><div className="spinner"></div><p>Loading orders...</p></div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
          <h3 style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '0.5rem' }}>No orders yet</h3>
          <p style={{ color: 'rgba(255,255,255,0.35)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            You haven't placed any orders. Browse the marketplace to get started!
          </p>
          <Link to="/marketplace" className="btn btn-primary">🛒 Shop Now</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Summary strip */}
          <div style={{
            display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center',
            padding: '0.75rem 1.25rem', borderRadius: 10,
            background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)',
            fontSize: '0.85rem', marginBottom: '0.5rem'
          }}>
            <span>🧾 <strong style={{ color: '#fff' }}>{orders.length}</strong> <span style={{ color: 'rgba(255,255,255,0.45)' }}>total orders</span></span>
            <span>✅ <strong style={{ color: '#4ade80' }}>{orders.filter(o => o.paymentDetails?.status === 'completed').length}</strong> <span style={{ color: 'rgba(255,255,255,0.45)' }}>completed</span></span>
            <span>💰 <strong style={{ color: '#fbbf24' }}>₹{orders.reduce((s, o) => s + (o.totalAmount || 0), 0).toFixed(2)}</strong> <span style={{ color: 'rgba(255,255,255,0.45)' }}>total spent</span></span>
          </div>

          {orders.map((order, idx) => {
            const status = order.paymentDetails?.status || 'pending';
            const st = STATUS_STYLES[status] || STATUS_STYLES.pending;
            const isOpen = expanded === order._id;
            const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

            return (
              <div
                key={order._id}
                className="glass-panel animate-fade-in"
                style={{ padding: 0, overflow: 'hidden', animationDelay: `${idx * 0.05}s` }}
              >
                {/* Order header row — click to expand */}
                <button
                  onClick={() => toggle(order._id)}
                  style={{
                    width: '100%', textAlign: 'left', background: 'transparent', border: 'none',
                    cursor: 'pointer', padding: '1rem 1.25rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    {/* Status badge */}
                    <span style={{
                      padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600,
                      background: st.bg, border: `1px solid ${st.border}`, color: st.color, whiteSpace: 'nowrap'
                    }}>{st.label}</span>

                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.1rem' }}>Order ID</div>
                      <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.7)' }}>#{order._id.slice(-8).toUpperCase()}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.1rem' }}>Date</div>
                      <div style={{ fontSize: '0.85rem' }}>{date}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.1rem' }}>Items</div>
                      <div style={{ fontSize: '0.85rem' }}>{order.orderItems?.length || 0} item{order.orderItems?.length !== 1 ? 's' : ''}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Total</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4ade80' }}>₹{(order.totalAmount || 0).toFixed(2)}</div>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
                  </div>
                </button>

                {/* Expandable order details */}
                {isOpen && (
                  <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {(order.orderItems || []).map((item, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '0.6rem 0.75rem', borderRadius: 8,
                          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '1.4rem' }}>🌾</span>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.title || 'Crop Product'}</div>
                              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Qty: {item.quantity}</div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>₹{item.priceAtPurchase?.toFixed(2)} × {item.quantity}</div>
                            <div style={{ fontWeight: 600, color: '#fbbf24' }}>₹{((item.priceAtPurchase || 0) * item.quantity).toFixed(2)}</div>
                          </div>
                        </div>
                      ))}

                      {/* Footer */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                          Stripe Session: {order.paymentDetails?.stripeSessionId ? order.paymentDetails.stripeSessionId.slice(0, 20) + '...' : 'N/A'}
                        </div>
                        <div style={{ fontWeight: 700, color: '#4ade80' }}>Total: ₹{(order.totalAmount || 0).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/marketplace" className="btn btn-outline">🛒 Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
