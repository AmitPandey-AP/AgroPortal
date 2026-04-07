import { useState } from 'react';
import api from '../../services/api';
import { SOIL_TYPES, FERTILIZER_CROPS } from '../../data/indiaData';

const FertilizerRecommendation = () => {
  const [form, setForm] = useState({ N: '', P: '', K: '', temperature: '', humidity: '', soilMoisture: '', soilType: '', crop: '' });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setResult('');
    try {
      const payload = {
        N: Number(form.N), P: Number(form.P), K: Number(form.K),
        temperature: Number(form.temperature), humidity: Number(form.humidity),
        soilMoisture: Number(form.soilMoisture), soilType: form.soilType, crop: form.crop,
      };
      const { data } = await api.post('/intelligence/recommend/fertilizer', payload);
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
        <h1 style={{ marginBottom: '0.5rem' }}>🧪 Fertilizer Recommendation</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
          Enter soil, climate, and crop details to get the best fertilizer recommendation.
        </p>

        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>📋 Enter Details</h3>
          <form onSubmit={onSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
              {[
                { name: 'N', label: 'Nitrogen (N)', placeholder: 'e.g. 37' },
                { name: 'P', label: 'Phosphorus (P)', placeholder: 'e.g. 0' },
                { name: 'K', label: 'Potassium (K)', placeholder: 'e.g. 0' },
                { name: 'temperature', label: 'Temperature (°C)', placeholder: 'e.g. 26' },
                { name: 'humidity', label: 'Humidity (%)', placeholder: 'e.g. 52' },
                { name: 'soilMoisture', label: 'Soil Moisture', placeholder: 'e.g. 38' },
              ].map(f => (
                <div className="form-group" key={f.name}>
                  <label className="form-label">{f.label}</label>
                  <input className="form-control" type="number" name={f.name} value={form[f.name]} onChange={onChange} placeholder={f.placeholder} required />
                </div>
              ))}

              <div className="form-group">
                <label className="form-label">Soil Type</label>
                <select className="form-control" name="soilType" value={form.soilType} onChange={onChange} required>
                  <option value="">Select...</option>
                  {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Crop</label>
                <select className="form-control" name="crop" value={form.crop} onChange={onChange} required>
                  <option value="">Select...</option>
                  {FERTILIZER_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? '🔄 Analyzing...' : '🧪 Get Fertilizer Recommendation'}
            </button>
          </form>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', borderRadius: 8, padding: '1rem', marginBottom: '1rem', color: '#fca5a5' }}>⚠️ {error}</div>
        )}

        {result && (
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', textAlign: 'center', border: '1px solid rgba(245,158,11,0.3)', background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(251,191,36,0.04))' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🧪</div>
            <h3 style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>Recommended Fertilizer</h3>
            <div style={{ color: '#fbbf24', fontSize: '2rem', fontWeight: 700 }}>{result}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FertilizerRecommendation;

