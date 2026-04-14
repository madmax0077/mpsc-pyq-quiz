import easyocr
import json
import os
from PIL import Image, ImageEnhance, ImageFilter

base_dir = os.path.dirname(os.path.abspath(__file__))
rotated_dir = os.path.join(base_dir, "pdf_pages_rotated")

img = Image.open(os.path.join(rotated_dir, "page_03.png"))

enhancer = ImageEnhance.Contrast(img)
img = enhancer.enhance(1.8)
enhancer = ImageEnhance.Sharpness(img)
img = enhancer.enhance(2.0)
img = img.convert('L')

temp_path = os.path.join(base_dir, "enhanced_test.png")
img.save(temp_path)
print(f"Enhanced image saved: {img.size}")

reader = easyocr.Reader(['hi', 'en'], gpu=False)
print("Starting OCR on enhanced image...")

results = reader.readtext(temp_path, detail=1, paragraph=True)

output = []
for (bbox, text, conf) in results:
    if conf > 0.2:
        output.append({
            'text': text,
            'conf': round(conf, 3),
            'y': int(bbox[0][1])
        })

output.sort(key=lambda x: x['y'])

with open(os.path.join(base_dir, "ocr_enhanced_test.json"), 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Done! {len(output)} segments with conf > 0.2")

for item in output[:30]:
    pass
