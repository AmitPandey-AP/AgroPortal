# 🌿 Agricultural Assistance & Trading Portal

A full-stack **MERN** web application built as a Major Academic Project — combining AI-powered agricultural analytics with a direct-to-consumer (D2C) crop marketplace. Purpose-built for Indian farmers and customers, it features 5 Python-based ML models, a Groq Llama 3.3 AI chatbot, live weather forecasting, a news feed, Stripe payments, and a complete admin panel.

> **Migrated from:** PHP + MySQL + XAMPP  
> **Migrated to:** MERN Stack (MongoDB + Express.js + React 19 + Node.js) with Python ML integration

---

## ✨ Features

### 🌾 Farmer Portal
| Feature | Description |
|---|---|
| **Dashboard** | Overview of listed products, total sales & revenue stats |
| **Crop Prediction** | Predict suitable crops by State, District & Season (Decision Tree `.pkl` model) |
| **Yield Prediction** | Predict crop yield in Quintals (Random Forest Regressor) |
| **Rainfall Prediction** | Predict monthly average rainfall in mm by region (Historical linear model) |
| **Crop Recommendation** | Recommend crop using N, P, K, Temperature, Humidity, pH, Rainfall (Random Forest Classifier) |
| **Fertilizer Recommendation** | Recommend fertilizer using soil & crop parameters (Decision Tree Classifier) |
| **Trade Crops** | List crops for sale with pricing, category, stock qty & image upload |
| **Selling History** | View all past orders with product names, revenue & order totals |
| **AI ChatBot** | Agriculture assistant powered by **Groq Llama 3.3 70B Versatile** |
| **Weather Forecast** | 5-day/3-hourly forecast via OpenWeatherMap API |
| **News Feed** | Latest agriculture news via NewsAPI (farmers + india + agriculture) |
| **Profile** | View & edit profile — name, email, phone, gender, DOB, State/District |

### 🛒 Customer Portal
| Feature | Description |
|---|---|
| **Marketplace** | Browse, search & filter all available crop listings (keyword + category) |
| **Product Details** | View full product info including farmer contact |
| **Cart** | Add/remove items, manage quantities — persisted in `localStorage` |
| **Stripe Checkout** | Secure online payment via Stripe; stock auto-decrements on payment |
| **Order Verification** | `/success` page verifies Stripe session & creates order (idempotent) |
| **My Orders** | View complete purchase history |
| **Crop Stocks** | Browse all crop listings (stock-level view) |
| **AI Intelligence Hub** | Embedded Crop & Fertilizer Recommendation tools for customers |
| **Profile** | View & edit personal profile |

### 🛡️ Admin Panel
| Feature | Description |
|---|---|
| **Dashboard** | Platform-wide stats — total farmers, customers, products, queries |
| **Manage Farmers** | View, search & delete farmer accounts |
| **Manage Customers** | View, search & delete customer accounts |
| **Crop Stock** | View all listed crop products across all farmers |
| **Contact Queries** | View & delete submitted contact form queries |

### 🌐 Public
| Feature | Description |
|---|---|
| **Register / Login** | Role-based JWT authentication (Farmer / Customer / Admin) |
| **Marketplace** | Browse products without login |
| **Contact Form** | Submit queries to the admin |
| **Intelligence Hub** | Public access to crop & fertilizer recommendation tools |

---

## 🏗️ System Architecture

```
Agriculture_Portal/
├── backend/                         # Node.js + Express API (Port 5000)
│   ├── .env                         # Environment variables
│   ├── package.json
│   ├── uploads/                     # Multer-uploaded product images (served statically)
│   └── src/
│       ├── server.js                # Express app entry point
│       ├── config/
│       │   └── db.js                # Mongoose MongoDB connection
│       ├── controllers/
│       │   ├── authController.js    # Register, Login, GetProfile, UpdateProfile (bcrypt + JWT)
│       │   ├── farmerController.js  # Products CRUD, Dashboard stats, Selling history
│       │   ├── marketplaceController.js  # Browse products, Stripe checkout, Order fulfillment
│       │   ├── intelligenceController.js # ML predictions, Weather, News, Groq ChatBot
│       │   ├── adminController.js   # Platform-wide stats, Manage farmers/customers/stock/queries
│       │   └── contactController.js # Contact form submission
│       ├── middleware/
│       │   └── authMiddleware.js    # JWT protect() + restrictTo(role) guards
│       ├── models/
│       │   ├── User.js              # name, email, password, role, phone, gender, dob, state, district, city
│       │   ├── Product.js           # farmer(ref), title, description, price, stockQuantity, category, images[]
│       │   ├── Order.js             # customer(ref), orderItems[], paymentDetails{stripeSessionId, status}, totalAmount
│       │   ├── Contact.js           # Contact query schema
│       │   └── CropData.js          # Crop data reference model
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── farmerRoutes.js      # Multer image upload middleware
│       │   ├── marketplaceRoutes.js # Stripe checkout + orders
│       │   ├── intelligenceRoutes.js
│       │   ├── adminRoutes.js
│       │   └── contactRoutes.js
│       ├── scripts/                 # Python ML scripts (called via child_process.spawn)
│       │   ├── seed.js              # Database seeder
│       │   ├── crop_prediction/
│       │   │   ├── ZDecision_Tree_Model.py       # Model trainer (builds .pkl)
│       │   │   ├── ZDecision_Tree_Model_Call.py  # Inference script (loads .pkl)
│       │   │   ├── filetest2.pkl                 # Pre-trained Decision Tree model
│       │   │   └── preprocessed2.csv             # Training dataset (State/District/Season/Crop)
│       │   ├── yield_prediction/
│       │   │   ├── yield_prediction.py           # Random Forest Regressor (trains on-the-fly)
│       │   │   └── crop_production_karnataka.csv # Historical production data
│       │   ├── rainfall_prediction/
│       │   │   ├── rainfall_prediction.py        # Historical average lookup
│       │   │   └── rainfall_in_india_1901-2015.csv
│       │   ├── crop_recommendation/
│       │   │   ├── recommend.py                  # Random Forest Classifier (trains on-the-fly)
│       │   │   └── Crop_recommendation.csv       # N,P,K,Temp,Humidity,pH,Rainfall → Crop
│       │   └── fertilizer_recommendation/
│       │       ├── fertilizer_recommendation.py  # Decision Tree Classifier (trains on-the-fly)
│       │       └── fertilizer_recommendation.csv
│       ├── services/
│       └── utils/
│
└── frontend/                        # React 19 + Vite (Port 5173)
    ├── .env                         # VITE_API_URL, VITE_STRIPE_PUBLISHABLE_KEY
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx                 # React DOM entry + Redux Provider
        ├── App.jsx                  # React Router v7 with ProtectedRoute guards
        ├── store.js                 # Redux store + localStorage cart persistence
        ├── index.css                # Global CSS (Glassmorphism dark theme)
        ├── components/
        │   └── Navbar.jsx           # Role-based nav with dropdowns (farmer/customer/admin)
        ├── data/
        │   └── indiaData.js         # States, districts, regions, crop lists (static reference)
        ├── features/
        │   ├── auth/authSlice.js    # Login/logout, user state, JWT storage
        │   ├── cart/cartSlice.js    # Cart items, localStorage persistence
        │   └── prediction/predictionSlice.js  # ML form results
        ├── pages/
        │   ├── common/
        │   │   ├── Login.jsx
        │   │   ├── Register.jsx
        │   │   ├── Profile.jsx      # State/District cascading select + profile update
        │   │   ├── Contact.jsx
        │   │   └── Success.jsx      # Stripe redirect handler → verifies session → clears cart
        │   ├── farmer/
        │   │   ├── Dashboard.jsx    # Stats cards + product list/add/edit/delete
        │   │   ├── CropPrediction.jsx
        │   │   ├── YieldPrediction.jsx
        │   │   ├── RainfallPrediction.jsx
        │   │   ├── CropRecommendation.jsx
        │   │   ├── FertilizerRecommendation.jsx
        │   │   ├── SellingHistory.jsx
        │   │   ├── ChatBot.jsx      # Groq Llama 3.3 chat interface
        │   │   ├── WeatherForecast.jsx
        │   │   └── NewsFeed.jsx
        │   ├── customer/
        │   │   ├── Marketplace.jsx
        │   │   ├── ProductDetails.jsx
        │   │   ├── Cart.jsx
        │   │   ├── IntelligenceHub.jsx  # Full crop + fertilizer recommendation UI
        │   │   ├── CropStocks.jsx
        │   │   └── MyOrders.jsx
        │   └── admin/
        │       ├── AdminDashboard.jsx
        │       └── AdminPages.jsx    # AdminFarmers, AdminCustomers, AdminCropStock, AdminQueries
        ├── services/
        │   └── api.js               # Axios instance with JWT interceptor (Authorization header)
        └── styles/
```

---

## 🧰 Complete Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | v20.19+ / v22.12+ | Runtime environment |
| **Express.js** | v5.2.1 | HTTP server & REST API framework |
| **MongoDB Atlas** | Cloud | NoSQL database |
| **Mongoose** | v9.4.1 | ODM — schema validation & queries |
| **bcryptjs** | v3.0.3 | Password hashing |
| **jsonwebtoken** | v9.0.3 | JWT-based authentication |
| **Multer** | v2.1.1 | File uploads (product images) |
| **Stripe** | v22.0.0 | Payment processing |
| **Axios** | v1.14.0 | HTTP client for external APIs |
| **dotenv** | v17.4.0 | Environment variable management |
| **CORS** | v2.8.6 | Cross-origin request handling |
| **nodemon** | v3.1.14 | Dev hot-reload |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | v19.2.4 | UI component library |
| **Vite** | v8.0.1 | Build tool & dev server |
| **React Router DOM** | v7.14.0 | Client-side routing |
| **Redux Toolkit** | v2.11.2 | Global state management |
| **React Redux** | v9.2.0 | React-Redux bindings |
| **Axios** | v1.14.0 | HTTP client (API calls) |
| **@stripe/stripe-js** | v9.0.1 | Stripe browser SDK |
| **@heroicons/react** | v2.2.0 | Icon library |
| **Vanilla CSS** | — | Glassmorphism dark theme |

### Python ML
| Library | Purpose |
|---|---|
| **scikit-learn** | All ML models (RandomForest, DecisionTree, OneHotEncoder, LabelEncoder) |
| **pandas** | DataFrame operations, CSV loading, data preprocessing |
| **numpy** | Numerical arrays, array operations |
| **joblib** | Loading persisted `.pkl` Decision Tree model |

### External APIs
| API | Purpose | Free? |
|---|---|---|
| **Groq (Llama 3.3 70B Versatile)** | AI ChatBot (OpenAI-compatible endpoint) | ✅ Yes |
| **OpenWeatherMap** | 5-day / 3-hour weather forecast | ✅ Yes (1000 calls/day) |
| **NewsAPI** | Agriculture news articles | ✅ Yes (limited) |
| **Stripe** | Card payment processing & checkout sessions | ✅ Test keys free |

---

## ⚙️ Requirements

- **Node.js** v20.19+ or v22.12+ — [Download](https://nodejs.org/)
- **Python 3.x** — with `scikit-learn`, `pandas`, `numpy`, `joblib`
- **MongoDB Atlas** account — [Create free cluster](https://www.mongodb.com/cloud/atlas)
- **npm** (bundled with Node.js)

---

## 🚀 Installation & Setup

### 1. Install Node Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Python ML Dependencies

```bash
pip install scikit-learn pandas numpy joblib
```

### 3. Configure Environment Variables

**`backend/.env`**

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/agriculture_portal
JWT_SECRET=your_super_secret_jwt_key

# Stripe (payments)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# External APIs (set to "mock" for demo mode with sample data)
OPENWEATHER_API_KEY=mock     # https://openweathermap.org/api  (free)
NEWS_API_KEY=mock            # https://newsapi.org/register    (free)
GROQ_API_KEY=mock            # https://console.groq.com/keys   (free, starts with gsk_)
```

**`frontend/.env`**

```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

> **Demo Mode:** All features work with `mock` values — Weather, News, and ChatBot return sample data so you can test the UI without any real API keys.

### 4. Seed the Database (Optional)

Populate test accounts and sample products:

```bash
cd backend
node src/scripts/seed.js
```

---

## ▶️ Running the Application

Open **two terminals** from the project root:

**Terminal 1 — Backend API (port 5000)**
```bash
cd backend
npx nodemon src/server.js
```

**Terminal 2 — Frontend UI (port 5173)**
```bash
cd frontend
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## 🔐 Default Test Accounts

After running the seed script:

| Role | Email | Password |
|---|---|---|
| 👨‍🌾 Farmer | `farmer@example.com` | `password123` |
| 🛒 Customer | `customer@example.com` | `password123` |

> To create an **Admin** account: register at `/register` and select **"Admin (Manage Portal)"** from the role dropdown.

---

## 🔑 API Keys Guide

| Key | Where to Get | Free? | Used For |
|---|---|---|---|
| `GROQ_API_KEY` | [console.groq.com/keys](https://console.groq.com/keys) | ✅ Yes | AI ChatBot (Llama 3.3 70B) |
| `OPENWEATHER_API_KEY` | [openweathermap.org/api](https://openweathermap.org/api) | ✅ Yes (1000/day) | 5-day weather forecast |
| `NEWS_API_KEY` | [newsapi.org/register](https://newsapi.org/register) | ✅ Yes (100/day) | Agriculture news feed |
| `STRIPE_SECRET_KEY` | [dashboard.stripe.com](https://dashboard.stripe.com) | ✅ Test keys free | Payments & checkout |

---

## 📡 API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user (farmer/customer/admin) |
| POST | `/api/auth/login` | Public | Login — returns JWT token |
| GET | `/api/auth/profile` | Private | Get own profile |
| PUT | `/api/auth/profile` | Private | Update own profile |

### Intelligence — AI & ML (`/api/intelligence`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/intelligence/predict/crop` | Public | Crop prediction by State/District/Season |
| POST | `/api/intelligence/predict/yield` | Public | Yield prediction (Quintals) |
| POST | `/api/intelligence/predict/rainfall` | Public | Average rainfall prediction (mm) |
| POST | `/api/intelligence/recommend/crop` | Public | Crop recommendation (N,P,K,Temp,Hum,pH,Rainfall) |
| POST | `/api/intelligence/recommend/fertilizer` | Public | Fertilizer recommendation |
| GET | `/api/intelligence/weather?city=Mysore` | Public | 5-day weather forecast |
| GET | `/api/intelligence/news` | Public | Agriculture news feed |
| POST | `/api/intelligence/chatbot` | Public | Groq Llama 3.3 AI chat |

### Farmer (`/api/farmer`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/farmer/products` | Farmer | List own products |
| POST | `/api/farmer/products` | Farmer | Create product (with Multer image upload) |
| PUT | `/api/farmer/products/:id` | Farmer | Update own product |
| DELETE | `/api/farmer/products/:id` | Farmer | Delete own product |
| GET | `/api/farmer/dashboard-stats` | Farmer | Products count, stock, revenue stats |
| GET | `/api/farmer/selling-history` | Farmer | All orders containing farmer's products |

### Marketplace (`/api/marketplace`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/marketplace/products` | Public | List all available products (keyword + category filter) |
| GET | `/api/marketplace/products/:id` | Public | Get product detail |
| POST | `/api/marketplace/checkout/create-session` | Customer | Create Stripe checkout session |
| POST | `/api/marketplace/checkout/verify-session` | Customer | Verify payment & fulfil order (idempotent) |
| GET | `/api/marketplace/orders/my-orders` | Private | Customer's order history |
| POST | `/api/marketplace/webhook` | Public | Stripe webhook placeholder |

### Admin (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/admin/stats` | Admin | Platform-wide stats |
| GET | `/api/admin/farmers` | Admin | List all farmers |
| DELETE | `/api/admin/farmers/:id` | Admin | Delete farmer account |
| GET | `/api/admin/customers` | Admin | List all customers |
| DELETE | `/api/admin/customers/:id` | Admin | Delete customer account |
| GET | `/api/admin/stock` | Admin | All crop products (all farmers) |
| DELETE | `/api/admin/stock/:id` | Admin | Delete product |
| GET | `/api/admin/queries` | Admin | All contact queries |
| DELETE | `/api/admin/queries/:id` | Admin | Delete contact query |

### Contact (`/api/contact`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/contact` | Public | Submit contact query |

---

## 🗺️ Frontend Routes

| Path | Role | Component |
|---|---|---|
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/marketplace` | Public | Marketplace |
| `/marketplace/product/:id` | Public | ProductDetails |
| `/cart` | Public | Cart |
| `/customer/stocks` | Public | CropStocks |
| `/customer/orders` | Public | MyOrders |
| `/success` | Public | Stripe Success (verifies session) |
| `/intelligence` | Public | AI Intelligence Hub |
| `/contact` | Public | Contact Form |
| `/profile` | Authenticated | Profile (view/edit) |
| `/dashboard` | Farmer | Farmer Dashboard |
| `/farmer/prediction/crop` | Farmer | Crop Prediction |
| `/farmer/prediction/yield` | Farmer | Yield Prediction |
| `/farmer/prediction/rainfall` | Farmer | Rainfall Prediction |
| `/farmer/recommendation/crop` | Farmer | Crop Recommendation |
| `/farmer/recommendation/fertilizer` | Farmer | Fertilizer Recommendation |
| `/farmer/selling-history` | Farmer | Selling History |
| `/farmer/tools/chatbot` | Farmer | AI ChatBot |
| `/farmer/tools/weather` | Farmer | Weather Forecast |
| `/farmer/tools/news` | Farmer | News Feed |
| `/admin` | Admin | Admin Dashboard |
| `/admin/farmers` | Admin | Manage Farmers |
| `/admin/customers` | Admin | Manage Customers |
| `/admin/stock` | Admin | Crop Stock |
| `/admin/queries` | Admin | Contact Queries |

---

## 📁 Python ML Scripts Reference

Located in `backend/src/scripts/`. Called by Node.js via `child_process.spawn('python', [scriptPath, ...args])`.

| Script | Algorithm | CSV Dataset | Args (CLI) | Output |
|---|---|---|---|---|
| `crop_prediction/ZDecision_Tree_Model_Call.py` | Decision Tree (pre-trained `.pkl`) | `preprocessed2.csv` | state, district, season | Crop name(s) with probabilities |
| `yield_prediction/yield_prediction.py` | RandomForestRegressor + OneHotEncoder | `crop_production_karnataka.csv` | state, district, season, crop, area | Yield in Quintals (float) |
| `rainfall_prediction/rainfall_prediction.py` | Historical average lookup (pandas) | `rainfall_in_india_1901-2015.csv` | region (subdivision), month (JAN/FEB…) | Average rainfall in mm |
| `crop_recommendation/recommend.py` | RandomForestClassifier | `Crop_recommendation.csv` | N, P, K, temp, humidity, pH, rainfall (JSON-serialised) | Crop name |
| `fertilizer_recommendation/fertilizer_recommendation.py` | Decision Tree + LabelEncoder | `fertilizer_recommendation.csv` | N, P, K, temp, humidity, soilMoisture, soilType, crop | Fertilizer name |

---

## 🗄️ Database Models

### User
```
name, email, password(hashed), role(farmer|customer|admin),
phone, gender, dob, state, district, city, timestamps
```

### Product
```
farmer(ref:User), title, description, price, stockQuantity,
category(Vegetables|Fruits|Grains|Equipment), images[], isAvailable, timestamps
```

### Order
```
customer(ref:User), orderItems[{product, quantity, priceAtPurchase, title}],
shippingAddress{street,city,state,zip}, paymentDetails{stripeSessionId, status},
totalAmount, invoiceUrl, timestamps
```

### Contact
```
name, email, message, timestamps
```

---

## 🔄 Key Flows

### Payment Flow
1. Customer adds items → Cart (persisted in `localStorage` via Redux + `store.subscribe`)
2. Clicks Checkout → POST `/api/marketplace/checkout/create-session` → Stripe session URL
3. Redirected to Stripe-hosted checkout page
4. On success → redirected to `/success?session_id=<id>`
5. `Success.jsx` calls POST `/api/marketplace/checkout/verify-session` → verifies payment, creates Order, decrements stock, clears cart

### ML Prediction Flow
1. React form → POST `/api/intelligence/predict/*` or `/api/intelligence/recommend/*`
2. Express validates inputs → calls `child_process.spawn('python', [script, ...args])`
3. Python script loads CSV → trains/loads model → runs inference → `print(result)` to stdout
4. Node.js captures stdout → responds to client with JSON

### Authentication Flow
1. Register/Login → bcrypt hash (register) or compare (login) → sign JWT
2. JWT stored in Redux state + `localStorage`
3. Axios interceptor in `api.js` auto-attaches `Authorization: Bearer <token>` header
4. `authMiddleware.js protect()` verifies JWT on every protected route

---

## 🛠️ Recent Changes (Migration from PHP)

| Area | Change |
|---|---|
| **Stack** | PHP + MySQL + XAMPP → MERN (MongoDB + Express + React 19 + Node.js) |
| **Auth** | PHP sessions → JWT (bcryptjs + jsonwebtoken) |
| **Database** | MySQL tables → MongoDB Atlas (Mongoose ODM) |
| **Frontend** | PHP-rendered HTML → React 19 SPA with React Router v7 |
| **State** | Page reloads → Redux Toolkit (auth + cart + prediction slices) |
| **Cart** | PHP `$_SESSION` → Redux slice + localStorage persistence (survives Stripe redirect) |
| **Payments** | Basic PHP form → Stripe Checkout Session + verify-session fulfillment (idempotent) |
| **Product Images** | PHP file_move → Multer (Node.js) serving via `/uploads` static route |
| **ML** | None in PHP → 5 Python ML scripts via `child_process.spawn` |
| **AI Chat** | None → Groq Llama 3.3 70B proxy endpoint |
| **Marketplace** | New feature — browse, product details, cart, Stripe checkout, My Orders |
| **Intelligence Hub** | New — customer-facing crop & fertilizer recommendation UI |
| **Customer `MyOrders`** | New — order history page |
| **Customer `CropStocks`** | New — stock browsing page |
| **Farmer `SellingHistory`** | New — shows all orders containing farmer's products |
| **Admin Stock** | Now correctly queries all Products (not just the admin's) |

---

## 📄 License

This project is part of an academic Major Project. All rights reserved.
