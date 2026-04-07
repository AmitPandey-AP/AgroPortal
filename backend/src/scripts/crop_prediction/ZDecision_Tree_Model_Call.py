import pandas as pd
import numpy as np
import joblib
import sys
import os
from collections import Counter

# ---- Path resolution (no more hardcoded 'ML/...' paths) ----
script_dir = os.path.dirname(os.path.abspath(__file__))

# ---- Decision Tree helper classes (mirrors what was used to build the .pkl) ----
header = ['State_Name', 'District_Name', 'Season', 'Crop']

class Question:
    def __init__(self, column, value):
        self.column = column
        self.value = value
    def match(self, example):
        return example[self.column] == self.value
    def match2(self, example):
        return example in ('True', 'true', '1')
    def __repr__(self):
        return "Is %s == %s?" % (header[self.column], str(self.value))

def class_counts(Data):
    counts = {}
    for row in Data:
        label = row[-1]
        counts[label] = counts.get(label, 0) + 1
    return counts

class Leaf:
    def __init__(self, Data):
        self.predictions = class_counts(Data)

class Decision_Node:
    def __init__(self, question, true_branch, false_branch):
        self.question = question
        self.true_branch = true_branch
        self.false_branch = false_branch

def print_leaf(counts):
    total = sum(counts.values()) * 1.0
    return {lbl: str(int(counts[lbl] / total * 100)) + "%" for lbl in counts}

def classify(row, node):
    if isinstance(node, Leaf):
        return node.predictions
    if node.question.match(row):
        return classify(row, node.true_branch)
    else:
        return classify(row, node.false_branch)

# ---- Load the pre-trained model from the script's own directory ----
model_path = os.path.join(script_dir, 'filetest2.pkl')
dt_model_final = joblib.load(model_path)

# ---- Read args — Node.js passes them as plain strings ----
# Strip any accidental surrounding quotes (e.g. if JSON.stringify was used)
def clean_arg(val):
    return val.strip().strip('"\'')

state    = clean_arg(sys.argv[1])
district = clean_arg(sys.argv[2])
season   = clean_arg(sys.argv[3])

testing_data = [[state, district, season]]

# ---- Run prediction and print results ----
results = []
for row in testing_data:
    predict_dict = print_leaf(classify(row, dt_model_final))
    for crop in predict_dict:
        results.append(crop)

# Print one crop per line (the controller reads stdout)
for crop in results:
    print(crop)
    print("  ,  ")
