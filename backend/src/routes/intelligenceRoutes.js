const express = require('express');
const router = express.Router();
const {
  predictCrop,
  predictYield,
  predictRainfall,
  recommendCrop,
  recommendFertilizer,
  getWeather,
  getNews,
  chatBot,
} = require('../controllers/intelligenceController');

router.post('/predict/crop', predictCrop);
router.post('/predict/yield', predictYield);
router.post('/predict/rainfall', predictRainfall);
router.post('/recommend/crop', recommendCrop);
router.post('/recommend/fertilizer', recommendFertilizer);
router.get('/weather', getWeather);
router.get('/news', getNews);
router.post('/chatbot', chatBot);

module.exports = router;
