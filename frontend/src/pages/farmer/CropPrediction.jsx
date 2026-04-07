import { useState } from 'react';
import api from '../../services/api';
import { INDIAN_STATES, DISTRICTS_BY_STATE } from '../../data/indiaData';

const SEASONS = ['Kharif', 'Whole Year', 'Autumn', 'Rabi', 'Summer', 'Winter'];

const MLFormCard = ({ children, title, icon }) => (
  <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
    <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span>{icon}</span> {title}
    </h3>
    {children}
  </div>
);

const ResultCard = ({ result, label }) => (
  result && (
    <div className="glass-panel animate-fade-in" style={{
      padding: '2rem', textAlign: 'center',
      border: '1px solid rgba(74,222,128,0.3)',
      background: 'linear-gradient(135deg, rgba(74,222,128,0.08), rgba(34,197,94,0.04))'
    }}>
      <h3 style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', fontSize: '1rem' }}>{label}</h3>
      <div style={{ color: '#4ade80', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.4 }}>{result}</div>
    </div>
  )
);

const CropPrediction = () => {
  const [form, setForm] = useState({ state: '', district: '', season: '' });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const districts = form.state && DISTRICTS_BY_STATE[form.state]
    ? DISTRICTS_BY_STATE[form.state]
    : [];

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value, ...(name === 'state' ? { district: '' } : {}) }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');
    try {
      const { data } = await api.post('/intelligence/predict/crop', form);
      setResult(data.prediction || 'No prediction returned');
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed. Ensure Python ML models are set up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-8 animate-fade-in">
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>🌾 Crop Prediction</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
          Select your state, district and season to get AI-powered crop predictions.
        </p>

        <MLFormCard title="Enter Location & Season" icon="📍">
          <form onSubmit={onSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">State</label>
                <select className="form-control" name="state" value={form.state} onChange={onChange} required>
                  <option value="">Select State...</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">District</label>
                <select className="form-control" name="district" value={form.district} onChange={onChange} required>
                  <option value="">Select District...</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Season</label>
                <select className="form-control" name="season" value={form.season} onChange={onChange} required>
                  <option value="">Select Season...</option>
                  {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? '🔄 Predicting...' : '🔮 Predict Crops'}
            </button>
          </form>
        </MLFormCard>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', borderRadius: 8, padding: '1rem', marginBottom: '1rem', color: '#fca5a5' }}>
            ⚠️ {error}
          </div>
        )}

        <ResultCard
          result={result}
          label={`Crops grown in ${form.district || '...'} during the ${form.season || '...'} season`}
        />
      </div>
    </div>
  );
};

export default CropPrediction;

