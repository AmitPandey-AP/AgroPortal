import base64
import zlib
import urllib.request
import os

def generate_mermaid_png(mmd_file, output_png):
    with open(mmd_file, 'rb') as f:
        data = f.read()
    
    # Kroki encoding: compress with zlib, then base64 encode
    compressed = zlib.compress(data, 9)
    encoded = base64.urlsafe_b64encode(compressed).decode('ascii')
    
    url = f"https://kroki.io/mermaid/png/{encoded}"
    print(f"Downloading {output_png} from Kroki...")
    urllib.request.urlretrieve(url, output_png)
    print(f"Saved {output_png}")

diagrams = [
    ('diagrams/arch_main.mmd', 'diagrams/arch_main.png'),
    ('diagrams/ml_sequence.mmd', 'diagrams/ml_sequence.png'),
    ('diagrams/payment_sequence.mmd', 'diagrams/payment_sequence.png')
]

for mmd, png in diagrams:
    if os.path.exists(mmd):
        generate_mermaid_png(mmd, png)
