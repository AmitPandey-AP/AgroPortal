const mongoose = require('mongoose');

const cropDataSchema = new mongoose.Schema({
  nitrogen: { type: Number },
  phosphorus: { type: Number },
  potassium: { type: Number },
  temperature: { type: Number },
  humidity: { type: Number },
  ph: { type: Number },
  rainfall: { type: Number },
  recommendedCrop: { type: String },
  recommendedFertilizer: { type: String }
});

module.exports = mongoose.model('CropData', cropDataSchema);
