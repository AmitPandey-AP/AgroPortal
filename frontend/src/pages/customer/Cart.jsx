import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../../features/cart/cartSlice';
import api, { BACKEND_URL } from '../../services/api';

const Cart = () => {
  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleCheckout = async () => {
    try {
      const { data } = await api.post('/marketplace/checkout/create-session', { cartItems });

      // Modern Stripe approach: redirect directly to the Checkout URL
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Checkout session created but no URL was returned. Check your Stripe keys.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      alert('Checkout error: ' + msg);
    }
  };

  return (
    <div className="container mt-8 animate-fade-in">
      <h1 className="mb-8">Your Cart</h1>
      
      {cartItems.length === 0 ? (
         <div className="glass-panel text-center p-8">
            <h2 className="text-muted mb-4">Your cart is completely empty.</h2>
            <button onClick={() => window.history.back()} className="btn btn-primary">Return to Store</button>
         </div>
      ) : (
         <div className="grid-cols-1-2" style={{ gridTemplateColumns: 'minmax(400px, 2fr) minmax(300px, 1fr)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {cartItems.map((item) => (
                  <div key={item._id} className="glass-card flex-between p-4" style={{ alignItems: 'flex-start' }}>
                     <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        {/* Product image */}
                        {item.images?.[0] ? (
                          <img
                            src={item.images[0].startsWith('/') ? `${BACKEND_URL}${item.images[0]}` : item.images[0]}
                            alt={item.title}
                            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                            onError={e => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <div style={{ width: 80, height: 80, borderRadius: 8, background: 'rgba(74,222,128,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>🌾</div>
                        )}
                        <div>
                           <h4 style={{ marginBottom: '0.25rem' }}>{item.title}</h4>
                           <p className="text-muted text-sm">{item.category}</p>
                           <p style={{ marginTop: '0.4rem', fontWeight: 700, color: '#4ade80' }}>₹{item.price.toFixed(2)} <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>× {item.quantity}</span></p>
                        </div>
                     </div>
                     <button
                       onClick={() => dispatch(removeFromCart(item._id))}
                       style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '0.3rem 0.75rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', flexShrink: 0 }}
                     >✕ Remove</button>
                  </div>
               ))}
            </div>
            
            <div className="glass-panel" style={{ height: 'fit-content' }}>
               <h3 className="mb-4">Order Summary</h3>
               <div className="flex-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
               </div>
               <div className="flex-between mb-4 pb-4" style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <span className="text-muted">Platform Fee</span>
                  <span>₹0.00</span>
               </div>
               <div className="flex-between mb-8">
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Total</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4ade80' }}>₹{totalAmount.toFixed(2)}</span>
               </div>
               
               <button onClick={handleCheckout} className="btn btn-primary w-full shadow-lg">
                  Proceed to Checkout
               </button>
               
               <button onClick={() => dispatch(clearCart())} className="btn btn-outline w-full mt-4 hover:border-danger hover:text-danger">
                  Clear Cart
               </button>
            </div>
         </div>
      )}
    </div>
  );
};

export default Cart;
