import { useState, useEffect } from 'react';
import api, { BACKEND_URL } from '../../services/api';

const getImageUrl = (images) => {
  if (!images || images.length === 0) return null;
  const img = images[0];
  return img.startsWith('/') ? `${BACKEND_URL}${img}` : img;
};

const AdminTable = ({ title, icon, endpoint, columns, renderRow, deleteEndpoint, emptyMsg }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: res } = await api.get(endpoint);
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load data. Check your login role.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await api.delete(`${deleteEndpoint}/${id}`);
      setData(prev => prev.filter(item => item._id !== id));
    } catch (err) { alert('Delete failed'); }
  };

  const filtered = data.filter(item =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="page-loading"><div className="spinner"></div><p>Loading...</p></div>;

  if (error) return (
    <div className="container mt-8">
      <h1>{icon} {title}</h1>
      <div style={{ marginTop: '1.5rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '1.25rem', color: '#fca5a5' }}>
        ⚠️ {error}
      </div>
    </div>
  );

  return (
    <div className="container mt-8 animate-fade-in">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>{icon} {title}</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
          {data.length} records found
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            className="form-control"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
            style={{ maxWidth: 400 }}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <h3 style={{ color: 'rgba(255,255,255,0.6)' }}>{emptyMsg || 'No records found'}</h3>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(74,222,128,0.1)', borderBottom: '1px solid rgba(74,222,128,0.2)' }}>
                    {[...columns, 'Action'].map(h => (
                      <th key={h} style={{ padding: '1rem', textAlign: 'center', color: '#4ade80', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, i) => (
                    <tr key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                      {renderRow(item)}
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDelete(item._id)}
                          style={{
                            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                            color: '#fca5a5', padding: '0.3rem 0.7rem', borderRadius: 6,
                            cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.3)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                        >🗑 Delete</button>
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

const td = (content, extra = {}) => (
  <td style={{ padding: '0.75rem 1rem', textAlign: 'center', ...extra }}>{content || '—'}</td>
);

export const AdminFarmers = () => (
  <AdminTable
    title="Farmers List" icon="🌾"
    endpoint="/admin/farmers" deleteEndpoint="/admin/farmers"
    emptyMsg="No farmers registered yet"
    columns={['ID', 'Name', 'Gender', 'Email', 'Phone', 'DOB', 'State', 'District', 'City']}
    renderRow={item => (<>
      {td(<span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{item._id?.slice(-6).toUpperCase()}</span>)}
      {td(<span style={{ fontWeight: 500 }}>{item.name}</span>)}
      {td(item.gender)}
      {td(<span style={{ color: '#60a5fa', fontSize: '0.85rem' }}>{item.email}</span>)}
      {td(item.phone)}
      {td(item.dob)}
      {td(item.state)}
      {td(item.district)}
      {td(item.city)}
    </>)}
  />
);

export const AdminCustomers = () => (
  <AdminTable
    title="Customers List" icon="👥"
    endpoint="/admin/customers" deleteEndpoint="/admin/customers"
    emptyMsg="No customers registered yet"
    columns={['ID', 'Name', 'Gender', 'Email', 'Phone', 'DOB', 'State', 'District', 'City']}
    renderRow={item => (<>
      {td(<span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{item._id?.slice(-6).toUpperCase()}</span>)}
      {td(<span style={{ fontWeight: 500 }}>{item.name}</span>)}
      {td(item.gender)}
      {td(<span style={{ color: '#60a5fa', fontSize: '0.85rem' }}>{item.email}</span>)}
      {td(item.phone)}
      {td(item.dob)}
      {td(item.state)}
      {td(item.district)}
      {td(item.city)}
    </>)}
  />
);

export const AdminCropStock = () => (
  <AdminTable
    title="Crop Stock" icon="📦"
    endpoint="/admin/stock" deleteEndpoint="/admin/stock"
    emptyMsg="No crop products listed yet"
    columns={['Photo', 'Title', 'Category', 'Price', 'Stock', 'Availability', 'Farmer', 'Location']}
    renderRow={item => (<>
      {td(
        getImageUrl(item.images)
          ? <img src={getImageUrl(item.images)} alt={item.title} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, display: 'block', margin: '0 auto' }} onError={e => { e.currentTarget.style.display = 'none'; }} />
          : <span style={{ fontSize: '1.5rem' }}>🌾</span>
      )}
      {td(<span style={{ fontWeight: 500 }}>{item.title}</span>)}
      {td(<span style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.2)', padding: '0.15rem 0.5rem', borderRadius: 20, fontSize: '0.75rem', color: '#4ade80' }}>{item.category}</span>)}
      {td(<span style={{ color: '#fbbf24', fontWeight: 600 }}>₹{item.price?.toFixed(2)}</span>)}
      {td(`${item.stockQuantity} kg`)}
      {td(
        <span style={{
          display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600,
          background: item.isAvailable ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)',
          color: item.isAvailable ? '#4ade80' : '#f87171',
          border: `1px solid ${item.isAvailable ? '#4ade80' : '#ef4444'}44`
        }}>{item.isAvailable ? 'Available' : 'Unavailable'}</span>
      )}
      {td(item.farmer?.name)}
      {td(`${item.farmer?.state || ''} ${item.farmer?.district || ''}`)}
    </>)}
  />
);


export const AdminQueries = () => (
  <AdminTable
    title="Contact Queries" icon="💬"
    endpoint="/admin/queries" deleteEndpoint="/admin/queries"
    emptyMsg="No contact queries yet"
    columns={['Name', 'Email', 'Phone', 'Subject', 'Message', 'Date']}
    renderRow={item => (<>
      {td(<span style={{ fontWeight: 500 }}>{item.name}</span>)}
      {td(<span style={{ color: '#60a5fa', fontSize: '0.85rem' }}>{item.email}</span>)}
      {td(item.phone)}
      {td(item.subject)}
      {td(<span style={{ maxWidth: 200, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{item.message}</span>)}
      {td(<span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{new Date(item.createdAt).toLocaleDateString('en-IN')}</span>)}
    </>)}
  />
);
