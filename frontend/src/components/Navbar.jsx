import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import './Navbar.css';

const DropdownMenu = ({ label, icon, items }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="nav-dropdown" ref={ref}>
      <button className="nav-link nav-dropdown-btn" onClick={() => setOpen(!open)}>
        <span className={`nav-icon ${icon}`}></span>
        {label} <span className="dropdown-arrow">▾</span>
      </button>
      {open && (
        <div className="dropdown-panel animate-fade-in">
          {items.map(item => (
            <Link key={item.to} to={item.to} className="dropdown-item" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const cartCount = useSelector(state => state.cart?.cartItems?.length || 0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const farmerDropdowns = [
    {
      label: 'Prediction', icon: 'icon-magic',
      items: [
        { to: '/farmer/prediction/crop', label: '🌾 Crop Prediction' },
        { to: '/farmer/prediction/yield', label: '📊 Yield Prediction' },
        { to: '/farmer/prediction/rainfall', label: '🌧 Rainfall Prediction' },
      ]
    },
    {
      label: 'Recommendation', icon: 'icon-gavel',
      items: [
        { to: '/farmer/recommendation/crop', label: '🌱 Crop Recommendation' },
        { to: '/farmer/recommendation/fertilizer', label: '🧪 Fertilizer Recommendation' },
      ]
    },
    {
      label: 'Trade', icon: 'icon-cart',
      items: [
        { to: '/farmer/trade', label: '🛒 Trade Crops' },
        { to: '/farmer/stocks', label: '📦 Crop Stocks' },
        { to: '/farmer/selling-history', label: '📋 Selling History' },
      ]
    },
    {
      label: 'Tools', icon: 'icon-tools',
      items: [
        { to: '/farmer/tools/chatbot', label: '🤖 AI ChatBot' },
        { to: '/farmer/tools/weather', label: '🌤 Weather Forecast' },
        { to: '/farmer/tools/news', label: '📰 News Feed' },
      ]
    },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to={isAuthenticated ? (user?.role === 'farmer' ? '/dashboard' : user?.role === 'admin' ? '/admin' : '/marketplace') : '/'} className="navbar-logo">
          <span className="logo-icon">🌿</span>
          <span className="logo-text">AgroPortal</span>
        </Link>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
          <span></span><span></span><span></span>
        </button>

        {/* Nav Links */}
        <div className={`navbar-links ${mobileOpen ? 'mobile-open' : ''}`}>
          {!isAuthenticated && (
            <>
              <Link to="/" className="nav-link" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link to="/marketplace" className="nav-link" onClick={() => setMobileOpen(false)}>Marketplace</Link>
              <Link to="/contact" className="nav-link" onClick={() => setMobileOpen(false)}>Contact</Link>
            </>
          )}

          {/* FARMER NAV */}
          {isAuthenticated && user?.role === 'farmer' && (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>Dashboard</Link>
              {farmerDropdowns.map(dd => <DropdownMenu key={dd.label} {...dd} />)}
            </>
          )}

          {/* CUSTOMER NAV */}
          {isAuthenticated && user?.role === 'customer' && (
            <>
              <Link to="/marketplace" className={`nav-link ${isActive('/marketplace') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>🛒 Buy Crops</Link>
              <Link to="/customer/stocks" className={`nav-link ${isActive('/customer/stocks') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>📦 Crop Stocks</Link>
              <Link to="/intelligence" className={`nav-link ${isActive('/intelligence') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>🧠 AI Hub</Link>
              <Link to="/customer/orders" className={`nav-link ${isActive('/customer/orders') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>📋 My Orders</Link>
              {/* Cart with badge */}
              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                className={`nav-link ${isActive('/cart') ? 'active' : ''}`}
              >
                🛍️ Cart
                {cartCount > 0 && (
                  <span style={{
                    background: '#4ade80', color: '#000',
                    borderRadius: '50%', minWidth: 18, height: 18,
                    fontSize: '0.65rem', fontWeight: 700,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 4px', lineHeight: 1
                  }}>{cartCount}</span>
                )}
              </Link>
            </>
          )}

          {/* ADMIN NAV */}
          {isAuthenticated && user?.role === 'admin' && (
            <>
              <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>📊 Dashboard</Link>
              <Link to="/admin/farmers" className={`nav-link ${isActive('/admin/farmers') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>🌾 Farmers</Link>
              <Link to="/admin/customers" className={`nav-link ${isActive('/admin/customers') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>👥 Customers</Link>
              <Link to="/admin/stock" className={`nav-link ${isActive('/admin/stock') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>📦 Crop Stock</Link>
              <Link to="/admin/queries" className={`nav-link ${isActive('/admin/queries') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>💬 Queries</Link>
            </>
          )}

          {/* Auth Actions */}
          {isAuthenticated ? (
            <div className="nav-user-section">
              <Link to="/profile" className="nav-user-pill" onClick={() => setMobileOpen(false)}>
                <span className="avatar-circle">{user?.name?.charAt(0).toUpperCase()}</span>
                <span className="user-name-text">{user?.name?.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="btn-logout">⏻ Logout</button>
            </div>
          ) : (
            <div className="nav-auth-btns">
              <Link to="/login" className="btn-nav-login" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/register" className="btn-nav-register" onClick={() => setMobileOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
