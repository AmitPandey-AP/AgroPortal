import { useState } from 'react';
import api from '../../services/api';
import { SOIL_TYPES, FERTILIZER_CROPS } from '../../data/indiaData';

/* ── Validation ranges (mirrors backend/src/utils/validation.js) ─────────── */
const RANGES = {
  N:           { min: 0, max: 200,  label: 'Nitrogen (N)',    unit: 'mg/kg' },
  P:           { min: 0, max: 200,  label: 'Phosphorus (P)',  unit: 'mg/kg' },
  K:           { min: 0, max: 300,  label: 'Potassium (K)',   unit: 'mg/kg' },
  temperature: { min: 0, max: 60,   label: 'Temperature',     unit: '°C'    },
  humidity:    { min: 0, max: 100,  label: 'Humidity',        unit: '%'     },
  soilMoisture:{ min: 0, max: 100,  label: 'Soil Moisture',   unit: '%'     },
};

const NUM_FIELDS = [
  { name: 'N',           label: 'Nitrogen (N)',    placeholder: 'e.g. 37', hint: '0 – 200 mg/kg' },
  { name: 'P',           label: 'Phosphorus (P)',  placeholder: 'e.g. 0',  hint: '0 – 200 mg/kg' },
  { name: 'K',           label: 'Potassium (K)',   placeholder: 'e.g. 0',  hint: '0 – 300 mg/kg' },
  { name: 'temperature', label: 'Temperature (°C)',placeholder: 'e.g. 26', hint: '0 – 60 °C'     },
  { name: 'humidity',    label: 'Humidity (%)',    placeholder: 'e.g. 52', hint: '0 – 100 %'     },
  { name: 'soilMoisture',label: 'Soil Moisture',   placeholder: 'e.g. 38', hint: '0 – 100 %'     },
];

const validate = (name, value) => {
  const r = RANGES[name];
  if (!r) return null;
  const num = Number(value);
  if (value === '' || value === null) return `${r.label} is required.`;
  if (isNaN(num)) return `${r.label} must be a number.`;
  if (num < r.min || num > r.max)
    return `${r.label} must be between ${r.min}${r.unit ? ' ' + r.unit : ''} and ${r.max}${r.unit ? ' ' + r.unit : ''}.`;
  return null;
};

const INITIAL = { N: '', P: '', K: '', temperature: '', humidity: '', soilMoisture: '', soilType: '', crop: '' };

const FertilizerRecommendation = () => {
  const [form, setForm]               = useState(INITIAL);
  const [touched, setTouched]         = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [result, setResult]           = useState('');
  const [loading, setLoading]         = useState(false);
  const [apiError, setApiError]       = useState('');

  /* ── Handlers ───────────────────────────────────────────────────────────── */
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const onBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setFieldErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const validateAll = () => {
    const errors = {};
    let hasError = false;
    // Validate numeric fields
    for (const f of NUM_FIELDS) {
      const err = validate(f.name, form[f.name]);
      errors[f.name] = err;
      if (err) hasError = true;
    }
    // Validate string selects
    if (!form.soilType) { errors.soilType = 'Soil Type is required.'; hasError = true; }
    if (!form.crop)     { errors.crop     = 'Crop is required.';      hasError = true; }

    setFieldErrors(errors);
    const allTouched = Object.fromEntries([...NUM_FIELDS, { name: 'soilType' }, { name: 'crop' }].map(f => [f.name, true]));
    setTouched(allTouched);
    return !hasError;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setLoading(true); setApiError(''); setResult('');
    try {
      const payload = {
        N: Number(form.N), P: Number(form.P), K: Number(form.K),
        temperature: Number(form.temperature), humidity: Number(form.humidity),
        soilMoisture: Number(form.soilMoisture), soilType: form.soilType, crop: form.crop,
      };
      const { data } = await api.post('/intelligence/recommend/fertilizer', payload);
      setResult(data.recommendation || 'No recommendation returned');
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.errors?.length) {
        setApiError(errData.errors.join(' | '));
      } else {
        setApiError(errData?.message || errData?.detail || 'Recommendation failed. Ensure Python ML models are set up.');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Render ─────────────────────────────────────────────────────────────── */
  const inputStyle = (name) => ({
    borderColor: fieldErrors[name] ? '#ef4444' : undefined,
    background:  fieldErrors[name] ? 'rgba(239,68,68,0.06)' : undefined,
  });

  return (
    <div className="container mt-8 animate-fade-in">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>🧪 Fertilizer Recommendation</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
          Enter soil, climate, and crop details to get the best fertilizer recommendation.
        </p>

        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>📋 Enter Details</h3>

          {/* Valid-range reference bar */}
          <div style={{
            marginBottom: '1.25rem', padding: '0.65rem 1rem', borderRadius: 8,
            background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)',
            fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)',
            display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.5rem'
          }}>
            {NUM_FIELDS.map(f => (
              <span key={f.name}>
                <strong style={{ color: 'rgba(245,158,11,0.8)' }}>{f.label}:</strong> {f.hint}
              </span>
            ))}
          </div>

          <form onSubmit={onSubmit} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
              {/* Numeric inputs */}
              {NUM_FIELDS.map(f => (
                <div className="form-group" key={f.name}>
                  <label className="form-label">{f.label}</label>
                  <input
                    className="form-control"
                    type="number"
                    name={f.name}
                    value={form[f.name]}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={f.placeholder}
                    style={inputStyle(f.name)}
                  />
                  {fieldErrors[f.name] && (
                    <span style={{ color: '#fca5a5', fontSize: '0.72rem', marginTop: '0.2rem', display: 'block' }}>
                      ⚠ {fieldErrors[f.name]}
                    </span>
                  )}
                </div>
              ))}

              {/* Soil Type */}
              <div className="form-group">
                <label className="form-label">Soil Type</label>
                <select
                  className="form-control"
                  name="soilType"
                  value={form.soilType}
                  onChange={onChange}
                  onBlur={onBlur}
                  style={inputStyle('soilType')}
                >
                  <option value="">Select...</option>
                  {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {fieldErrors.soilType && (
                  <span style={{ color: '#fca5a5', fontSize: '0.72rem', marginTop: '0.2rem', display: 'block' }}>
                    ⚠ {fieldErrors.soilType}
                  </span>
                )}
              </div>

              {/* Crop */}
              <div className="form-group">
                <label className="form-label">Crop</label>
                <select
                  className="form-control"
                  name="crop"
                  value={form.crop}
                  onChange={onChange}
                  onBlur={onBlur}
                  style={inputStyle('crop')}
                >
                  <option value="">Select...</option>
                  {FERTILIZER_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {fieldErrors.crop && (
                  <span style={{ color: '#fca5a5', fontSize: '0.72rem', marginTop: '0.2rem', display: 'block' }}>
                    ⚠ {fieldErrors.crop}
                  </span>
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? '🔄 Analyzing...' : '🧪 Get Fertilizer Recommendation'}
            </button>
          </form>
        </div>

        {/* API error */}
        {apiError && (
          <div style={{
            background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444',
            borderRadius: 8, padding: '1rem', marginBottom: '1rem', color: '#fca5a5'
          }}>⚠️ {apiError}</div>
        )}

        {result && (
          <div className="glass-panel animate-fade-in" style={{
            padding: '2rem', textAlign: 'center',
            border: '1px solid rgba(245,158,11,0.3)',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(251,191,36,0.04))'
          }}>
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
