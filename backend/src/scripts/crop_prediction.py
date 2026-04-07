import sys
import json

def main():
    # Expecting: python crop_prediction.py N P K temp humidity ph rainfall
    try:
        if len(sys.argv) < 8:
            print(json.dumps({"error": "Missing input parameters"}))
            return
            
        N = float(sys.argv[1])
        P = float(sys.argv[2])
        K = float(sys.argv[3])
        temp = float(sys.argv[4])
        humidity = float(sys.argv[5])
        ph = float(sys.argv[6])
        rainfall = float(sys.argv[7])

        # Mock ML Model logic
        # In a real app, this would load a .pkl model and predict
        prediction = "Rice" if rainfall > 150 else "Wheat"
        confidence = 85.5

        result = {
            "prediction": prediction,
            "confidence": confidence,
            "inputs_received": {
                 "N": N, "P": P, "K": K, "temp": temp, "humidity": humidity, "ph": ph, "rainfall": rainfall
            }
        }
        
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == '__main__':
    main()
