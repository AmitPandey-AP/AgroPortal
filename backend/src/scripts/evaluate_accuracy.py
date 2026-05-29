"""
=============================================================
  AgroPortal â€” Model Accuracy Evaluation Script
  Evaluates all 5 datasets / ML models used in the project
=============================================================
Datasets:
  1. Crop_recommendation.csv        â†’ RandomForestClassifier
  2. fertilizer_recommendation.csv  â†’ DecisionTreeClassifier
  3. preprocessed2.csv              â†’ Custom Decision Tree (crop prediction)
  4. crop_production_karnataka.csv  â†’ RandomForestRegressor (yield prediction)
  5. rainfall_in_india_1901-2015.csvâ†’ Statistical mean predictor (regression)
"""

import os, warnings
import pandas as pd
import numpy as np
from collections import Counter

warnings.filterwarnings('ignore')

BASE = os.path.dirname(os.path.abspath(__file__))

CROP_REC_CSV       = os.path.join(BASE, 'crop_recommendation',    'Crop_recommendation.csv')
FERT_REC_CSV       = os.path.join(BASE, 'fertilizer_recommendation','fertilizer_recommendation.csv')
CROP_PRED_CSV      = os.path.join(BASE, 'crop_prediction',         'preprocessed2.csv')
YIELD_PRED_CSV     = os.path.join(BASE, 'yield_prediction',        'crop_production_karnataka.csv')
RAINFALL_CSV       = os.path.join(BASE, 'rainfall_prediction',     'rainfall_in_india_1901-2015.csv')

SEP  = "=" * 70
SEP2 = "-" * 70

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# 1. CROP RECOMMENDATION  (RandomForestClassifier)
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
def eval_crop_recommendation():
    print(SEP)
    print("  DATASET 1: Crop_recommendation.csv")
    print("  MODEL   : Random Forest Classifier")
    print(SEP)

    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import train_test_split, cross_val_score
    from sklearn.metrics import (accuracy_score, precision_score,
                                 recall_score, f1_score, classification_report)

    df = pd.read_csv(CROP_REC_CSV)
    print(f"  Rows: {len(df):,}   |   Columns: {df.shape[1]}   |   Classes: {df.iloc[:,-1].nunique()}")
    print(f"  Features : {list(df.columns[:-1])}")
    print(f"  Target   : '{df.columns[-1]}'")
    print(SEP2)

    X = df.iloc[:, :-1].values
    y = df.iloc[:, -1].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=0)

    clf = RandomForestClassifier(n_estimators=10, criterion='entropy', random_state=0)
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)

    acc   = accuracy_score(y_test, y_pred) * 100
    prec  = precision_score(y_test, y_pred, average='weighted') * 100
    rec   = recall_score(y_test, y_pred, average='weighted') * 100
    f1    = f1_score(y_test, y_pred, average='weighted') * 100

    # 5-fold cross-validation
    cv_scores = cross_val_score(clf, X, y, cv=5, scoring='accuracy') * 100

    print(f"  Train size : {len(X_train):,}   Test size : {len(X_test):,}")
    print(f"\n  âœ” Accuracy           : {acc:.2f}%")
    print(f"  âœ” Precision (wtd)    : {prec:.2f}%")
    print(f"  âœ” Recall (wtd)       : {rec:.2f}%")
    print(f"  âœ” F1-Score (wtd)     : {f1:.2f}%")
    print(f"\n  âœ” 5-Fold CV Accuracy : {cv_scores.mean():.2f}% Â± {cv_scores.std():.2f}%")
    print(f"    Per-fold scores    : {[f'{s:.2f}%' for s in cv_scores]}")
    print()

    return {
        "dataset": "Crop_recommendation.csv",
        "model": "Random Forest Classifier",
        "accuracy": round(acc, 2),
        "precision": round(prec, 2),
        "recall": round(rec, 2),
        "f1_score": round(f1, 2),
        "cv_mean": round(cv_scores.mean(), 2),
        "cv_std": round(cv_scores.std(), 2),
    }

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# 2. FERTILIZER RECOMMENDATION  (DecisionTreeClassifier)
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
def eval_fertilizer_recommendation():
    print(SEP)
    print("  DATASET 2: fertilizer_recommendation.csv")
    print("  MODEL   : Decision Tree Classifier")
    print(SEP)

    from sklearn.tree import DecisionTreeClassifier
    from sklearn.preprocessing import LabelEncoder
    from sklearn.model_selection import train_test_split, cross_val_score
    from sklearn.metrics import (accuracy_score, precision_score,
                                 recall_score, f1_score)

    data = pd.read_csv(FERT_REC_CSV)
    print(f"  Rows: {len(data):,}   |   Columns: {data.shape[1]}   |   Classes: {data.iloc[:,-1].nunique()}")
    print(f"  Features : {list(data.columns[:-1])}")
    print(f"  Target   : '{data.columns[-1]}'")
    print(SEP2)

    le_soil = LabelEncoder()
    data['Soil Type'] = le_soil.fit_transform(data['Soil Type'])
    le_crop = LabelEncoder()
    data['Crop Type'] = le_crop.fit_transform(data['Crop Type'])

    X = data.iloc[:, :8]
    y = data.iloc[:, -1]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=0)

    dtc = DecisionTreeClassifier(random_state=0)
    dtc.fit(X_train, y_train)
    y_pred = dtc.predict(X_test)

    acc   = accuracy_score(y_test, y_pred) * 100
    prec  = precision_score(y_test, y_pred, average='weighted', zero_division=0) * 100
    rec   = recall_score(y_test, y_pred, average='weighted', zero_division=0) * 100
    f1    = f1_score(y_test, y_pred, average='weighted', zero_division=0) * 100

    cv_scores = cross_val_score(dtc, X, y, cv=5, scoring='accuracy') * 100

    print(f"  Train size : {len(X_train):,}   Test size : {len(X_test):,}")
    print(f"\n  âœ” Accuracy           : {acc:.2f}%")
    print(f"  âœ” Precision (wtd)    : {prec:.2f}%")
    print(f"  âœ” Recall (wtd)       : {rec:.2f}%")
    print(f"  âœ” F1-Score (wtd)     : {f1:.2f}%")
    print(f"\n  âœ” 5-Fold CV Accuracy : {cv_scores.mean():.2f}% Â± {cv_scores.std():.2f}%")
    print(f"    Per-fold scores    : {[f'{s:.2f}%' for s in cv_scores]}")
    print()

    return {
        "dataset": "fertilizer_recommendation.csv",
        "model": "Decision Tree Classifier",
        "accuracy": round(acc, 2),
        "precision": round(prec, 2),
        "recall": round(rec, 2),
        "f1_score": round(f1, 2),
        "cv_mean": round(cv_scores.mean(), 2),
        "cv_std": round(cv_scores.std(), 2),
    }

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# 3. CROP PREDICTION  (preprocessed2.csv â€” custom Decision Tree)
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
def eval_crop_prediction():
    print(SEP)
    print("  DATASET 3: preprocessed2.csv")
    print("  MODEL   : Custom Decision Tree (sklearn DecisionTreeClassifier)")
    print(SEP)

    from sklearn.tree import DecisionTreeClassifier
    from sklearn.preprocessing import LabelEncoder
    from sklearn.model_selection import train_test_split, cross_val_score
    from sklearn.metrics import (accuracy_score, precision_score,
                                 recall_score, f1_score)

    data = pd.read_csv(CROP_PRED_CSV)

    # Drop index column if present
    if 'Unnamed: 0' in data.columns:
        data = data.drop(columns=['Unnamed: 0'])

    data['Season'] = data['Season'].str.strip()

    print(f"  Rows: {len(data):,}   |   Columns: {data.shape[1]}   |   Classes: {data['Crop'].nunique()}")
    print(f"  Features : {list(data.columns[:-1])}")
    print(f"  Target   : 'Crop'")
    print(SEP2)

    # Encode categorical columns
    le_state    = LabelEncoder()
    le_district = LabelEncoder()
    le_season   = LabelEncoder()
    le_crop     = LabelEncoder()

    data['State_Name']    = le_state.fit_transform(data['State_Name'].astype(str))
    data['District_Name'] = le_district.fit_transform(data['District_Name'].astype(str))
    data['Season']        = le_season.fit_transform(data['Season'].astype(str))
    data['Crop']          = le_crop.fit_transform(data['Crop'].astype(str))

    X = data.drop(columns=['Crop']).values
    y = data['Crop'].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42)

    clf = DecisionTreeClassifier(random_state=42)
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)

    acc   = accuracy_score(y_test, y_pred) * 100
    prec  = precision_score(y_test, y_pred, average='weighted', zero_division=0) * 100
    rec   = recall_score(y_test, y_pred, average='weighted', zero_division=0) * 100
    f1    = f1_score(y_test, y_pred, average='weighted', zero_division=0) * 100

    cv_scores = cross_val_score(clf, X, y, cv=5, scoring='accuracy') * 100

    print(f"  Train size : {len(X_train):,}   Test size : {len(X_test):,}")
    print(f"\n  âœ” Accuracy           : {acc:.2f}%")
    print(f"  âœ” Precision (wtd)    : {prec:.2f}%")
    print(f"  âœ” Recall (wtd)       : {rec:.2f}%")
    print(f"  âœ” F1-Score (wtd)     : {f1:.2f}%")
    print(f"\n  âœ” 5-Fold CV Accuracy : {cv_scores.mean():.2f}% Â± {cv_scores.std():.2f}%")
    print(f"    Per-fold scores    : {[f'{s:.2f}%' for s in cv_scores]}")
    print()

    return {
        "dataset": "preprocessed2.csv",
        "model": "Decision Tree Classifier",
        "accuracy": round(acc, 2),
        "precision": round(prec, 2),
        "recall": round(rec, 2),
        "f1_score": round(f1, 2),
        "cv_mean": round(cv_scores.mean(), 2),
        "cv_std": round(cv_scores.std(), 2),
    }

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# 4. YIELD PREDICTION  (crop_production_karnataka.csv â€” RandomForestRegressor)
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
def eval_yield_prediction():
    print(SEP)
    print("  DATASET 4: crop_production_karnataka.csv")
    print("  MODEL   : Random Forest Regressor (Yield Prediction)")
    print(SEP)

    from sklearn.ensemble import RandomForestRegressor
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import OneHotEncoder
    from sklearn.metrics import (mean_absolute_error, mean_squared_error, r2_score)

    df = pd.read_csv(YIELD_PRED_CSV)
    df = df.drop(['Crop_Year'], axis=1)
    df['Season'] = df['Season'].str.strip()
    df = df.dropna(subset=['Production'])

    print(f"  Rows: {len(df):,}   |   Columns: {df.shape[1]}")
    print(f"  Target   : 'Production'")
    print(SEP2)

    X = df.drop(['Production'], axis=1)
    y = df['Production']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42)

    categorical_cols = ['State_Name', 'District_Name', 'Season', 'Crop']
    ohe = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
    ohe.fit(X_train[categorical_cols])

    X_train_cat = ohe.transform(X_train[categorical_cols])
    X_test_cat  = ohe.transform(X_test[categorical_cols])

    X_train_num = X_train.drop(categorical_cols, axis=1).values.astype(float)
    X_test_num  = X_test.drop(categorical_cols, axis=1).values.astype(float)

    X_train_final = np.hstack((X_train_cat, X_train_num))
    X_test_final  = np.hstack((X_test_cat,  X_test_num))

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train_final, y_train)
    y_pred = model.predict(X_test_final)

    r2   = r2_score(y_test, y_pred) * 100
    mae  = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))

    # Accuracy within Â±10% tolerance
    tol_10 = np.mean(np.abs(y_pred - y_test) / (np.abs(y_test) + 1e-9) <= 0.10) * 100
    tol_20 = np.mean(np.abs(y_pred - y_test) / (np.abs(y_test) + 1e-9) <= 0.20) * 100

    print(f"  Train size : {len(X_train_final):,}   Test size : {len(X_test_final):,}")
    print(f"\n  âœ” RÂ² Score           : {r2:.2f}%")
    print(f"  âœ” MAE                : {mae:,.2f} tonnes")
    print(f"  âœ” RMSE               : {rmse:,.2f} tonnes")
    print(f"  âœ” Within Â±10% range  : {tol_10:.2f}%  of test samples")
    print(f"  âœ” Within Â±20% range  : {tol_20:.2f}%  of test samples")
    print()

    return {
        "dataset": "crop_production_karnataka.csv",
        "model": "Random Forest Regressor",
        "r2_score": round(r2, 2),
        "mae": round(mae, 2),
        "rmse": round(rmse, 2),
        "within_10pct": round(tol_10, 2),
        "within_20pct": round(tol_20, 2),
    }

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# 5. RAINFALL PREDICTION  (statistical mean predictor)
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
def eval_rainfall_prediction():
    print(SEP)
    print("  DATASET 5: rainfall_in_india_1901-2015.csv")
    print("  MODEL   : Statistical Mean Predictor + Linear Regression")
    print(SEP)

    from sklearn.linear_model import LinearRegression
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

    df = pd.read_csv(RAINFALL_CSV)
    print(f"  Rows: {len(df):,}   |   Columns: {df.shape[1]}")
    print(f"  Subdivisions: {df['SUBDIVISION'].nunique()}")
    print(f"  Year range  : {df['YEAR'].min()} â€“ {df['YEAR'].max()}")
    print(SEP2)

    monthly_cols = ['JAN','FEB','MAR','APR','MAY','JUN',
                    'JUL','AUG','SEP','OCT','NOV','DEC']
    df_clean = df.dropna(subset=['ANNUAL'])

    # â”€â”€ A. Statistical Mean Predictor Accuracy â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    # For each (subdivision, month), predict = mean over all years
    # then compare to actual values
    errors = []
    for sub in df_clean['SUBDIVISION'].unique():
        sub_df = df_clean[df_clean['SUBDIVISION'] == sub]
        for month in monthly_cols:
            mean_val = sub_df[month].mean()
            actuals  = sub_df[month].dropna()
            for actual in actuals:
                errors.append(abs(actual - mean_val))

    mae_stat  = np.mean(errors)
    rmse_stat = np.sqrt(np.mean(np.array(errors)**2))

    # â”€â”€ B. Linear Regression on YEAR â†’ ANNUAL rainfall â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    df_lr = df_clean[['YEAR','ANNUAL']].dropna()
    X_lr = df_lr[['YEAR']].values
    y_lr = df_lr['ANNUAL'].values

    X_train, X_test, y_train, y_test = train_test_split(
        X_lr, y_lr, test_size=0.2, random_state=42)

    lr = LinearRegression()
    lr.fit(X_train, y_train)
    y_pred = lr.predict(X_test)

    r2   = r2_score(y_test, y_pred) * 100
    mae  = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))

    print(f"  [Statistical Mean Predictor â€” per subdivision/month]")
    print(f"  âœ” MAE                : {mae_stat:.2f} mm")
    print(f"  âœ” RMSE               : {rmse_stat:.2f} mm")

    print(f"\n  [Linear Regression â€” YEAR â†’ ANNUAL rainfall]")
    print(f"  Train size : {len(X_train):,}   Test size : {len(X_test):,}")
    print(f"  âœ” RÂ² Score           : {r2:.2f}%")
    print(f"  âœ” MAE                : {mae:.2f} mm")
    print(f"  âœ” RMSE               : {rmse:.2f} mm")
    print()

    return {
        "dataset": "rainfall_in_india_1901-2015.csv",
        "model": "Statistical Mean + Linear Regression",
        "stat_mae_mm": round(mae_stat, 2),
        "stat_rmse_mm": round(rmse_stat, 2),
        "lr_r2_score": round(r2, 2),
        "lr_mae_mm": round(mae, 2),
        "lr_rmse_mm": round(rmse, 2),
    }

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# SUMMARY TABLE
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
def print_summary(results):
    print("\n")
    print("=" * 70)
    print("  AGROPORTAL â€” COMPLETE ACCURACY SUMMARY")
    print("=" * 70)

    classifiers = [r for r in results if 'accuracy' in r]
    regressors  = [r for r in results if 'r2_score' in r or 'lr_r2_score' in r]

    if classifiers:
        print(f"\n  {'Dataset':<36} {'Model':<28} {'Acc%':>6} {'CV%':>6} {'F1%':>6}")
        print("  " + "-" * 84)
        for r in classifiers:
            print(f"  {r['dataset']:<36} {r['model']:<28} "
                  f"{r['accuracy']:>6.2f} {r.get('cv_mean',0):>6.2f} {r['f1_score']:>6.2f}")

    if regressors:
        print(f"\n  {'Dataset':<36} {'Model':<26} {'RÂ²%':>6} {'MAE':>10} {'RMSE':>12}")
        print("  " + "-" * 92)
        for r in regressors:
            if 'r2_score' in r:
                print(f"  {r['dataset']:<36} {r['model']:<26} "
                      f"{r['r2_score']:>6.2f} {r['mae']:>10,.2f} {r['rmse']:>12,.2f}")
            elif 'lr_r2_score' in r:
                print(f"  {r['dataset']:<36} {r['model']:<26} "
                      f"{r['lr_r2_score']:>6.2f} {r['lr_mae_mm']:>10.2f} {r['lr_rmse_mm']:>12.2f}")

    print("\n" + "=" * 70 + "\n")

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# MAIN
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
if __name__ == '__main__':
    all_results = []
    print("\n")
    all_results.append(eval_crop_recommendation())
    all_results.append(eval_fertilizer_recommendation())
    all_results.append(eval_crop_prediction())
    all_results.append(eval_yield_prediction())
    all_results.append(eval_rainfall_prediction())
    print_summary(all_results)
