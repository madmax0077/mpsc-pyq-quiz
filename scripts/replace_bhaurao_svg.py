# -*- coding: utf-8 -*-
import json
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "notes" / "samajsudharak"
jpg = OUT / "bhaurao-patil.jpg"
if jpg.exists():
    jpg.unlink()

svg = """<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#15803d"/>
      <stop offset="100%" stop-color="#1f2937"/>
    </linearGradient>
  </defs>
  <rect width="480" height="480" fill="url(#g)"/>
  <circle cx="240" cy="240" r="150" fill="rgba(255,255,255,0.12)"/>
  <text x="240" y="268" text-anchor="middle"
        font-family="Noto Sans Devanagari, Segoe UI, sans-serif"
        font-size="120" font-weight="700" fill="white">भा</text>
</svg>
"""
(OUT / "bhaurao-patil.svg").write_text(svg, encoding="utf-8")
manifest_path = OUT / "manifest.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
manifest["bhaurao-patil"] = {
    "file": "/notes/samajsudharak/bhaurao-patil.svg",
    "source": "generated-initials",
    "note": "Wikipedia page image was incorrect; using initials until verified portrait is available",
}
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
print("replaced bhaurao-patil with svg")
