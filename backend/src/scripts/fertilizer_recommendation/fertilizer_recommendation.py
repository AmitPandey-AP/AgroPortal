import pandas as pd
import numpy as np
import sys
import os
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier

# Load the dataset — path relative to this script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))
data = pd.read_csv(os.path.join(script_dir, 'fertilizer_recommendation.csv'))

# Label encoding for categorical features
le_soil = LabelEncoder()
data['Soil Type'] = le_soil.fit_transform(data['Soil Type'])
le_crop = LabelEncoder()
data['Crop Type'] = le_crop.fit_transform(data['Crop Type'])

# Splitting the data into input and output variables
X = data.iloc[:, :8]
y = data.iloc[:, -1]

# Training the Decision Tree Classifier model
dtc = DecisionTreeClassifier(random_state=0)
dtc.fit(X, y)

# ---------- Read command-line args ----------
# Args: N P K temperature humidity soilMoisture soilType crop
# Numerics come as plain number strings; soilType/crop as plain strings
n_val   = float(sys.argv[1])
p_val   = float(sys.argv[2])
k_val   = float(sys.argv[3])
t_val   = float(sys.argv[4])
h_val   = float(sys.argv[5])
sm_val  = float(sys.argv[6])
soil_val = sys.argv[7].strip().strip('"\'')   # strip any accidental quotes
crop_val = sys.argv[8].strip().strip('"\'')

# ---------- Case-insensitive encoding helper ----------
def encode_label(encoder, value, label_name):
    try:
        return encoder.transform([value])[0]
    except ValueError:
        # Try case-insensitive match
        match = next((s for s in encoder.classes_ if s.lower() == value.lower()), None)
        if match:
            return encoder.transform([match])[0]
        print(f"Error: Unknown {label_name} '{value}'. Valid: {list(encoder.classes_)}", file=sys.stderr)
        sys.exit(1)

soil_enc = encode_label(le_soil, soil_val, 'Soil Type')
crop_enc = encode_label(le_crop, crop_val, 'Crop Type')

# Build input: [Temperature, Humidity, Moisture, Soil, Crop, N, K, P]
user_input = np.array([[t_val, h_val, sm_val, soil_enc, crop_enc, n_val, k_val, p_val]])

fertilizer_name = dtc.predict(user_input)
print(str(fertilizer_name[0]))