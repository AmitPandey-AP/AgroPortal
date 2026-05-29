# 🌿 Agricultural Assistance & Trading Portal
### Major Project Presentation

**Department of Computer Science & Engineering / Information Technology**

---

> **Project Title:** Agricultural Assistance & Trading Portal
> **Technology Stack:** MERN Stack + Python ML + Groq AI
> **Type:** Full-Stack Web Application (Major Academic Project)

---

## 📋 TABLE OF CONTENTS

| # | Topic |
|---|---|
| 1 | [Introduction](#1-introduction) |
| 2 | [Motivation](#2-motivation) |
| 3 | [Problem Statement](#3-problem-statement) |
| 4 | [Objectives](#4-objectives) |
| 5 | [Proposed System](#5-proposed-system) |
| 6 | [System Architecture / Design](#6-system-architecture--design) |
| 7 | [Technology Stack](#7-technology-stack) |
| 8 | [Methodology / Workflow](#8-methodology--workflow) |
| 9 | [Implementation / Features](#9-implementation--features) |
| 10 | [Results / Output Screens](#10-results--output-screens) |
| 11 | [Conclusion](#11-conclusion) |
| 12 | [Future Scope](#12-future-scope) |
| 13 | [References](#13-references) |

---

## 1. Introduction

### 1.1 Overview

Agriculture is the backbone of the Indian economy, contributing approximately **18% of GDP** and employing over **50% of the Indian workforce**. Despite this critical importance, Indian farmers — particularly small and marginal farmers — continue to face severe challenges: crop failure due to uninformed decisions, lack of market access, dependency on middlemen, and limited access to modern agricultural knowledge.

The **Agricultural Assistance & Trading Portal** is a full-stack web application designed to bridge this gap. It provides an integrated platform where:

- **Farmers** can sell crops directly to consumers (D2C), get AI-powered predictions on which crops to grow, how much yield to expect, what fertilizer to use, and consult an AI chatbot for real-time guidance
- **Customers** can browse and purchase fresh farm produce directly from farmers, eliminating intermediaries
- **Administrators** can monitor the entire platform — users, products, transactions, and queries

### 1.2 What the System Does

```
┌────────────────────────────────────────────────────────────────┐
│                  AGRICULTURAL PORTAL                           │
│                                                                │
│   FARMER       →   ML Predictions, AI Chat, D2C Selling        │
│   CUSTOMER     →   Marketplace, Stripe Payments, AI Tools      │
│   ADMIN        →   Dashboard, User & Product Management        │
│                                                                │
│   CORE ENGINE  →   MERN Stack + 5 Python ML Models + 4 APIs    │
└────────────────────────────────────────────────────────────────┘
```

### 1.3 Project Type

This is a **MERN Stack** (MongoDB, Express.js, React, Node.js) web application, migrated and substantially enhanced from a previous PHP + MySQL implementation. The current version integrates:
- 5 Python-based Machine Learning models
- Groq Llama 3.3 70B AI Chatbot
- Stripe payment gateway
- OpenWeatherMap & NewsAPI integrations

---

## 2. Motivation

### 2.1 The Agricultural Crisis

India has over **146 million farm holdings**, the majority of which are small and marginal (less than 2 hectares). These farmers face:

| Problem | Impact |
|---|---|
| No direct market access | 40-50% of produce value lost to middlemen |
| Crop selection based on guesswork | Risk of crop failure & financial loss |
| No access to scientific tools | Suboptimal fertilizer & resource use |
| Information gap | Farmers unaware of government schemes, best practices |
| Lack of digital literacy portals | Existing solutions are too complex or English-only |

### 2.2 Why Technology is the Answer

Digital platforms have already transformed industries like retail (Amazon), finance (GPay), and food delivery. Agriculture is the next frontier. Mobile internet penetration in rural India has crossed **400 million users** (TRAI, 2024), making a web-based agricultural portal viable and impactful.

### 2.3 Why Machine Learning for Agriculture?

Rule-based systems ("if state=Karnataka and season=Kharif, grow rice") cannot generalise across the diversity of Indian agriculture — 36 states/UTs, hundreds of districts, varying soil profiles. Machine Learning models learn patterns from **historical data** and generalise intelligently:

- Thousands of historical cropping records → Crop Prediction
- Decades of soil + yield data → Fertilizer & Crop Recommendation
- 115 years of rainfall history → Rainfall Prediction

### 2.4 Personal / Project Motivation

> "We wanted to build something that has real-world value beyond passing an exam — a system a farmer could actually use. By combining the scalable MERN stack with Python ML models and modern AI (Groq Llama 3.3), we aimed to demonstrate that academic projects can also be production-grade solutions."

---

## 3. Problem Statement

### 3.1 Formal Problem Statement

> **"Design and develop a full-stack web application that provides Indian farmers with AI-powered crop management tools and a direct-to-consumer marketplace, while offering customers a reliable platform to purchase farm produce. The system must implement role-based access, machine learning-based predictions for crop selection, yield estimation, rainfall forecasting, and fertilizer recommendations, along with a secure payment gateway and AI-powered conversational assistant."**

### 3.2 Existing System Limitations

| Existing Approach | Limitation |
|---|---|
| Phone-based middlemen | Price exploitation; no transparency |
| Manual crop selection (experience-based) | No data backing; high failure risk |
| Government agricultural portals | Complex, not farmer-friendly, no marketplace |
| Generic e-commerce platforms | Not agriculture-specific; no ML guidance |
| Previous PHP version (our own) | No SPA, session-based auth, no ML integration, no Stripe |

### 3.3 Scope of the Problem

The system must solve across three dimensions:

1. **Market Access** — farmers need a way to list and sell produce directly
2. **Decision Support** — farmers need data-driven guidance for crop and farming decisions
3. **Information Access** — farmers need weather, news, and expert AI assistance

---

## 4. Objectives

### 4.1 Primary Objectives

1. **Build a D2C Marketplace** — enable farmers to list, manage, and sell crops directly to consumers without intermediary dependency

2. **Implement 5 ML-Based Prediction Models:**
   - Crop Prediction (by State, District, Season)
   - Yield Prediction (in Quintals)
   - Rainfall Forecasting (historical average by region)
   - Crop Recommendation (based on soil NPK, pH, temperature)
   - Fertilizer Recommendation (based on soil type, crop & nutrient levels)

3. **Integrate an AI Agricultural Assistant** — powered by Groq Llama 3.3 70B for real-time farmer queries

4. **Implement Secure Online Payments** — Stripe-based card checkout with idempotent order fulfillment

5. **Role-Based Access Control** — distinct, secure portals for Farmers, Customers, and Admins

6. **Provide Weather & News Intelligence** — real-time agricultural weather and news feeds

### 4.2 Technical Objectives

- Migrate the system from PHP + MySQL to a modern **MERN stack** architecture
- Implement **JWT-based stateless authentication** (replacing PHP sessions)
- Ensure **cart state persistence** across Stripe payment redirects using Redux + localStorage
- Integrate **Python ML scripts** with Node.js using `child_process.spawn`
- Build a clean, role-aware **React SPA** with React Router v7 protected routes
- Design a **glassmorphism dark-themed** responsive UI in Vanilla CSS

### 4.3 Non-Technical Objectives

- Create a system usable even by someone with limited digital literacy
- Provide a "demo mode" where all features work without real API keys
- Build a scalable MVC architecture ready for production deployment

---

## 5. Proposed System

### 5.1 System Description

The proposed system is a **three-tier web application**:

```
┌──────────────────────────────────────────────────────────────────┐
│                        TIER 1 — CLIENT                          │
│         React 19 + Vite SPA  (http://localhost:5173)            │
│         Redux Toolkit  ·  React Router v7  ·  Axios             │
└────────────────────────┬─────────────────────────────────────────┘
                         │ REST API (JSON over HTTP)
                         │ JWT in Authorization header
┌────────────────────────┴─────────────────────────────────────────┐
│                        TIER 2 — SERVER                          │
│         Node.js + Express.js  (http://localhost:5000)           │
│                                                                  │
│  ┌─────────┐  ┌────────────┐  ┌────────────┐  ┌─────────────┐  │
│  │  Auth   │  │  Farmer    │  │  Market-   │  │ Intelligence│  │
│  │ Routes  │  │  Routes    │  │  place     │  │  Routes     │  │
│  └─────────┘  └────────────┘  └────────────┘  └──────┬──────┘  │
│                                                       │          │
│                                         child_process.spawn      │
│                                                       │          │
│                              ┌────────────────────────┴────────┐ │
│                              │   Python ML Scripts             │ │
│                              │  (scikit-learn + pandas)        │ │
│                              └─────────────────────────────────┘ │
└──────────────────────────────┬───────────────────────────────────┘
                               │ Mongoose ODM
┌──────────────────────────────┴───────────────────────────────────┐
│                       TIER 3 — DATABASE                         │
│                  MongoDB Atlas (Cloud)                          │
│         Users · Products · Orders · Contacts · CropData         │
└──────────────────────────────────────────────────────────────────┘
```

### 5.2 Key Differentiators from the Existing System

| Feature | Old System (PHP) | Proposed System (MERN) |
|---|---|---|
| Architecture | Multi-page PHP renders | React SPA with REST API |
| Authentication | PHP `$_SESSION` | JWT stateless tokens |
| Database | MySQL (relational) | MongoDB Atlas (NoSQL) |
| ML Integration | None | 5 Python ML models |
| AI Assistant | None | Groq Llama 3.3 70B |
| Payments | None | Stripe Checkout sessions |
| Cart Persistence | PHP session | Redux + localStorage |
| Image Upload | PHP `move_uploaded_file` | Multer (Node.js) |
| Customer Portal | Basic | Marketplace + Orders + Intelligence Hub |
| Admin Panel | Basic | Full stats + CRUD management |

### 5.3 User Roles & Access

```
┌────────────┬────────────────────────────────────────────────────┐
│ Role       │ Access Scope                                        │
├────────────┼────────────────────────────────────────────────────┤
│ 🌐 Public  │ Browse marketplace, contact form, register/login    │
├────────────┼────────────────────────────────────────────────────┤
│ 👨‍🌾 Farmer  │ Dashboard, ML predictions, crop trade, AI tools    │
├────────────┼────────────────────────────────────────────────────┤
│ 🛒 Customer│ Marketplace, cart, Stripe checkout, AI tools       │
├────────────┼────────────────────────────────────────────────────┤
│ 🛡️ Admin   │ Platform stats, manage farmers/customers/products  │
└────────────┴────────────────────────────────────────────────────┘
```

---

## 6. System Architecture / Design

### 6.1 Overall Architecture Diagram

```
                     ┌────────────────────┐
                     │   React Frontend   │
                     │   (Vite, Port 5173)│
                     └────────┬───────────┘
                              │ Axios REST calls (JSON)
                              │ Authorization: Bearer <JWT>
                     ┌────────┴───────────┐
                     │  Express.js Server │
                     │  (Node.js, Port 5000)
                     ├────────────────────┤
                     │  authRoutes        │ ─── authController.js
                     │  farmerRoutes      │ ─── farmerController.js ─► Multer
                     │  marketplaceRoutes │ ─── marketplaceController.js ─► Stripe
                     │  intelligenceRoutes│ ─── intelligenceController.js ─► Python
                     │  adminRoutes       │ ─── adminController.js
                     │  contactRoutes     │ ─── contactController.js
                     └────────┬─────┬─────┘
                              │     │
                    Mongoose  │     │  child_process.spawn
                              │     │
               ┌──────────────┘     └──────────────────┐
               ▼                                        ▼
      ┌─────────────────┐                   ┌──────────────────────┐
      │  MongoDB Atlas  │                   │   Python Scripts     │
      │  - users        │                   │  - crop_prediction   │
      │  - products     │                  │  - yield_prediction  │
      │  - orders       │                   │  - rainfall_pred     │
      │  - contacts     │                   │  - crop_recommend    │
      └─────────────────┘                   │  - fertilizer_rec    │
                                            └──────────────────────┘
                     External APIs:
                     ┌──────────────────────────────────────┐
                     │ Groq API   → Llama 3.3 70B ChatBot   │
                     │ OpenWeather→ 5-day weather forecast  │
                     │ NewsAPI    → Agriculture news feed   │
                     │ Stripe     → Card payment processing │
                     └──────────────────────────────────────┘
```

### 6.2 Frontend Component Tree

```
main.jsx
  └── Redux <Provider store>
        └── <App.jsx>
              ├── <Navbar /> — Role-aware navigation with dropdowns
              └── <Routes>
                    ├── Public    : /login, /register, /marketplace, /contact
                    ├── Protected : /profile  (any logged-in user)
                    ├── Farmer    : /dashboard, /farmer/prediction/*, /farmer/tools/*
                    ├── Customer  : /cart, /customer/orders, /intelligence
                    └── Admin     : /admin, /admin/farmers, /admin/stock, ...
```

### 6.3 Redux State Architecture

```
Redux Store
  ├── auth slice
  │     ├── user: { id, name, email, role }
  │     ├── token: "eyJ..."
  │     └── isAuthenticated: true/false
  │
  ├── cart slice (persisted → localStorage)
  │     └── items: [{ _id, title, price, quantity, image }]
  │
  └── prediction slice
        ├── result: "Rice, Wheat..."
        ├── loading: false
        └── error: null
```

### 6.4 Database Design (Entity Relationship)

```
USER (users)
  _id (PK), name, email, password(hashed), role,
  phone, gender, dob, state, district, city, timestamps

PRODUCT (products)
  _id (PK), farmer → User._id (FK),
  title, description, price, stockQuantity,
  category [Vegetables|Fruits|Grains|Equipment],
  images[], isAvailable, timestamps

ORDER (orders)
  _id (PK), customer → User._id (FK),
  orderItems[{ product→Product._id, qty, priceAtPurchase, title }],
  paymentDetails{ stripeSessionId, status },
  totalAmount, invoiceUrl, timestamps

CONTACT (contacts)
  _id (PK), name, email, message, timestamps
```

### 6.5 ML Pipeline Architecture

```
User Input (React Form)
      │
      ▼ POST /api/intelligence/predict|recommend/...
Express Controller (intelligenceController.js)
      │
      ▼ child_process.spawn('python', [script, ...args])
Python Script
  1. Load CSV dataset with pandas
  2. Preprocess data (encode, split)
  3. Train model (Random Forest / Decision Tree)
     OR Load pre-trained .pkl (crop prediction)
  4. Run inference on user input
  5. print(result) → stdout
      │
      ▼ Node.js captures stdout
Express sends JSON response
      │
      ▼ React displays result
```

### 6.6 Authentication Architecture

```
Register → bcrypt.hash(password, 10) → MongoDB save → JWT issued
Login    → bcrypt.compare(input, hash) → valid? → JWT issued
          JWT: { id: user._id } + JWT_SECRET → signed token

Every API Request:
  Axios interceptor → Authorization: Bearer <token>
  ↓
  protect() middleware → jwt.verify(token, secret) → req.user
  ↓
  restrictTo('farmer') → req.user.role check
```

---

## 7. Technology Stack

### 7.1 Full Technology Summary

```
┌──────────────────────────────────────────────────────────────────┐
│                    COMPLETE TECH STACK                           │
├──────────────────┬───────────────┬──────────────────────────────┤
│ Layer            │ Technology    │ Purpose                      │
├──────────────────┼───────────────┼──────────────────────────────┤
│ FRONTEND         │ React 19      │ UI component library         │
│                  │ Vite 8        │ Build tool & dev server      │
│                  │ React Router 7│ Client-side routing          │
│                  │ Redux Toolkit │ Global state management      │
│                  │ Axios         │ HTTP client                  │
│                  │ Stripe.js     │ Payment UI SDK               │
│                  │ Heroicons     │ Icon library                 │
│                  │ Vanilla CSS   │ Glassmorphism dark theme     │
├──────────────────┼───────────────┼──────────────────────────────┤
│ BACKEND          │ Node.js v20+  │ JavaScript runtime           │
│                  │ Express.js 5  │ REST API framework           │
│                  │ Mongoose 9    │ MongoDB ODM                  │
│                  │ bcryptjs      │ Password hashing             │
│                  │ jsonwebtoken  │ JWT auth tokens              │
│                  │ Multer        │ File upload middleware       │
│                  │ Stripe SDK    │ Payment processing           │
│                  │ Axios         │ External API proxy calls     │
│                  │ dotenv        │ Environment config           │
│                  │ CORS          │ Cross-origin handling        │
│                  │ nodemon       │ Development hot-reload       │
├──────────────────┼───────────────┼──────────────────────────────┤
│ DATABASE         │ MongoDB Atlas │ Cloud NoSQL database         │
├──────────────────┼───────────────┼──────────────────────────────┤
│ ML / AI          │ Python 3.x    │ ML script runtime            │
│                  │ scikit-learn  │ ML algorithms                │
│                  │ pandas        │ Data loading & processing    │
│                  │ numpy         │ Numerical arrays             │
│                  │ joblib        │ Model serialization (.pkl)   │
├──────────────────┼───────────────┼──────────────────────────────┤
│ EXTERNAL APIs    │ Groq (Llama)  │ AI chatbot (free, fast LLM)  │
│                  │ OpenWeather   │ 5-day weather forecast       │
│                  │ NewsAPI       │ Agriculture news             │
│                  │ Stripe        │ Card payments                │
└──────────────────┴───────────────┴──────────────────────────────┘
```

### 7.2 Why MERN?

| Reason | Detail |
|---|---|
| **Unified Language** | JavaScript used on both frontend (React) and backend (Node/Express) — no context switching |
| **JSON-native** | MongoDB stores JSON documents; Node.js works with JSON natively; React consumes JSON APIs — all aligned |
| **Scalability** | MongoDB scales horizontally; Node handles concurrent connections efficiently with event loop |
| **Ecosystem** | npm has the largest package ecosystem; React has massive community support |
| **Modern standard** | MERN is an industry-standard stack used by companies like LinkedIn, Netflix, and Airbnb |

### 7.3 Why Python for ML?

| Reason | Detail |
|---|---|
| **scikit-learn** | Industry-standard ML library with Decision Tree, Random Forest, encoders out-of-the-box |
| **pandas** | Best tool for CSV data loading, filtering, and preprocessing |
| **Existing ecosystem** | The ML datasets and algorithms were already Python-native |
| **Separation of concerns** | ML code separate from web code; each can evolve independently |

### 7.4 Why MongoDB over MySQL?

| MongoDB | MySQL |
|---|---|
| Flexible schema — optional profile fields need no ALTER TABLE | Rigid schema — every optional field needs nullable column |
| JSON documents — natural fit for JavaScript stack | Tables + JOINs — requires ORM mapping layer |
| Atlas free tier — cloud-hosted, no local setup | Requires local installation or cloud server setup |
| Mongoose ODM — clean schema + validation in code | Requires SQL migration scripts |

---

## 8. Methodology / Workflow

### 8.1 Development Methodology: Agile (Feature-Based Sprints)

```
Sprint 1: Foundation
  ✔ Node.js + Express server setup
  ✔ MongoDB Atlas connection + Mongoose models (User, Product, Order, Contact)
  ✔ JWT authentication (register/login/profile)
  ✔ React + Vite setup with Redux store

Sprint 2: Farmer Module
  ✔ Farmer Dashboard with product CRUD
  ✔ Multer image upload
  ✔ Python ML scripts: crop_prediction, yield_prediction, rainfall_prediction
  ✔ CropPrediction, YieldPrediction, RainfallPrediction React pages

Sprint 3: Intelligence & AI
  ✔ Crop recommendation (Random Forest Classifier)
  ✔ Fertilizer recommendation (Decision Tree Classifier)
  ✔ Groq Llama 3.3 chatbot proxy
  ✔ OpenWeatherMap 5-day forecast
  ✔ NewsAPI agriculture feed

Sprint 4: Marketplace & Payments
  ✔ Customer Marketplace with keyword/category search
  ✔ Product Details page
  ✔ Redux cart with localStorage persistence
  ✔ Stripe Checkout session creation
  ✔ Success page with verify-session + idempotent order fulfillment

Sprint 5: Admin & Polish
  ✔ Admin Dashboard with platform stats
  ✔ Admin manage: farmers, customers, crop stock, contact queries
  ✔ Customer Intelligence Hub, My Orders, Crop Stocks pages
  ✔ Farmer Selling History
  ✔ Role-based Navbar with dropdowns
  ✔ Glassmorphism CSS theme across all pages
```

### 8.2 Request–Response Workflow

```
User Action (UI click / form submit)
         │
         ▼
React Component (useState, useSelector)
         │ Axios call (api.js with JWT interceptor)
         ▼
Express Route → Middleware (protect, restrictTo)
         │
         ▼                     ┌─────────────────┐
Controller Logic ─────────────►│ MongoDB (CRUD)  │
                │               └─────────────────┘
                │               ┌──────────────────────┐
                └──────────────►│ Python ML (spawn)    │
                │               └──────────────────────┘
                │               ┌──────────────────────┐
                └──────────────►│ External API (axios) │
                                └──────────────────────┘
                │
                ▼
        JSON Response
                │
                ▼
React → setState / Redux dispatch
                │
                ▼
    Component re-renders with data
```

### 8.3 ML Model Training Workflow

```
CSV File (training data)
     │
     ▼ pandas.read_csv()
DataFrame loaded & cleaned
     │ dropna, strip whitespace, drop irrelevant columns
     ▼
Feature Engineering
     │ OneHotEncoder (categorical → binary) or LabelEncoder (category → integer)
     ▼
train_test_split (80% train, 20% test)
     │
     ▼
Model Training
     │ RandomForestClassifier / RandomForestRegressor / DecisionTreeClassifier
     ▼
Inference on user input (sys.argv)
     │
     ▼ print(result) → stdout → Node.js → JSON Response → React UI
```

### 8.4 Payment Processing Workflow

```
Cart (localStorage) → POST create-session → Stripe URL
     │
     ▼
Stripe hosted checkout (user enters card)
     │
     ▼
Stripe redirect → /success?session_id=cs_...
     │
     ▼
POST verify-session →
   1. stripe.checkout.sessions.retrieve(sessionId)
   2. Check payment_status === 'paid'
   3. Idempotency check (findOne by stripeSessionId)
   4. Decrement product stock, isAvailable=false if stock=0
   5. Create Order in MongoDB
   6. Return order → clearCart() in Redux
```

---

## 9. Implementation / Features

### 9.1 Feature List by Role

#### 👨‍🌾 Farmer Features

| # | Feature | How It Works |
|---|---|---|
| 1 | **Dashboard** | Stats (products, stock, revenue, orders) from MongoDB aggregation |
| 2 | **Add/Edit/Delete Products** | FormData with Multer image upload → stored in `/uploads/` |
| 3 | **Crop Prediction** | State + District + Season → Decision Tree `.pkl` via Python |
| 4 | **Yield Prediction** | State, District, Season, Crop, Area → Random Forest Regressor |
| 5 | **Rainfall Prediction** | Region + Month → historical 115-year average (pandas) |
| 6 | **Crop Recommendation** | N, P, K, Temp, Humidity, pH, Rainfall → Random Forest Classifier |
| 7 | **Fertilizer Recommendation** | Soil Type, Crop, N/P/K, Temp, Humidity → Decision Tree Classifier |
| 8 | **AI ChatBot** | Groq Llama 3.3 70B with agriculture system prompt |
| 9 | **Weather Forecast** | 5-day / 3-hourly data from OpenWeatherMap (city name input) |
| 10 | **News Feed** | Latest agriculture news from NewsAPI |
| 11 | **Selling History** | Orders containing farmer's products + revenue summary |
| 12 | **Profile** | View & edit with state/district cascading dropdown |

#### 🛒 Customer Features

| # | Feature | How It Works |
|---|---|---|
| 1 | **Marketplace** | Browse all available products with keyword + category filter |
| 2 | **Product Details** | Full product info including farmer contact |
| 3 | **Add to Cart** | Redux cart slice; persisted to localStorage |
| 4 | **Stripe Checkout** | Stripe session → hosted payment page → verify on return |
| 5 | **My Orders** | Purchase history from MongoDB (orders collection) |
| 6 | **Intelligence Hub** | Embedded Crop + Fertilizer Recommendation tools |
| 7 | **Crop Stocks** | Browse all crop listings by stock availability |
| 8 | **Profile** | Same profile editor as farmer |

#### 🛡️ Admin Features

| # | Feature | How It Works |
|---|---|---|
| 1 | **Dashboard** | Total farmers, customers, products, queries (MongoDB count) |
| 2 | **Manage Farmers** | List with search, delete farmer accounts |
| 3 | **Manage Customers** | List with search, delete customer accounts |
| 4 | **Crop Stock** | All products across all farmers |
| 5 | **Contact Queries** | View & delete all submitted contact form messages |

### 9.2 Key Implementation Details

#### JWT Authentication
```javascript
// authController.js — token generation
const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: '30d' }
)

// authMiddleware.js — token verification on every protected route
const decoded = jwt.verify(token, process.env.JWT_SECRET) // { id, iat, exp }
req.user = await User.findById(decoded.id).select('-password')
```

#### Python → Node.js Bridge
```javascript
// intelligenceController.js
const runPython = (scriptName, args) => new Promise((resolve, reject) => {
  const process = spawn('python', [scriptPath, ...args])
  process.stdout.on('data', data => output += data.toString())
  process.on('close', code => {
    if (code !== 0) reject(new Error('Python script failed'))
    else resolve(output.trim())
  })
})
```

#### Stripe Idempotency Guard
```javascript
// marketplaceController.js
const existing = await Order.findOne({ 'paymentDetails.stripeSessionId': sessionId })
if (existing) return res.json({ message: 'Already fulfilled', order: existing })
// Prevents duplicate orders if user refreshes the success page
```

#### Cart Persistence Across Stripe Redirect
```javascript
// store.js — saves cart to localStorage on every Redux state change
store.subscribe(() => saveCartToStorage(store.getState().cart))
// Preloads on app start — cart survives page reload + Stripe external redirect
const preloadedState = { cart: loadCartFromStorage() }
```

### 9.3 ML Models Implementation Summary

```
MODEL 1 — Crop Prediction
  Algorithm   : Custom Decision Tree (pre-trained, saved as .pkl)
  Input       : State, District, Season (string args from Node.js)
  Output      : List of suitable crops with distribution
  Dataset     : preprocessed2.csv (~1M rows of historical data)
  Training    : Done once; loaded via joblib on each request

MODEL 2 — Yield Prediction
  Algorithm   : Random Forest Regressor (100 trees)
  Encoding    : OneHotEncoder for State/District/Season/Crop
  Input       : State, District, Season, Crop, Area (hectares)
  Output      : Predicted yield in Quintals (float)
  Dataset     : crop_production_karnataka.csv

MODEL 3 — Rainfall Prediction
  Method      : Historical average (pandas groupby + mean)
  Input       : Meteorological subdivision name, Month (JAN/FEB/...)
  Output      : Average rainfall in mm
  Dataset     : rainfall_in_india_1901-2015.csv (115 years)

MODEL 4 — Crop Recommendation
  Algorithm   : Random Forest Classifier (10 trees, entropy criterion)
  Input       : N, P, K, Temperature, Humidity, pH, Rainfall (7 numeric values)
  Output      : Best crop name (from 22 possible crops)
  Dataset     : Crop_recommendation.csv (2200 rows)

MODEL 5 — Fertilizer Recommendation
  Algorithm   : Decision Tree Classifier
  Encoding    : LabelEncoder for Soil Type + Crop Type
  Input       : N, P, K, Temperature, Humidity, Soil Moisture, Soil Type, Crop
  Output      : Fertilizer name (e.g. Urea, DAP, 14-35-14)
  Dataset     : fertilizer_recommendation.csv
```

### 9.4 Project File Structure Summary

```
Agriculture_Portal/
├── README.md                    ← Complete setup & API documentation
├── PROJECT_GUIDE.md             ← Learning guide, flows, Q&A
├── PRESENTATION.md              ← This presentation document
├── TESTING_GUIDE.md             ← Testing instructions
│
├── backend/                     ← Node.js + Express (Port 5000)
│   ├── .env                     ← Environment variables
│   ├── package.json
│   ├── uploads/                 ← Multer image storage
│   └── src/
│       ├── server.js
│       ├── config/db.js         ← MongoDB connection
│       ├── controllers/         ← 6 controllers
│       ├── middleware/          ← JWT auth middleware
│       ├── models/              ← 5 Mongoose schemas
│       ├── routes/              ← 6 route files
│       └── scripts/             ← 5 Python ML scripts + seed.js
│
└── frontend/                    ← React 19 + Vite (Port 5173)
    ├── .env
    └── src/
        ├── App.jsx              ← Router + protected routes
        ├── store.js             ← Redux store + persistence
        ├── components/Navbar    ← Role-aware navigation
        ├── features/            ← auth, cart, prediction slices
        ├── pages/               ← 25 page components
        └── services/api.js      ← Axios + JWT interceptor
```

---

## 10. Results / Output Screens

### 10.1 Feature Outputs Summary

#### Authentication
```
✅ Register Page      — Role selection (Farmer / Customer / Admin)
✅ Login Page         — Email + Password with JWT response
✅ Profile Page       — State/District cascading dropdowns, editable fields
```

#### Farmer Dashboard
```
✅ Stats Cards        — "4 Products | 120 kg Stock | ₹8,400 Revenue | 3 Orders"
✅ Product Table      — CRUD with image preview, edit/delete buttons
✅ Trade Form         — Title, Price, Category, Stock Qty, Description, Image upload
```

#### ML Predictions
```
✅ Crop Prediction    → Input: "Karnataka / Mysore / Kharif"
                       Output: "Rice, Ragi, Maize" (with probability %)

✅ Yield Prediction   → Input: "Karnataka / Mysore / Kharif / Rice / 1500 ha"
                       Output: "Predicted Yield: 3842.50 Quintals"

✅ Rainfall Forecast  → Input: "Karnataka / JUL"
                       Output: "Predicted Rainfall: 165.4 mm"

✅ Crop Recommendation→ Input: N=90, P=42, K=43, Temp=21, Humidity=82, pH=6.5, Rainfall=203
                       Output: "Recommended Crop: Rice"

✅ Fertilizer Rec.   → Input: N=37, P=0, K=0, Temp=26, Humid=52, Moisture=38, Loamy, Maize
                       Output: "Recommended Fertilizer: Urea"
```

#### AI & Live Tools
```
✅ ChatBot           → Multi-turn conversation with Groq Llama 3.3 70B
                       System: "You are an Agriculture AI assistant for Indian farmers"
                       User: "Which crop is best for black soil in Maharashtra?"

✅ Weather Forecast  → 5-day / 3-hourly table: Temp Max/Min, Humidity, Wind, Condition

✅ News Feed         → Cards with title, author, date, description, link to full article
```

#### Customer & Marketplace
```
✅ Marketplace       → Grid of product cards: image, title, price, farmer name, "Add to Cart"
✅ Product Details   → Full info + quantity selector + "Add to Cart" button
✅ Cart              → Item list, quantity ++/--, remove, total, "Proceed to Checkout"
✅ Stripe Checkout   → Stripe-hosted page (test card: 4242 4242 4242 4242)
✅ Success Page      → "Payment successful! Order created. Cart cleared."
✅ My Orders         → Order history with items, total, date, status
```

#### Admin Panel
```
✅ Admin Dashboard   → Stats: total farmers, customers, products, queries
✅ Manage Farmers    → Searchable table, delete button
✅ Manage Customers  → Searchable table, delete button
✅ Crop Stock        → All products from all farmers with details
✅ Contact Queries   → Contact form submissions with delete
```

### 10.2 API Response Samples

**Crop Recommendation:**
```json
{
  "recommendation": "rice"
}
```

**Yield Prediction:**
```json
{
  "prediction": "3842.5",
  "unit": "Quintal"
}
```

**Stripe Checkout:**
```json
{
  "id": "cs_test_a1...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_a1..."
}
```

**Order Fulfillment:**
```json
{
  "message": "Order fulfilled",
  "order": {
    "_id": "64abc...",
    "customer": "64def...",
    "orderItems": [{ "title": "Organic Rice", "quantity": 2, "priceAtPurchase": 150 }],
    "totalAmount": 300,
    "paymentDetails": { "stripeSessionId": "cs_test...", "status": "completed" }
  }
}
```

---

## 11. Conclusion

### 11.1 Summary

The **Agricultural Assistance & Trading Portal** successfully demonstrates a production-grade full-stack web application that integrates:

1. **MERN Stack** — MongoDB, Express.js, React 19, Node.js for a responsive, modern SPA
2. **5 Python ML Models** — delivering data-driven agricultural intelligence (crop prediction, yield estimation, rainfall forecasting, crop & fertilizer recommendation)
3. **Groq AI Integration** — a real-time conversational AI assistant for farmers using Meta's Llama 3.3 70B model
4. **Stripe Payments** — secure, idempotent checkout with automatic stock management
5. **Role-Based Access** — distinct, secure portals for Farmers, Customers, and Admins
6. **Modern UI** — Glassmorphism dark theme with glassmorphic cards, smooth animations, and responsive layout

### 11.2 Key Achievements

| Objective | Status | Notes |
|---|---|---|
| D2C Marketplace | ✅ Complete | CRUD + image upload + Stripe |
| 5 ML Prediction Models | ✅ Complete | All 5 scripts functional |
| AI Chatbot | ✅ Complete | Groq Llama 3.3 integrated |
| Role-Based Auth | ✅ Complete | JWT + 3-layer protection |
| Cart Persistence | ✅ Complete | Survives Stripe redirect |
| Admin Panel | ✅ Complete | Full CRUD management |
| Weather & News | ✅ Complete | With mock/demo mode |
| Responsive UI | ✅ Complete | Glassmorphism dark theme |

### 11.3 Learning Outcomes

Through this project, we gained hands-on experience in:
- **Full-stack architecture** — designing scalable 3-tier applications
- **RESTful API design** — building and consuming 27+ endpoints
- **Database design** — MongoDB schema modeling with Mongoose
- **ML integration** — bridging Python ML with a Node.js server via IPC
- **Security** — JWT, bcrypt, role-based access, Stripe payment security
- **State management** — Redux Toolkit with persistence strategies
- **API integration** — Groq, Stripe, OpenWeatherMap, NewsAPI

### 11.4 Impact

This system, if deployed, could directly benefit:
- **Small & marginal farmers** — direct market access, AI-guided crop decisions
- **Urban consumers** — access to fresh, traceable farm produce
- **Agricultural NGOs** — a ready platform to onboard farmers digitally

---

## 12. Future Scope

### 12.1 Short-Term Improvements (3–6 months)

| Enhancement | Description |
|---|---|
| **Save ML models as `.pkl`** | Yield, Crop Recommendation, and Fertilizer models currently train on every request. Pre-training and caching would reduce latency from 30s to <1s |
| **Real-time Stripe Webhooks** | Implement proper `stripe.webhooks.constructEvent()` for production-grade payment confirmation |
| **Product Reviews & Ratings** | Allow customers to rate purchased products |
| **Push Notifications** | Notify farmers when their products are sold |
| **SMS OTP Verification** | Use Twilio for farmer phone verification |
| **Multi-language Support** | Hindi, Kannada, Marathi UI translations for wider farmer reach |
| **Image Compression** | Auto-resize uploaded product images using Sharp.js |

### 12.2 Medium-Term Enhancements (6–12 months)

| Enhancement | Description |
|---|---|
| **Mobile App (React Native)** | Cross-platform mobile app using the same REST API |
| **Geolocation-based Marketplace** | Show nearby farmers/products based on GPS |
| **Live Price Tracker** | Real-time crop price updates from AGMARKNET API |
| **Negotiation / Bidding System** | Allow buyers to negotiate directly with farmers |
| **IoT Integration** | Connect with soil sensors for real-time parameter reading instead of manual input |
| **Satellite-Based Crop Health** | Integration with NASA/ISRO satellite imagery APIs for crop monitoring |
| **Logistics / Delivery Tracking** | Partner with courier APIs for shipment tracking |

### 12.3 Long-Term Vision (1–2 years)

| Enhancement | Description |
|---|---|
| **Deep Learning Models** | Replace Random Forest with CNN-based crop disease detection from photos |
| **LLM Fine-tuning** | Fine-tune a smaller LLM specifically on Indian agricultural data |
| **Crowdsourcing Farmer Data** | Build a community atlas of soil & crop data reported by farmers |
| **Carbon Credit Marketplace** | Help farmers monetize sustainable farming practices |
| **Government API Integration** | PM-Kisan, PMFBY, eNAM scheme portals |
| **Microservices Architecture** | Split ML, marketplace, and auth into independent microservices on Kubernetes |
| **Blockchain for Traceability** | Record supply chain provenance on blockchain for food safety compliance |

### 12.4 Scalability Roadmap

```
Current:   Monolith (Node.js + Python scripts, local MongoDB)
Phase 1:   Cloud (MongoDB Atlas + Vercel frontend + Railway/Render backend)
Phase 2:   Microservices (ML as a separate FastAPI service on AWS SageMaker)
Phase 3:   Enterprise (Kubernetes, CDN for images, Redis caching, load balancer)
```

---

## 13. References

### 13.1 Academic / Research References

1. **Doshi, Z., Nadkarni, S. V., Agrawal, R., & Shah, N. (2018)**
   *AgriBot: A smart agriculture chat bot*
   IEEE Global Conference on Wireless Computing and Networking (GCWCN)

2. **Pudumalar, S., Ramanujam, E., Rajashree, R. H., Kavya, C., Kiruthika, T., & Jsia, J. (2017)**
   *Crop recommendation system for precision agriculture*
   8th Annual Information Technology, Electromechanical Engineering and Microelectronics Conference (IEMECON)

3. **Elavarasan, D., & Vincent, P. D. R. (2021)**
   *Crop yield prediction using deep reinforcement learning model for sustainable agrarian applications*
   IEEE Access, 8, 86886–86901

4. **Ministry of Agriculture & Farmers Welfare, Government of India (2024)**
   *Annual Report 2023-24*
   https://agricoop.nic.in

5. **TRAI (2024)**
   *Telecom Subscription Data: Rural Internet Users*
   https://trai.gov.in

### 13.2 Technology Documentation

6. **MongoDB Documentation**
   *Mongoose ODM — Schema, Models, Queries*
   https://mongoosejs.com/docs/guide.html

7. **React Documentation**
   *React 19 Hooks, Server Components*
   https://react.dev

8. **Redux Toolkit Documentation**
   *createSlice, configureStore, RTK Query*
   https://redux-toolkit.js.org

9. **scikit-learn Documentation**
   *RandomForestClassifier, RandomForestRegressor, DecisionTreeClassifier*
   https://scikit-learn.org/stable/modules/ensemble.html

10. **Stripe Documentation**
    *Stripe Checkout Sessions, Webhooks, Idempotency*
    https://stripe.com/docs/payments/checkout

11. **Groq Documentation**
    *Llama 3.3 70B API — OpenAI-compatible endpoints*
    https://console.groq.com/docs/quickstart

12. **OpenWeatherMap API Documentation**
    *5-Day Forecast API*
    https://openweathermap.org/forecast5

13. **NewsAPI Documentation**
    *Everything endpoint — querying agriculture news*
    https://newsapi.org/docs/endpoints/everything

14. **Vite Documentation**
    *Build tool for modern JavaScript projects*
    https://vitejs.dev/guide

15. **JWT (JSON Web Tokens) Specification**
    *RFC 7519 — JSON Web Token Standard*
    https://jwt.io/introduction

### 13.3 Datasets Used

16. **Crop Recommendation Dataset**
    *Kaggle — Atharva Ingle*
    https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset
    (2,200 rows; N, P, K, Temperature, Humidity, pH, Rainfall → Crop label)

17. **Crop Production Statistics — Karnataka**
    *Open Government Data (OGD) Platform India*
    https://data.gov.in
    (Historical crop production by district, season, crop; used for yield prediction)

18. **Rainfall in India 1901–2015**
    *Kaggle — RAJANAND ILANGOVAN*
    https://www.kaggle.com/datasets/rajanand/rainfall-in-india
    (Monthly rainfall across all Indian meteorological subdivisions; 115 years)

19. **Fertilizer Recommendation Dataset**
    *Kaggle Community Contribution*
    (Soil type, crop type, N/P/K/Temp/Humidity → Fertilizer name)

20. **India Crop Cultivation Dataset (Preprocessed)**
    *ICAR / State Agricultural Departments*
    (State, District, Season → Crop; pre-trained as Decision Tree `.pkl` model)

---

## 🔚 End of Presentation

---

**Prepared by:** [Your Name / Team Names]
**Guided by:** [Faculty Guide Name]
**Department:** [Department Name]
**Institution:** [Institution Name]
**Academic Year:** 2025–2026

---

*"Technology is best when it brings people together — and when it helps farmers grow better, everyone eats better."*

---
