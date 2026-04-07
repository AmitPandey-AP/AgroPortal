import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ farmerCount: 0, customerCount: 0, productCount: 0, queryCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const cards = [
    { label: 'Total Farmers', value: stats.farmerCount, icon: '🌾', color: '#4ade80', link: '/admin/farmers' },
    { label: 'Total Customers', value: stats.customerCount, icon: '👥', color: '#60a5fa', link: '/admin/customers' },
    { label: 'Crop Products Listed', value: stats.productCount, icon: '📦', color: '#fbbf24', link: '/admin/stock' },
    { label: 'Contact Queries', value: stats.queryCount, icon: '💬', color: '#f87171', link: '/admin/queries' },
  ];

  if (loading) return <div className="page-loading"><div className="spinner"></div><p>Loading...</p></div>;

  return (
    <div className="container mt-8 animate-fade-in">
      <h1 style={{ marginBottom: '0.5rem' }}>🛡️ Admin Dashboard</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>Overview of the Agriculture Portal platform.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {cards.map(card => (
          <a key={card.label} href={card.link} style={{ textDecoration: 'none' }}>
            <div className="glass-card p-4" style={{ textAlign: 'center', cursor: 'pointer', border: `1px solid ${card.color}30`, transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = card.color}
              onMouseLeave={e => e.currentTarget.style.borderColor = `${card.color}30`}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{card.icon}</div>
              <div style={{ color: card.color, fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>{card.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{card.label}</div>
            </div>
          </a>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#4ade80' }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {[
            { label: '🌾 Manage Farmers', link: '/admin/farmers', color: '#4ade80' },
            { label: '👥 Manage Customers', link: '/admin/customers', color: '#60a5fa' },
            { label: '📦 View Crop Stock', link: '/admin/stock', color: '#fbbf24' },
            { label: '💬 View Queries', link: '/admin/queries', color: '#f87171' },
          ].map(item => (
            <a key={item.label} href={item.link} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '1rem 1.5rem', background: `${item.color}15`,
                border: `1px solid ${item.color}30`, borderRadius: 10,
                color: '#fff', fontWeight: 500, transition: 'all 0.2s',
                cursor: 'pointer'
              }}
                onMouseEnter={e => { e.currentTarget.style.background = `${item.color}25`; e.currentTarget.style.borderColor = item.color; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${item.color}15`; e.currentTarget.style.borderColor = `${item.color}30`; }}
              >
                {item.label}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

