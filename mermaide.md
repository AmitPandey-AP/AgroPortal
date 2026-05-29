
graph TB
    %% ─── USER ROLES ──────────────────────────────────────────────
    subgraph USERS["👥 User Roles"]
        FARMER["🌾 Farmer"]
        CUSTOMER["🛒 Customer"]
        ADMIN["🔑 Admin"]
    end

    %% ─── FRONTEND ────────────────────────────────────────────────
    subgraph FRONTEND["⚛️  Frontend · React 18 + Vite + Redux Toolkit"]

        subgraph REDUX["Redux Store"]
            AUTH_SLICE["authSlice\nJWT token + user role"]
            CART_SLICE["cartSlice\nlocalStorage persisted"]
            PRED_SLICE["predictionSlice"]
        end

        subgraph FARMER_PAGES["Farmer Pages (role-protected)"]
            FP1["Dashboard · Selling History"]
            FP2["Crop Prediction · Yield Prediction\nRainfall Prediction"]
            FP3["Crop Recommendation\nFertilizer Recommendation"]
            FP4["AI ChatBot · Weather Forecast\nNews Feed"]
        end

        subgraph CUSTOMER_PAGES["Customer Pages"]
            CP1["Marketplace · Product Details\nCart · My Orders"]
            CP2["Crop Stocks · Intelligence Hub"]
        end

        subgraph ADMIN_PAGES["Admin Pages (role-protected)"]
            AP1["Admin Dashboard (stats)"]
            AP2["Manage Farmers · Manage Customers\nManage Crop Stock · Manage Queries"]
        end

        subgraph COMMON_PAGES["Common Pages"]
            CM1["Login · Register · Profile\nContact · Success"]
        end
    end

    %% ─── BACKEND ─────────────────────────────────────────────────
    subgraph BACKEND["🟢 Backend · Node.js + Express.js  (port 5000)"]

        subgraph MIDDLEWARE["Middleware"]
            JWT_MW["authMiddleware.js\nprotect() — jwt.verify()\nrestrictTo(role)"]
            MULTER["Multer — disk storage\n5 MB · JPEG/PNG/WEBP\n/uploads/ dir"]
        end

        subgraph ROUTES["API Routes"]
            R1["/api/auth"]
            R2["/api/farmer  🔒 farmer"]
            R3["/api/marketplace"]
            R4["/api/intelligence"]
            R5["/api/admin  🔒 admin"]
            R6["/api/contact"]
        end

        subgraph CONTROLLERS["Controllers"]
            C1["authController\nregister · login · getMe\ngetProfile · updateProfile"]
            C2["farmerController\ncreateProduct · getFarmerProducts\nupdateProduct · deleteProduct\ngetDashboardStats · getSellingHistory"]
            C3["marketplaceController\ngetProducts · getProductById\ncreateCheckoutSession\nverifyAndFulfillSession\ngetMyOrders · stripeWebhook"]
            C4["intelligenceController\npredictCrop · predictYield\npredictRainfall · recommendCrop\nrecommendFertilizer\ngetWeather · getNews · chatBot"]
            C5["adminController\ngetAdminStats · getAllFarmers\ndeleteFarmer · getAllCustomers\ndeleteCustomer · getAllCropStock\ndeleteProduct · getAllQueries\ndeleteQuery"]
            C6["contactController\nsaveContact"]
        end

        PYRUNNER["runPython() helper\nchild_process.spawn()\nreads stdout"]
    end

    %% ─── ML LAYER ────────────────────────────────────────────────
    subgraph ML["🐍 Python ML Scripts  (backend/src/scripts/)"]
        ML1["crop_prediction/\nZDecision_Tree_Model_Call.py\n📦 Custom Decision Tree  ·  joblib .pkl\n📊 preprocessed2.csv\n🎯 Input: state · district · season"]
        ML2["crop_recommendation/\nrecommend.py\n📦 RandomForestClassifier\n   10 estimators · entropy\n📊 Crop_recommendation.csv\n🎯 Input: N·P·K·temp·humidity·pH·rainfall"]
        ML3["fertilizer_recommendation/\nfertilizer_recommendation.py\n📦 DecisionTreeClassifier  (sklearn)\n📊 fertilizer_recommendation.csv\n🎯 Input: N·P·K·temp·humidity\n   soilMoisture·soilType·crop"]
        ML4["yield_prediction/\nyield_prediction.py\n📦 RandomForestRegressor\n   100 estimators · OneHotEncoder\n📊 crop_production_karnataka.csv\n🎯 Input: state·district·season·crop·area"]
        ML5["rainfall_prediction/\nrainfall_prediction.py\n📦 Pandas historical CSV average\n   (no trained model)\n📊 rainfall_in_india_1901-2015.csv\n🎯 Input: region · month"]
    end

    %% ─── DATABASE ────────────────────────────────────────────────
    subgraph DATABASE["🍃 MongoDB  (Mongoose ODM)"]
        DB1["User\nname · email · password\nrole: farmer|customer|admin\nphone · gender · dob\nstate · district · city"]
        DB2["Product\nfarmer(ref:User) · title\nprice · stockQuantity\ncategory · images[]\nisAvailable"]
        DB3["Order\ncustomer(ref:User)\norderItems[product·qty·price]\nstripeSessionId · status\ntotalAmount · invoiceUrl"]
        DB4["Contact\nname · email · message"]
        DB5["CropData"]
    end

    %% ─── EXTERNAL APIs ───────────────────────────────────────────
    subgraph EXTERNAL["🌐 External APIs"]
        EX1["OpenWeatherMap\n/data/2.5/forecast\n5-day city forecast"]
        EX2["NewsAPI.org\n/v2/everything\nagri news India"]
        EX3["Groq API\nllama-3.3-70b-versatile\nAgriculture AI ChatBot"]
        EX4["Stripe\nCheckout Sessions\ncard payment · idempotency"]
    end

    %% ─── CONNECTIONS ─────────────────────────────────────────────
    FARMER --> FARMER_PAGES & COMMON_PAGES
    CUSTOMER --> CUSTOMER_PAGES & COMMON_PAGES
    ADMIN --> ADMIN_PAGES & COMMON_PAGES

    FRONTEND -->|"HTTP REST · Axios\nBearer JWT token"| BACKEND

    R1 --> C1
    R2 --> JWT_MW --> C2
    R2 --> MULTER
    R3 --> C3
    R4 --> C4
    R5 --> JWT_MW
    JWT_MW --> C5
    R6 --> C6

    C1 --> DB1
    C2 --> DB2
    C3 --> DB2 & DB3
    C5 --> DB1 & DB2 & DB4
    C6 --> DB4

    C4 --> PYRUNNER
    PYRUNNER -->|"spawn + stdout"| ML1 & ML2 & ML3 & ML4 & ML5

    C4 -->|axios.get| EX1
    C4 -->|axios.get| EX2
    C4 -->|axios.post| EX3
    C3 -->|stripe SDK| EX4
    EX4 -->|"redirect /success\n?session_id=..."| FRONTEND

sequenceDiagram
    participant FE as Frontend (React)
    participant BE as Express Controller
    participant PY as Python Script
    participant DS as Dataset / .pkl

    FE->>BE: POST /api/intelligence/predict/crop {state, district, season}
    BE->>BE: validateStrings() — sanitize inputs
    BE->>PY: spawn('python', ['ZDecision_Tree_Model_Call.py', args...])
    PY->>DS: joblib.load('filetest2.pkl')
    DS-->>PY: Decision Tree model loaded
    PY-->>BE: stdout → crop list (one per line)
    BE-->>FE: { prediction: "Rice, Wheat...", district, season }

sequenceDiagram
    participant C as Customer Browser
    participant BE as Express Backend
    participant ST as Stripe API
    participant DB as MongoDB

    C->>BE: POST /api/marketplace/checkout/create-session {cartItems}
    BE->>ST: stripe.checkout.sessions.create(lineItems + metadata)
    ST-->>BE: { id, url }
    BE-->>C: { id, url }
    C->>ST: Browser → Stripe Checkout page
    ST-->>C: Redirect /success?session_id=xxx
    C->>BE: POST /api/marketplace/checkout/verify-session {sessionId}
    BE->>ST: sessions.retrieve(sessionId)
    ST-->>BE: payment_status = 'paid'
    BE->>DB: Idempotency check — Order.findOne(stripeSessionId)
    BE->>DB: Product.stockQuantity -= qty
    BE->>DB: new Order(...).save()
    BE-->>C: { message: 'Order fulfilled', order }
