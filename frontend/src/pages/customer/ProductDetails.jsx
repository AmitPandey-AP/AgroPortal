import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import api from '../../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/marketplace/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    alert('Added to cart successfully!');
  };

  if (loading) return <div className="flex-center" style={{ height: '100vh' }}>Loading Details...</div>;
  if (!product) return <div className="flex-center" style={{ height: '100vh' }}>Product Not Found</div>;

  return (
    <div className="container mt-8 animate-fade-in">
       <button onClick={() => navigate(-1)} className="btn btn-outline mb-4">← Back to Marketplace</button>
       
       <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '3rem' }}>
          <div style={{ borderRadius: '12px', overflow: 'hidden', height: '400px', backgroundColor: 'var(--bg-secondary)', backgroundImage: `url(${product.images[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
             <span style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-color)' }}>{product.category}</span>
             <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {product.title}
             </h1>
             
             <p className="text-muted mb-8" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                {product.description}
             </p>
             
             <div className="flex-between mb-8 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                <div>
                   <span className="text-muted" style={{ display: 'block', fontSize: '0.85rem' }}>Price</span>
                   <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>${product.price.toFixed(2)}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <span className="text-muted" style={{ display: 'block', fontSize: '0.85rem' }}>Availability</span>
                   <span style={{ fontWeight: '500' }}>{product.stockQuantity > 0 ? `${product.stockQuantity} In Stock` : 'Out of Stock'}</span>
                </div>
             </div>
             
             <div className="flex-between" style={{ gap: '1rem' }}>
                <button onClick={handleAddToCart} className="btn btn-primary w-full" disabled={product.stockQuantity === 0} style={{ padding: '1rem' }}>
                   {product.stockQuantity > 0 ? 'Add to Cart 🛒' : 'Sold Out'}
                </button>
             </div>
             
             <div className="mt-8 pt-4" style={{ borderTop: '1px solid var(--glass-border)' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                   Grown proudly by <strong style={{ color: 'var(--text-light)' }}>{product.farmer?.name}</strong>
                </p>
             </div>
          </div>
       </div>
    </div>
  );
};

export default ProductDetails;
