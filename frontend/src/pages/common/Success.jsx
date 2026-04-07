import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../features/cart/cartSlice';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Success = () => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState('processing'); // 'processing' | 'done' | 'error'
  const [orderRef, setOrderRef] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (!sessionId) {
      // Navigated here manually — nothing to do
      setStatus('done');
      return;
    }

    // Call backend to verify payment, create order, and decrement stock
    api.post('/marketplace/checkout/verify-session', { sessionId })
      .then(({ data }) => {
        const orderId = data.order?._id;
        setOrderRef(orderId ? `#${orderId.slice(-8).toUpperCase()}` : '');
        dispatch(clearCart());   // Only clear cart after confirmed payment
        setStatus('done');
      })
      .catch((err) => {
        console.error('Fulfillment error:', err.response?.data || err.message);
        setStatus('error');
      });
  }, [dispatch]);

  // Verify endpoint requires auth — if guest somehow lands here, skip fulfillment
  return (
    <div className="flex-center" style={{ minHeight: '100vh' }}>
      <div className="glass-panel text-center animate-fade-in" style={{ padding: '4rem 2.5rem', maxWidth: '520px', width: '90%' }}>

        {status === 'processing' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <h2 style={{ marginBottom: '0.5rem' }}>Confirming your payment...</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
              Please wait while we verify your order and update stock.
            </p>
            <div className="spinner" style={{ margin: '1.5rem auto 0' }}></div>
          </>
        )}

        {status === 'done' && (
          <>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
            <h1 style={{ color: '#4ade80', marginBottom: '0.5rem' }}>Payment Successful!</h1>
            {orderRef && (
              <div style={{
                display: 'inline-block', margin: '0.5rem 0 1rem',
                padding: '0.3rem 1rem', borderRadius: 20,
                background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)',
                color: '#4ade80', fontWeight: 600, fontSize: '0.9rem', fontFamily: 'monospace'
              }}>
                Order {orderRef}
              </div>
            )}
            <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Your order has been confirmed and stock has been updated. 
              You can track your purchase in My Orders.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/customer/orders" className="btn btn-primary">📋 View My Orders</Link>
              <Link to="/marketplace" className="btn btn-outline">🛒 Continue Shopping</Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ marginBottom: '0.5rem', color: '#fca5a5' }}>Order Confirmation Failed</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>
              Your payment went through but we couldn't confirm the order automatically.
              Please contact support with your Stripe session ID.
            </p>
            <Link to="/contact" className="btn btn-primary">📩 Contact Support</Link>
          </>
        )}

      </div>
    </div>
  );
};

export default Success;
