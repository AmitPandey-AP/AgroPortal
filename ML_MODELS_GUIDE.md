# 🌾 ML Models & Predictions — Agriculture Portal

A complete technical reference for all machine learning models, datasets, algorithms,
API endpoints, and integration patterns used in the Agriculture Portal's AI Intelligence Hub.

---

## 📋 Table of Contents

1. [System Overview](#1-system-overview)
2. [Crop Recommendation](#2-crop-recommendation)
3. [Fertilizer Recommendation](#3-fertilizer-recommendation)
4. [Crop Prediction (by Region)](#4-crop-prediction-by-region)
5. [Yield Prediction](#5-yield-prediction)
6. [Rainfall Prediction](#6-rainfall-prediction)
7. [Dataset Sources & Origins](#7-dataset-sources--origins)
8. [Integration Architecture](#8-integration-architecture)
9. [API Reference](#9-api-reference)
10. [Data Flow Diagram](#10-data-flow-diagram)

---

## 1. System Overview

The Agriculture Portal uses a **Python + Node.js hybrid architecture** for ML inference.  
All five ML modules are Python scripts invoked by the Node.js backend via `child_process.spawn`.

```
React Frontend  ──►  Express API (Node.js)  ──►  Python ML Scripts
                           │                          │
                           │  intelligenceRoutes.js   │  scikit-learn / pandas
                           │  intelligenceController  │  custom Decision Tree
                           └──────────────────────────┘
```

| Module | Algorithm | Dataset | Output Type |
|---|---|---|---|
| Crop Recommendation | Random Forest Classifier | Crop_recommendation.csv | Single crop name |
| Fertilizer Recommendation | Decision Tree Classifier | fertilizer_recommendation.csv | Fertilizer name |
| Crop Prediction (Region) | Custom Decision Tree + pkl | preprocessed2.csv (pre-built) | List of suitable crops |
| Yield Prediction | Random Forest Regressor | crop_production_karnataka.csv | Production in Quintal |
| Rainfall Prediction | Historical Mean Lookup | rainfall_in_india_1901-2015.csv | Avg. rainfall in mm |

---

## 2. Crop Recommendation

### 📁 Script Location
```
backend/src/scripts/crop_recommendation/recommend.py
backend/src/scripts/crop_recommendation/Crop_recommendation.csv
```

### 🧠 Algorithm — Random Forest Classifier

| Property | Value |
|---|---|
| Algorithm | `RandomForestClassifier` (scikit-learn) |
| Number of Trees (`n_estimators`) | 10 |
| Split Criterion | Entropy (Information Gain) |
| Train/Test Split | 80% train / 20% test |
| `random_state` | 0 |

### 📊 Dataset — `Crop_recommendation.csv`

| Column | Type | Description |
|---|---|---|
| `N` | float | Nitrogen content in soil (kg/ha) |
| `P` | float | Phosphorus content in soil (kg/ha) |
| `K` | float | Potassium content in soil (kg/ha) |
| `temperature` | float | Ambient temperature (°C) |
| `humidity` | float | Relative humidity (%) |
| `ph` | float | Soil pH level (0–14) |
| `rainfall` | float | Annual rainfall (mm) |
| `label` | string | **Target** — crop name (e.g., rice, wheat, maize…) |

> **Dataset size:** ~150 KB (≈ 2,200 records, 22 unique crops)

### 🔄 How It Works

```
Input (7 soil + climate parameters)
   │
   ▼
Load CSV → Split 80/20 → Train Random Forest
   │
   ▼
Predict on [N, P, K, Temperature, Humidity, pH, Rainfall]
   │
   ▼
Output: Single crop name (string)
```

### 📥 Input Parameters

```json
{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 21,
  "humidity": 82,
  "ph": 6.5,
  "rainfall": 203
}
```

### 📤 Output

```json
{ "recommendation": "rice" }
```

### ⚠️ Notes
- The model is **re-trained on every request** (no pickle caching). For production, save the trained model as `.pkl`.
- Parameters are passed as **JSON-stringified strings** via command-line args.

---

## 3. Fertilizer Recommendation

### 📁 Script Location
```
backend/src/scripts/fertilizer_recommendation/fertilizer_recommendation.py
backend/src/scripts/fertilizer_recommendation/fertilizer_recommendation.csv
```

### 🧠 Algorithm — Decision Tree Classifier

| Property | Value |
|---|---|
| Algorithm | `DecisionTreeClassifier` (scikit-learn) |
| Split Criterion | Gini (default) |
| Random State | 0 |
| Encoding | `LabelEncoder` for `Soil Type` and `Crop Type` |

### 📊 Dataset — `fertilizer_recommendation.csv`

| Column | Type | Description |
|---|---|---|
| `Temperature` | float | Soil temperature (°C) |
| `Humidity` | float | Humidity (%) |
| `Moisture` | float | Soil moisture level |
| `Soil Type` | string | E.g., Sandy, Loamy, Black, Red, Clayey |
| `Crop Type` | string | E.g., Wheat, Maize, Sugarcane… |
| `N` | float | Nitrogen level |
| `K` | float | Potassium level |
| `P` | float | Phosphorus level |
| `Fertilizer Name` | string | **Target** — e.g., Urea, DAP, 14-35-14… |

> **Dataset size:** ~3.8 KB (small, ~100 records)

### 🔄 How It Works

```
Input (N, P, K, Temperature, Humidity, Moisture, SoilType, CropType)
   │
   ▼
Label-encode SoilType & CropType
   │
   ▼
Build input vector: [Temperature, Humidity, Moisture, Soil_enc, Crop_enc, N, K, P]
   │
   ▼
Predict with Decision Tree
   │
   ▼
Output: Fertilizer name (string)
```

### 📥 Input Parameters

```json
{
  "N": 37,
  "P": 0,
  "K": 0,
  "temperature": 26,
  "humidity": 52,
  "soilMoisture": 38,
  "soilType": "Sandy",
  "crop": "Maize"
}
```

### 📤 Output

```json
{ "recommendation": "Urea" }
```

### ⚠️ Notes
- Case-insensitive label matching is implemented — mismatched casing (e.g. `"sandy"` vs `"Sandy"`) is handled gracefully.
- Model is trained fresh every request.

---

## 4. Crop Prediction (by Region)

### 📁 Script Location
```
backend/src/scripts/crop_prediction/ZDecision_Tree_Model_Call.py   ← Inference script
backend/src/scripts/crop_prediction/ZDecision_Tree_Model.py        ← Training script (offline)
backend/src/scripts/crop_prediction/filetest2.pkl                  ← Pre-trained model
backend/src/scripts/crop_prediction/preprocessed2.csv             ← Preprocessed dataset
```

### 🧠 Algorithm — Custom Decision Tree (from scratch)

Unlike scikit-learn's `DecisionTreeClassifier`, this is a **hand-implemented CART decision tree** that:

| Concept | Detail |
|---|---|
| Splitting metric | **Gini Impurity** |
| Information Gain | Used to select the best split at each node |
| Leaf Node | Stores class probability distributions |
| Model format | Serialised as `filetest2.pkl` via `joblib.dump` |

**Core functions in `ZDecision_Tree_Model.py`:**

```python
gini(Data)              # Calculates Gini impurity of a dataset
info_gain(left, right)  # Calculates information gain of a split
find_best_split(Data)   # Tries all features × all values → best split
build_tree(Data)        # Recursively builds the full decision tree
classify(row, node)     # Traverses tree to classify a single row
```

### 📊 Dataset — `preprocessed2.csv`

Pre-processed version of crop production data.

| Column | Type | Description |
|---|---|---|
| `State_Name` | string | Indian state |
| `District_Name` | string | District within the state |
| `Season` | string | Kharif, Rabi, Whole Year, etc. |
| `Crop` | string | **Target** — crop name |

> **Dataset size:** ~12 MB (large — covers multiple states across India)

### 🔄 How It Works

```
[One-time Offline Training — ZDecision_Tree_Model.py]
Load preprocessed2.csv → Build custom Decision Tree → Save as filetest2.pkl

[Runtime Inference — ZDecision_Tree_Model_Call.py]
Load filetest2.pkl
   │
Input: [State, District, Season]
   │
Traverse trained tree → Leaf node → Class distribution as {crop: probability%}
   │
Output: All matched crop names (one per line, comma-separated)
```

### 📥 Input Parameters

```json
{
  "state": "Karnataka",
  "district": "Mysore",
  "season": "Kharif"
}
```

### 📤 Output

```json
{
  "prediction": "Rice\n  ,  \nMaize\n  ,  \nRagi\n  ,  ",
  "district": "Mysore",
  "season": "Kharif"
}
```

### ⚠️ Notes
- This model **does NOT** re-train on each request — it loads the pre-built `filetest2.pkl`.
- The pkl file was built using `sklearn.externals.joblib` (older API). Current inference uses `import joblib` directly.
- Output format: crops separated by `"  ,  "` delimiters (parsed by the frontend).

---

## 5. Yield Prediction

### 📁 Script Location
```
backend/src/scripts/yield_prediction/yield_prediction.py
backend/src/scripts/yield_prediction/crop_production_karnataka.csv
```

### 🧠 Algorithm — Random Forest Regressor

| Property | Value |
|---|---|
| Algorithm | `RandomForestRegressor` (scikit-learn) |
| Number of Trees | 100 |
| Task Type | **Regression** (predicts a numeric production value) |
| Encoding | `OneHotEncoder` for categorical features |
| Train/Test Split | 80% / 20%, `random_state=42` |

### 📊 Dataset — `crop_production_karnataka.csv`

| Column | Type | Description |
|---|---|---|
| `State_Name` | string | Always "Karnataka" in this dataset |
| `District_Name` | string | District within Karnataka |
| `Crop_Year` | int | Year (dropped before training) |
| `Season` | string | Kharif, Rabi, etc. (whitespace-stripped) |
| `Crop` | string | Crop name |
| `Area` | float | Area under cultivation (hectares) |
| `Production` | float | **Target** — crop production (Quintals) |

> **Dataset size:** ~1.1 MB (large, multi-year Karnataka data)

### 🔄 How It Works

```
Load CSV → Drop Crop_Year → Strip Season whitespace → Drop NaN Production rows
   │
   ▼
OneHotEncode: [State_Name, District_Name, Season, Crop]
Numeric: [Area]
   │
   ▼
Combine encoded + numeric → Train RandomForestRegressor (100 trees)
   │
   ▼
User input → Same OHE transform → Predict → Round to 2 decimals
   │
   ▼
Output: Production in Quintals
```

### 📥 Input Parameters

```json
{
  "state": "Karnataka",
  "district": "Mysore",
  "season": "Kharif",
  "crop": "Rice",
  "area": 120
}
```

### 📤 Output

```json
{ "prediction": "4521.36", "unit": "Quintal" }
```

### ⚠️ Notes
- Model is **re-trained on every API call**. With 100 trees on ~1.1MB of data, this can be slow (~5–10s). Consider pickling the trained model.
- `Crop_Year` is intentionally excluded — the model predicts based on geography, season, crop, and area only.
- Karnataka-specific dataset — predictions may be inaccurate for other states.

---

## 6. Rainfall Prediction

### 📁 Script Location
```
backend/src/scripts/rainfall_prediction/rainfall_prediction.py
backend/src/scripts/rainfall_prediction/rainfall_in_india_1901-2015.csv
```

### 🧠 Algorithm — Historical Mean Averaging

> **No ML model is used here.** Rainfall is predicted by computing the **historical monthly mean** for a given subdivision (state/region).

| Property | Value |
|---|---|
| Method | `pandas` `groupby` + `.mean()` |
| Time Range | 1901–2015 (115 years of data) |
| Accuracy | Reflects long-term climatological average |

### 📊 Dataset — `rainfall_in_india_1901-2015.csv`

| Column | Type | Description |
|---|---|---|
| `SUBDIVISION` | string | Indian meteorological subdivision (e.g., "KERALA", "ANDAMAN & NICOBAR ISLANDS") |
| `YEAR` | int | Year of record |
| `JAN` | float | January rainfall (mm) |
| `FEB` | float | February rainfall (mm) |
| `MAR` | float | March rainfall (mm) |
| `APR` | float | April rainfall (mm) |
| `MAY` | float | May rainfall (mm) |
| `JUN` | float | June rainfall (mm) |
| `JUL` | float | July rainfall (mm) |
| `AUG` | float | August rainfall (mm) |
| `SEP` | float | September rainfall (mm) |
| `OCT` | float | October rainfall (mm) |
| `NOV` | float | November rainfall (mm) |
| `DEC` | float | December rainfall (mm) |
| `ANNUAL` | float | Annual total rainfall (mm) |

> **Dataset size:** ~515 KB (1901–2015, all Indian subdivisions)

### 🔄 How It Works

```
Input: [region (SUBDIVISION), month (e.g. "JUN")]
   │
   ▼
Filter rows where SUBDIVISION == region
   │
   ▼
Compute df[month].mean() across all years (1901–2015)
   │
   ▼
Output: Average rainfall for that month in mm
```

### 📥 Input Parameters

```json
{
  "region": "KERALA",
  "month": "JUN"
}
```

### 📤 Output

```json
{ "prediction": "651.23", "unit": "mm", "region": "KERALA", "month": "JUN" }
```

### ⚠️ Notes
- `month` must be passed as a **3-letter uppercase abbreviation**: `JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUN`, `JUL`, `AUG`, `SEP`, `OCT`, `NOV`, `DEC`.
- `region` must exactly match the `SUBDIVISION` column values in the CSV (ALL CAPS).
- This is **not a predictive model** — it returns a historical average, not a forecast.

---

## 7. Dataset Sources & Origins

All CSV datasets used in this project are sourced from **Kaggle** (a public ML platform),
whose data ultimately traces back to **Indian Government open data portals**.

### 🔗 Origin Chain

```
Government / Research Sources
       │
       ├── IMD (India Meteorological Dept) ──► data.gov.in ──► Kaggle ──► rainfall CSV
       │
       ├── Indian Agri / Fertilizer Depts ──► Augmented data ──► Kaggle ──► crop recommendation CSV
       │
       ├── Govt agricultural records ──► data.world ──► Kaggle ──► crop production CSV
       │
       └── Research compilation ──► Kaggle ──► fertilizer recommendation CSV
```

---

### 📂 Dataset 1 — `Crop_recommendation.csv`

| Field | Detail |
|---|---|
| **Kaggle URL** | https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset |
| **Author** | Atharva Ingle (`@AtharvaIngle7`) |
| **License** | **Apache 2.0** (Free to use, modify, distribute) |
| **Published** | December 2020 |
| **Downloads** | ~92,000+ |
| **Views** | ~491,000+ |
| **Origin** | Augmented from Indian rainfall, climate & fertilizer databases |
| **Description** | *"Build a predictive model to recommend the most suitable crops to grow in a particular farm based on various parameters"* |

**Why this dataset?**  
It is the most widely-used Indian crop recommendation dataset with clean, well-labelled soil+climate features across 22 crop classes — ideal for training a Random Forest classifier.

---

### 📂 Dataset 2 — `fertilizer_recommendation.csv`

| Field | Detail |
|---|---|
| **Kaggle URL** | https://www.kaggle.com/datasets/gdabhishek/fertilizer-prediction |
| **Author** | G D Abhishek (`@gdabhishek`) |
| **License** | Unknown (research/compilation) |
| **Published** | November 2019 |
| **Downloads** | ~11,000 |
| **Views** | ~64,000 |
| **Origin** | *"Researched from various websites and sources"* — compiled fertilizer usage data |
| **Description** | *"Data of various fertilizers information — soil conditions mapped to fertilizer types"* |

**Why this dataset?**  
The only readily available structured dataset linking soil NPK, moisture, soil type, and crop type to specific fertilizer names in an Indian agricultural context.

---

### 📂 Dataset 3 — `crop_production_karnataka.csv` + `preprocessed2.csv`

Both files originate from the **same** Kaggle source — one is a Karnataka-filtered subset, the other is the full multi-state version.

| Field | Detail |
|---|---|
| **Kaggle URL** | https://www.kaggle.com/datasets/abhinand05/crop-production-in-india |
| **Author** | Abhinand (`@abhinand05`) |
| **License** | As specified in dataset description |
| **Published** | November 2019 |
| **Downloads** | ~17,000 |
| **Views** | ~97,000 |
| **True Origin** | [data.world/thatzprem/agriculture-india](https://data.world/thatzprem/agriculture-india) → originally compiled from **Government of India agricultural production records** |
| **Description** | *"Huge amount of information on crop production in India ranging from several years — State/District/Season/Area/Production"* |

**Usage in this project:**
- `crop_production_karnataka.csv` → **Karnataka rows only** → used for Yield Prediction (Random Forest Regressor)
- `preprocessed2.csv` → **All-India rows**, pre-processed (State, District, Season, Crop only) → used to train the custom Decision Tree pkl model

---

### 📂 Dataset 4 — `rainfall_in_india_1901-2015.csv`

| Field | Detail |
|---|---|
| **Kaggle URL** | https://www.kaggle.com/datasets/rajanand/rainfall-in-india |
| **Author** | RAJANAND ILANGOVAN (`@iRajanand`) |
| **License** | **CC BY-SA 4.0** (Open — attribution required) |
| **Published** | 2017 (Version 2) |
| **Downloads** | ~47,000 |
| **Views** | ~217,000 |
| **True Origin** | **India Meteorological Department (IMD)** — official govt data published on [data.gov.in](https://data.gov.in/catalog/rainfall-india) under **Government Open Data License - India** |
| **Description** | *"Sub-division wise monthly data for 115 years from 1901–2015. 36 meteorological sub-divisions, monthly granularity, unit: mm"* |

**Why this dataset?**  
IMD is the authoritative source for Indian rainfall records. 115 years of data across all 36 sub-divisions provides a reliable historical average for each region and month.

---

### 📊 Datasets at a Glance

| File | Kaggle Author | True Origin | License | Size | Records |
|---|---|---|---|---|---|
| `Crop_recommendation.csv` | Atharva Ingle | Indian Agri/Climate DBs | Apache 2.0 | ~150 KB | 2,200 |
| `fertilizer_recommendation.csv` | G D Abhishek | Research compilation | Unknown | ~3.8 KB | ~100 |
| `crop_production_karnataka.csv` | Abhinand | Govt of India agri records | As described | ~1.1 MB | ~30,000 |
| `preprocessed2.csv` | Abhinand (same) | Govt of India agri records | As described | ~12 MB | ~300,000 |
| `rainfall_in_india_1901-2015.csv` | Rajanand Ilangovan | IMD / data.gov.in | CC BY-SA 4.0 | ~515 KB | ~4,140 |

---

## 8. Integration Architecture

### Node.js → Python Bridge

All Python scripts are invoked via **`child_process.spawn`** in `intelligenceController.js`:

```javascript
const runPython = (scriptName, args) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../scripts', scriptName);
    const pythonProcess = spawn('python', [scriptPath, ...args]);
    // Collects stdout → resolves promise
    // Non-zero exit code → rejects with stderr
  });
};
```

### Argument Passing Convention

| Feature | Arguments passed as |
|---|---|
| Crop Recommendation | `JSON.stringify(value)` (JSON strings) |
| Fertilizer Recommendation | `String(value)` (plain strings) |
| Crop Prediction | Plain strings |
| Yield Prediction | Plain strings (area as `String(number)`) |
| Rainfall Prediction | Plain strings |

### Frontend Pages (React)

| Page | Route | Feature used |
|---|---|---|
| AI Intelligence Hub | `/farmer/intelligence` | All 5 ML modules + Weather + News + Chatbot |
| Crop Recommender | Tab within Intelligence Hub | `POST /api/intelligence/recommend/crop` |
| Fertilizer Advisor | Tab within Intelligence Hub | `POST /api/intelligence/recommend/fertilizer` |
| Crop Predictor | Tab within Intelligence Hub | `POST /api/intelligence/predict/crop` |
| Yield Estimator | Tab within Intelligence Hub | `POST /api/intelligence/predict/yield` |
| Rainfall Tool | Tab within Intelligence Hub | `POST /api/intelligence/predict/rainfall` |

---

## 9. API Reference

Base URL: `http://localhost:5000/api/intelligence`

### Crop Recommendation
```
POST /recommend/crop
Body: { N, P, K, temperature, humidity, ph, rainfall }
Response: { recommendation: "rice" }
```

### Fertilizer Recommendation
```
POST /recommend/fertilizer
Body: { N, P, K, temperature, humidity, soilMoisture, soilType, crop }
Response: { recommendation: "Urea" }
```

### Crop Prediction (by Region)
```
POST /predict/crop
Body: { state, district, season }
Response: { prediction: "Rice\n  ,  \nMaize\n  ,  ", district, season }
```

### Yield Prediction
```
POST /predict/yield
Body: { state, district, season, crop, area }
Response: { prediction: "4521.36", unit: "Quintal" }
```

### Rainfall Prediction
```
POST /predict/rainfall
Body: { region, month }
Response: { prediction: "651.23", unit: "mm", region, month }
```

### Weather Forecast
```
GET /weather?city=Mysore
Response: { city, list: [...5-day forecast] }   (OpenWeatherMap API)
```

### Agricultural News
```
GET /news
Response: { articles: [...] }   (NewsAPI)
```

### AI Chatbot
```
POST /chatbot
Body: { messages: [{role, content}, ...] }
Response: OpenAI-compatible (via Groq — llama-3.3-70b-versatile)
```

---

## 10. Data Flow Diagram

```
USER INPUT (React Frontend)
        │
        ▼
  Express Router  (intelligenceRoutes.js)
        │
        ▼
  intelligenceController.js
  └── runPython(scriptPath, args)
              │
       child_process.spawn('python', ...)
              │
    ┌─────────┴──────────┐
    │                    │
  stdout (result)      stderr (errors)
    │
    ▼
  res.json({ recommendation/prediction: result })
        │
        ▼
  React State Update → UI Display
```

---

## 🔧 Setup Requirements

### Python Dependencies
```bash
pip install pandas numpy scikit-learn joblib
```

### Environment Variables (backend `.env`)
```env
OPENWEATHER_API_KEY=your_openweather_key
NEWS_API_KEY=your_newsapi_key
GROQ_API_KEY=your_groq_key
```

---

## 📌 Known Limitations & Improvement Suggestions

| Issue | Current State | Suggestion |
|---|---|---|
| Model re-training per request | Crop Recommendation & Yield re-train each call | Pickle/cache trained models on startup |
| Small fertilizer dataset | ~100 rows | Expand dataset for better accuracy |
| Crop Prediction output format | Raw string with `"  ,  "` separators | Switch to JSON array output |
| Karnataka-only yield data | Yield model limited to Karnataka | Add national dataset |
| Rainfall is historical average | Not a real forecast | Integrate OpenWeatherMap historical or ML-based model |
| No model accuracy metrics | Models trained without evaluation reporting | Add accuracy/R² logging on startup |
