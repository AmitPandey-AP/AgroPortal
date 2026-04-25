const { spawn } = require('child_process');
const axios = require('axios');
const path = require('path');
const { validateFields, validateStrings } = require('../utils/validation');

/* ─── Shared Python runner ──────────────────────────────────────────────────── */
const runPython = (scriptName, args) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../scripts', scriptName);
    const pythonProcess = spawn('python', [scriptPath, ...args]);
    let output = '';
    let errOutput = '';
    pythonProcess.stdout.on('data', (data) => { output += data.toString(); });
    pythonProcess.stderr.on('data', (data) => { errOutput += data.toString(); });
    pythonProcess.on('close', (code) => {
      if (code !== 0) return reject(new Error(errOutput || 'Python script error'));
      resolve(output.trim());
    });
  });
};

/* ─── Helper: send validation errors ────────────────────────────────────────── */
const sendValidationError = (res, errors) => {
  return res.status(400).json({
    message: 'Validation failed — please correct the highlighted fields.',
    errors,
  });
};

/* ─── Predict Crop (State / District / Season — Decision Tree) ──────────────── */
// @route POST /api/intelligence/predict/crop
const predictCrop = async (req, res) => {
  try {
    // String-only inputs — validate presence & safety
    const { errors: strErrors, sanitized: strData } = validateStrings(
      req.body,
      ['state', 'district', 'season']
    );
    if (strErrors.length) return sendValidationError(res, strErrors);

    const { state, district, season } = strData;

    const result = await runPython(
      'crop_prediction/ZDecision_Tree_Model_Call.py',
      [state, district, season]
    );
    res.json({ prediction: result, district, season });
  } catch (error) {
    console.error('Crop prediction error:', error.message);
    res.status(500).json({ message: 'Crop prediction model error', detail: error.message });
  }
};

/* ─── Predict Yield ──────────────────────────────────────────────────────────── */
// @route POST /api/intelligence/predict/yield
const predictYield = async (req, res) => {
  try {
    // Validate string fields
    const { errors: strErrors, sanitized: strData } = validateStrings(
      req.body,
      ['state', 'district', 'season', 'crop']
    );

    // Validate numeric field: area
    const { errors: numErrors, sanitized: numData } = validateFields(
      req.body,
      ['area']
    );

    const allErrors = [...strErrors, ...numErrors];
    if (allErrors.length) return sendValidationError(res, allErrors);

    const { state, district, season, crop } = strData;
    const { area } = numData;

    const result = await runPython(
      'yield_prediction/yield_prediction.py',
      [state, district, season, crop, String(area)]
    );
    res.json({ prediction: result, unit: 'Quintal' });
  } catch (error) {
    console.error('Yield prediction error:', error.message);
    res.status(500).json({ message: 'Yield prediction error', detail: error.message });
  }
};

/* ─── Predict Rainfall ───────────────────────────────────────────────────────── */
// @route POST /api/intelligence/predict/rainfall
const predictRainfall = async (req, res) => {
  try {
    const { errors, sanitized } = validateStrings(req.body, ['region', 'month']);
    if (errors.length) return sendValidationError(res, errors);

    const { region, month } = sanitized;

    const result = await runPython(
      'rainfall_prediction/rainfall_prediction.py',
      [region, month]
    );
    res.json({ prediction: result, unit: 'mm', region, month });
  } catch (error) {
    console.error('Rainfall prediction error:', error.message);
    res.status(500).json({ message: 'Rainfall prediction error', detail: error.message });
  }
};

/* ─── Recommend Crop (N, P, K, temp, humidity, pH, rainfall) ───────────────── */
// @route POST /api/intelligence/recommend/crop
const recommendCrop = async (req, res) => {
  try {
    const { errors, sanitized } = validateFields(
      req.body,
      ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    );
    if (errors.length) return sendValidationError(res, errors);

    const { N, P, K, temperature, humidity, ph, rainfall } = sanitized;

    const result = await runPython(
      'crop_recommendation/recommend.py',
      [
        JSON.stringify(N), JSON.stringify(P), JSON.stringify(K),
        JSON.stringify(temperature), JSON.stringify(humidity),
        JSON.stringify(ph), JSON.stringify(rainfall),
      ]
    );
    res.json({ recommendation: result });
  } catch (error) {
    console.error('Crop recommendation error:', error.message);
    res.status(500).json({ message: 'Crop recommendation error', detail: error.message });
  }
};

/* ─── Recommend Fertilizer ───────────────────────────────────────────────────── */
// @route POST /api/intelligence/recommend/fertilizer
const recommendFertilizer = async (req, res) => {
  try {
    // Numeric fields
    const { errors: numErrors, sanitized: numData } = validateFields(
      req.body,
      ['N', 'P', 'K', 'temperature', 'humidity', 'soilMoisture']
    );

    // String fields
    const { errors: strErrors, sanitized: strData } = validateStrings(
      req.body,
      ['soilType', 'crop']
    );

    const allErrors = [...numErrors, ...strErrors];
    if (allErrors.length) return sendValidationError(res, allErrors);

    const { N, P, K, temperature, humidity, soilMoisture } = numData;
    const { soilType, crop } = strData;

    const result = await runPython(
      'fertilizer_recommendation/fertilizer_recommendation.py',
      [
        String(N), String(P), String(K),
        String(temperature), String(humidity),
        String(soilMoisture), soilType, crop,
      ]
    );
    res.json({ recommendation: result });
  } catch (error) {
    console.error('Fertilizer recommendation error:', error.message);
    res.status(500).json({ message: 'Fertilizer recommendation error', detail: error.message });
  }
};

/* ─── Live Weather ───────────────────────────────────────────────────────────── */
// @route GET /api/intelligence/weather?city=Mysore
const getWeather = async (req, res) => {
  try {
    const city = (req.query.city || '').trim();
    if (!city) return res.status(400).json({ message: 'city query parameter is required.' });
    if (city.length > 100) return res.status(400).json({ message: 'city name is too long.' });
    if (/[<>{}|\\^`]/.test(city)) return res.status(400).json({ message: 'city name contains invalid characters.' });

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey || apiKey === 'mock') {
      return res.json({
        city,
        list: Array.from({ length: 8 }, (_, i) => ({
          dt_txt: new Date(Date.now() + i * 10800000).toISOString().replace('T', ' ').slice(0, 19),
          main: { temp_max: 30 + i, temp_min: 22 + i, humidity: 65 },
          weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
          wind: { speed: 3.5 }
        }))
      });
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&lang=en&units=metric&APPID=${apiKey}`;
    const { data } = await axios.get(url);
    res.json({ city: data.city.name, list: data.list });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─── Agriculture News ───────────────────────────────────────────────────────── */
// @route GET /api/intelligence/news
const getNews = async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey || apiKey === 'mock') {
      return res.json({ articles: [
        { title: 'Farmers adopt new technology for better yield', urlToImage: null, author: 'AgriToday', publishedAt: new Date().toISOString(), url: '#', description: 'Modern farming techniques boost productivity.' },
        { title: 'Government announces new subsidy scheme for farmers', urlToImage: null, author: 'FarmNewsIndia', publishedAt: new Date().toISOString(), url: '#', description: 'New subsidies aimed at helping small farmers.' },
        { title: 'Rainfall predicted to be above normal this monsoon', urlToImage: null, author: 'MeteoIndia', publishedAt: new Date().toISOString(), url: '#', description: 'Good news for rabi crop farmers across India.' },
      ]});
    }

    const url = `https://newsapi.org/v2/everything?q=farmers+agriculture+india&sortBy=popularity&language=en&apiKey=${apiKey}`;
    const { data } = await axios.get(url);
    res.json({ articles: data.articles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─── ChatBot (Groq proxy) ───────────────────────────────────────────────────── */
// @route POST /api/intelligence/chatbot
const chatBot = async (req, res) => {
  try {
    const { messages } = req.body;

    // Basic structural validation
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'messages must be a non-empty array.' });
    }
    if (messages.length > 100) {
      return res.status(400).json({ message: 'Conversation history is too long (max 100 messages).' });
    }
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return res.status(400).json({ message: 'Each message must have a role and content.' });
      }
      if (!['user', 'assistant', 'system'].includes(msg.role)) {
        return res.status(400).json({ message: `Invalid message role: "${msg.role}". Must be user, assistant, or system.` });
      }
      if (typeof msg.content !== 'string' || msg.content.length === 0) {
        return res.status(400).json({ message: 'Message content must be a non-empty string.' });
      }
      if (msg.content.length > 4000) {
        return res.status(400).json({ message: 'A single message exceeds the 4000-character limit.' });
      }
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === 'mock') {
      return res.json({
        choices: [{
          message: {
            role: 'assistant',
            content: 'Hello! I am your Agriculture AI Assistant 🌾. I can help you with farming, crop selection, soil health, pest management, fertilizer usage, weather, market prices, and government schemes.\n\n(Add your free Groq API key in backend `.env` as `GROQ_API_KEY` — get it free at https://console.groq.com/keys)'
          }
        }]
      });
    }

    const fullMessages = [
      {
        role: 'system',
        content: 'You are an expert Agriculture AI Assistant for Indian farmers. You help with crop selection, soil health, pest management, fertilizer usage, weather interpretation, market prices, and government agricultural schemes. Keep responses concise, practical, and helpful. Use simple language.'
      },
      ...messages
    ];

    const { data } = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        }
      }
    );

    res.json(data);
  } catch (error) {
    console.error('Groq chatbot error:', error.response?.data || error.message);
    res.status(500).json({ message: error.response?.data?.error?.message || error.message });
  }
};

module.exports = {
  predictCrop,
  predictYield,
  predictRainfall,
  recommendCrop,
  recommendFertilizer,
  getWeather,
  getNews,
  chatBot,
};
