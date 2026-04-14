import fitz
import os

pdf_path = r"c:\Users\patiswap\Downloads\DocScanner (1).pdf"
output_dir = "pdf_pages"

doc = fitz.open(pdf_path)
print(f"Total pages: {len(doc)}")

for i, page in enumerate(doc):
    mat = fitz.Matrix(2.5, 2.5)
    pix = page.get_pixmap(matrix=mat)
    out_path = os.path.join(output_dir, f"page_{i+1:02d}.png")
    pix.save(out_path)
    print(f"Saved: {out_path}")

doc.close()
print("Done!")
