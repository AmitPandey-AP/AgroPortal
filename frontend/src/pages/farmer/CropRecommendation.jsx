import { useState } from 'react';
import api from '../../services/api';

/* ── Validation ranges (mirrors backend/src/utils/validation.js) ─────────── */
const RANGES = {
  N:           { min: 0,   max: 200,  label: 'Nitrogen (N)',    unit: 'mg/kg' },
  P:           { min: 0,   max: 200,  label: 'Phosphorus (P)',  unit: 'mg/kg' },
  K:           { min: 0,   max: 300,  label: 'Potassium (K)',   unit: 'mg/kg' },
  temperature: { min: 0,   max: 60,   label: 'Temperature',     unit: '°C'    },
  humidity:    { min: 0,   max: 100,  label: 'Humidity',        unit: '%'     },
  ph:          { min: 3.5, max: 10.0, label: 'Soil pH',         unit: ''      },
  rainfall:    { min: 0,   max: 1000, label: 'Rainfall',        unit: 'mm'    },
};

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

/* ── Field definitions ────────────────────────────────────────────────────── */
const FIELDS = [
  { name: 'N',           label: 'Nitrogen (N)',    placeholder: 'e.g. 90',  step: '1',    hint: '0 – 200 mg/kg' },
  { name: 'P',           label: 'Phosphorus (P)',  placeholder: 'e.g. 42',  step: '1',    hint: '0 – 200 mg/kg' },
  { name: 'K',           label: 'Potassium (K)',   placeholder: 'e.g. 43',  step: '1',    hint: '0 – 300 mg/kg' },
  { name: 'temperature', label: 'Temperature (°C)',placeholder: 'e.g. 21',  step: '0.01', hint: '0 – 60 °C'     },
  { name: 'humidity',    label: 'Humidity (%)',    placeholder: 'e.g. 82',  step: '0.01', hint: '0 – 100 %'     },
  { name: 'ph',          label: 'Soil pH',         placeholder: 'e.g. 6.5', step: '0.01', hint: '3.5 – 10.0'   },
  { name: 'rainfall',    label: 'Rainfall (mm)',   placeholder: 'e.g. 203', step: '0.01', hint: '0 – 1000 mm'   },
];

const INITIAL = { N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: '' };

const CropRecommendation = () => {
  const [form, setForm]         = useState(INITIAL);
  const [touched, setTouched]   = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [result, setResult]     = useState('');
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState('');

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
    for (const f of FIELDS) {
      const err = validate(f.name, form[f.name]);
      errors[f.name] = err;
      if (err) hasError = true;
    }
    setFieldErrors(errors);
    setTouched(Object.fromEntries(FIELDS.map(f => [f.name, true])));
    return !hasError;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return; // stop if client-side errors exist

    setLoading(true); setApiError(''); setResult('');
    try {
      const payload = Object.fromEntries(FIELDS.map(f => [f.name, Number(form[f.name])]));
      const { data } = await api.post('/intelligence/recommend/crop', payload);
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
  return (
    <div className="container mt-8 animate-fade-in">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>🌱 Crop Recommendation</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
          Enter soil and climate parameters to get the best crop recommendation for your land.
        </p>

        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>🧪 Enter Soil &amp; Environment Parameters</h3>

          {/* Valid-range reference bar */}
          <div style={{
            marginBottom: '1.25rem', padding: '0.65rem 1rem', borderRadius: 8,
            background: 'rgba(96,165,250,0.07)', border: '1px solid rgba(96,165,250,0.2)',
            fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)',
            display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.5rem'
          }}>
            {FIELDS.map(f => (
              <span key={f.name}>
                <strong style={{ color: 'rgba(96,165,250,0.8)' }}>{f.label}:</strong> {f.hint}
              </span>
            ))}
          </div>

          <form onSubmit={onSubmit} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
              {FIELDS.map(f => {
                const err = fieldErrors[f.name];
                return (
                  <div
                    className="form-group"
                    key={f.name}
                    style={{ gridColumn: f.name === 'rainfall' ? 'span 2' : 'span 1' }}
                  >
                    <label className="form-label">{f.label}</label>
                    <input
                      className="form-control"
                      type="number"
                      step={f.step}
                      name={f.name}
                      value={form[f.name]}
                      onChange={onChange}
                      onBlur={onBlur}
                      placeholder={f.placeholder}
                      style={{
                        borderColor: err ? '#ef4444' : undefined,
                        background: err ? 'rgba(239,68,68,0.06)' : undefined,
                      }}
                    />
                    {err && (
                      <span style={{ color: '#fca5a5', fontSize: '0.72rem', marginTop: '0.2rem', display: 'block' }}>
                        ⚠ {err}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? '🔄 Analyzing...' : '🌱 Get Recommendation'}
            </button>
          </form>
        </div>

        {/* API error summary */}
        {apiError && (
          <div style={{
            background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444',
            borderRadius: 8, padding: '1rem', marginBottom: '1rem', color: '#fca5a5'
          }}>⚠️ {apiError}</div>
        )}

        {result && (
          <div className="glass-panel animate-fade-in" style={{
            padding: '2rem', textAlign: 'center',
            border: '1px solid rgba(74,222,128,0.3)',
            background: 'linear-gradient(135deg, rgba(74,222,128,0.08), rgba(34,197,94,0.04))'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🌱</div>
            <h3 style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>Recommended Crop</h3>
            <div style={{ color: '#4ade80', fontSize: '2.5rem', fontWeight: 700, textTransform: 'capitalize' }}>
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropRecommendation;
