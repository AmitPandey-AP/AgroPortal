import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../../features/auth/authSlice';
import api from '../../services/api';
import { INDIAN_STATES, DISTRICTS_BY_STATE } from '../../data/indiaData';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/auth/profile');
        setProfile(data);
        setForm({
          name: data.name || '',
          phone: data.phone || '',
          gender: data.gender || '',
          dob: data.dob || '',
          state: data.state || '',
          district: data.district || '',
          city: data.city || '',
          password: '',
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const districts = form.state && DISTRICTS_BY_STATE[form.state]
    ? DISTRICTS_BY_STATE[form.state]
    : DISTRICTS_BY_STATE['default'] || [];

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'state' ? { district: '' } : {}),
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      const { data } = await api.put('/auth/profile', payload);
      dispatch(loginSuccess({ ...data, token: user.token }));
      setProfile(data);
      setMessage('✅ Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      setMessage('❌ Update failed. Please try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return (
    <div className="page-loading">
      <div className="spinner"></div>
      <p>Loading profile...</p>
    </div>
  );

  const roleColors = { farmer: '#4ade80', customer: '#60a5fa', admin: '#f59e0b' };
  const roleColor = roleColors[profile?.role] || '#4ade80';

  return (
    <div className="container mt-8 animate-fade-in">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>
          👤 My Profile
        </h1>

        {message && (
          <div style={{
            background: message.startsWith('✅') ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)',
            border: `1px solid ${message.startsWith('✅') ? '#4ade80' : '#ef4444'}`,
            borderRadius: 8, padding: '1rem', marginBottom: '1.5rem', color: '#fff'
          }}>{message}</div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>
          {/* Left Card */}
          <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{
              width: 90, height: 90, borderRadius: '50%',
              background: `linear-gradient(135deg, ${roleColor}, ${roleColor}99)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem', fontSize: '2.5rem', fontWeight: 700, color: '#1a2e1a'
            }}>
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ marginBottom: 4 }}>{profile?.name}</h3>
            <span style={{
              display: 'inline-block', padding: '0.25rem 0.8rem',
              borderRadius: 20, fontSize: '0.78rem', fontWeight: 600,
              background: `${roleColor}22`, color: roleColor, border: `1px solid ${roleColor}44`
            }}>{profile?.role?.toUpperCase()}</span>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              {profile?.email}
            </p>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="btn btn-primary"
                style={{ marginTop: '1.5rem', width: '100%' }}
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>

          {/* Right Section */}
          <div className="glass-panel">
            {!editing ? (
              <>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Profile Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[
                    ['ID', profile?._id?.slice(-8).toUpperCase()],
                    ['Name', profile?.name],
                    ['Email', profile?.email],
                    ['Phone', profile?.phone || '-'],
                    ['Gender', profile?.gender || '-'],
                    ['Date of Birth', profile?.dob || '-'],
                    ['State', profile?.state || '-'],
                    ['District', profile?.district || '-'],
                    ['City', profile?.city || '-'],
                    ['Password', '••••••••'],
                  ].map(([label, value]) => (
                    <div key={label} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: 4 }}>{label}</div>
                      <div style={{ color: '#fff', fontWeight: 500, wordBreak: 'break-all' }}>{value}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ color: 'var(--primary-color)' }}>Edit Profile</h3>
                  <button type="button" onClick={() => setEditing(false)} style={{
                    background: 'none', border: '1px solid rgba(255,255,255,0.2)',
                    color: 'rgba(255,255,255,0.7)', padding: '0.35rem 0.8rem',
                    borderRadius: 6, cursor: 'pointer'
                  }}>✕ Cancel</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {/* Name */}
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-control" type="text" name="name" value={form.name} onChange={onChange} required />
                  </div>

                  {/* Phone */}
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-control" type="tel" name="phone" value={form.phone} onChange={onChange} />
                  </div>

                  {/* Gender */}
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select className="form-control" name="gender" value={form.gender} onChange={onChange}>
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* DOB */}
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input className="form-control" type="date" name="dob" value={form.dob} onChange={onChange} />
                  </div>

                  {/* State */}
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <select className="form-control" name="state" value={form.state} onChange={onChange}>
                      <option value="">Select State...</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* District */}
                  <div className="form-group">
                    <label className="form-label">District</label>
                    <select className="form-control" name="district" value={form.district} onChange={onChange}>
                      <option value="">Select District...</option>
                      {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  {/* City */}
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">City / Location</label>
                    <input className="form-control" type="text" name="city" value={form.city} onChange={onChange} />
                  </div>

                  {/* Password */}
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">New Password (leave blank to keep current)</label>
                    <input className="form-control" type="password" name="password" value={form.password} onChange={onChange} placeholder="Enter new password..." />
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <input type="hidden" name="email" readOnly value={form.email} />
                  <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1 }}>
                    {saving ? 'Saving...' : '💾 Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
