import pandas as pd
import numpy as np
import sys
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder

# Load the dataset — path relative to this script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))
df = pd.read_csv(os.path.join(script_dir, 'crop_production_karnataka.csv'))

# Drop the Crop_Year column
df = df.drop(['Crop_Year'], axis=1)

# Strip trailing whitespace from Season column (CSV has 'Kharif     ' etc.)
df['Season'] = df['Season'].str.strip()

# Drop rows where Production is NaN
df = df.dropna(subset=['Production'])

# Separate the features and target variables
X = df.drop(['Production'], axis=1)
y = df['Production']

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Categorical columns for one-hot encoding
categorical_cols = ['State_Name', 'District_Name', 'Season', 'Crop']

# One-hot encode the categorical columns
ohe = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
ohe.fit(X_train[categorical_cols])

# Convert categorical columns to one-hot encoding
X_train_cat = ohe.transform(X_train[categorical_cols])
X_test_cat  = ohe.transform(X_test[categorical_cols])

# Combine one-hot encoded + numerical columns
X_train_num = X_train.drop(categorical_cols, axis=1).values.astype(float)
X_test_num  = X_test.drop(categorical_cols, axis=1).values.astype(float)

X_train_final = np.hstack((X_train_cat, X_train_num))
X_test_final  = np.hstack((X_test_cat,  X_test_num))

# Train the model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train_final, y_train)

# ---------- Read command-line args (plain strings from Node.js) ----------
Jstate    = sys.argv[1].strip()
Jdistrict = sys.argv[2].strip()
Jseason   = sys.argv[3].strip()
Jcrops    = sys.argv[4].strip()
Jarea     = float(sys.argv[5])

# Build input as a DataFrame row so OHE gets correct column names
user_df = pd.DataFrame([[Jstate, Jdistrict, Jseason, Jcrops]], columns=categorical_cols)
user_cat = ohe.transform(user_df)
user_num = np.array([[Jarea]])

user_input_final = np.hstack((user_cat, user_num))

# Make the prediction
prediction = model.predict(user_input_final)
print(str(round(float(prediction[0]), 2)))
