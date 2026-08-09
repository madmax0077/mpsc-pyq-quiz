# -*- coding: utf-8 -*-
"""Build lib/notesData/samajsudharakContent.json (Marathi-only chapters).

Chapter text lives in scripts/samajsudharak_chapters_mr.json so rebuilds
do not reintroduce English / romanized drafts.
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = Path(__file__).resolve().parent / "samajsudharak_chapters_mr.json"
OUT = ROOT / "lib" / "notesData" / "samajsudharakContent.json"
MANIFEST = ROOT / "public" / "notes" / "samajsudharak" / "manifest.json"

ACCENTS = {
    "ambedkar": "from-indigo-600 to-blue-700",
    "vr-shinde": "from-teal-600 to-emerald-700",
    "karve": "from-rose-500 to-pink-700",
    "sane-guruji": "from-amber-500 to-orange-700",
    "ranade": "from-slate-600 to-stone-800",
    "sarvajanik-kaka": "from-yellow-600 to-amber-800",
    "jambhekar": "from-cyan-600 to-sky-800",
    "lokhitwadi": "from-lime-600 to-green-800",
    "dadoba": "from-violet-600 to-purple-800",
    "agarkar": "from-fuchsia-600 to-pink-800",
    "tilak": "from-orange-600 to-red-700",
    "pandita-ramabai": "from-pink-500 to-rose-700",
    "ramabai-ranade": "from-red-500 to-rose-800",
    "bhaurao-patil": "from-green-600 to-teal-800",
    "gokhale-paranjpe": "from-sky-600 to-blue-800",
    "vishnubuva": "from-stone-600 to-neutral-800",
    "shankarshet": "from-amber-700 to-yellow-900",
    "lahuji": "from-red-700 to-orange-900",
    "bhau-daji": "from-emerald-600 to-green-900",
    "bhau-mahajan": "from-neutral-600 to-stone-800",
    "phule": "from-[#FF671F] via-[#D9482F] to-[#046A38]",
}


def img_for(cid: str) -> str | None:
    if not MANIFEST.exists():
        return None
    m = json.loads(MANIFEST.read_text(encoding="utf-8"))
    hit = m.get(cid)
    return hit.get("file") if hit else None


def main() -> None:
    src = json.loads(SRC.read_text(encoding="utf-8"))
    chapters = []
    for ch in src["chapters"]:
        cid = ch["id"]
        chapters.append(
            {
                "id": cid,
                "image": img_for(cid),
                "accent": ACCENTS.get(cid, ch.get("accent", "from-slate-600 to-slate-800")),
                "titleMr": ch["titleMr"],
                "titleEn": "",
                "subtitleMr": ch["subtitleMr"],
                "tip": ch["tip"],
                "blocks": ch["blocks"],
            }
        )

    total_blocks = sum(len(c["blocks"]) for c in chapters)
    data = {
        "title_mr": "समाजसुधारक — सविस्तर नोट्स",
        "title_en": "",
        "subtitle_mr": "आंबेडकर ते फुले · २१ सुधारक · तारखा · संस्था · ग्रंथ · परीक्षा पुनरावृत्ती कार्डे",
        "totalPages": 42,
        "totalChapters": len(chapters),
        "totalBlocks": total_blocks,
        "chapters": chapters,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    missing = [c["id"] for c in chapters if not c.get("image")]
    print(f"Wrote {OUT} · chapters={len(chapters)} · blocks={total_blocks}")
    if missing:
        print("Missing images:", ", ".join(missing))


if __name__ == "__main__":
    main()
