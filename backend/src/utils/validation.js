/**
 * Agricultural Data Validation Utility
 * 
 * Validates numeric inputs before they are passed to ML prediction models.
 * Catches physically impossible / out-of-range "noisy" data early so the
 * model never sees invalid inputs.
 */

/* ── Allowed ranges ──────────────────────────────────────────────────────────── */
const RANGES = {
  N:           { min: 0,   max: 200,  unit: 'mg/kg',  label: 'Nitrogen (N)' },
  P:           { min: 0,   max: 200,  unit: 'mg/kg',  label: 'Phosphorus (P)' },
  K:           { min: 0,   max: 300,  unit: 'mg/kg',  label: 'Potassium (K)' },
  temperature: { min: 0,   max: 60,   unit: '°C',     label: 'Temperature' },
  humidity:    { min: 0,   max: 100,  unit: '%',       label: 'Humidity' },
  ph:          { min: 3.5, max: 10.0, unit: '',        label: 'Soil pH' },
  rainfall:    { min: 0,   max: 1000, unit: 'mm',      label: 'Rainfall' },
  soilMoisture:{ min: 0,   max: 100,  unit: '%',       label: 'Soil Moisture' },
  area:        { min: 0.01,max: 100000, unit: 'ha',   label: 'Area' },
};

/**
 * Validates that a single numeric field is within its allowed range.
 * @param {string} field   - Key from RANGES
 * @param {*}      value   - Raw value (may be string, number, NaN, etc.)
 * @returns {string|null}  - Error message or null if valid
 */
const validateField = (field, value) => {
  const range = RANGES[field];
  if (!range) return null; // unknown field — skip

  const num = Number(value);

  if (value === '' || value === null || value === undefined) {
    return `${range.label} is required.`;
  }
  if (isNaN(num)) {
    return `${range.label} must be a number; received "${value}".`;
  }
  if (!isFinite(num)) {
    return `${range.label} must be a finite number.`;
  }
  if (num < range.min || num > range.max) {
    const unitStr = range.unit ? ` ${range.unit}` : '';
    return `${range.label} must be between ${range.min}${unitStr} and ${range.max}${unitStr}. Got: ${num}.`;
  }
  return null;
};

/**
 * Validates a set of fields from the request body.
 * @param {Object}   body        - req.body
 * @param {string[]} fieldNames  - List of field keys to validate
 * @returns {{ errors: string[], sanitized: Object }}
 */
const validateFields = (body, fieldNames) => {
  const errors = [];
  const sanitized = {};

  for (const field of fieldNames) {
    const err = validateField(field, body[field]);
    if (err) {
      errors.push(err);
    } else {
      sanitized[field] = Number(body[field]);
    }
  }

  return { errors, sanitized };
};

/**
 * Validates required string fields (non-empty, no special chars).
 * @param {Object}   body        - req.body
 * @param {string[]} fieldNames  - List of string field keys
 * @returns {{ errors: string[], sanitized: Object }}
 */
const validateStrings = (body, fieldNames) => {
  const errors = [];
  const sanitized = {};

  for (const field of fieldNames) {
    const val = (body[field] || '').toString().trim();
    if (!val) {
      errors.push(`${field} is required.`);
    } else if (val.length > 100) {
      errors.push(`${field} is too long (max 100 characters).`);
    } else if (/[<>{}|\\^`]/.test(val)) {
      errors.push(`${field} contains invalid characters.`);
    } else {
      sanitized[field] = val;
    }
  }

  return { errors, sanitized };
};

module.exports = { validateFields, validateStrings, RANGES };
