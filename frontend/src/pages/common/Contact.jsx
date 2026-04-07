import { useState } from 'react';
import api from '../../services/api';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.post('/contact', form);
      setSent(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-8 animate-fade-in">
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>📬 Contact Us</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
          Have a question or need support? Fill out the form and we'll get back to you shortly.
        </p>

        {sent ? (
          <div className="glass-panel animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px solid rgba(74,222,128,0.3)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ color: '#4ade80', marginBottom: '0.5rem' }}>Message Sent!</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Thank you for reaching out. Our team will respond to your query soon.</p>
            <button onClick={() => setSent(false)} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              Send Another Message
            </button>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', borderRadius: 8, padding: '1rem', marginBottom: '1.5rem', color: '#fca5a5' }}>
                ❌ {error}
              </div>
            )}

            <form onSubmit={onSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-control" type="text" name="name" value={form.name} onChange={onChange} placeholder="Your full name" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input className="form-control" type="email" name="email" value={form.email} onChange={onChange} placeholder="your@email.com" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-control" type="tel" name="phone" value={form.phone} onChange={onChange} placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input className="form-control" type="text" name="subject" value={form.subject} onChange={onChange} placeholder="What is your query about?" />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Message *</label>
                <textarea
                  className="form-control" rows={6}
                  name="message" value={form.message} onChange={onChange}
                  placeholder="Describe your question or issue in detail..." required
                />
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? '📤 Sending...' : '📤 Send Message'}
              </button>
            </form>

            {/* Info Box */}
            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {[
                { icon: '📧', label: 'Email', value: 'support@agroportal.in' },
                { icon: '📞', label: 'Phone', value: '+91 98765 43210' },
                { icon: '🕐', label: 'Hours', value: 'Mon-Sat, 9AM-6PM' },
              ].map(item => (
                <div key={item.label} style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{item.icon}</div>
                  <div style={{ color: '#4ade80', fontSize: '0.75rem', fontWeight: 600 }}>{item.label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginTop: '0.15rem' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
