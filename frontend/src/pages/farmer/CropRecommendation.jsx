import { useState } from 'react';
import api from '../../services/api';

const CropRecommendation = () => {
  const [form, setForm] = useState({ N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: '' });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fields = [
    { name: 'N', label: 'Nitrogen (N)', placeholder: 'e.g. 90', step: '1' },
    { name: 'P', label: 'Phosphorus (P)', placeholder: 'e.g. 42', step: '1' },
    { name: 'K', label: 'Potassium (K)', placeholder: 'e.g. 43', step: '1' },
    { name: 'temperature', label: 'Temperature (°C)', placeholder: 'e.g. 21', step: '0.01' },
    { name: 'humidity', label: 'Humidity (%)', placeholder: 'e.g. 82', step: '0.01' },
    { name: 'ph', label: 'Soil pH', placeholder: 'e.g. 6.5', step: '0.01' },
    { name: 'rainfall', label: 'Rainfall (mm)', placeholder: 'e.g. 203', step: '0.01' },
  ];

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setResult('');
    try {
      const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, Number(v)]));
      const { data } = await api.post('/intelligence/recommend/crop', payload);
      setResult(data.recommendation || 'No recommendation returned');
    } catch (err) {
      setError(err.response?.data?.detail || 'Recommendation failed. Ensure Python ML models are set up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-8 animate-fade-in">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>🌱 Crop Recommendation</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
          Enter soil and climate parameters to get the best crop recommendation for your land.
        </p>

        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>🧪 Enter Soil & Environment Parameters</h3>
          <form onSubmit={onSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
              {fields.map(f => (
                <div className="form-group" key={f.name} style={{ gridColumn: f.name === 'rainfall' ? 'span 2' : 'span 1' }}>
                  <label className="form-label">{f.label}</label>
                  <input
                    className="form-control" type="number" step={f.step}
                    name={f.name} value={form[f.name]}
                    onChange={onChange} placeholder={f.placeholder} required
                  />
                </div>
              ))}
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? '🔄 Analyzing...' : '🌱 Get Recommendation'}
            </button>
          </form>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', borderRadius: 8, padding: '1rem', marginBottom: '1rem', color: '#fca5a5' }}>⚠️ {error}</div>
        )}

        {result && (
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', textAlign: 'center', border: '1px solid rgba(74,222,128,0.3)', background: 'linear-gradient(135deg, rgba(74,222,128,0.08), rgba(34,197,94,0.04))' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🌱</div>
            <h3 style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>Recommended Crop</h3>
            <div style={{ color: '#4ade80', fontSize: '2.5rem', fontWeight: 700, textTransform: 'capitalize' }}>{result}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropRecommendation;

