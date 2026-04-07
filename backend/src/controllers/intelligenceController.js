const { spawn } = require('child_process');
const axios = require('axios');
const path = require('path');

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

// @desc    Predict Crop by State/District/Season (Python ML - Decision Tree)
// @route   POST /api/intelligence/predict/crop
const predictCrop = async (req, res) => {
  try {
    const { state, district, season } = req.body;
    if (!state || !district || !season)
      return res.status(400).json({ message: 'state, district, and season are required' });

    const result = await runPython(
      'crop_prediction/ZDecision_Tree_Model_Call.py',
      [state, district, season]   // plain strings — no JSON.stringify
    );
    res.json({ prediction: result, district, season });
  } catch (error) {
    console.error('Crop prediction error:', error.message);
    res.status(500).json({ message: 'Crop prediction model error', detail: error.message });
  }
};

// @desc    Predict Yield
// @route   POST /api/intelligence/predict/yield
const predictYield = async (req, res) => {
  try {
    const { state, district, season, crop, area } = req.body;
    const result = await runPython(
      'yield_prediction/yield_prediction.py',
      [state, district, season, crop, String(area)]   // strings plain, area as string number
    );
    res.json({ prediction: result, unit: 'Quintal' });
  } catch (error) {
    console.error('Yield prediction error:', error.message);
    res.status(500).json({ message: 'Yield prediction error', detail: error.message });
  }
};

// @desc    Predict Rainfall
// @route   POST /api/intelligence/predict/rainfall
const predictRainfall = async (req, res) => {
  try {
    const { region, month } = req.body;
    const result = await runPython(
      'rainfall_prediction/rainfall_prediction.py',
      [region, month]   // plain strings
    );
    res.json({ prediction: result, unit: 'mm', region, month });
  } catch (error) {
    console.error('Rainfall prediction error:', error.message);
    res.status(500).json({ message: 'Rainfall prediction error', detail: error.message });
  }
};

// @desc    Recommend Crop (N,P,K,T,H,pH,R) via Python ML
// @route   POST /api/intelligence/recommend/crop
const recommendCrop = async (req, res) => {
  try {
    const { N, P, K, temperature, humidity, ph, rainfall } = req.body;
    const result = await runPython(
      'crop_recommendation/recommend.py',
      [JSON.stringify(N), JSON.stringify(P), JSON.stringify(K), JSON.stringify(temperature), JSON.stringify(humidity), JSON.stringify(ph), JSON.stringify(rainfall)]
    );
    res.json({ recommendation: result });
  } catch (error) {
    console.error('Crop recommendation error:', error.message);
    res.status(500).json({ message: 'Crop recommendation error', detail: error.message });
  }
};

// @desc    Recommend Fertilizer via Python ML
// @route   POST /api/intelligence/recommend/fertilizer
const recommendFertilizer = async (req, res) => {
  try {
    const { N, P, K, temperature, humidity, soilMoisture, soilType, crop } = req.body;
    const result = await runPython(
      'fertilizer_recommendation/fertilizer_recommendation.py',
      [
        String(N), String(P), String(K),
        String(temperature), String(humidity),
        String(soilMoisture), soilType, crop   // soilType & crop are plain strings — no JSON.stringify
      ]
    );
    res.json({ recommendation: result });
  } catch (error) {
    console.error('Fertilizer recommendation error:', error.message);
    res.status(500).json({ message: 'Fertilizer recommendation error', detail: error.message });
  }
};

// @desc    5-day Weather Forecast by city name
// @route   GET /api/intelligence/weather?city=Mysore
const getWeather = async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ message: 'city is required' });

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

// @desc    Get Agriculture/Farmers News from NewsAPI
// @route   GET /api/intelligence/news
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

// @desc    ChatBot proxy to Groq API (OpenAI-compatible, free & ultra-fast)
// @route   POST /api/intelligence/chatbot
const chatBot = async (req, res) => {
  try {
    const { messages } = req.body;
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

    // Groq is 100% OpenAI-compatible — same request format, just different base URL
    // Prepend a system message for agriculture context
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

    // Groq returns exact OpenAI format — pass through directly
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

