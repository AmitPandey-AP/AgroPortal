import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cropPrediction: null,
  fertilizerRecommendation: null,
  weather: null,
  news: [],
};

export const predictionSlice = createSlice({
  name: 'prediction',
  initialState,
  reducers: {
    setCropPrediction: (state, action) => {
      state.cropPrediction = action.payload;
    },
    setFertilizerRecommendation: (state, action) => {
      state.fertilizerRecommendation = action.payload;
    },
    setWeather: (state, action) => {
      state.weather = action.payload;
    },
    setNews: (state, action) => {
       state.news = action.payload;
    }
  },
});

export const { setCropPrediction, setFertilizerRecommendation, setWeather, setNews } = predictionSlice.actions;
export default predictionSlice.reducer;
