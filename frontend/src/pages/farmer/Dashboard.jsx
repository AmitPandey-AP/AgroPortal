import { useState, useEffect } from 'react';
import api, { BACKEND_URL } from '../../services/api';

const CATEGORIES = ['Grains', 'Pulses', 'Vegetables', 'Fruits', 'Spices', 'Cash Crops', 'Equipment', 'Other'];

const Dashboard = () => {
  const [stats, setStats] = useState({ totalProducts: 0, totalSales: 0, totalRevenue: 0 });
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: '', description: '', price: '', stockQuantity: '', category: 'Grains'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, productsRes] = await Promise.all([
        api.get('/farmer/dashboard-stats'),
        api.get('/farmer/products'),
      ]);
      setStats(statsRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const onChange = (e) => setNewProduct({ ...newProduct, [e.target.name]: e.target.value });

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const onSubmitProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Always use FormData so multer on the backend handles it consistently
      const formData = new FormData();
      formData.append('title',         newProduct.title);
      formData.append('description',   newProduct.description);
      formData.append('price',         newProduct.price);          // sent as string, backend parses with Number()
      formData.append('stockQuantity', newProduct.stockQuantity);  // same
      formData.append('category',      newProduct.category);
      if (imageFile) formData.append('image', imageFile);

      await api.post('/farmer/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setNewProduct({ title: '', description: '', price: '', stockQuantity: '', category: 'Grains' });
      setImageFile(null);
      setImagePreview(null);
      setSuccessMsg('✅ Product listed successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchDashboardData();
    } catch (err) {
      alert('Error adding product: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const onDeleteProduct = async (id) => {
    if (!window.confirm('Remove this listing?')) return;
    try {
      await api.delete(`/farmer/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div><p>Loading Dashboard...</p></div>;

  return (
    <div className="container mt-8 animate-fade-in">
      <h2 style={{ marginBottom: '0.5rem' }}>👨‍🌾 Farmer Dashboard</h2>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>Manage your crop listings and track performance.</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
        {[
          { label: 'Products Listed', value: stats.totalProducts, icon: '📦', color: '#4ade80' },
          { label: 'Total Items Sold', value: stats.totalSales, icon: '🛒', color: '#60a5fa' },
          { label: 'Total Revenue', value: `₹${stats.totalRevenue.toFixed(2)}`, icon: '💰', color: '#fbbf24' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Add Product Form */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>➕ List New Crop</h3>

          {successMsg && (
            <div style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem', color: '#4ade80', fontSize: '0.9rem' }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={onSubmitProduct}>
            <div className="form-group">
              <label className="form-label">Crop / Product Title *</label>
              <input type="text" className="form-control" name="title" value={newProduct.title} onChange={onChange} placeholder="e.g. Premium Basmati Rice" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Price (₹/kg) *</label>
                <input type="number" step="0.01" min="0" className="form-control" name="price" value={newProduct.price} onChange={onChange} placeholder="e.g. 45" required />
              </div>
              <div className="form-group">
                <label className="form-label">Stock (kg) *</label>
                <input type="number" min="0" className="form-control" name="stockQuantity" value={newProduct.stockQuantity} onChange={onChange} placeholder="e.g. 500" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-control" name="category" value={newProduct.category} onChange={onChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows="2" name="description" value={newProduct.description} onChange={onChange} placeholder="Describe your product quality, harvest date, etc." />
            </div>

            {/* Image upload */}
            <div className="form-group">
              <label className="form-label">Product Photo (optional)</label>
              <label style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)',
                border: '2px dashed rgba(74,222,128,0.3)', borderRadius: 8,
                cursor: 'pointer', transition: 'all 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(74,222,128,0.6)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(74,222,128,0.3)'}
              >
                <span style={{ fontSize: '1.5rem' }}>📸</span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
                  {imageFile ? imageFile.name : 'Click to upload image (JPG/PNG/WEBP)'}
                </span>
                <input type="file" accept="image/*" onChange={onImageChange} style={{ display: 'none' }} />
              </label>

              {imagePreview && (
                <div style={{ marginTop: '0.75rem', position: 'relative', display: 'inline-block' }}>
                  <img src={imagePreview} alt="preview" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 8 }} />
                  <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} style={{
                    position: 'absolute', top: 6, right: 6,
                    background: 'rgba(239,68,68,0.85)', border: 'none', borderRadius: '50%',
                    width: 24, height: 24, color: '#fff', cursor: 'pointer', fontSize: '0.8rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>✕</button>
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
              {submitting ? '⏳ Listing...' : '🌾 List Crop'}
            </button>
          </form>
        </div>

        {/* Active Listings */}
        <div>
          <h3 style={{ marginBottom: '1rem' }}>📋 Your Active Listings ({products.length})</h3>
          {products.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🌾</div>
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>No crops listed yet. Add your first listing!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {products.map(product => (
                <div key={product._id} className="glass-card" style={{ padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  {/* thumb */}
                  {product.images?.[0] ? (
                    <img src={`${BACKEND_URL}${product.images[0]}`} alt={product.title} style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 52, height: 52, borderRadius: 8, background: 'rgba(74,222,128,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>🌾</div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.title}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{product.category} • {product.stockQuantity} kg</div>
                  </div>
                  <div style={{ color: '#4ade80', fontWeight: 700, fontSize: '1rem', whiteSpace: 'nowrap' }}>₹{product.price?.toFixed(2)}</div>
                  <button
                    onClick={() => onDeleteProduct(product._id)}
                    style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '0.3rem 0.6rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', flexShrink: 0 }}
                  >🗑</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
