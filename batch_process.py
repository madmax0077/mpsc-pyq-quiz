import os
import json
from PIL import Image

base_dir = os.path.dirname(os.path.abspath(__file__))
input_dir = os.path.join(base_dir, "pdf_pages")
rotated_dir = os.path.join(base_dir, "pdf_pages_rotated")
os.makedirs(rotated_dir, exist_ok=True)

for i in range(1, 61):
    fname = f"page_{i:02d}.png"
    in_path = os.path.join(input_dir, fname)
    out_path = os.path.join(rotated_dir, fname)
    if os.path.exists(in_path):
        img = Image.open(in_path)
        rotated = img.rotate(90, expand=True)
        rotated.save(out_path)
        print(f"Rotated: {fname}")

print("All pages rotated!")
