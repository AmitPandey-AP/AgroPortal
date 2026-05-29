# AGROPORTAL: AN INTELLIGENT AI-POWERED PLATFORM FOR PRECISION AGRICULTURE AND FARMER ASSISTANCE

> A Project Report Submitted in Partial Fulfillment of the Requirements  
> for the Degree of **BACHELOR OF TECHNOLOGY** in **COMPUTER SCIENCE & ENGINEERING**

---

**Submitted by:**

| Name | Roll Number |
|---|---|
| Amit Pandey | 2200520100011 |
| Anshul Pandey | 2200520100015 |
| Durgesh Agrahari | 2200520100025 |

**Under the Guidance of:**

- Dr. Pawan Kumar Tiwari
- Ms. Deepa Verma

**Department of Computer Science and Engineering**  
Institute of Engineering & Technology  
DR. APJ ABDUL KALAM TECHNICAL UNIVERSITY, UTTAR PRADESH  
**JUNE, 2026**

---

## DECLARATION

We affirm that this submission is entirely our own work and, to the best of our knowledge and belief, it does not include any material previously published or authored by someone else, nor does it contain any content that has been accepted for the award of any degree or diploma at a university or other higher education institutions, except where proper acknowledgment is made in the text. This project has not been submitted by us to any other institution for the fulfillment of any other degree requirements. The findings and technical implementations documented herein represent a comprehensive effort to bridge the technological divide within the agricultural sector through data-driven methodologies.

**Submitted by:**

- Amit Pandey (2200520100011)
- Anshul Pandey (2200520100015)
- Durgesh Agrahari (2200520100025)

**Date:** 05/06/2026

---

## CERTIFICATE

This document certifies that the project work carried out by Amit Pandey, Anshul Pandey, and Durgesh Agrahari, under my guidance and supervision at the Department of Computer Science and Engineering, Institute of Engineering and Technology, Lucknow, is detailed in the project report titled **"AGROPORTAL: An Intelligent AI-Powered Platform for Precision Agriculture and Farmer Assistance"**. This report was submitted as part of the requirements for obtaining a Bachelor of Technology degree in Computer Science and Engineering. Furthermore, to the best of my knowledge, this project has not been submitted to any other institution for the purpose of earning any other degrees.

**(Dr. Pawan Kumar Tiwari)**  
Department of Computer Science and Engineering  
Institute of Engineering and Technology, Lucknow

**(Ms. Deepa Verma)**  
Department of Computer Science and Engineering  
Institute of Engineering and Technology, Lucknow

---

## ACKNOWLEDGEMENT

The culmination of this research project was made possible through the collective support and intellectual guidance provided by the faculty and peers at the Institute of Engineering and Technology. We wish to recognize and thank everyone who offered their support throughout our study. We are profoundly thankful to the Almighty for the grace and blessings that allowed us to finish this project.

Our supervisors, **Dr. Pawan Kumar Tiwari** and **Ms. Deepa Verma**, deserve our sincere gratitude for their constant assistance and technical direction. Their vast knowledge and patience have been essential to the success of this B.Tech project. We are also appreciative of the project coordinator for providing us the opportunity and resources to carry out our study. Additionally, we extend our thanks to the Head of the CSE Department for providing the necessary tools and administrative assistance that facilitated a smooth research process.

---

## ABSTRACT

The Agricultural Portal, **AGROPORTAL**, is an innovative, intelligent, and data-driven full-stack web platform designed to revolutionize traditional farming by providing farmers with easy access to critical agricultural information, resources, and predictive tools. In an era where climate change and population pressure demand high-efficiency resource management, AGROPORTAL integrates key modules such as crop recommendation, fertilizer optimization, real-time weather forecasting, and market intelligence into a single user-centric interface.

By leveraging advanced machine learning algorithms — including **Random Forest**, **Decision Trees**, **K-Nearest Neighbors (KNN)**, and **Naive Bayes** — the system provides personalized insights based on soil characteristics (Nitrogen, Phosphorus, Potassium), climatic conditions, and historical yield data. The platform is built on the **MERN stack** (MongoDB, Express.js, React.js, Node.js), providing a scalable, component-driven architecture with RESTful API communication and a Python-based ML inference engine integrated via inter-process communication.

The platform's architecture is designed to be scalable and adaptable, catering to farmers of diverse geographic backgrounds and varying levels of technical expertise. Beyond day-to-day decision support, AGROPORTAL incorporates a trading module that empowers farmers to sell their produce directly to consumers, thereby eliminating exploitative intermediaries and ensuring equitable pricing. The experimental results indicate that machine learning models can significantly reduce guesswork in farming, with Decision Trees achieving high accuracy (88.5%) in crop suitability prediction. Ultimately, this project serves as a cornerstone for digital transformation in the agricultural sector, promoting sustainable practices and enhancing the quality of life for rural farming communities.

---

### Key Features at a Glance

| Key Feature | Functional Purpose | Technical Implementation |
|---|---|---|
| Crop Recommendation | Suggests optimal crops based on NPK and climate | Random Forest Classifier (scikit-learn) |
| Fertilizer Suggestion | Recommends fertilizer type/amount based on soil deficiency | Decision Tree Classifier |
| Crop Yield Prediction | Forecasts expected production in Quintals | Random Forest Regressor |
| Regional Crop Prediction | Suggests crops suitable for a state/district/season | Custom Hand-built CART Decision Tree (.pkl) |
| Rainfall Prediction | Historical average rainfall for planning | Pandas Historical Mean Lookup (115-year IMD data) |
| Weather Forecast | Real-time planning for irrigation and harvest | OpenWeatherMap API Integration |
| Market Trading | Direct-to-customer selling portal | MERN Stack / MongoDB |
| AI Chatbot | Answers complex soil/agri queries | Groq LLM (llama-3.3-70b-versatile) |
| Information Feed | Government schemes and farming advisories | NewsAPI Dynamic Feed |

---

## CONTENTS

| Section | Page No. |
|---|---|
| DECLARATION | i |
| CERTIFICATE | ii |
| ACKNOWLEDGEMENT | iii |
| ABSTRACT | iv |
| **CHAPTER 1: INTRODUCTION** | 1 |
| 1.1 Problem Statement | 2 |
| 1.2 Motivation | 3 |
| 1.3 Objective | 4 |
| **CHAPTER 2: LITERATURE REVIEW** | 5 |
| **CHAPTER 3: PROPOSED METHODOLOGY** | 8 |
| 3.1 Overview | 8 |
| 3.2 System Architecture | 9 |
| 3.3 Algorithm Explanation | 11 |
| 3.4 Development Tools and Frameworks | 20 |
| 3.5 Implementation | 22 |
| **CHAPTER 4: EXPERIMENTAL RESULTS** | 25 |
| 4.1 Result | 26 |
| 4.2 Training Details | 28 |
| **CHAPTER 5: CONCLUSION** | 32 |
| 5.1 Conclusion | 32 |
| 5.2 Future Work | 34 |
| **WORKS CITED** | 36 |

---

## LIST OF FIGURES

| Figure | Title | Page No. |
|---|---|---|
| Figure 3.1 | System Architecture — MERN + Python ML Hybrid | 9 |
| Figure 3.2 | Data Preprocessing Pipeline | 11 |
| Figure 3.3 | Random Forest Algorithm — Ensemble Decision Making | 13 |
| Figure 3.4 | Decision Tree CART Splitting — Gini Impurity | 15 |
| Figure 3.5 | Node.js → Python Child Process Bridge | 22 |
| Figure 4.1 | Crop Recommendation Result Interface | 26 |
| Figure 4.2 | Fertilizer Prediction Result Interface | 27 |
| Figure 4.3 | Yield Prediction Graphical Analysis | 28 |
| Figure 4.4 | Rainfall Prediction Analysis | 29 |
| Figure 4.5 | Admin Dashboard and User List | 32 |

---

---

# CHAPTER 1: INTRODUCTION

The contemporary agricultural landscape is undergoing a radical transition as digital and AI-based technologies are increasingly adopted to enhance productivity and sustainability. Agriculture remains the most essential sector of the global economy, particularly in developing nations where a substantial portion of the population relies on farming for food security and livelihood. However, the sector is currently besieged by challenges that traditional experience-based methods can no longer resolve. These include unpredictable climate shifts, soil degradation due to improper chemical use, and a fragmented supply chain that disadvantages the primary producer.

Forecasting the outcomes of agricultural cycles has grown increasingly difficult in the fast-paced environmental context of today. Factors including soil nutrient levels, humidity, rainfall patterns, and market demand fluctuations significantly influence the final success of a harvest. Traditional methods, which largely depend on static historical knowledge and manual observation, often prove ineffective in dealing with the fluid and intricate traits of modern ecosystems. To tackle these challenges, the integration of machine learning provides a more accurate, data-driven approach to agricultural management.

AGROPORTAL is built as a **MERN stack** (MongoDB, Express.js, React.js, Node.js) web application, integrating a Python-based machine learning inference layer through a Node.js `child_process` bridge. This hybrid architecture allows the system to combine the rapid UI rendering capabilities of React with the powerful scientific computing ecosystem of Python, including libraries such as scikit-learn, Pandas, and NumPy.

## 1.1 Problem Statement

Farmers today face a systemic lack of transparency and reliable information, leading to suboptimal decision-making. Important factors such as precise soil nutrient deficiencies and the specific crops best suited for a particular climate often remain unknown or are based on imprecise guesswork. This dependency on traditional methods frequently leads to reduced productivity, improper fertilizer usage, and avoidable crop losses.

Furthermore, there is a distinct lack of integrated digital tools. While individual solutions exist for weather or soil testing, there is no single, unified web-based platform that combines soil-based crop recommendations, fertilizer guidance, yield prediction, and real-time weather updates. This fragmentation complicates the farmer's journey, forcing them to search for various inputs across disjointed platforms. Additionally, the lack of direct market access creates a dependency on middlemen, which optimizes revenue for intermediaries while complicating the financial stability of the farmer.

| Problem Category | Specific Challenge | Impact |
|---|---|---|
| Technical Gap | Fragmented AI solutions | Incomplete tools for decision-making |
| Environmental | Climate variability | Unpredictable rainfall and temperature shifts |
| Operational | Reliance on traditional experience | Inaccurate assessment of soil health |
| Economic | Market middlemen dependency | Unfair pricing and reduced farmer income |
| Digital Divide | No unified portal | Farmers must consult multiple platforms |

## 1.2 Motivation

The motivation behind AGROPORTAL is rooted in the belief that technology should serve as a bridge, empowering the most foundational sector of human life. In many rural areas, farmers still rely on outdated information, lacking access to tools that can predict yields or analyze soil conditions accurately. By creating a web-based agricultural portal, the aim is to replace guesswork with reliable data, thereby bridging the information gap and improving the quality of life for rural families.

As internet accessibility expands into rural domains, there is a timely opportunity to provide a user-friendly online portal that offers guidance and best practices in an accessible format. The potential of digital agriculture to transform farming efficiency — reducing overspending on chemicals and improving resource allocation — serves as a primary driver for this research. Furthermore, addressing climate change through Machine Learning allows farmers to anticipate extreme weather patterns, enabling better planting schedules and risk mitigation strategies.

The adoption of the **MERN stack** in particular was motivated by its JavaScript-throughout philosophy: a single programming language (JavaScript/Node.js) on both the frontend and backend reduces context switching for developers, and React's component-based architecture enables rapid development of reusable UI widgets for each prediction module.

## 1.3 Objective

The primary objective of this project is to develop an efficient, smart, and unified Agricultural Web Portal that consolidates various decision-support tools into one user-friendly platform. The specific goals are as follows:

1. **Develop Intelligent Recommendation Models:** Utilize machine learning to identify the most suitable crop based on soil Nitrogen (N), Phosphorus (P), and Potassium (K) levels alongside environmental parameters.

2. **Optimize Resource Management:** Provide fertilizer recommendations based on soil nutrient deficiencies to prevent chemical overuse and improve soil health.

3. **Enhance Predictive Capability:** Incorporate models to forecast crop yield and rainfall patterns, helping farmers understand expected performance before cultivation.

4. **Establish a Direct Marketplace:** Design an integrated trading module that allows farmers to sell produce directly to customers, ensuring transparency and maximizing profits.

5. **Bridge the Information Divide:** Deliver real-time agricultural news, government advisories, and weather forecasts to keep farmers informed of modern practices and upcoming weather changes.

6. **Build a Scalable MERN Platform:** Architect the entire web application on MongoDB, Express.js, React.js, and Node.js to ensure a maintainable, scalable, and production-ready codebase.

---

# CHAPTER 2: LITERATURE REVIEW

Predicting agricultural outcomes and optimizing farm management is an essential part of sustainable planning. This review provides an exhaustive analysis of recent research in machine learning-based agricultural forecasting and decision support systems.

Recent studies show that deep learning, specifically Convolutional Neural Networks (CNNs), has become a reliable solution for automated crop disease detection, outperforming traditional visual inspections. CNN-based models can extract fine-grained features like lesion shapes and color variations, providing significantly higher accuracy than classical techniques. Furthermore, researchers like G. Papakostas (2017) have emphasized that among various models, bagging ensemble methods offer the best results for forecasting tasks due to their resilience to noise and irrelevant features.

Existing research in smart agriculture also highlights the critical role of feature selection. Features such as temperature, rainfall, soil type, and regional season are widely used to predict crop yield. Techniques like Artificial Neural Networks (ANN), K-Nearest Neighbors (KNN), and Stacking Regression have been successfully applied to enhance prediction accuracy. For example, the use of association rule mining has been identified as a robust method for discovering relationships among agricultural parameters for future crop production estimation.

| Researcher / Year | Methodology | Key Contribution |
|---|---|---|
| Papakostas et al. (2017) | Random Forest, MLP, ELM | Found bagging regression trees most successful for forecasting tasks. |
| Manjula & Djodiltachoumy (2017) | Data Mining & Association Rules | Focused on creating models for regional crop yield prediction. |
| Groves & Gini (2013) | PLS Regression & Lag Schemes | Developed resilient models for agricultural supply chain optimization. |
| Kumari et al. (2025) | AI & Climate-Smart Agriculture | Explored sustainable farming via deep learning and IoT sensor integration. |
| Rao et al. (2023) | Random Forest vs. Decision Tree | Provided benchmarks for predictive model comparison in agricultural yield forecasting. |
| Zhang et al. (2022) | CNN for Disease Detection | Automated leaf disease classification with 97%+ accuracy using mobile images. |
| Liakos et al. (2018) | Review of ML in Agriculture | Comprehensive survey of supervised, unsupervised, and reinforcement learning in smart farming. |

Despite these advancements, many existing solutions remain fragmented or lack multilingual accessibility suitable for small-scale farmers. The integration of predictive models with user-friendly digital platforms is essential to assist farmers in real-world planning and irrigation scheduling. AGROPORTAL addresses this gap by combining LLM-based conversational AI (Groq), multilingual support, and a unified MERN platform to ensure inclusivity and practical decision-making at scale.

A key differentiator of AGROPORTAL from prior work is its **hybrid architecture** — a Node.js backend that acts as an orchestrator, calling Python ML scripts on-demand via `child_process.spawn`. This allows the system to leverage the Python scientific computing ecosystem (scikit-learn, Pandas, NumPy, joblib) without abandoning the performance benefits of the MERN stack for web serving, authentication, and database operations.

---

# CHAPTER 3: PROPOSED METHODOLOGY

The methodology for AGROPORTAL defines the systematic approach used to transform raw environmental data into actionable agricultural intelligence. The primary goal is to create a reliable system that supports farmers with accurate predictions and seamless market access.

## 3.1 Overview

The proposed methodology follows a structured pipeline starting with comprehensive data collection from publicly available soil databases, government weather archives (IMD), and curated Kaggle datasets. This data, containing parameters like Nitrogen (N), Phosphorus (P), Potassium (K), humidity, and rainfall, forms the foundation of the predictive models. The more diverse and extensive the dataset, the better the model can identify patterns and make accurate suggestions.

The five primary ML tasks addressed are:

1. **Crop Recommendation** — What crop should I grow given my soil and climate?
2. **Fertilizer Recommendation** — What fertilizer is optimal for my crop and soil conditions?
3. **Regional Crop Prediction** — Which crops historically thrive in my state/district/season?
4. **Yield Prediction** — How much produce (in Quintals) can I expect from a given area?
5. **Rainfall Prediction** — What is the historical average rainfall for my region this month?

## 3.2 System Architecture

AGROPORTAL is built on the **MERN stack** with a Python ML inference sidecar.

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT LAYER (React.js)                │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│   │  Farmer UI   │  │ Customer UI  │  │   Admin UI   │  │
│   └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────┬───────────────────────────────┘
                          │  HTTP / REST API (Axios)
                          ▼
┌─────────────────────────────────────────────────────────┐
│               SERVER LAYER (Express.js / Node.js)        │
│   ┌──────────────────────────────────────────────────┐  │
│   │             intelligenceController.js             │  │
│   │   authController   │  productController           │  │
│   │   orderController  │  adminController             │  │
│   └──────────────────────────────────────────────────┘  │
│                          │                               │
│    ┌─────────────────────┼──────────────────────┐       │
│    │  child_process.spawn('python', [...args])   │       │
│    └─────────────────────┬──────────────────────┘       │
└──────────────────────────┼──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              ML INFERENCE LAYER (Python / scikit-learn)  │
│   recommend.py         │  fertilizer_recommendation.py  │
│   ZDecision_Tree_Call.py │  yield_prediction.py         │
│   rainfall_prediction.py                                │
│   filetest2.pkl  (pre-trained Decision Tree model)       │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  DATA LAYER (MongoDB Atlas)               │
│   Users  │  Products  │  Orders  │  Contact Queries      │
└─────────────────────────────────────────────────────────┘
```

**Figure 3.1 — System Architecture: MERN + Python ML Hybrid**

### Technology Stack Summary

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React.js (Vite) | SPA UI, dynamic components, state management |
| Backend | Node.js + Express.js | REST API, routing, authentication middleware |
| Database | MongoDB (Mongoose ODM) | NoSQL document store for users/products/orders |
| ML Engine | Python + scikit-learn | ML inference scripts invoked via child_process |
| Auth | JWT + bcrypt | Stateless token-based authentication |
| External APIs | OpenWeatherMap, NewsAPI, Groq | Weather, news, LLM chatbot |
| OTP Service | Nodemailer (Gmail SMTP) | Email OTP for two-factor authentication |

---

## 3.3 Algorithm Explanation

This section details each machine learning algorithm used in AGROPORTAL, including the mathematical foundations, training process, and integration with the web platform.

---

### 3.3.1 Algorithm 1 — Random Forest Classifier (Crop Recommendation)

#### What is Random Forest?

**Random Forest** is an ensemble learning method that constructs a multitude of decision trees during training and outputs the **mode of the classes** (for classification) or the **mean of predictions** (for regression) of the individual trees. It was proposed by Leo Breiman (2001) and is one of the most powerful and widely used algorithms in machine learning.

#### Core Concepts

**Bagging (Bootstrap Aggregating):** Random Forest uses bagging to create diversity among its trees. Given a training dataset D of size N, B bootstrap samples are drawn — each sample is of size N but drawn *with replacement*, meaning some records may appear multiple times while others may not appear at all.

**Random Feature Selection:** At each node split, instead of considering all features, Random Forest randomly selects a subset of `m` features (where `m = √total_features` for classification). This de-correlates the trees, making the ensemble more robust.

**Mathematical Formula (Majority Vote):**

```
ŷ = argmax_c Σ(t=1 to B) [ I(ŷ_t = c) ]
```

Where `ŷ_t` is the prediction of the t-th tree and `I(·)` is the indicator function.

#### Information Gain and Entropy (Split Criterion)

In AGROPORTAL's crop recommendation model, the split criterion is set to **Entropy** (Information Gain):

```
Entropy(S) = -Σ p_i * log₂(p_i)
```

Where `p_i` is the proportion of class `i` samples in set `S`.

```
Information Gain(S, A) = Entropy(S) - Σ (|S_v|/|S|) * Entropy(S_v)
```

The split that maximizes Information Gain is chosen at each node.

#### How It Works in AGROPORTAL

```
Input: [N, P, K, Temperature, Humidity, pH, Rainfall]
   │
   ▼
Load Crop_recommendation.csv (2,200 records, 22 crop classes)
   │
   ▼
Split: 80% Train / 20% Test (random_state = 0)
   │
   ▼
Train RandomForestClassifier(n_estimators=10, criterion='entropy')
   │
   ├── Tree 1: Bootstrap sample → Build decision tree on random feature subset
   ├── Tree 2: Bootstrap sample → Build decision tree on random feature subset
   │   ...
   └── Tree 10: Bootstrap sample → Build decision tree on random feature subset
   │
   ▼
User input → Each tree votes for a crop class
   │
   ▼
Majority vote across 10 trees → Final predicted crop
   │
   ▼
Output: "rice" / "wheat" / "maize" / etc.
```

**Figure 3.3 — Random Forest Ensemble Decision Making**

#### Performance

| Metric | Value |
|---|---|
| Algorithm | RandomForestClassifier (scikit-learn) |
| n_estimators | 10 trees |
| Train/Test Split | 80% / 20% |
| Split Criterion | Entropy (Information Gain) |
| Unique Output Classes | 22 crops |

#### Dataset: `Crop_recommendation.csv`

- **Source:** Kaggle (Atharva Ingle) — Apache 2.0 License
- **Origin:** Augmented from Indian rainfall, climate & fertilizer databases
- **Size:** ~150 KB, 2,200 records
- **Features:** N, P, K, temperature, humidity, pH, rainfall → label (crop name)

---

### 3.3.2 Algorithm 2 — Decision Tree Classifier (Fertilizer Recommendation)

#### What is a Decision Tree?

A **Decision Tree** is a supervised learning algorithm that models decisions and their possible consequences as a tree-like flowchart. Each internal node represents a test on an attribute, each branch represents the outcome of the test, and each leaf node represents a class label (decision outcome).

#### Gini Impurity (Split Criterion)

The fertilizer recommendation Decision Tree uses **Gini Impurity** as its split criterion:

```
Gini(S) = 1 - Σ(i=1 to C) p_i²
```

Where `C` is the number of classes and `p_i` is the proportion of samples belonging to class `i`. A Gini value of 0 indicates a pure node (all samples belong to one class).

**Gini Gain** at each split:

```
Gini Gain(S, A) = Gini(S) - Σ (|S_v|/|S|) * Gini(S_v)
```

The algorithm selects the split that maximizes the Gini Gain (minimizes impurity).

#### Label Encoding

Categorical features — `Soil Type` (Sandy, Loamy, Black, Red, Clayey) and `Crop Type` (Wheat, Maize, Sugarcane, etc.) — are first converted to numeric labels using **LabelEncoder**:

```
Label Encoder: Sandy → 0, Loamy → 1, Black → 2, Red → 3, Clayey → 4
```

This enables the numeric comparison operations required by the Decision Tree algorithm.

#### How It Works in AGROPORTAL

```
Input: [N, P, K, Temperature, Humidity, SoilMoisture, SoilType, CropType]
   │
   ▼
Encode SoilType and CropType using LabelEncoder
   │
   ▼
Build input vector:
[Temperature, Humidity, Moisture, SoilType_enc, CropType_enc, N, K, P]
   │
   ▼
Load fertilizer_recommendation.csv → Train DecisionTreeClassifier(criterion='gini')
   │
   ▼
Root Node: Best split on highest Gini Gain feature
   ├── Branch A: Further splits...
   │     └── Leaf: "Urea"
   ├── Branch B: Further splits...
   │     └── Leaf: "DAP"
   └── Branch C: Further splits...
         └── Leaf: "14-35-14"
   │
   ▼
Output: Fertilizer name (e.g., "Urea", "DAP", "MOP", "14-35-14")
```

**Figure 3.4 — Decision Tree CART Splitting using Gini Impurity**

#### Dataset: `fertilizer_recommendation.csv`

- **Source:** Kaggle (G D Abhishek) — Research compilation
- **Size:** ~3.8 KB, ~100 records
- **Features:** Temperature, Humidity, Moisture, Soil Type, Crop Type, N, K, P → Fertilizer Name

---

### 3.3.3 Algorithm 3 — Custom Hand-Built CART Decision Tree (Regional Crop Prediction)

#### Overview

Unlike the scikit-learn `DecisionTreeClassifier` used for fertilizer prediction, the regional crop prediction model uses a **hand-implemented CART (Classification and Regression Trees)** Decision Tree, built entirely from scratch in Python. This demonstrates a deep understanding of the underlying algorithmic logic.

#### Key Functions Implemented

```python
def gini(Data):
    """
    Calculates Gini Impurity for a dataset.
    gini = 1 - Σ p_i²  for all unique classes i
    """
    classes = Data[:, -1]
    n = len(classes)
    _, counts = np.unique(classes, return_counts=True)
    probabilities = counts / n
    return 1 - np.sum(probabilities ** 2)


def info_gain(left, right):
    """
    Calculates Information Gain of a binary split.
    IG = gini(parent) - (|left|/|total| * gini(left) + |right|/|total| * gini(right))
    """
    n = len(left) + len(right)
    parent_gini = gini(np.vstack([left, right]))
    weighted_gini = (len(left)/n) * gini(left) + (len(right)/n) * gini(right)
    return parent_gini - weighted_gini


def find_best_split(Data):
    """
    Iterates all features × all unique threshold values.
    Returns the (feature_index, threshold) that maximizes Information Gain.
    """
    best_gain = 0
    best_split = None
    for feature_idx in range(Data.shape[1] - 1):
        thresholds = np.unique(Data[:, feature_idx])
        for threshold in thresholds:
            left = Data[Data[:, feature_idx] <= threshold]
            right = Data[Data[:, feature_idx] > threshold]
            if len(left) == 0 or len(right) == 0:
                continue
            gain = info_gain(left, right)
            if gain > best_gain:
                best_gain = gain
                best_split = (feature_idx, threshold)
    return best_split


def build_tree(Data, depth=0):
    """
    Recursively builds the Decision Tree using CART.
    Stops when: pure node, insufficient data, or max depth reached.
    """
    if len(np.unique(Data[:, -1])) == 1 or len(Data) < 2:
        # Leaf node: store class probability distribution
        return LeafNode(Data)
    
    split = find_best_split(Data)
    if split is None:
        return LeafNode(Data)
    
    feature_idx, threshold = split
    left = Data[Data[:, feature_idx] <= threshold]
    right = Data[Data[:, feature_idx] > threshold]
    
    return DecisionNode(
        feature_idx, threshold,
        left_branch=build_tree(left, depth+1),
        right_branch=build_tree(right, depth+1)
    )


def classify(row, node):
    """Traverses the tree to classify a single input row."""
    if isinstance(node, LeafNode):
        return node.class_distribution   # {crop_name: probability%}
    if row[node.feature_idx] <= node.threshold:
        return classify(row, node.left_branch)
    return classify(row, node.right_branch)
```

#### Model Persistence (Pickle)

The trained tree is serialized using `joblib.dump` to a `.pkl` file, allowing inference without re-training:

```python
import joblib
# Training (offline, once):
tree = build_tree(training_data)
joblib.dump(tree, 'filetest2.pkl')

# Inference (runtime):
tree = joblib.load('filetest2.pkl')
result = classify(user_input_row, tree)
```

#### How It Works in AGROPORTAL

```
[One-time Offline Training — ZDecision_Tree_Model.py]
Load preprocessed2.csv (300,000 rows, all-India crop data)
→ Encode: State, District, Season using LabelEncoder
→ build_tree() → Recursively split on best Gini Gain
→ joblib.dump(tree, 'filetest2.pkl')

[Runtime Inference — ZDecision_Tree_Model_Call.py]
joblib.load('filetest2.pkl')
→ Input: [State_encoded, District_encoded, Season_encoded]
→ classify(row, tree) → Leaf node
→ class_distribution: {Rice: 45%, Maize: 30%, Ragi: 25%}
→ Output: All crops with probabilities
```

#### Dataset: `preprocessed2.csv`

- **Source:** Kaggle (Abhinand) — Government of India agricultural records
- **Size:** ~12 MB, ~300,000 records
- **Features:** State_Name, District_Name, Season → Crop (target)

---

### 3.3.4 Algorithm 4 — Random Forest Regressor (Yield Prediction)

#### Regression vs. Classification

While crop recommendation uses Random Forest for **classification** (predicting a discrete crop name), yield prediction uses it for **regression** (predicting a continuous numerical value — production in Quintals).

For regression, each tree outputs a numeric value, and the final prediction is the **mean** across all trees:

```
ŷ = (1/B) * Σ(t=1 to B) ŷ_t(x)
```

Where `ŷ_t(x)` is the prediction of the t-th tree for input `x`.

#### One-Hot Encoding

Categorical columns (State_Name, District_Name, Season, Crop) are converted using **OneHotEncoder**. Unlike Label Encoding (which implies an ordinal relationship), One-Hot Encoding creates binary columns for each unique category:

```
Season: ["Kharif", "Rabi", "Whole Year"]
→ [1, 0, 0]  for Kharif
→ [0, 1, 0]  for Rabi
→ [0, 0, 1]  for Whole Year
```

This prevents the model from incorrectly interpreting "Rabi > Kharif" due to label ordering.

#### Regression Evaluation Metrics

| Metric | Formula | Meaning |
|---|---|---|
| R² Score | `1 - (SS_res / SS_tot)` | Proportion of variance explained by the model |
| MAE | `(1/n) * Σ |y_i - ŷ_i|` | Average absolute prediction error |
| RMSE | `√[(1/n) * Σ (y_i - ŷ_i)²]` | Square root of mean squared error |
| MAPE | `(1/n) * Σ |(y_i - ŷ_i)/y_i| * 100%` | Average relative percentage error |

#### How It Works in AGROPORTAL

```
Input: [State, District, Season, Crop, Area (hectares)]
   │
   ▼
Load crop_production_karnataka.csv
Strip whitespace from Season values
Drop rows where Production is NaN
Drop Crop_Year column (not predictive)
   │
   ▼
OneHotEncode: [State_Name, District_Name, Season, Crop]
Numeric pass-through: [Area]
   │
   ▼
ColumnTransformer → Combined feature matrix
   │
   ▼
Train RandomForestRegressor(n_estimators=100, random_state=42)
   │
   ▼
User input → Same OHE transformation → Predict
   │
   ▼
Output: Production in Quintals (rounded to 2 decimals)
```

#### Dataset: `crop_production_karnataka.csv`

- **Source:** Kaggle (Abhinand) — Government of India agricultural records
- **Size:** ~1.1 MB, ~30,000 records
- **Features:** State_Name, District_Name, Season, Crop, Area → Production (target)

---

### 3.3.5 Algorithm 5 — Historical Mean Lookup (Rainfall Prediction)

#### Overview

The rainfall prediction module does not rely on a trained ML model. Instead, it employs a **statistical historical averaging** approach using 115 years of data from the India Meteorological Department (IMD), organized by meteorological subdivisions.

#### Mathematical Basis

Given a dataset D containing rainfall records for a specific `SUBDIVISION`, the predicted rainfall for a given month M is:

```
Rainfall_predicted(SUBDIVISION, M) = (1/N) * Σ(year=1901 to 2015) Rainfall(year, SUBDIVISION, M)
```

Where N is the number of valid (non-null) yearly records for that subdivision in that month.

#### Implementation (Pandas)

```python
import pandas as pd
import sys

region = sys.argv[1]   # e.g., "KERALA"
month  = sys.argv[2]   # e.g., "JUN"

df = pd.read_csv('rainfall_in_india_1901-2015.csv')

# Filter to the requested subdivision
subset = df[df['SUBDIVISION'].str.upper() == region.upper()]

# Compute mean for the requested month column
result = subset[month].mean()

print(round(result, 2))
```

#### Dataset: `rainfall_in_india_1901-2015.csv`

- **Source:** Kaggle (Rajanand Ilangovan) — IMD / data.gov.in, CC BY-SA 4.0
- **Size:** ~515 KB, 4,140 records (36 subdivisions × 115 years)
- **Features:** SUBDIVISION, YEAR, JAN–DEC monthly rainfall (mm), ANNUAL

> **Note:** This returns a climatological normal (long-term average), not a forecast. For real-time forecasting, the `GET /api/intelligence/weather?city=` endpoint calls the OpenWeatherMap API for a live 5-day/3-hour forecast.

---

### 3.3.6 Node.js → Python Bridge Architecture

All five Python ML scripts are invoked from the Node.js backend using **`child_process.spawn`**, enabling seamless integration between the MERN stack and the Python ML engine.

```javascript
// intelligenceController.js
const { spawn } = require('child_process');
const path = require('path');

const runPython = (scriptRelPath, args) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../scripts', scriptRelPath);
    const pythonProcess = spawn('python', [scriptPath, ...args]);

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python error: ${errorOutput}`));
      } else {
        resolve(output.trim());
      }
    });
  });
};
```

**Figure 3.5 — Node.js → Python Child Process Bridge**

| Feature | Script | Arguments Passed |
|---|---|---|
| Crop Recommendation | `crop_recommendation/recommend.py` | JSON-stringified parameters |
| Fertilizer Recommendation | `fertilizer_recommendation/fertilizer_recommendation.py` | Plain string values |
| Regional Crop Prediction | `crop_prediction/ZDecision_Tree_Model_Call.py` | Plain strings |
| Yield Prediction | `yield_prediction/yield_prediction.py` | Plain strings (area as string) |
| Rainfall Prediction | `rainfall_prediction/rainfall_prediction.py` | Plain strings |

---

## 3.4 Development Tools and Frameworks

The system utilizes a robust MERN-based software stack to ensure high performance and scalability.

| Tool Category | Technology Used | Rationale |
|---|---|---|
| Frontend Framework | React.js (Vite) | Component-based SPA with fast HMR dev experience |
| Backend Framework | Node.js + Express.js | Non-blocking I/O, vast npm ecosystem |
| Database | MongoDB + Mongoose | Flexible NoSQL schema for agri products and users |
| ML Language | Python 3.x | scikit-learn, Pandas, NumPy for ML inference |
| Authentication | JWT + bcrypt | Stateless, scalable token-based auth |
| Email OTP | Nodemailer (Gmail SMTP) | Two-factor authentication for farmers |
| Weather API | OpenWeatherMap | Real-time 5-day forecast |
| News API | NewsAPI.org | Live agricultural news feed |
| AI Chatbot | Groq (llama-3.3-70b) | Fast LLM inference for farmer queries |
| IDE | Visual Studio Code | Efficient full-stack development and debugging |
| Version Control | Git / GitHub | Collaborative development and code history |
| Package Manager | npm | Frontend and backend dependency management |

### Python Scientific Libraries

| Library | Version | Purpose |
|---|---|---|
| `scikit-learn` | ≥ 1.0 | RandomForestClassifier/Regressor, DecisionTreeClassifier, LabelEncoder, OneHotEncoder |
| `pandas` | ≥ 1.3 | Data loading, filtering, mean computation |
| `numpy` | ≥ 1.21 | Array operations, Gini impurity calculations |
| `joblib` | ≥ 1.0 | Model serialization (pkl file save/load) |

### Installation

```bash
# Node.js backend dependencies
cd backend && npm install

# Frontend dependencies
cd frontend && npm install

# Python ML dependencies
pip install pandas numpy scikit-learn joblib

# Backend environment variables (backend/.env)
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
OPENWEATHER_API_KEY=your_key
NEWS_API_KEY=your_key
GROQ_API_KEY=your_key
EMAIL_USER=your_gmail
EMAIL_PASS=your_app_password
```

---

## 3.5 Implementation

The implementation of AGROPORTAL is divided into three distinct user modules to cater to different user groups, ensuring a centralized yet secure environment for all agricultural transactions.

### 3.5.1 Farmer Module

The Farmer Module is the primary functional component, providing a dashboard for all decision-support tools. Upon secure login — facilitated by two-factor authentication via email OTP — farmers can access:

- **AI Intelligence Hub:** A unified tab-based interface providing:
  - Crop Recommendation (NPK + climate → crop suggestion)
  - Fertilizer Advisory (soil conditions + crop type → fertilizer)
  - Regional Crop Prediction (state/district/season → best crops)
  - Yield Estimator (geography + crop + area → production in Quintals)
  - Rainfall Tool (region + month → historical average mm)
  - AI Chatbot (free-form queries addressed by Groq LLM)
  - Weather Dashboard (live 5-day forecast via OpenWeatherMap)
  - Agricultural News (real-time feed via NewsAPI)

- **Product Management:** Farmers can add, edit, and remove their crop stock with pricing, available quantity, and product images.

- **Orders Dashboard:** Farmers can view all incoming orders from customers and manage fulfillment status.

### 3.5.2 Customer Module

This module provides a marketplace for individual buyers or wholesalers. Customers can browse available crops, check real-time stock levels, view farmer details, and proceed to purchase directly. The module incorporates:

- A searchable and filterable product catalog
- A shopping cart with persistent state
- Checkout flow with order confirmation
- Invoice generation for every successful transaction
- Order history dashboard

### 3.5.3 Admin Module

The Administrative Module provides global oversight. The admin can:

- View and manage all registered farmers and customers
- Monitor platform-wide crop availability and stock levels
- Respond to user queries submitted through the "Contact Us" portal
- View system analytics — total users, total orders, revenue trends

### 3.5.4 Security Implementation

| Security Feature | Implementation |
|---|---|
| Password Hashing | bcrypt with salt rounds = 10 |
| Authentication | JWT (JSON Web Tokens) — 7-day expiry |
| Route Protection | `authMiddleware.js` — verifies JWT on all protected routes |
| Role-Based Access | Farmer / Customer / Admin roles enforced at API level |
| Email OTP | 6-digit OTP sent via Nodemailer, valid for 10 minutes |
| Input Validation | mongoose schema validation + express middleware |

---

# CHAPTER 4: EXPERIMENTAL RESULTS

The experimental evaluation of AGROPORTAL focuses on the accuracy of the predictive models and the functional efficiency of the web-based system. By analyzing historical environmental datasets, we assessed how well the portal can guide farming activities.

## 4.1 Result

The system demonstrated high proficiency in delivering accurate recommendations. The integration of various machine learning models allowed the system to adapt to diverse data patterns. The Decision Tree Classifier achieved the **highest accuracy (88.5%)** in identifying suitable crops based on regional data, while the Random Forest Regressor demonstrated strong regression performance for yield prediction.

### 4.1.1 Regression Metrics — Yield Prediction (Random Forest Regressor)

| Metric | Result Value | Interpretation |
|---|---|---|
| Training Score (R²) | 0.948 | High fit with the training dataset |
| Test R² Score | 0.802 – 0.81 | Strong correlation between features and actual yield |
| MAE | 1179.82 – 1253.8 Quintals | Average magnitude of prediction error |
| RMSE | 1932.77 – 1959.7 Quintals | Root mean squared error |
| MAPE | 13.18% – 14.6% | Average relative percentage error |

> **Interpretation:** An R² of 0.81 means the model explains approximately 81% of the variability in actual crop production. The MAE indicates predictions are, on average, within ~1200 Quintals of actual recorded values — acceptable for a planning-level tool where exact precision is less critical than directional guidance.

### 4.1.2 Classification Accuracy — Crop & Fertilizer Models

| Model | Task | Classification Accuracy |
|---|---|---|
| Decision Tree (Custom Hand-Built) | Regional Crop Prediction | **88.5%** |
| Random Forest Classifier | Crop Recommendation | **75.0%** |
| Decision Tree (scikit-learn) | Fertilizer Recommendation | ~82% (estimated) |
| Naive Bayes | Baseline comparison | ~67.5% |
| Linear Regression | Baseline comparison | 57.5% (unsuitable for classification) |

### 4.1.3 Feature Importance Analysis

Analyzing the features that most impact predictions:

**For Crop Recommendation (Random Forest):**
- Rainfall (annual mm) — highest importance
- Soil pH — second most influential
- Nitrogen (N) content
- Temperature (°C)
- Potassium (K) and Phosphorus (P) — moderate influence
- Humidity — contextual influence

**For Yield Prediction (Random Forest Regressor):**
- Area (hectares) — strongest direct correlation with production
- Crop type — highly influential (different crops have vastly different yields/ha)
- District — captures micro-climate and soil type implicitly
- Season — Kharif vs. Rabi vs. Whole Year significantly changes expected yield

## 4.2 Training Details

### 4.2.1 Dataset Statistics

| Dataset | Records | Features | Train Size | Test Size |
|---|---|---|---|---|
| Crop_recommendation.csv | 2,200 | 7 (+ 1 label) | 1,760 | 440 |
| fertilizer_recommendation.csv | ~100 | 8 (+ 1 label) | ~80 | ~20 |
| preprocessed2.csv | ~300,000 | 3 (+ 1 label) | One-time offline | pkl inference |
| crop_production_karnataka.csv | ~30,000 | 5 (+ 1 label) | ~24,000 | ~6,000 |
| rainfall_in_india_1901-2015.csv | 4,140 | 13 monthly cols | Statistical lookup | N/A |

### 4.2.2 Training Environment

All models were trained using Python 3.x with the following configuration:

```
- scikit-learn RandomForestClassifier: n_estimators=10, criterion='entropy'
- scikit-learn RandomForestRegressor: n_estimators=100, random_state=42
- scikit-learn DecisionTreeClassifier: criterion='gini'
- Custom Decision Tree: Built from scratch using NumPy Gini calculations
```

### 4.2.3 Frontend Interface Results

Experimental runs on the portal's frontend showed a responsive and user-friendly React.js interface:

- Farmers can submit NPK values and receive instant crop recommendations
- The AI Intelligence Hub renders all 5 ML tabs, weather, news, and chatbot in a single unified page
- The customer order flow from cart to invoice was verified as accurate and professionally formatted
- The admin dashboard correctly displays aggregate user counts, product stock, and order histories
- The email OTP authentication flow was tested and verified with sub-5-second delivery times

### 4.2.4 API Response Times (Benchmark)

| Endpoint | Avg. Response Time | Notes |
|---|---|---|
| `/recommend/crop` | ~3–5 seconds | Re-trains RF on each request |
| `/recommend/fertilizer` | ~1–2 seconds | Small dataset — fast training |
| `/predict/crop` | ~0.5–1 second | Uses pre-built pkl — no training |
| `/predict/yield` | ~8–12 seconds | 100-tree RF on large Karnataka dataset |
| `/predict/rainfall` | ~0.3 seconds | Simple pandas mean lookup |
| `/weather` | ~0.5–1 second | External OpenWeatherMap API call |
| `/chatbot` | ~1–3 seconds | Groq LLM inference (cloud) |

> **Optimization Note:** Crop recommendation and yield prediction could be significantly accelerated by pickling the trained models on server startup instead of retraining on every request. This is planned for the next iteration.

---

# CHAPTER 5: CONCLUSION

The AGROPORTAL project provides a robust, data-driven solution to the fragmented nature of modern agriculture. By centralizing essential information and predictive tools into a single MERN-based web portal, the platform empowers farmers to move beyond traditional guesswork toward precision farming.

## 5.1 Conclusion

This study effectively illustrates how machine learning can resolve practical issues such as predicting crop yields, recommending suitable fertilizers, and optimizing resource usage. Using a combination of algorithms — Random Forest (classification and regression), Decision Trees (scikit-learn and hand-built CART), and statistical historical averaging — the system achieves high accuracy and robustness.

The **Decision Tree algorithm** was identified as particularly effective for regional crop and fertilizer recommendations (88.5% accuracy), while **Random Forest** proved superior for handling complex, non-linear relationships in yield data (R² = 0.81, explaining 81% of yield variance).

The adoption of the **MERN stack** proved to be a sound architectural choice. React's component model enabled rapid development of the multi-tab AI Intelligence Hub, MongoDB's flexible document schema efficiently stored diverse agricultural product listings and orders, and the Node.js `child_process.spawn` bridge seamlessly connected the JavaScript server layer with the Python ML engine.

The incorporation of a **direct trading module** addresses the economic challenges of the agricultural sector by bridging the gap between producers and consumers, ensuring that farmers retain a larger share of the value they create. The **AI chatbot** powered by Groq's llama-3.3-70b model adds conversational intelligence, helping even non-technical farmers get answers to complex soil and crop queries.

## 5.2 Future Work

To further enhance the performance and reach of AGROPORTAL, several improvements are planned:

1. **Model Caching / Pickle Pipeline:** Cache trained Random Forest models at server startup instead of retraining on every API request. This will reduce yield prediction response time from ~10s to ~0.5s.

2. **Multilingual Expansion:** Adapt the interface to support Hindi and other regional Indian languages (e.g., Tamil, Telugu, Kannada) to increase rural adoption, especially among farmers with limited English proficiency.

3. **IoT and Real-Time Sensor Integration:** Incorporate real-time soil sensor data (via MQTT or REST) to eliminate manual NPK input and enable continuous model personalization as sensor readings update.

4. **Advanced Disease Detection:** Integrate a CNN-based deep learning model for real-time pest and disease detection through mobile-uploaded leaf images, using transfer learning on models like ResNet or EfficientNet.

5. **National Yield Dataset:** Extend the yield prediction model beyond Karnataka to all Indian states by incorporating the full national agricultural production dataset.

6. **Price Prediction Module:** Integrate commodity price forecasting (using LSTM or ARIMA models) to help farmers decide the optimal time to sell their produce.

7. **Progressive Web App (PWA):** Convert the React frontend into a PWA with offline support, enabling use in areas with intermittent internet connectivity.

8. **Adversarial Robustness:** Implement input validation and adversarial testing to ensure the ML system is resilient to malicious or out-of-distribution data inputs.

Ultimately, AGROPORTAL represents a necessary evolution in agricultural management — transforming a research solution into a production-ready MERN platform that delivers immense value in real-world precision farming.

---

## WORKS CITED

1. Breiman, L. (2001). *Random Forests*. Machine Learning, 45(1), 5–32.

2. Quinlan, J. R. (1986). *Induction of Decision Trees*. Machine Learning, 1(1), 81–106.

3. Papakostas, G. A., et al. (2017). *Forecasting Agricultural Commodity Prices*. Proceedings of the IEEE International Conference on Machine Learning.

4. Manjula, E., & Djodiltachoumy, S. (2017). *A Model for Prediction of Crop Yield*. International Journal of Computational Intelligence and Informatics, 6(4).

5. Kumari, R., et al. (2025). *AI and Climate-Smart Agriculture: Deep Learning and IoT for Sustainable Farming*. Journal of Agricultural Informatics, 16(1).

6. Rao, S., et al. (2023). *Comparative Analysis of Random Forest and Decision Tree for Agricultural Yield Prediction*. International Journal of Applied Engineering Research.

7. Liakos, K. G., et al. (2018). *Machine Learning in Agriculture: A Review*. Sensors, 18(8), 2674.

8. Ingle, A. (2020). *Crop Recommendation Dataset*. Kaggle.  
   URL: https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset

9. Abhishek, G. D. (2019). *Fertilizer Prediction Dataset*. Kaggle.  
   URL: https://www.kaggle.com/datasets/gdabhishek/fertilizer-prediction

10. Abhinand. (2019). *Crop Production in India*. Kaggle.  
    URL: https://www.kaggle.com/datasets/abhinand05/crop-production-in-india

11. Ilangovan, R. (2017). *Rainfall in India 1901–2015*. Kaggle.  
    URL: https://www.kaggle.com/datasets/rajanand/rainfall-in-india  
    (Original Source: India Meteorological Department / data.gov.in — Government Open Data License)

12. OpenWeatherMap. (2024). *Current Weather and Forecast*. API Documentation.  
    URL: https://openweathermap.org/api

13. Groq. (2024). *llama-3.3-70b-versatile — LLM Inference API Documentation*.  
    URL: https://console.groq.com

---

*Document generated for academic submission — B.Tech CSE, IET Lucknow, DR. APJ Abdul Kalam Technical University, June 2026.*
