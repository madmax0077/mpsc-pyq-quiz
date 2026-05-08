"""
Build the redesigned 'Maharashtra Geography' PDF + the page-image set used by
the website's Notes tab.

Why this exists
---------------
The source PDF (`Mh- geography.pdf` by Lokseva Academy / Appa Hatnure Sir) is
laid out in the Shree-Dev7 legacy non-Unicode Marathi font. Its page text
extracts as garbage, so we cannot re-typeset the body. Instead we:

  1) render every original page to a high-quality JPG (the Marathi pixels
     are preserved exactly — readers see the same content their teacher
     printed),
  2) wrap those page-images in a brand-new, professionally designed PDF
     shell — bespoke saffron / navy cover, redesigned table of contents,
     part dividers, chapter dividers, page footer with branding & page
     numbers,
  3) emit the page-images into `public/notes/mh-geography/pages/` so the
     Next.js Notes tab can lazy-load them inside a copy-protected viewer.

Run from repo root:
    python scripts/build_mh_geography_redesign.py
"""

from __future__ import annotations

import json
import os
import shutil
from dataclasses import dataclass
from pathlib import Path
from typing import List

import fitz  # PyMuPDF


# --------------------------------------------------------------------------- #
# Paths & constants
# --------------------------------------------------------------------------- #
REPO_ROOT = Path(__file__).resolve().parent.parent
SOURCE_PDF = Path(os.path.expanduser("~/Downloads/Mh- geography.pdf"))
OUT_DIR = REPO_ROOT / "public" / "notes" / "mh-geography"
PAGES_DIR = OUT_DIR / "pages"
REDESIGNED_PDF = OUT_DIR / "maharashtra-geography-redesigned.pdf"
MANIFEST_JSON = OUT_DIR / "manifest.json"

RENDER_DPI = 150  # 150 DPI = good print + reasonable web size
JPG_QUALITY = 78  # 78 = visually transparent for text-on-white scans


# --------------------------------------------------------------------------- #
# Brand palette (saffron + deep navy + cream)
# --------------------------------------------------------------------------- #
COL_SAFFRON = (0.961, 0.514, 0.114)      # #F58320
COL_SAFFRON_DARK = (0.804, 0.349, 0.063) # #CD5910
COL_NAVY = (0.071, 0.114, 0.227)         # #12193A
COL_NAVY_SOFT = (0.149, 0.196, 0.337)    # #263256
COL_CREAM = (0.988, 0.973, 0.945)        # #FCF8F1
COL_INK = (0.118, 0.137, 0.180)          # #1E232E
COL_INK_SOFT = (0.388, 0.443, 0.522)     # #637185
COL_LINE = (0.886, 0.890, 0.910)         # #E2E3E8
COL_WHITE = (1, 1, 1)
COL_GREEN = (0.094, 0.541, 0.302)        # #18834D
COL_GREEN_BG = (0.882, 0.953, 0.910)     # #E1F3E8


# --------------------------------------------------------------------------- #
# Chapter map (derived from the original printed TOC on page 1).
# Print-page numbers map 1:1 to PDF page indexes (printed page N == PDF page N,
# zero-based index N-1).
# --------------------------------------------------------------------------- #
@dataclass
class Chapter:
    number: str       # "01", "02", ... "14", "15", "16"
    title_mr: str     # Marathi heading
    title_en: str     # English heading
    page_start: int   # source-PDF print page (1-based)
    page_end: int     # inclusive
    part: int         # 1 = Maharashtra geography, 2 = Other important topics


CHAPTERS: List[Chapter] = [
    Chapter("01", "महाराष्ट्राची स्थापना",                "Formation of Maharashtra",            2,  2,  1),
    Chapter("02", "महाराष्ट्र : स्थान, विस्तार व आकार",      "Location, Extent & Shape",            3,  4,  1),
    Chapter("03", "महाराष्ट्राचा राजकीय भूगोल",            "Political Geography",                 5,  9,  1),
    Chapter("04", "रचनात्मक प्राकृतिक भूगोल",            "Structural Physical Geography",       10, 14, 1),
    Chapter("05", "भारताची व महाराष्ट्राची जनगणना",         "Census of India & Maharashtra",       15, 23, 1),
    Chapter("06", "स्थलांतर",                            "Migration",                           24, 24, 1),
    Chapter("07", "नदीप्रणाली",                          "River Systems",                       25, 36, 1),
    Chapter("08", "खनिज संपत्ती",                         "Mineral Wealth",                      37, 40, 1),
    Chapter("09", "हवामान",                              "Climate",                             41, 47, 1),
    Chapter("10", "वनसंपत्ती",                           "Forests",                             48, 57, 1),
    Chapter("11", "महाराष्ट्रातील ऊर्जा साधनसंपत्ती",        "Energy Resources",                    58, 63, 1),
    Chapter("12", "वाहतूक व दळणवळण",                  "Transport & Communication",           64, 70, 1),
    Chapter("13", "पर्यटन",                              "Tourism",                             71, 73, 1),
    Chapter("14", "खगोलशास्त्र",                          "Astronomy",                           74, 78, 2),
    Chapter("15", "वातावरण",                             "Atmosphere",                          79, 81, 2),
    Chapter("16", "अवकाश प्रक्षेपण",                     "Space Launches",                       82, 83, 2),
]

PART_TITLES = {
    1: ("Part 1", "Maharashtra Geography", "महाराष्ट्र भूगोल"),
    2: ("Part 2", "Other Important Topics", "इतर महत्त्वाचे घटक"),
}


# --------------------------------------------------------------------------- #
# Step 1 — render original pages to JPG
# --------------------------------------------------------------------------- #
def render_pages() -> int:
    print(f"Rendering {SOURCE_PDF.name} -> {PAGES_DIR}")
    PAGES_DIR.mkdir(parents=True, exist_ok=True)

    src = fitz.open(SOURCE_PDF)
    n_pages = len(src)
    zoom = RENDER_DPI / 72.0
    matrix = fitz.Matrix(zoom, zoom)

    for i, page in enumerate(src, start=1):
        out = PAGES_DIR / f"page-{i:03d}.jpg"
        if out.exists() and out.stat().st_size > 10_000:
            continue
        pix = page.get_pixmap(matrix=matrix, alpha=False)
        pix.pil_save(out, format="JPEG", quality=JPG_QUALITY, optimize=True)
        if i % 10 == 0 or i == n_pages:
            print(f"  rendered {i:3d}/{n_pages}")

    src.close()
    print(f"  done. {n_pages} pages.")
    return n_pages


# --------------------------------------------------------------------------- #
# Step 2 — Marathi-capable font
# --------------------------------------------------------------------------- #
def find_devanagari_font() -> Path | None:
    """Locate a TrueType font on the system that can render Devanagari."""
    candidates = [
        # Windows defaults
        Path("C:/Windows/Fonts/Nirmala.ttf"),
        Path("C:/Windows/Fonts/NirmalaB.ttf"),
        Path("C:/Windows/Fonts/Mangal.ttf"),
        Path("C:/Windows/Fonts/Aparaji.ttf"),
        # Common Noto installs
        Path("C:/Windows/Fonts/NotoSansDevanagari-Regular.ttf"),
        Path("C:/Windows/Fonts/NotoSerifDevanagari-Regular.ttf"),
    ]
    for c in candidates:
        if c.exists():
            return c
    return None


# --------------------------------------------------------------------------- #
# Step 3 — drawing helpers (operate on a fitz.Page)
# --------------------------------------------------------------------------- #
def draw_filled_rect(page: fitz.Page, rect: fitz.Rect, color):
    page.draw_rect(rect, color=color, fill=color, width=0)


def insert_text_safe(page, point, text, *, fontname, fontfile, fontsize, color):
    """Insert text using a custom TTF font (needed for Devanagari)."""
    page.insert_text(
        point,
        text,
        fontname=fontname,
        fontfile=fontfile,
        fontsize=fontsize,
        color=color,
    )


# --------------------------------------------------------------------------- #
# Step 4 — build the redesigned PDF
# --------------------------------------------------------------------------- #
PAGE_W, PAGE_H = fitz.paper_size("a4")  # 595 x 842 pt


def make_cover(doc: fitz.Document, font_dev: Path | None):
    page = doc.new_page(width=PAGE_W, height=PAGE_H)
    # Solid navy base
    draw_filled_rect(page, fitz.Rect(0, 0, PAGE_W, PAGE_H), COL_NAVY)
    # Saffron diagonal accent band (top-right)
    page.draw_polyline(
        [(PAGE_W, 0), (PAGE_W, 220), (PAGE_W - 320, 0)],
        color=COL_SAFFRON, fill=COL_SAFFRON, width=0,
    )
    # Cream lower block
    draw_filled_rect(page, fitz.Rect(0, PAGE_H - 110, PAGE_W, PAGE_H), COL_CREAM)
    # Saffron rule
    draw_filled_rect(page, fitz.Rect(0, PAGE_H - 114, PAGE_W, PAGE_H - 110), COL_SAFFRON)

    # Eyebrow
    page.insert_text(
        (60, 110), "DON'T KNOW ACADEMY  ·  STUDY NOTES",
        fontname="helv", fontsize=10, color=COL_SAFFRON,
    )

    # English title
    page.insert_text(
        (60, 200), "Maharashtra",
        fontname="hebo", fontsize=64, color=COL_WHITE,
    )
    page.insert_text(
        (60, 260), "Geography",
        fontname="hebo", fontsize=64, color=COL_SAFFRON,
    )

    # Marathi subtitle
    if font_dev:
        insert_text_safe(
            page, (60, 320),
            "महाराष्ट्र भूगोल — संपूर्ण नोट्स",
            fontname="DevReg", fontfile=str(font_dev),
            fontsize=22, color=COL_WHITE,
        )

    # Tagline
    page.insert_text(
        (60, 360), "Complete notes for MPSC · Rajyaseva · UPSC · RTO AMVI",
        fontname="helv", fontsize=12, color=(0.85, 0.86, 0.92),
    )

    # Stats row
    stats_y = 440
    stat_pairs = [("16", "Chapters"), ("83", "Pages"), ("2", "Parts"), ("100%", "Syllabus")]
    x = 60
    for value, label in stat_pairs:
        page.insert_text((x, stats_y), value, fontname="hebo", fontsize=28, color=COL_SAFFRON)
        page.insert_text((x, stats_y + 18), label, fontname="helv", fontsize=9, color=(0.78, 0.80, 0.86))
        x += 110

    # Author / source band
    band_y = PAGE_H - 220
    page.insert_text(
        (60, band_y), "ORIGINAL NOTES",
        fontname="hebo", fontsize=9, color=COL_SAFFRON,
    )
    page.insert_text(
        (60, band_y + 18), "Lokseva Academy  ·  Appa Hatnure Sir",
        fontname="hebo", fontsize=14, color=COL_WHITE,
    )
    page.insert_text(
        (60, band_y + 35), "+91 9011194443  /  9011194446",
        fontname="helv", fontsize=10, color=(0.78, 0.80, 0.86),
    )

    page.insert_text(
        (60, band_y + 70), "REDESIGNED & PUBLISHED BY",
        fontname="hebo", fontsize=9, color=COL_SAFFRON,
    )
    page.insert_text(
        (60, band_y + 88), "Don't know Academy  ·  mpscs.in",
        fontname="hebo", fontsize=14, color=COL_WHITE,
    )

    # Footer in cream band
    page.insert_text(
        (60, PAGE_H - 80),
        "EDITION 2026",
        fontname="hebo", fontsize=10, color=COL_NAVY,
    )
    page.insert_text(
        (60, PAGE_H - 65),
        "A premium revision package for last-week prelims preparation.",
        fontname="heit", fontsize=9, color=COL_INK_SOFT,
    )
    page.insert_text(
        (PAGE_W - 60 - 70, PAGE_H - 65),
        "mpscs.in",
        fontname="hebo", fontsize=11, color=COL_SAFFRON_DARK,
    )


def make_toc(doc: fitz.Document, font_dev: Path | None, page_index_lookup: dict[str, int]):
    page = doc.new_page(width=PAGE_W, height=PAGE_H)

    # Header strip
    draw_filled_rect(page, fitz.Rect(0, 0, PAGE_W, 90), COL_NAVY)
    draw_filled_rect(page, fitz.Rect(0, 90, PAGE_W, 94), COL_SAFFRON)
    page.insert_text((60, 40), "TABLE OF CONTENTS", fontname="hebo", fontsize=11, color=COL_SAFFRON)
    page.insert_text((60, 70), "Maharashtra Geography", fontname="hebo", fontsize=22, color=COL_WHITE)

    # Two columns
    left_x = 60
    right_x = PAGE_W / 2 + 10
    col_w = PAGE_W / 2 - 70
    y = 130

    def draw_part_heading(yy: float, x: float, part: int) -> float:
        part_label, en, mr = PART_TITLES[part]
        page.insert_text((x, yy), part_label.upper(), fontname="hebo", fontsize=9, color=COL_SAFFRON)
        page.insert_text((x, yy + 16), en, fontname="hebo", fontsize=14, color=COL_NAVY)
        if font_dev:
            insert_text_safe(page, (x, yy + 32), mr, fontname="DevReg",
                              fontfile=str(font_dev), fontsize=11, color=COL_INK_SOFT)
        page.draw_line((x, yy + 42), (x + col_w, yy + 42), color=COL_LINE, width=0.5)
        return yy + 56

    def draw_chapter(yy: float, x: float, ch: Chapter) -> float:
        # Number circle
        page.draw_circle((x + 9, yy + 8), 9, color=COL_SAFFRON, fill=COL_SAFFRON, width=0)
        page.insert_text((x + 4 if len(ch.number) > 1 else x + 6, yy + 11),
                         ch.number, fontname="hebo", fontsize=8, color=COL_WHITE)
        # English title
        page.insert_text((x + 28, yy + 8), ch.title_en, fontname="hebo", fontsize=10.5, color=COL_NAVY)
        # Marathi subtitle
        if font_dev:
            insert_text_safe(page, (x + 28, yy + 22), ch.title_mr,
                              fontname="DevReg", fontfile=str(font_dev),
                              fontsize=9, color=COL_INK_SOFT)
        # Page jump (final-PDF page #)
        target_page = page_index_lookup[ch.number] + 1  # 1-based for display
        page_label = f"p. {target_page}"
        tw = fitz.get_text_length(page_label, fontname="hebo", fontsize=9)
        page.insert_text((x + col_w - tw, yy + 14), page_label,
                         fontname="hebo", fontsize=9, color=COL_SAFFRON_DARK)
        return yy + 36

    # Part 1 in left column
    y = draw_part_heading(y, left_x, 1)
    for ch in CHAPTERS:
        if ch.part != 1:
            continue
        y = draw_chapter(y, left_x, ch)

    # Part 2 in right column
    y2 = 130
    y2 = draw_part_heading(y2, right_x, 2)
    for ch in CHAPTERS:
        if ch.part != 2:
            continue
        y2 = draw_chapter(y2, right_x, ch)

    # Footer
    foot_y = PAGE_H - 60
    page.draw_line((60, foot_y - 14), (PAGE_W - 60, foot_y - 14), color=COL_LINE, width=0.5)
    page.insert_text((60, foot_y), "Don't know Academy  ·  mpscs.in",
                     fontname="hebo", fontsize=9, color=COL_NAVY)
    tw = fitz.get_text_length("Read-only revision notes", fontname="heit", fontsize=9)
    page.insert_text((PAGE_W - 60 - tw, foot_y),
                     "Read-only revision notes", fontname="heit", fontsize=9,
                     color=COL_INK_SOFT)


def make_part_divider(doc: fitz.Document, part: int, font_dev: Path | None):
    page = doc.new_page(width=PAGE_W, height=PAGE_H)
    # Cream background
    draw_filled_rect(page, fitz.Rect(0, 0, PAGE_W, PAGE_H), COL_CREAM)
    # Big saffron accent
    draw_filled_rect(page, fitz.Rect(0, PAGE_H / 2 - 4, PAGE_W, PAGE_H / 2 + 4), COL_SAFFRON)
    draw_filled_rect(page, fitz.Rect(0, PAGE_H / 2 + 4, PAGE_W, PAGE_H / 2 + 8), COL_NAVY)

    part_label, en, mr = PART_TITLES[part]

    page.insert_text((60, PAGE_H / 2 - 70), part_label.upper(),
                     fontname="hebo", fontsize=12, color=COL_SAFFRON_DARK)
    page.insert_text((60, PAGE_H / 2 - 30), en,
                     fontname="hebo", fontsize=44, color=COL_NAVY)
    if font_dev:
        insert_text_safe(page, (60, PAGE_H / 2 + 50), mr,
                          fontname="DevReg", fontfile=str(font_dev),
                          fontsize=22, color=COL_INK)

    # Mini chapter list
    mini_y = PAGE_H / 2 + 90
    page.insert_text((60, mini_y), "CHAPTERS IN THIS PART", fontname="hebo", fontsize=9, color=COL_SAFFRON_DARK)
    mini_y += 22
    for ch in CHAPTERS:
        if ch.part != part:
            continue
        page.insert_text((60, mini_y), f"{ch.number}.", fontname="hebo", fontsize=11, color=COL_SAFFRON)
        page.insert_text((92, mini_y), ch.title_en, fontname="hebo", fontsize=11, color=COL_NAVY)
        if font_dev:
            insert_text_safe(page, (PAGE_W / 2 + 30, mini_y), ch.title_mr,
                              fontname="DevReg", fontfile=str(font_dev),
                              fontsize=10, color=COL_INK_SOFT)
        mini_y += 18

    # Footer
    page.insert_text((60, PAGE_H - 50), "Don't know Academy  ·  mpscs.in",
                     fontname="hebo", fontsize=9, color=COL_NAVY)


def make_chapter_divider(doc: fitz.Document, ch: Chapter, font_dev: Path | None):
    page = doc.new_page(width=PAGE_W, height=PAGE_H)
    draw_filled_rect(page, fitz.Rect(0, 0, PAGE_W, PAGE_H), COL_WHITE)

    # Left navy stripe with chapter number
    draw_filled_rect(page, fitz.Rect(0, 0, 110, PAGE_H), COL_NAVY)
    draw_filled_rect(page, fitz.Rect(110, 0, 116, PAGE_H), COL_SAFFRON)
    page.insert_text((20, 100), "CH", fontname="hebo", fontsize=10, color=COL_SAFFRON)
    page.insert_text((20, 175), ch.number, fontname="hebo", fontsize=72, color=COL_WHITE)

    # Saffron eyebrow
    part_label, _, _ = PART_TITLES[ch.part]
    page.insert_text((150, 100),
                     f"{part_label.upper()}   ·   CHAPTER {ch.number} OF 16",
                     fontname="hebo", fontsize=10, color=COL_SAFFRON_DARK)

    # English title
    page.insert_text((150, 145), ch.title_en,
                     fontname="hebo", fontsize=30, color=COL_NAVY)

    # Marathi title
    if font_dev:
        insert_text_safe(page, (150, 195), ch.title_mr,
                          fontname="DevReg", fontfile=str(font_dev),
                          fontsize=24, color=COL_INK)

    # Decorative line
    page.draw_line((150, 230), (PAGE_W - 60, 230), color=COL_LINE, width=0.7)

    # Stats — stacked tight with adequate horizontal breathing room
    n_pages = ch.page_end - ch.page_start + 1
    stat_y = 270
    # Column 1
    page.insert_text((150, stat_y), str(n_pages),
                     fontname="hebo", fontsize=28, color=COL_SAFFRON)
    page.insert_text((150, stat_y + 18), "PAGES",
                     fontname="hebo", fontsize=8, color=COL_INK_SOFT)
    # Vertical divider
    page.draw_line((250, stat_y - 4), (250, stat_y + 22),
                   color=COL_LINE, width=0.5)
    # Column 2
    page.insert_text((270, stat_y), f"{ch.page_start}-{ch.page_end}",
                     fontname="hebo", fontsize=28, color=COL_SAFFRON)
    page.insert_text((270, stat_y + 18), "SOURCE PAGES",
                     fontname="hebo", fontsize=8, color=COL_INK_SOFT)
    # Vertical divider
    page.draw_line((400, stat_y - 4), (400, stat_y + 22),
                   color=COL_LINE, width=0.5)
    # Column 3 — chapter index
    page.insert_text((420, stat_y), f"{ch.number}/16",
                     fontname="hebo", fontsize=28, color=COL_SAFFRON)
    page.insert_text((420, stat_y + 18), "CHAPTER",
                     fontname="hebo", fontsize=8, color=COL_INK_SOFT)

    # Big quote / hint band
    band_y = PAGE_H - 220
    draw_filled_rect(page, fitz.Rect(150, band_y, PAGE_W - 60, band_y + 110), COL_CREAM)
    page.insert_text((170, band_y + 30), "STUDY TIP",
                     fontname="hebo", fontsize=9, color=COL_SAFFRON_DARK)
    page.insert_text((170, band_y + 55), tip_for(ch),
                     fontname="hebo", fontsize=12, color=COL_NAVY)
    page.insert_text((170, band_y + 78),
                     tip_subtext_for(ch),
                     fontname="heit", fontsize=10, color=COL_INK_SOFT)

    # Footer
    page.insert_text((150, PAGE_H - 50), "Don't know Academy  ·  mpscs.in",
                     fontname="hebo", fontsize=9, color=COL_NAVY)


def tip_for(ch: Chapter) -> str:
    tips = {
        "01": "Pin down 1 May 1960 and the Bombay Reorganisation Act.",
        "02": "Memorise the lat/long extents for both India and Maharashtra.",
        "03": "Map the 6 revenue divisions to their 36 districts.",
        "04": "Learn the 4 physiographic divisions and their highest peaks.",
        "05": "Memorise the 2011 census top-10 lists for Maharashtra.",
        "06": "Push & pull factors with classic Indian examples.",
        "07": "Master Krishna, Godavari, Tapi, and the Konkan rivers.",
        "08": "Mineral districts: Nagpur (Mn), Chandrapur (Coal).",
        "09": "Climatic divisions: Konkan, Western Maharashtra, Marathwada, Vidarbha.",
        "10": "Reserved forests, biosphere reserves & 6 tiger reserves.",
        "11": "Hydro / Thermal / Nuclear plant locations + capacities.",
        "12": "National highways through Maharashtra & major ports.",
        "13": "World Heritage sites: Ajanta, Ellora, Elephanta, CSMT.",
        "14": "Solar system order, planet records, Indian space milestones.",
        "15": "Atmospheric layers in order of altitude.",
        "16": "ISRO chronology: SLV, ASLV, PSLV, GSLV, GSLV-Mk III, SSLV.",
    }
    return tips.get(ch.number, "Read once, recite the headings, then revise.")


def tip_subtext_for(ch: Chapter) -> str:
    subs = {
        "01": "Statehood, Bombay Reorganisation Act and the Nagpur Pact are evergreen prelims questions.",
        "02": "Coordinates yield 1-2 direct prelims questions almost every year.",
        "03": "Districts to divisions matching is a classic objective trap.",
        "04": "Sahyadri, Satpura, Deccan plateau and Konkan coast in order.",
        "05": "Density, sex ratio, literacy, urbanisation: top-10 districts.",
        "06": "Internal vs international, urban-pull, rural-push, distress migration.",
        "07": "Tributaries, dams and the river-direction trick decide most river questions.",
        "08": "Match minerals to districts; remember single-largest producer claims.",
        "09": "Rainfall belts and average annual rainfall by region.",
        "10": "Forest types, percentage cover, tribal forest rights.",
        "11": "Koyna, Tarapur, Chandrapur: never confuse coal / hydro / nuclear.",
        "12": "NH-48, JNPT, Mumbai Port Trust, Konkan Railway corridor.",
        "13": "Hill stations, beaches, UNESCO sites and the new state-government circuits.",
        "14": "Distance from Sun, planetary moons, Indian astronomy contributions.",
        "15": "Troposphere → Exosphere; ozone layer, ionosphere uses.",
        "16": "Launch vehicles, payload classes, recent missions (Chandrayaan, Aditya-L1).",
    }
    return subs.get(ch.number, "Refer to the original pages on the next spread for full coverage.")


def insert_original_page_image(
    doc: fitz.Document,
    image_path: Path,
    *,
    page_num_in_book: int,
    total_pages_in_book: int,
    chapter: Chapter,
    src_page_num: int,
):
    page = doc.new_page(width=PAGE_W, height=PAGE_H)

    # Top header strip
    draw_filled_rect(page, fitz.Rect(0, 0, PAGE_W, 28), COL_NAVY)
    draw_filled_rect(page, fitz.Rect(0, 28, PAGE_W, 30), COL_SAFFRON)

    page.insert_text((20, 18),
                     f"CH {chapter.number}  ·  {chapter.title_en.upper()}",
                     fontname="hebo", fontsize=8, color=COL_SAFFRON)
    label_right = "Don't know Academy  ·  mpscs.in"
    tw = fitz.get_text_length(label_right, fontname="hebo", fontsize=8)
    page.insert_text((PAGE_W - 20 - tw, 18), label_right,
                     fontname="hebo", fontsize=8, color=(0.85, 0.86, 0.92))

    # Image — fit inside content area
    margin_x = 36
    top = 50
    bottom_pad = 40
    box = fitz.Rect(margin_x, top, PAGE_W - margin_x, PAGE_H - bottom_pad)
    page.insert_image(box, filename=str(image_path), keep_proportion=True)

    # Footer strip
    draw_filled_rect(page, fitz.Rect(0, PAGE_H - 22, PAGE_W, PAGE_H), COL_CREAM)
    page.draw_line((20, PAGE_H - 22), (PAGE_W - 20, PAGE_H - 22), color=COL_LINE, width=0.5)
    page.insert_text((20, PAGE_H - 8),
                     f"Original page {src_page_num} of 83",
                     fontname="heit", fontsize=8, color=COL_INK_SOFT)
    centre_text = f"Chapter {chapter.number}"
    cw = fitz.get_text_length(centre_text, fontname="hebo", fontsize=8)
    page.insert_text(((PAGE_W - cw) / 2, PAGE_H - 8), centre_text,
                     fontname="hebo", fontsize=8, color=COL_NAVY)
    pg_label = f"{page_num_in_book} / {total_pages_in_book}"
    pw = fitz.get_text_length(pg_label, fontname="hebo", fontsize=8)
    page.insert_text((PAGE_W - 20 - pw, PAGE_H - 8), pg_label,
                     fontname="hebo", fontsize=8, color=COL_NAVY)


def make_back_cover(doc: fitz.Document, font_dev: Path | None):
    page = doc.new_page(width=PAGE_W, height=PAGE_H)
    draw_filled_rect(page, fitz.Rect(0, 0, PAGE_W, PAGE_H), COL_NAVY)
    draw_filled_rect(page, fitz.Rect(0, PAGE_H - 6, PAGE_W, PAGE_H), COL_SAFFRON)

    page.insert_text((60, 130), "End of Notes",
                     fontname="hebo", fontsize=42, color=COL_WHITE)
    if font_dev:
        insert_text_safe(page, (60, 175), "महाराष्ट्र भूगोल — संपूर्ण",
                          fontname="DevReg", fontfile=str(font_dev),
                          fontsize=20, color=COL_SAFFRON)

    block = [
        ("All-in-one MPSC Geography revision pack",
         "Original notes by Lokseva Academy / Appa Hatnure Sir, redesigned & " \
         "presented by Don't know Academy."),
        ("Practice on mpscs.in",
         "MCQ quizzes, daily leaderboard, interactive Maharashtra map and " \
         "topic-wise practice, all free."),
        ("Read more notes",
         "Open the Notes tab on mpscs.in for newspapers, history, polity " \
         "and weekly current affairs notes."),
    ]
    y = 240
    for title, body in block:
        page.insert_text((60, y), title, fontname="hebo", fontsize=14, color=COL_SAFFRON)
        page.insert_text((60, y + 18), body, fontname="helv", fontsize=10, color=(0.85, 0.86, 0.92))
        y += 56

    page.insert_text((60, PAGE_H - 80), "© 2026 Don't know Academy",
                     fontname="hebo", fontsize=9, color=(0.85, 0.86, 0.92))
    page.insert_text((60, PAGE_H - 60),
                     "Free for personal study use. Redistribution prohibited.",
                     fontname="heit", fontsize=9, color=(0.78, 0.80, 0.86))
    page.insert_text((PAGE_W - 60 - 80, PAGE_H - 60),
                     "mpscs.in",
                     fontname="hebo", fontsize=14, color=COL_SAFFRON)


# --------------------------------------------------------------------------- #
# Step 5 — orchestrator
# --------------------------------------------------------------------------- #
def build_redesigned_pdf():
    print(f"Building redesigned PDF -> {REDESIGNED_PDF.name}")
    font_dev = find_devanagari_font()
    if font_dev is None:
        print("  WARNING: No Devanagari TTF found; Marathi headings on cover/divider"
              " pages will be skipped. The original page images still render.")
    else:
        print(f"  Using Devanagari font: {font_dev}")

    # First pass — compute page-index-of each chapter divider in the FINAL PDF
    # so the TOC can show accurate page numbers.
    page_index_lookup: dict[str, int] = {}
    cursor = 0
    cursor += 1  # cover
    cursor += 1  # toc
    last_part = None
    for ch in CHAPTERS:
        if ch.part != last_part:
            cursor += 1  # part divider
            last_part = ch.part
        page_index_lookup[ch.number] = cursor  # 0-based index of chapter divider
        cursor += 1  # chapter divider
        cursor += (ch.page_end - ch.page_start + 1)  # original page images

    total_pages = cursor + 1  # back cover

    # Second pass — actually emit pages
    doc = fitz.open()
    make_cover(doc, font_dev)
    make_toc(doc, font_dev, page_index_lookup)

    last_part = None
    book_page = 2  # we've added cover + toc
    for ch in CHAPTERS:
        if ch.part != last_part:
            make_part_divider(doc, ch.part, font_dev)
            book_page += 1
            last_part = ch.part

        make_chapter_divider(doc, ch, font_dev)
        book_page += 1

        for src_p in range(ch.page_start, ch.page_end + 1):
            img = PAGES_DIR / f"page-{src_p:03d}.jpg"
            insert_original_page_image(
                doc, img,
                page_num_in_book=book_page,
                total_pages_in_book=total_pages,
                chapter=ch,
                src_page_num=src_p,
            )
            book_page += 1

    make_back_cover(doc, font_dev)

    # Document outlines (PDF bookmarks)
    toc_entries: list[list] = []
    cur = 1
    cur += 1  # cover
    toc_entries.append([1, "Table of Contents", 2])
    cur = 3  # next page after TOC (1-based)
    last_part = None
    for ch in CHAPTERS:
        if ch.part != last_part:
            label = f"{PART_TITLES[ch.part][0]} \u00b7 {PART_TITLES[ch.part][1]}"
            toc_entries.append([1, label, cur])
            cur += 1
            last_part = ch.part
        toc_entries.append([2, f"Ch {ch.number}: {ch.title_en}", cur])
        cur += 1
        cur += (ch.page_end - ch.page_start + 1)
    toc_entries.append([1, "End of Notes", cur])
    doc.set_toc(toc_entries)

    doc.set_metadata({
        "title": "Maharashtra Geography - Complete Notes (Redesigned 2026 Edition)",
        "author": "Lokseva Academy / Appa Hatnure Sir",
        "subject": "MPSC Maharashtra Geography Revision Notes",
        "keywords": "MPSC, Maharashtra Geography, Rajyaseva, UPSC, RTO AMVI, Notes, Don't know Academy, mpscs.in",
        "creator": "Don't know Academy - mpscs.in",
        "producer": "PyMuPDF redesign pipeline",
    })

    doc.save(str(REDESIGNED_PDF), deflate=True, garbage=4, clean=True)
    doc.close()
    print(f"  saved: {REDESIGNED_PDF}  ({REDESIGNED_PDF.stat().st_size/1_048_576:.1f} MB)")


def write_manifest(n_pages: int):
    """Write a small JSON file the web client uses to know which page-image
    belongs to which chapter."""
    manifest = {
        "title_en": "Maharashtra Geography",
        "title_mr": "महाराष्ट्र भूगोल",
        "edition": "2026",
        "totalPages": n_pages,
        "renderDpi": RENDER_DPI,
        "originalAuthor": "Lokseva Academy · Appa Hatnure Sir",
        "redesignedBy": "Don't know Academy · mpscs.in",
        "downloadPdf": "/notes/mh-geography/maharashtra-geography-redesigned.pdf",
        "imagePathTemplate": "/notes/mh-geography/pages/page-{:03d}.jpg",
        "parts": [
            {
                "id": k,
                "label": v[0],
                "title_en": v[1],
                "title_mr": v[2],
            } for k, v in PART_TITLES.items()
        ],
        "chapters": [
            {
                "number": c.number,
                "title_en": c.title_en,
                "title_mr": c.title_mr,
                "pageStart": c.page_start,
                "pageEnd": c.page_end,
                "pageCount": c.page_end - c.page_start + 1,
                "part": c.part,
                "tip": tip_for(c),
            } for c in CHAPTERS
        ],
    }
    MANIFEST_JSON.write_text(json.dumps(manifest, ensure_ascii=False, indent=2),
                             encoding="utf-8")
    print(f"  manifest written -> {MANIFEST_JSON}")


def main():
    if not SOURCE_PDF.exists():
        raise SystemExit(f"Source PDF not found: {SOURCE_PDF}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    n_pages = render_pages()
    build_redesigned_pdf()
    write_manifest(n_pages)
    print("Done.")


if __name__ == "__main__":
    main()
