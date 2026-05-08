"""
Extract clean Unicode Marathi text from the OCR'd Maharashtra Geography PDF
(`Geo_last_resort (1).pdf`) and group it by chapter.

The OCR'd PDF was produced by PDF24 Tools - OCR over the original
non-Unicode (Shree-Dev7) source. PyMuPDF text extraction returns:
  - the legacy non-Unicode text layer (garbage glyphs)  -- skipped
  - followed by the OCR'd Devanagari text layer         -- kept

This script:
  1) reads each of the 83 pages,
  2) keeps only the Unicode Devanagari section,
  3) strips publisher headers / footers / phone numbers / page numbers,
  4) normalises bullets (* / : / ७ / ४: -> proper Unicode bullet),
  5) repairs the most common OCR misreads,
  6) groups page text by chapter using `MH_GEO_CHAPTERS`,
  7) writes a Python + JSON dump used downstream by:
       - lib/notesData/mhGeographyContent.ts (web reader)
       - scripts/build_mh_geography_typeset.py (typeset PDF)

Run from repo root:
    python scripts/extract_mh_geography_ocr.py
"""

from __future__ import annotations

import io
import json
import os
import re
from dataclasses import dataclass
from pathlib import Path
from typing import List

import fitz  # PyMuPDF


REPO_ROOT = Path(__file__).resolve().parent.parent
SOURCE_PDF = Path(os.path.expanduser("~/Downloads/Geo_last_resort (1).pdf"))
OUT_JSON = REPO_ROOT / "lib" / "notesData" / "mhGeographyContent.json"


# --------------------------------------------------------------------------- #
# Chapter map (kept in sync with lib/notesData/mhGeography.ts)
# --------------------------------------------------------------------------- #
@dataclass
class Chapter:
    number: str
    title_en: str
    title_mr: str
    page_start: int
    page_end: int
    part: int
    tip: str


CHAPTERS: List[Chapter] = [
    Chapter("01", "Formation of Maharashtra",      "महाराष्ट्राची स्थापना",                 2,  2,  1, "Pin down 1 May 1960 and the Bombay Reorganisation Act."),
    Chapter("02", "Location, Extent & Shape",      "महाराष्ट्र : स्थान, विस्तार व आकार",    3,  4,  1, "Memorise the lat/long extents — both India & Maharashtra."),
    Chapter("03", "Political Geography",           "महाराष्ट्राचा राजकीय भूगोल",             5,  9,  1, "Map the 6 revenue divisions to their 36 districts."),
    Chapter("04", "Structural Physical Geography", "रचनात्मक प्राकृतिक भूगोल",             10, 14, 1, "Learn the 4 physiographic divisions and their highest peaks."),
    Chapter("05", "Census of India & Maharashtra", "भारताची व महाराष्ट्राची जनगणना",         15, 23, 1, "Memorise the 2011 census top-10 lists for Maharashtra."),
    Chapter("06", "Migration",                     "स्थलांतर",                             24, 24, 1, "Push & pull factors with classic Indian examples."),
    Chapter("07", "River Systems",                 "नदीप्रणाली",                           25, 36, 1, "Master Krishna, Godavari, Tapi, and the Konkan rivers."),
    Chapter("08", "Mineral Wealth",                "खनिज संपत्ती",                          37, 40, 1, "Mineral districts → Nagpur (Mn), Chandrapur (Coal)."),
    Chapter("09", "Climate",                       "हवामान",                               41, 47, 1, "Climatic divisions: Konkan, Western Maharashtra, Marathwada, Vidarbha."),
    Chapter("10", "Forests",                       "वनसंपत्ती",                            48, 57, 1, "Reserved forests, biosphere reserves & 6 tiger reserves."),
    Chapter("11", "Energy Resources",              "महाराष्ट्रातील ऊर्जा साधनसंपत्ती",         58, 63, 1, "Hydro / Thermal / Nuclear plant locations + capacities."),
    Chapter("12", "Transport & Communication",     "वाहतूक व दळणवळण",                   64, 70, 1, "National highways through Maharashtra & major ports."),
    Chapter("13", "Tourism",                       "पर्यटन",                               71, 73, 1, "World Heritage sites: Ajanta, Ellora, Elephanta, CSMT."),
    Chapter("14", "Astronomy",                     "खगोलशास्त्र",                           74, 78, 2, "Solar system order, planet records, Indian space milestones."),
    Chapter("15", "Atmosphere",                    "वातावरण",                              79, 81, 2, "Atmospheric layers in order of altitude."),
    Chapter("16", "Space Launches",                "अवकाश प्रक्षेपण",                      82, 83, 2, "ISRO chronology — SLV, ASLV, PSLV, GSLV, GSLV-Mk III, SSLV."),
]


# --------------------------------------------------------------------------- #
# Cleaning helpers
# --------------------------------------------------------------------------- #
DEVANAGARI = re.compile(r"[\u0900-\u097F]")

# Anything that contains the publisher's brand or phone numbers must be dropped.
LOKSEVA_RX = re.compile(
    r"(lokseva|appa\s*hatnure|9011\s*194\s*4(?:43|46)|9011194443|9011194446|लोकसेवा|लोकमेवा)",
    re.IGNORECASE,
)

# Lines that are purely page numbers, separators or junk.
PURE_NUMBER_RX = re.compile(r"^\s*[०-९0-9\.\(\)\[\]\|]+\s*$")
ORPHAN_PAGENUM_RX = re.compile(r"^\s*[०-९0-9]{1,3}\s*[\)\]\.,]?\s*$")
PURE_PUNCT_RX = re.compile(r"^\s*[-_=*<>|/\\\.\(\)\[\]\{\}\,\:\;\!\?\"\'`]+\s*$")
LATIN_NOISE_RX = re.compile(r"^[A-Za-z\s\.\,\-\|\(\)\[\]\!\@\#\$\%\^\&\*\:\;]+$")
LONG_GARBAGE_RX = re.compile(r"^[^\u0900-\u097F0-9]{8,}$")  # >=8 non-DEV/non-digit chars
TOC_LEADER_GARBAGE_RX = re.compile(r"[Hh]{4,}")  # OCR misread of dot leaders

# Bullets that the OCR mangled. All map to "•". These are literal substring
# replacements only safe when they appear in their distinctive form. Inline
# safe replacements only — leading-only markers are handled in `normalise_bullets`.
BULLET_REPLACEMENTS_INLINE = [
    ("\u0967\u00b3\u0967\u00b3", "•"),  # १३१३ artifact
]

# Markers we recognise *only when they sit at the start of a line* (so we
# never corrupt %, digit `४`, currency `₹` or genuine `७` (=7) inside body
# text). Order matters: most specific first.
LEADING_BULLET_MARKERS = [
    "*:_", "*:", "*-", "*",
    "४:_", "४:", "४.", "४)",
    "७.", "७)", "७",
    "©", "£", "©:", "©.", "©)",
    "4:_", "4:", "4)",
    "›", "»",
    ">", "}", "]", "|",
]


def extract_unicode_portion(raw: str) -> str:
    """Drop the legacy Shree-Dev7 garbage that fitz extracts before the OCR
    layer kicks in. We keep everything from the first line that contains any
    Devanagari character onwards."""
    lines = raw.split("\n")
    first = None
    for i, line in enumerate(lines):
        if DEVANAGARI.search(line):
            first = i
            break
    if first is None:
        return ""
    return "\n".join(lines[first:])


def normalise_bullets(line: str) -> str:
    s = line
    # Inline-only: only the distinctive Devanagari-digit artifact
    for src, dst in BULLET_REPLACEMENTS_INLINE:
        s = s.replace(src, dst)
    # Strip leading whitespace for marker detection
    stripped = s.lstrip()
    if not stripped:
        return s
    # Recognise leading bullet markers (longest first thanks to ordering)
    for marker in LEADING_BULLET_MARKERS:
        if stripped.startswith(marker):
            rest = stripped[len(marker):].lstrip(" \t:.;,)")
            return "• " + rest
    # Already a real bullet?
    if stripped[0] in "•\u2022\u25cf\u25e6":
        rest = stripped[1:].lstrip(" \t:.;,)")
        return "• " + rest
    return s


def is_garbage_line(line: str) -> bool:
    s = line.strip()
    if not s:
        return True
    if LOKSEVA_RX.search(s):
        return True
    # OCR-leader garbage like "१३१३११ ९" or "SHHSHHHH"
    if TOC_LEADER_GARBAGE_RX.search(s):
        return True
    # Pages with pure brackets / page markers
    if PURE_PUNCT_RX.match(s):
        return True
    # Lines that have NO Devanagari chars and almost no info
    if not DEVANAGARI.search(s):
        # Allow short numeric / English markers (years, percentages, table values)
        if PURE_NUMBER_RX.match(s):
            return False
        if len(s) <= 6:  # tiny side-labels likely noise
            return True
        # Long lines without devanagari at all == OCR noise
        if LONG_GARBAGE_RX.match(s):
            return True
        # Latin-only filler with no real words is noise
        if LATIN_NOISE_RX.match(s) and len(set(s)) < 5:
            return True
    return False


def clean_inline(line: str) -> str:
    s = line
    # Repeated separator runs
    s = re.sub(r"[\.]{4,}", " … ", s)
    s = re.sub(r"_{3,}", " ", s)
    s = re.sub(r"-{3,}", " — ", s)
    # Excess spaces and strange |||
    s = re.sub(r"\|+", "|", s)
    s = re.sub(r"\s+", " ", s).strip()
    # Common OCR fixes (verified against multiple sample pages)
    fixes = [
        ("महीाशष्ट्रांची", "महाराष्ट्राची"),
        ("महीाशष्ट्र", "महाराष्ट्र"),
        ("स्थायना", "स्थापना"),
        ("नागपुर", "नागपूर"),
        ("मुम्बई", "मुंबई"),
        # OCR noise scraps
        ("Hal Aled", ""),
        ("HSH", ""),
        ("SHHSHHHHHH", ""),
        # Stray vertical bars / orphan pipes
        ("•|", ""),
        (" |", " "),
    ]
    for src, dst in fixes:
        s = s.replace(src, dst)
    return s.strip()


def clean_page(raw: str) -> str:
    text = extract_unicode_portion(raw)
    if not text:
        return ""
    cleaned: List[str] = []
    for line in text.split("\n"):
        line = normalise_bullets(line)
        line = clean_inline(line)
        if not line:
            continue
        if is_garbage_line(line):
            continue
        cleaned.append(line)

    # Strip trailing orphan page-number(s) (the OCR places "६०)" or "60" at
    # the bottom). Only the LAST line(s) of a page can qualify so this won't
    # eat in-table digits.
    while cleaned and ORPHAN_PAGENUM_RX.match(cleaned[-1]):
        cleaned.pop()

    # Merge bullet-continuation lines: a line that doesn't start with • and
    # doesn't begin with a numbered marker likely continues the previous bullet.
    merged: List[str] = []
    for line in cleaned:
        if (
            merged
            and not line.startswith("•")
            and not re.match(r"^\d+\.\s", line)
            and not re.match(r"^[०-९]+[\.\)]", line)
            and not line.startswith("=")
            and len(line) > 0
            and not merged[-1].endswith((":", ".", "?", "!", ";"))
        ):
            merged[-1] = (merged[-1] + " " + line).strip()
        else:
            merged.append(line)

    return "\n".join(merged).strip()


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #
def main() -> None:
    if not SOURCE_PDF.exists():
        raise SystemExit(f"Source PDF not found: {SOURCE_PDF}")

    print(f"Reading {SOURCE_PDF}")
    doc = fitz.open(SOURCE_PDF)
    total_pages = len(doc)
    print(f"  {total_pages} pages")

    # Per-page cleaned text
    per_page = {}
    for i, page in enumerate(doc, start=1):
        per_page[i] = clean_page(page.get_text())
    doc.close()

    # Group by chapter
    chapters_out = []
    for ch in CHAPTERS:
        body_pages = []
        for p in range(ch.page_start, ch.page_end + 1):
            txt = per_page.get(p, "").strip()
            if txt:
                body_pages.append({"page": p, "text": txt})
        chapters_out.append(
            {
                "number": ch.number,
                "titleEn": ch.title_en,
                "titleMr": ch.title_mr,
                "pageStart": ch.page_start,
                "pageEnd": ch.page_end,
                "part": ch.part,
                "tip": ch.tip,
                "body": body_pages,
            }
        )

    out = {
        "totalChapters": len(CHAPTERS),
        "totalPages": total_pages,
        "publishedBy": "Don't know Academy",
        "chapters": chapters_out,
    }

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    with io.open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    print(f"Wrote {OUT_JSON}")
    # Quick stats
    for ch in chapters_out:
        chars = sum(len(b["text"]) for b in ch["body"])
        print(
            f"  Ch {ch['number']} {ch['titleEn']:<32} "
            f"pages={ch['pageStart']}-{ch['pageEnd']:<3} "
            f"sections={len(ch['body'])} chars={chars}"
        )


if __name__ == "__main__":
    main()
