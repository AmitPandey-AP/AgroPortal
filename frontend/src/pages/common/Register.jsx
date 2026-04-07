import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { loginStart, loginSuccess, loginFailure } from '../../features/auth/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', role: 'customer' 
  });
  const { name, email, password, role } = formData;
  
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
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role });
      dispatch(loginSuccess(data));
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '2rem' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '450px' }}>
        <h2 className="text-center nav-logo mb-8">AgriPortal</h2>
        <h3 className="text-center mb-4">Create an Account</h3>
        
        {error && <div className="p-4 mb-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', borderRadius: '8px' }}>{error}</div>}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" name="name" value={name} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" name="email" value={email} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" name="password" value={password} onChange={onChange} minLength="6" required />
          </div>
          <div className="form-group">
            <label className="form-label">I am a...</label>
            <select className="form-control" name="role" value={role} onChange={onChange}>
              <option value="customer">Customer (Buy Products)</option>
              <option value="farmer">Farmer (Sell Products & AI Info)</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <p className="text-center mt-4 text-muted" style={{ fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
