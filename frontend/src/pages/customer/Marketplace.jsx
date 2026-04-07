import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api, { BACKEND_URL } from '../../services/api';
import { addToCart } from '../../features/cart/cartSlice';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=80';

const getImageUrl = (images) => {
  if (!images || images.length === 0) return FALLBACK_IMG;
  const img = images[0];
  // If it's a relative /uploads/ path, prefix with backend URL
  if (img.startsWith('/')) return `${BACKEND_URL}${img}`;
  return img;
};

const Marketplace = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState({});

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    setAdded(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [product._id]: false })), 1500);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/marketplace/products');
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="flex-center" style={{ height: '100vh' }}>Loading Marketplace...</div>;

  return (
    <div className="container mt-8 animate-fade-in">
      <div className="flex-between mb-8">
        <h2>Fresh from the Farm 🌾</h2>
        <Link to="/cart" className="btn btn-primary">Go to Cart</Link>
      </div>
      
      <div className="grid-cols-1-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {products.map((product) => (
          <div key={product._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Product image */}
            <div style={{ height: '200px', overflow: 'hidden', position: 'relative', background: 'rgba(74,222,128,0.05)' }}>
              <img
                src={getImageUrl(product.images)}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={e => { e.currentTarget.src = FALLBACK_IMG; }}
              />
              {/* Category badge */}
              <span style={{
                position: 'absolute', top: 8, left: 8,
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                padding: '0.2rem 0.6rem', borderRadius: 20,
                fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase',
                color: '#4ade80', letterSpacing: '0.05em'
              }}>{product.category}</span>
            </div>
            <div className="p-4" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div className="flex-between mb-2">
                 <span className="text-muted" style={{ fontSize: '0.8rem' }}>By {product.farmer?.name || 'Local Farmer'}</span>
                 <span style={{ fontSize: '0.8rem', color: product.stockQuantity > 0 ? '#4ade80' : '#f87171' }}>
                   {product.stockQuantity > 0 ? `${product.stockQuantity} kg` : 'Out of stock'}
                 </span>
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>{product.title}</h3>
              <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1rem', flex: 1 }}>
                {product.description ? product.description.substring(0, 80) + (product.description.length > 80 ? '...' : '') : 'Fresh farm produce.'}
              </p>
              <div className="flex-between" style={{ gap: '0.5rem' }}>
                 <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#4ade80' }}>₹{product.price.toFixed(2)}</span>
                 <div style={{ display: 'flex', gap: '0.4rem' }}>
                   <button
                     onClick={() => handleAddToCart(product)}
                     disabled={product.stockQuantity <= 0}
                     style={{
                       padding: '0.35rem 0.75rem', fontSize: '0.78rem', borderRadius: 6, cursor: product.stockQuantity > 0 ? 'pointer' : 'not-allowed',
                       background: added[product._id] ? 'rgba(74,222,128,0.3)' : 'rgba(74,222,128,0.15)',
                       border: '1px solid rgba(74,222,128,0.4)', color: '#4ade80',
                       transition: 'all 0.2s', opacity: product.stockQuantity <= 0 ? 0.4 : 1,
                       whiteSpace: 'nowrap'
                     }}
                   >{added[product._id] ? '✓ Added' : '🛒 Add'}</button>
                   <Link to={`/marketplace/product/${product._id}`} className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>View</Link>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
