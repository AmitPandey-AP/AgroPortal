# 🌿 AgroPortal — Testing Guide

## 📋 Pre-requisites

Before testing, make sure the following are installed:

- **Node.js** v20.19+ (or v22.12+) — [Download](https://nodejs.org/)
- **Python 3.x** — needed for ML predictions (crop, yield, rainfall, fertilizer)
- **MongoDB** — your cluster is already configured in `.env`

---

## 🔑 Step 1: Environment Variables (.env)

### Backend (`backend/.env`)

Your current `.env` already has most values. Here's what you need to update for **full functionality**:

```env
# ✅ Already configured — no changes needed
PORT=5000
MONGODB_URI=mongodb+srv://...  (already set)
JWT_SECRET=...                  (already set)
STRIPE_PUBLISHABLE_KEY=pk_...   (already set)
STRIPE_SECRET_KEY=sk_...        (already set)
STRIPE_WEBHOOK_SECRET=whsec_... (already set)

# ⚠️ UPDATE THESE for real functionality (currently "mock"):
OPENWEATHER_API_KEY=<your_key>    # Get free at: https://openweathermap.org/api
NEWS_API_KEY=<your_key>           # Get free at: https://newsapi.org/register
OPENAI_API_KEY=<your_key>         # Get at: https://platform.openai.com/api-keys
```

> **Note:** With `mock` values, the Weather, News, and ChatBot features return
> placeholder/sample data so you can still test the UI without real keys.

### Frontend (`frontend/.env`) — No changes needed

The frontend uses `http://localhost:5000/api` as the backend URL (configured in `src/services/api.js`).

---

## 🚀 Step 2: Install Dependencies & Start Servers

### Terminal 1 — Backend
```bash
cd backend
npm install
npx nodemon src/server.js
```
You should see: `Server is running on port 5000`

### Terminal 2 — Frontend
```bash
cd frontend
npm install
npm run dev
```
You should see: `Local: http://localhost:5173/`

---

## 🧪 Step 3: Testing — Create Test Accounts

### 3.1 Register a Farmer Account
1. Go to `http://localhost:5173/register`
2. Fill in:
   - **Name:** Test Farmer
   - **Email:** farmer@test.com
   - **Password:** password123
   - **Role:** farmer
3. Click Register → You should be redirected to the Farmer Dashboard

### 3.2 Register a Customer Account
1. Go to `http://localhost:5173/register`
2. Fill in:
   - **Name:** Test Customer
   - **Email:** customer@test.com
   - **Password:** password123
   - **Role:** customer
3. Click Register → Redirected to Marketplace

### 3.3 Register an Admin Account
1. Go to `http://localhost:5173/register`
2. Fill in:
   - **Name:** Admin User
   - **Email:** admin@test.com
   - **Password:** password123
   - **Role:** admin
3. Click Register → Redirected to Admin Dashboard

---

## 🌾 Step 4: Test Farmer Features (Login as farmer@test.com)

### 4.1 Navigation Bar
- [ ] ✅ Verify the green navbar at the top shows **🌿 AgroPortal**
- [ ] ✅ Verify dropdown menus: **Prediction**, **Recommendation**, **Trade**, **Tools**
- [ ] ✅ Verify user avatar (first letter of name) and **Logout** button

### 4.2 Dashboard
- [ ] Navigate to `/dashboard` (click "Dashboard" in nav)
- [ ] Verify stats cards show (Products Listed, Total Sales, etc.)

### 4.3 Profile (All Roles)
- [ ] Click your avatar/name → goes to `/profile`
- [ ] Verify profile card shows your Name, Email, Role
- [ ] Click **Edit Profile** → fill in Phone, Gender, State (e.g. Karnataka), District (e.g. Mysore), City
- [ ] Save → verify data persists (reload the page)

### 4.4 Prediction — Crop Prediction
- [ ] Navbar → Prediction → Crop Prediction (`/farmer/prediction/crop`)
- [ ] Select **State:** Karnataka, **District:** Mysore, **Season:** Kharif
- [ ] Click **Predict Crops**
- [ ] Expected: Shows prediction result (requires Python ML scripts working)
- [ ] If Python not set up, you'll see an error "Prediction failed..." — this is normal

### 4.5 Prediction — Yield Prediction
- [ ] Navbar → Prediction → Yield Prediction (`/farmer/prediction/yield`)
- [ ] **State:** Karnataka (fixed), **District:** MYSORE, **Season:** Kharif, **Crop:** Rice, **Area:** 5
- [ ] Click **Predict Yield**
- [ ] Expected: Shows predicted yield in Quintals

### 4.6 Prediction — Rainfall Prediction
- [ ] Navbar → Prediction → Rainfall Prediction (`/farmer/prediction/rainfall`)
- [ ] **Region:** COASTAL KARNATAKA, **Month:** JUN
- [ ] Click **Predict Rainfall**
- [ ] Expected: Shows predicted rainfall in mm

### 4.7 Recommendation — Crop Recommendation
- [ ] Navbar → Recommendation → Crop Recommendation (`/farmer/recommendation/crop`)
- [ ] Enter: N=90, P=42, K=43, Temp=21, Humidity=82, pH=6.5, Rainfall=203
- [ ] Click **Get Recommendation**
- [ ] Expected: Shows recommended crop name (e.g., "Rice")

### 4.8 Recommendation — Fertilizer Recommendation
- [ ] Navbar → Recommendation → Fertilizer Recommendation (`/farmer/recommendation/fertilizer`)
- [ ] Enter: N=37, P=0, K=0, Temp=26, Humidity=52, Soil Moisture=38, Soil Type=Sandy, Crop=Maize
- [ ] Click **Get Fertilizer Recommendation**
- [ ] Expected: Shows recommended fertilizer

### 4.9 Trade — Trade Crops
- [ ] Navbar → Trade → Trade Crops (`/farmer/trade`)
- [ ] Add a new crop product: Title, Price, Stock Quantity, Category

### 4.10 Trade — Selling History
- [ ] Navbar → Trade → Selling History (`/farmer/selling-history`)
- [ ] Verify: Shows empty list (no orders yet) or a table of past sales

### 4.11 Tools — AI ChatBot
- [ ] Navbar → Tools → ChatBot (`/farmer/tools/chatbot`)
- [ ] Verify: Chat interface appears with a welcome message
- [ ] Type "What crops grow well in Karnataka?" and press Enter or click Send
- [ ] Expected: AI responds (mock response if no OpenAI key, real response with key)
- [ ] Test **Clear Chat** and **Print** buttons

### 4.12 Tools — Weather Forecast
- [ ] Navbar → Tools → Weather Forecast (`/farmer/tools/weather`)
- [ ] Verify: auto-loads weather for your registered district
- [ ] Try searching for "Mumbai" → table updates with weather data
- [ ] Verify columns: Date, Time, Condition, Temp Max/Min, Humidity, Wind Speed

### 4.13 Tools — News Feed
- [ ] Navbar → Tools → News Feed (`/farmer/tools/news`)
- [ ] Verify: Table of news articles loads (mock data if no NewsAPI key)
- [ ] Check: Image, Title, Author, Published date, Visit link

---

## 🛒 Step 5: Test Customer Features (Login as customer@test.com)

### 5.1 Navigation
- [ ] Verify navbar shows: **Buy Crops**, **Crop Stocks**, **AI Hub**, Profile, Logout

### 5.2 Marketplace
- [ ] Go to `/marketplace`
- [ ] Browse available crop products (added by farmers)
- [ ] Click on a product → Product Details page
- [ ] Add to cart → verify Cart updates

### 5.3 Cart
- [ ] Go to `/cart`
- [ ] Verify items are listed with quantities and prices
- [ ] Test Stripe checkout (if Stripe keys are real)

### 5.4 Intelligence Hub (Customer version)
- [ ] Go to `/intelligence`
- [ ] Test Crop Prediction and Fertilizer Recommendation tabs

### 5.5 Profile
- [ ] Visit `/profile` → verify customer profile shows and can be edited

---

## 🛡️ Step 6: Test Admin Features (Login as admin@test.com)

### 6.1 Admin Dashboard
- [ ] Go to `/admin`
- [ ] Verify stat cards: Total Farmers, Total Customers, Crop Products, Contact Queries
- [ ] Click each card → navigates to the corresponding management page

### 6.2 Manage Farmers
- [ ] Go to `/admin/farmers`
- [ ] Verify table shows farmer accounts (the Test Farmer you created)
- [ ] Test the **Search** box
- [ ] Test the **Delete** button (careful — this actually deletes!)

### 6.3 Manage Customers
- [ ] Go to `/admin/customers`
- [ ] Verify table shows customer accounts
- [ ] Test Search and Delete

### 6.4 Crop Stock
- [ ] Go to `/admin/stock`
- [ ] Verify table shows all crop products with farmer info
- [ ] Expected columns: Title, Category, Price, Stock, Availability, Farmer, Location

### 6.5 Contact Queries
- [ ] Go to `/admin/queries`
- [ ] Initially empty; gets populated after submitting the Contact form

---

## 📬 Step 7: Test Public Pages

### 7.1 Contact Form
- [ ] Go to `/contact` (accessible without logging in)
- [ ] Fill in: Name, Email, Phone, Subject, Message
- [ ] Click **Send Message** → verify success message
- [ ] Login as Admin → go to `/admin/queries` → verify the query appears

---

## 🐍 Step 8: Python ML Models (Optional — for real predictions)

The ML predictions require Python scripts. They were copied to `backend/src/scripts/`.

To test if Python works:
```bash
cd backend/src/scripts
python crop_prediction/ZDecision_Tree_Model_Call.py "Karnataka" "Mysore" "Kharif"
```

If you get module errors (e.g., `sklearn not found`), install dependencies:
```bash
pip install scikit-learn pandas numpy
```

---

## ❓ Troubleshooting

| Issue | Fix |
|---|---|
| **Page is blank** | Hard refresh (Ctrl+Shift+R), or restart frontend `npm run dev` |
| **API returns 401** | You're not logged in. Login first. |
| **Prediction returns error** | Python scripts may not be compatible. Check terminal output. |
| **Weather/News shows mock data** | Update `OPENWEATHER_API_KEY` and `NEWS_API_KEY` in `.env` with real keys |
| **ChatBot returns default message** | Update `OPENAI_API_KEY` in `.env` |
| **Cannot register admin** | The role dropdown in Register page should include "admin" option |
| **MongoDB connection error** | Check `MONGODB_URI` in `.env` and ensure your IP is whitelisted in Atlas |

---

## 📊 Feature Parity Checklist (PHP vs MERN)

| Feature | PHP ✅ | MERN ✅ |
|---|---|---|
| Farmer Login/Register | ✅ | ✅ |
| Customer Login/Register | ✅ | ✅ |
| Admin Login/Register | ✅ | ✅ |
| Profile View/Edit | ✅ | ✅ |
| Crop Prediction (State/District/Season) | ✅ | ✅ |
| Yield Prediction | ✅ | ✅ |
| Rainfall Prediction | ✅ | ✅ |
| Crop Recommendation (N,P,K...) | ✅ | ✅ |
| Fertilizer Recommendation | ✅ | ✅ |
| Trade Crops / Product Listing | ✅ | ✅ |
| Crop Stocks View | ✅ | ✅ |
| Selling History | ✅ | ✅ |
| Buy Crops + Cart | ✅ | ✅ |
| Stripe Payment | ✅ | ✅ |
| ChatBot (GPT) | ✅ | ✅ |
| Weather Forecast (OpenWeather) | ✅ | ✅ |
| News Feed (NewsAPI) | ✅ | ✅ |
| Admin: Manage Farmers | ✅ | ✅ |
| Admin: Manage Customers | ✅ | ✅ |
| Admin: Crop Stock | ✅ | ✅ |
| Admin: Contact Queries | ✅ | ✅ |
| Contact Form | ✅ | ✅ |
| Role-based Navbar | ✅ | ✅ |
