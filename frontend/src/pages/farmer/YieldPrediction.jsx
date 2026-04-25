import { useState } from 'react';
import api from '../../services/api';
import { INDIAN_STATES, DISTRICTS_BY_STATE, CROP_OPTIONS_BY_DISTRICT_SEASON } from '../../data/indiaData';

const SEASONS = ['Kharif', 'Rabi', 'Summer', 'WholeYear'];

const validateArea = (value) => {
  if (value === '' || value === null || value === undefined) return 'Area is required.';
  const num = Number(value);
  if (isNaN(num)) return 'Area must be a number.';
  if (num <= 0)        return 'Area must be greater than 0 hectares.';
  if (num > 100000)    return 'Area cannot exceed 100,000 hectares.';
  return null;
};

const YieldPrediction = () => {
  const [form, setForm] = useState({ state: 'Karnataka', district: '', season: '', crop: '', area: '' });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [areaError, setAreaError] = useState('');
  const [areaTouched, setAreaTouched] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'state'  ? { district: '', crop: '' } : {}),
      ...(name === 'season' ? { crop: '' } : {}),
    }));
    if (name === 'area' && areaTouched) {
      setAreaError(validateArea(value));
    }
  };

  const onAreaBlur = () => {
    setAreaTouched(true);
    setAreaError(validateArea(form.area));
  };

  const districtOptions = DISTRICTS_BY_STATE[form.state] || DISTRICTS_BY_STATE['default'] || [];
  const cropOptions = form.season ? (CROP_OPTIONS_BY_DISTRICT_SEASON[form.season] || []) : [];

  const onSubmit = async (e) => {
    e.preventDefault();
    // Re-validate area on submit
    const err = validateArea(form.area);
    setAreaTouched(true);
    setAreaError(err);
    if (err) return;

    setLoading(true);
    setError('');
    setResult('');
    try {
      const payload = { ...form, area: parseFloat(form.area) };
      const { data } = await api.post('/intelligence/predict/yield', payload);
      setResult(data.prediction || 'No prediction returned');
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.errors?.length) {
        setError(errData.errors.join(' | '));
      } else {
        setError(errData?.detail || errData?.message || 'Prediction failed. Ensure Python ML models are set up.');
      }
    } finally {
      setLoading(false);
    }
  };


  const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '0.4rem' };
  const labelStyle = { fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <div className="container mt-8 animate-fade-in">
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <h1 style={{ marginBottom: '0.25rem' }}>📊 Yield Prediction</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Predict expected crop yield in quintals based on location, season, crop type, and cultivated area.
        </p>

        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', color: '#4ade80' }}>📋 Enter Crop Details</h3>

          <form onSubmit={onSubmit}>
            {/* Row 1: State + District + Season */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>

              {/* State */}
              <div style={fieldStyle}>
                <label style={labelStyle}>State</label>
                <select
                  className="form-control"
                  name="state"
                  value={form.state}
                  onChange={onChange}
                  required
                >
                  <option value="">— Select State —</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* District */}
              <div style={fieldStyle}>
                <label style={labelStyle}>District</label>
                <select
                  className="form-control"
                  name="district"
                  value={form.district}
                  onChange={onChange}
                  required
                  disabled={!form.state}
                >
                  <option value="">{form.state ? '— Select District —' : '← Select state first'}</option>
                  {districtOptions.map(d => (
                    <option key={d} value={d}>{d.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>

              {/* Season */}
              <div style={fieldStyle}>
                <label style={labelStyle}>Season</label>
                <select
                  className="form-control"
                  name="season"
                  value={form.season}
                  onChange={onChange}
                  required
                >
                  <option value="">— Select Season —</option>
                  {SEASONS.map(s => (
                    <option key={s} value={s}>{s === 'WholeYear' ? 'Whole Year' : s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Crop + Area + Submit */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1.25rem' }}>

              {/* Crop */}
              <div style={fieldStyle}>
                <label style={labelStyle}>Crop</label>
                <select
                  className="form-control"
                  name="crop"
                  value={form.crop}
                  onChange={onChange}
                  required
                  disabled={!form.season}
                  style={{ opacity: form.season ? 1 : 0.5, cursor: form.season ? 'pointer' : 'not-allowed' }}
                >
                  <option value="">
                    {form.season ? '— Select Crop —' : '← Select a season first'}
                  </option>
                  {cropOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {!form.season && (
                  <span style={{ fontSize: '0.72rem', color: '#fbbf24' }}>⚠️ Select season to see crops</span>
                )}
              </div>

              {/* Area */}
              <div style={fieldStyle}>
                <label style={labelStyle}>Area (Hectares)</label>
                <input
                  className="form-control"
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="area"
                  value={form.area}
                  onChange={onChange}
                  onBlur={onAreaBlur}
                  placeholder="e.g. 2.5"
                  style={{
                    borderColor: areaError ? '#ef4444' : undefined,
                    background:  areaError ? 'rgba(239,68,68,0.06)' : undefined,
                  }}
                />
                {areaError && (
                  <span style={{ color: '#fca5a5', fontSize: '0.72rem' }}>⚠ {areaError}</span>
                )}
              </div>

              {/* Submit */}
              <div style={{ ...fieldStyle, justifyContent: 'flex-end' }}>
                <label style={{ ...labelStyle, opacity: 0 }}>.</label>
                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                  {loading ? '🔄 Calculating...' : '📊 Predict Yield'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1rem', color: '#fca5a5', fontSize: '0.875rem' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="glass-panel animate-fade-in" style={{
            padding: '2rem', textAlign: 'center',
            border: '1px solid rgba(74,222,128,0.3)',
            background: 'linear-gradient(135deg, rgba(74,222,128,0.08), rgba(34,197,94,0.03))'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌾</div>
            <h3 style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', fontWeight: 500 }}>
              Predicted Yield for <span style={{ color: '#fff' }}>{form.crop}</span> in {form.district.replace(/_/g,' ')}
            </h3>
            <div style={{ color: '#4ade80', fontSize: '3rem', fontWeight: 700, lineHeight: 1 }}>
              {parseFloat(result).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
              Quintals — for {form.area} hectare{form.area !== '1' ? 's' : ''} in {form.season === 'WholeYear' ? 'Whole Year' : form.season} season
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YieldPrediction;
