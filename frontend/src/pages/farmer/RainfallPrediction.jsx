import { useState } from 'react';
import api from '../../services/api';
import { RAINFALL_REGIONS, MONTHS } from '../../data/indiaData';

const RainfallPrediction = () => {
  const [form, setForm] = useState({ region: '', month: '' });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setResult('');
    try {
      const { data } = await api.post('/intelligence/predict/rainfall', form);
      setResult(data.prediction || 'No prediction returned');
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed. Ensure Python ML models are set up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-8 animate-fade-in">
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>🌧 Rainfall Prediction</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
          Predicted rainfall in millimeters for your selected region and month.
        </p>

        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>📍 Select Region & Month</h3>
          <form onSubmit={onSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Region</label>
                <select className="form-control" name="region" value={form.region} onChange={onChange} required>
                  <option value="">Select Region...</option>
                  {RAINFALL_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Month</label>
                <select className="form-control" name="month" value={form.month} onChange={onChange} required>
                  <option value="">Select Month...</option>
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? '🔄 Predicting...' : '🌧 Predict Rainfall'}
            </button>
          </form>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', borderRadius: 8, padding: '1rem', marginBottom: '1rem', color: '#fca5a5' }}>⚠️ {error}</div>
        )}

        {result && (
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', textAlign: 'center', border: '1px solid rgba(96,165,250,0.3)', background: 'linear-gradient(135deg, rgba(96,165,250,0.08), rgba(59,130,246,0.04))' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌧</div>
            <h3 style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>
              Predicted Rainfall for {form.region} in {form.month}
            </h3>
            <div style={{ color: '#60a5fa', fontSize: '2rem', fontWeight: 700 }}>{result} mm</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RainfallPrediction;

