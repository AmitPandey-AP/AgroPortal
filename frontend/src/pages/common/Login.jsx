import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { loginStart, loginSuccess, loginFailure, clearError } from '../../features/auth/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'farmer') navigate('/dashboard');
      else if (user?.role === 'admin') navigate('/admin');
      else navigate('/marketplace');
    }
  }, [isAuthenticated, navigate, user]);

  const onChange = (e) => {
    // Clear error when user starts typing again
    if (error) dispatch(clearError());
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const { data } = await api.post('/auth/login', { email, password });
      dispatch(loginSuccess(data));
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center nav-logo mb-8">AgriPortal</h2>
        <h3 className="text-center mb-4">Welcome Back</h3>
        
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            marginBottom: '16px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            borderRadius: '8px',
            color: '#f87171',
            fontWeight: '600',
            fontSize: '0.9rem',
          }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="text-center mt-4 text-muted" style={{ fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
