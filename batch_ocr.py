import easyocr
import json
import os
from PIL import Image

base_dir = os.path.dirname(os.path.abspath(__file__))
rotated_dir = os.path.join(base_dir, "pdf_pages_rotated")
ocr_dir = os.path.join(base_dir, "ocr_output")
os.makedirs(ocr_dir, exist_ok=True)

reader = easyocr.Reader(['mr', 'en'], gpu=False)

for i in range(1, 61):
    fname = f"page_{i:02d}.png"
    in_path = os.path.join(rotated_dir, fname)
    out_path = os.path.join(ocr_dir, f"ocr_page_{i:02d}.json")
    
    if os.path.exists(out_path):
        print(f"Skip (already done): {fname}")
        continue
    
    if not os.path.exists(in_path):
        print(f"Skip (not found): {fname}")
        continue
    
    print(f"Processing {fname}...")
    
    img = Image.open(in_path)
    w, h = img.size
    img_resized = img.resize((w // 2, h // 2))
    temp_path = os.path.join(ocr_dir, "temp_resize.png")
    img_resized.save(temp_path)
    
    results = reader.readtext(temp_path, detail=1, paragraph=False)
    
    output = []
    for (bbox, text, conf) in results:
        output.append({
            'text': text,
            'conf': round(conf, 3),
            'x': int(bbox[0][0]),
            'y': int(bbox[0][1])
        })
    
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"  Done: {len(output)} segments saved")

if os.path.exists(os.path.join(ocr_dir, "temp_resize.png")):
    os.remove(os.path.join(ocr_dir, "temp_resize.png"))

print("\nBatch OCR complete!")
