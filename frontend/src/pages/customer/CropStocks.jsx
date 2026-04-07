import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api, { BACKEND_URL } from '../../services/api';
import { addToCart } from '../../features/cart/cartSlice';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=80';

const getImageUrl = (images) => {
  if (!images || images.length === 0) return FALLBACK_IMG;
  const img = images[0];
  return img.startsWith('/') ? `${BACKEND_URL}${img}` : img;
};

const CATEGORIES = ['All', 'Grains', 'Pulses', 'Vegetables', 'Fruits', 'Spices', 'Cash Crops', 'Equipment', 'Other'];

const CropStocks = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
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
        setError('Could not load crop stocks. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products
    .filter(p => category === 'All' || p.category === category)
    .filter(p =>
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.farmer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'stock-high') return b.stockQuantity - a.stockQuantity;
      return new Date(b.createdAt) - new Date(a.createdAt); // newest first
    });

  const available = products.filter(p => p.stockQuantity > 0).length;

  return (
    <div className="container mt-8 animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.25rem' }}>📦 Crop Stock Inventory</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Browse all available crop listings from local farmers.
        </p>

        {/* Stats bar */}
        {!loading && !error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap',
            padding: '0.75rem 1.25rem', marginBottom: '1.25rem',
            background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.15)',
            borderRadius: 10, fontSize: '0.85rem'
          }}>
            <span>📋 <strong style={{ color: '#fff' }}>{products.length}</strong> <span style={{ color: 'rgba(255,255,255,0.5)' }}>total listings</span></span>
            <span>✅ <strong style={{ color: '#4ade80' }}>{available}</strong> <span style={{ color: 'rgba(255,255,255,0.5)' }}>in stock</span></span>
            <span>🔍 <strong style={{ color: '#fff' }}>{filtered.length}</strong> <span style={{ color: 'rgba(255,255,255,0.5)' }}>shown</span></span>
          </div>
        )}

        {/* Controls row */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 200 }}>
            <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>🔍</span>
            <input
              type="text"
              className="form-control"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search crops or farmers..."
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Category filter */}
          <select
            className="form-control"
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ flex: '0 0 150px' }}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Sort */}
          <select
            className="form-control"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ flex: '0 0 160px' }}
          >
            <option value="newest">🕐 Newest First</option>
            <option value="price-low">💰 Price: Low → High</option>
            <option value="price-high">💰 Price: High → Low</option>
            <option value="stock-high">📦 Most Stock</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem', color: '#fca5a5' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="page-loading"><div className="spinner"></div><p>Loading stocks...</p></div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📦</div>
          <h3 style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>No listings found</h3>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>
            {search || category !== 'All' ? 'Try adjusting your filters.' : 'Farmers haven\'t listed any crops yet.'}
          </p>
          {(search || category !== 'All') && (
            <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={() => { setSearch(''); setCategory('All'); }}>
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {filtered.map((product, i) => (
            <div
              key={product._id}
              className="glass-card animate-fade-in"
              style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', animationDelay: `${i * 0.04}s`, transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              {/* Image */}
              <div style={{ height: 160, overflow: 'hidden', position: 'relative', background: 'rgba(74,222,128,0.05)' }}>
                <img
                  src={getImageUrl(product.images)}
                  alt={product.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.currentTarget.src = FALLBACK_IMG; }}
                />
                {/* Category badge */}
                <span style={{
                  position: 'absolute', top: 8, left: 8,
                  background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
                  padding: '0.2rem 0.6rem', borderRadius: 20,
                  fontSize: '0.7rem', fontWeight: 600, color: '#4ade80', textTransform: 'uppercase'
                }}>{product.category}</span>
                {/* Stock badge */}
                <span style={{
                  position: 'absolute', top: 8, right: 8,
                  background: product.stockQuantity > 0 ? 'rgba(74,222,128,0.85)' : 'rgba(239,68,68,0.85)',
                  padding: '0.2rem 0.6rem', borderRadius: 20,
                  fontSize: '0.7rem', fontWeight: 700, color: '#000'
                }}>
                  {product.stockQuantity > 0 ? `${product.stockQuantity} kg` : 'Out of Stock'}
                </span>
              </div>

              {/* Content */}
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem', fontWeight: 600 }}>{product.title}</h4>
                <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>
                  By {product.farmer?.name || 'Local Farmer'}
                </p>
                {product.description && (
                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', flex: 1,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description}
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.07)', gap: '0.4rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4ade80', whiteSpace: 'nowrap' }}>₹{product.price?.toFixed(2)}<span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>/kg</span></span>
                  <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stockQuantity <= 0}
                      style={{
                        padding: '0.35rem 0.7rem', fontSize: '0.75rem', borderRadius: 6,
                        cursor: product.stockQuantity > 0 ? 'pointer' : 'not-allowed',
                        background: added[product._id] ? 'rgba(74,222,128,0.3)' : 'rgba(74,222,128,0.12)',
                        border: '1px solid rgba(74,222,128,0.35)', color: '#4ade80',
                        transition: 'all 0.2s', opacity: product.stockQuantity <= 0 ? 0.4 : 1,
                        whiteSpace: 'nowrap'
                      }}
                    >{added[product._id] ? '✓ Added' : '🛒 Add'}</button>
                    <Link
                      to={`/marketplace/product/${product._id}`}
                      className="btn btn-outline"
                      style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem' }}
                    >View →</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CropStocks;
