import { useState, useEffect } from 'react';
import api from '../../services/api';

const SellingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/farmer/selling-history');
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const statusColor = { completed: '#4ade80', pending: '#fbbf24', failed: '#f87171' };

  return (
    <div className="container mt-8 animate-fade-in">
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>📋 Selling History</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
          All orders placed for your crop listings.
        </p>

        {loading ? (
          <div className="page-loading"><div className="spinner"></div><p>Loading history...</p></div>
        ) : history.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <h3 style={{ color: 'rgba(255,255,255,0.6)' }}>No selling history yet</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>Your sold orders will appear here once customers purchase your crops.</p>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(74,222,128,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#4ade80', fontWeight: 600 }}>📦 {history.length} Orders</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                Total Revenue: ₹{history.reduce((sum, h) => sum + h.total, 0).toFixed(2)}
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(74,222,128,0.1)', borderBottom: '1px solid rgba(74,222,128,0.2)' }}>
                    {['Order ID', 'Date', 'Customer', 'Crop', 'Qty (kg)', 'Price/kg', 'Total', 'Status'].map(h => (
                      <th key={h} style={{ padding: '1rem', textAlign: 'center', color: '#4ade80', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
                        {item.orderId?.toString().slice(-8).toUpperCase()}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.85rem' }}>
                        {new Date(item.date).toLocaleDateString('en-IN')}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                        <div style={{ fontWeight: 500 }}>{item.customer}</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{item.customerEmail}</div>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 500, color: '#4ade80' }}>{item.cropName}</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>₹{item.price?.toFixed(2)}</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 600, color: '#fbbf24' }}>₹{item.total?.toFixed(2)}</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block', padding: '0.2rem 0.6rem',
                          borderRadius: 20, fontSize: '0.75rem', fontWeight: 600,
                          background: `${statusColor[item.paymentStatus] || '#94a3b8'}22`,
                          color: statusColor[item.paymentStatus] || '#94a3b8',
                          border: `1px solid ${statusColor[item.paymentStatus] || '#94a3b8'}44`
                        }}>{item.paymentStatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellingHistory;

