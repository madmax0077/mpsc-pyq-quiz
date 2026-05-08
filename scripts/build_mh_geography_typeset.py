"""
Build the *typeset* Maharashtra Geography PDF directly from the cleaned OCR
content (lib/notesData/mhGeographyContent.json).

Unlike the older `build_mh_geography_redesign.py` (which wrapped the original
non-Unicode page images in a brand shell), this builder renders the Marathi
body text as real Unicode, in Noto Serif / Sans Devanagari, with a calm
cream / navy / saffron palette tuned for long study sessions.

What it produces
----------------
  public/notes/mh-geography/maharashtra-geography-redesigned.pdf

Layout
------
  Page 1  — Cover (saffron-navy gradient hero, edition meta)
  Page 2  — How to use this notes pack
  Page 3..N — Table of contents
  Then for each of the 16 chapters:
    1 chapter divider page (large title, study tip, page-range)
    K typeset content pages (Marathi text, bullets, highlight callouts)
  Final page — Closing card

Run from repo root:
    python scripts/build_mh_geography_typeset.py
"""

from __future__ import annotations

import io
import json
import os
import sys
import time
from pathlib import Path
from typing import List

import fitz  # PyMuPDF


# --------------------------------------------------------------------------- #
# Paths & constants
# --------------------------------------------------------------------------- #
REPO_ROOT = Path(__file__).resolve().parent.parent
CONTENT_JSON = REPO_ROOT / "lib" / "notesData" / "mhGeographyContent.json"
OUT_DIR = REPO_ROOT / "public" / "notes" / "mh-geography"
TARGET_PDF = OUT_DIR / "maharashtra-geography-redesigned.pdf"
TMP_PDF = OUT_DIR / "maharashtra-geography-redesigned.tmp.pdf"

# A4-ish portrait so it prints cleanly on letter or A4
PAGE_W, PAGE_H = 595.0, 842.0  # A4 in points
MARGIN_X, MARGIN_T, MARGIN_B = 46.0, 60.0, 56.0
HEADER_H, FOOTER_H = 26.0, 24.0

# Brand palette
HEX_NAVY = "#0d1638"
HEX_NAVY_SOFT = "#16265c"
HEX_AMBER = "#f59e0b"
HEX_AMBER_DARK = "#b45309"
HEX_CREAM = "#fdf8f1"
HEX_INK = "#1f2937"
HEX_INK_SOFT = "#475569"
HEX_LINE = "#e5e7eb"
HEX_HIGHLIGHT_BG = "#fff7ed"
HEX_HIGHLIGHT_BAR = "#f59e0b"
HEX_NUMBER_BG = "#eef2ff"

# Tailwind-style RGB tuples for fitz draw_rect
COL_NAVY = (0.051, 0.086, 0.220)
COL_NAVY_SOFT = (0.086, 0.149, 0.361)
COL_AMBER = (0.961, 0.620, 0.043)
COL_AMBER_DEEP = (0.706, 0.325, 0.035)
COL_CREAM = (0.992, 0.973, 0.945)
COL_LINE = (0.898, 0.906, 0.922)
COL_INK = (0.122, 0.161, 0.216)
COL_INK_SOFT = (0.278, 0.337, 0.412)
COL_WHITE = (1, 1, 1)


# --------------------------------------------------------------------------- #
# CSS shared by all html boxes
# --------------------------------------------------------------------------- #
GLOBAL_CSS = f"""
<style>
  body {{
    font-family: "Noto Sans Devanagari", "Noto Serif Devanagari", "DejaVu Sans", sans-serif;
    color: {HEX_INK};
    line-height: 1.65;
    font-size: 10.5pt;
  }}
  p {{ margin: 0 0 5pt 0; }}
  .heading {{
    font-family: "Noto Serif Devanagari", "DejaVu Serif", serif;
    font-weight: 700;
    color: {HEX_NAVY};
    font-size: 13pt;
    margin: 8pt 0 4pt 0;
    border-left: 3pt solid {HEX_AMBER};
    padding-left: 7pt;
  }}
  .bullet {{
    margin: 0 0 4pt 12pt;
  }}
  .bullet .b {{
    color: {HEX_AMBER_DARK};
    font-weight: 700;
    margin-right: 6pt;
  }}
  .num {{
    margin: 0 0 4pt 4pt;
    font-weight: 600;
    color: {HEX_INK};
  }}
  .highlight {{
    background: {HEX_HIGHLIGHT_BG};
    border-left: 3pt solid {HEX_HIGHLIGHT_BAR};
    padding: 5pt 9pt;
    margin: 5pt 0;
  }}
  .highlight .label {{
    font-family: "Noto Serif Devanagari", serif;
    font-weight: 700;
    color: {HEX_AMBER_DARK};
    margin-right: 6pt;
    font-size: 10pt;
  }}
  .highlight .value {{ color: {HEX_INK}; }}
</style>
"""


# --------------------------------------------------------------------------- #
# Block parser (mirrors components/notes/MhGeographyNotes.tsx parseBlocks)
# --------------------------------------------------------------------------- #
HIGHLIGHT_KEYS = (
    "उगम",
    "लांबी",
    "क्षेत्र",
    "उपनद्या",
    "क्षमता",
    "स्थापना",
    "स्थान",
    "विस्तार",
    "आकार",
    "मार्ग",
    "मुख्यालय",
    "धरण",
    "संगम",
)


def _esc(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def text_to_html(text: str) -> str:
    """Convert one cleaned-section string into the same block model the React
    component uses, then emit HTML the PyMuPDF html engine can render."""
    out: List[str] = []
    for raw in text.split("\n"):
        line = raw.strip()
        if not line:
            continue

        # Bullet?
        if line.startswith("•") or line.startswith("\u2022") or line.startswith("-"):
            body = line.lstrip("•\u2022- ").strip()
            if not body:
                continue
            # Highlight (key : value with a known key)
            if ":" in body:
                k, v = body.split(":", 1)
                k_clean = k.strip()
                if any(key in k_clean for key in HIGHLIGHT_KEYS) and len(k_clean) <= 25:
                    out.append(
                        f'<div class="highlight"><span class="label">{_esc(k_clean)}</span>'
                        f'<span class="value">{_esc(v.strip())}</span></div>'
                    )
                    continue
            out.append(
                f'<p class="bullet"><span class="b">&bull;</span>{_esc(body)}</p>'
            )
            continue

        # Numbered list
        if line[:1].isdigit() or (line[:1] in "०१२३४५६७८९"):
            # crude check: starts with "1.", "1)", "१.", "१)"
            if len(line) > 2 and line[1] in ".)" or (len(line) > 2 and line[1] in ".)"):
                out.append(f'<p class="num">{_esc(line)}</p>')
                continue

        # Standalone short heading-y line
        if (
            len(line) <= 40
            and any("\u0900" <= c <= "\u097F" for c in line)
            and not line.endswith((".", "।", ":", "?", "!"))
        ):
            out.append(f'<div class="heading">{_esc(line)}</div>')
            continue

        out.append(f'<p>{_esc(line)}</p>')

    return GLOBAL_CSS + '<div class="body">' + "".join(out) + "</div>"


# --------------------------------------------------------------------------- #
# Page furniture (header, footer, frames)
# --------------------------------------------------------------------------- #
def add_running_header(page: fitz.Page, title: str, ch_label: str) -> None:
    """Top bar with chapter label on the left, doc title on the right."""
    page.draw_line(
        fitz.Point(MARGIN_X, MARGIN_T - 14),
        fitz.Point(PAGE_W - MARGIN_X, MARGIN_T - 14),
        color=COL_LINE,
        width=0.5,
    )
    page.insert_htmlbox(
        fitz.Rect(MARGIN_X, MARGIN_T - 30, PAGE_W - MARGIN_X, MARGIN_T - 16),
        f"""
        <style>
          body {{ font-family: "Noto Sans Devanagari", sans-serif;
                  font-size: 7.5pt; color: {HEX_INK_SOFT}; }}
          table {{ width: 100%; border-collapse: collapse; }}
          td.l {{ font-weight: 700; color: {HEX_AMBER_DARK};
                letter-spacing: 1.2pt; text-align: left; }}
          td.r {{ font-weight: 500; text-align: right; }}
        </style>
        <table><tr>
          <td class="l">{_esc(ch_label.upper())}</td>
          <td class="r">{_esc(title)}</td>
        </tr></table>
        """,
    )


def add_footer(page: fitz.Page, page_num: int, total: int) -> None:
    page.draw_line(
        fitz.Point(MARGIN_X, PAGE_H - MARGIN_B + 8),
        fitz.Point(PAGE_W - MARGIN_X, PAGE_H - MARGIN_B + 8),
        color=COL_LINE,
        width=0.5,
    )
    page.insert_htmlbox(
        fitz.Rect(MARGIN_X, PAGE_H - MARGIN_B + 10, PAGE_W - MARGIN_X, PAGE_H - 18),
        f"""
        <style>
          body {{ font-family: "Noto Sans Devanagari", sans-serif;
                  font-size: 7.5pt; color: {HEX_INK_SOFT}; }}
          table {{ width: 100%; border-collapse: collapse; }}
          td.l {{ font-weight: 700; letter-spacing: 0.8pt;
                color: {HEX_AMBER_DARK}; text-align: left; }}
          td.r {{ font-weight: 600; color: {HEX_NAVY}; text-align: right; }}
        </style>
        <table><tr>
          <td class="l">DON'T KNOW ACADEMY</td>
          <td class="r">{page_num} / {total}</td>
        </tr></table>
        """,
    )


# --------------------------------------------------------------------------- #
# Cover page
# --------------------------------------------------------------------------- #
def render_cover(page: fitz.Page, total_chapters: int, total_pages: int) -> None:
    # Big navy hero band
    page.draw_rect(fitz.Rect(0, 0, PAGE_W, PAGE_H * 0.62), color=None, fill=COL_NAVY)
    # Diagonal saffron sash
    page.draw_rect(
        fitz.Rect(0, PAGE_H * 0.43, PAGE_W, PAGE_H * 0.50),
        color=None,
        fill=COL_AMBER,
    )

    # Brand strip
    page.insert_htmlbox(
        fitz.Rect(MARGIN_X, 70, PAGE_W - MARGIN_X, 110),
        f"""
        <style>body {{ font-family: 'Noto Sans Devanagari', sans-serif;
                       color: #fde68a; font-size: 9pt;
                       letter-spacing: 3pt; font-weight: 700; }}</style>
        <div>DON'T KNOW ACADEMY  ·  NOTES SERIES</div>
        """,
    )

    # English title
    page.insert_htmlbox(
        fitz.Rect(MARGIN_X, 130, PAGE_W - MARGIN_X, 240),
        f"""
        <style>body {{ font-family: 'Noto Serif Devanagari', serif;
                       color: white; font-size: 36pt; font-weight: 800;
                       line-height: 1.05; letter-spacing: -0.5pt; }}
                .a {{ color: #fbbf24; }}</style>
        <div>Maharashtra<br/><span class="a">Geography</span></div>
        """,
    )

    # Marathi subtitle (against saffron sash)
    page.insert_htmlbox(
        fitz.Rect(MARGIN_X, PAGE_H * 0.43 + 6, PAGE_W - MARGIN_X, PAGE_H * 0.43 + 50),
        """
        <style>body { font-family: 'Noto Serif Devanagari', serif;
                      color: #1c1c1c; font-size: 22pt; font-weight: 800;
                      letter-spacing: 0.5pt; }</style>
        <div>महाराष्ट्र भूगोल — संपूर्ण नोट्स</div>
        """,
    )

    # Description card — sits below the navy band on cream
    card_top = PAGE_H * 0.66
    page.draw_rect(
        fitz.Rect(MARGIN_X, card_top, PAGE_W - MARGIN_X, PAGE_H - 120),
        color=COL_LINE,
        fill=COL_CREAM,
        width=0.6,
    )
    page.insert_htmlbox(
        fitz.Rect(MARGIN_X + 18, card_top + 16, PAGE_W - MARGIN_X - 18, PAGE_H - 130),
        f"""
        <style>
          body {{ font-family: 'Noto Sans Devanagari', sans-serif;
                  color: {HEX_INK}; font-size: 10pt; line-height: 1.6; }}
          h2 {{ font-family: 'Noto Serif Devanagari', serif;
                font-size: 13pt; color: {HEX_NAVY}; margin-bottom: 6pt;
                font-weight: 700; }}
          ul {{ margin: 6pt 0 0 16pt; }}
          li {{ margin-bottom: 3pt; }}
          .meta {{ margin-top: 10pt; color: {HEX_INK_SOFT};
                   font-size: 9pt; line-height: 1.5; }}
          table.pills {{ border-collapse: collapse; margin-bottom: 10pt; }}
          table.pills td {{ background: {HEX_AMBER}; color: white;
                   padding: 3pt 10pt; font-size: 8pt; font-weight: 700;
                   letter-spacing: 1.2pt; text-align: center; }}
          table.pills .gap {{ background: white; padding: 0; width: 4pt; }}
        </style>
        <table class="pills"><tr>
          <td>MPSC</td><td class="gap"></td>
          <td>RAJYASEVA</td><td class="gap"></td>
          <td>UPSC</td><td class="gap"></td>
          <td>RTO AMVI</td>
        </tr></table>
        <h2>About this typeset edition</h2>
        <p>16 chapters of Marathi geography — re-typeset in modern Noto
           Devanagari with calm cream / navy / saffron colours tuned for
           focused study. {total_chapters} chapters · {total_pages} pages of
           source content · 2026 edition.</p>
        <ul>
          <li>Formation, location &amp; political geography of Maharashtra</li>
          <li>Physical geography, river systems, climate &amp; forests</li>
          <li>Energy, transport, tourism &amp; mineral wealth</li>
          <li>Bonus: astronomy, atmosphere &amp; ISRO space launches</li>
        </ul>
        <p class="meta">Published by Don't know Academy · mpscs.in</p>
        """,
    )

    # Bottom strip
    page.draw_rect(fitz.Rect(0, PAGE_H - 70, PAGE_W, PAGE_H), color=None, fill=COL_NAVY)
    page.insert_htmlbox(
        fitz.Rect(MARGIN_X, PAGE_H - 60, PAGE_W - MARGIN_X, PAGE_H - 20),
        """
        <style>body { font-family: 'Noto Sans Devanagari', sans-serif;
                      color: white; font-size: 9pt; letter-spacing: 1pt; }
                table { width: 100%; border-collapse: collapse; }
                td.l { color: #fbbf24; font-weight: 700; text-align: left; }
                td.r { text-align: right; }</style>
        <table><tr>
          <td class="l">2026 TYPESET EDITION</td>
          <td class="r">mpscs.in</td>
        </tr></table>
        """,
    )


# --------------------------------------------------------------------------- #
# How-to-use page
# --------------------------------------------------------------------------- #
def render_how_to_use(page: fitz.Page) -> None:
    page.insert_htmlbox(
        fitz.Rect(MARGIN_X, MARGIN_T, PAGE_W - MARGIN_X, PAGE_H - MARGIN_B),
        f"""
        <style>
          body {{ font-family: 'Noto Sans Devanagari', sans-serif;
                  color: {HEX_INK}; font-size: 10.5pt; line-height: 1.7; }}
          h1 {{ font-family: 'Noto Serif Devanagari', serif;
                color: {HEX_NAVY}; font-size: 22pt; font-weight: 800;
                margin-bottom: 4pt; }}
          h2 {{ font-family: 'Noto Serif Devanagari', serif;
                color: {HEX_AMBER_DARK}; font-size: 12pt; margin: 14pt 0 4pt;
                border-left: 3pt solid {HEX_AMBER}; padding-left: 6pt; }}
          p {{ margin: 0 0 8pt; }}
          ul {{ margin: 4pt 0 8pt 18pt; }}
          li {{ margin-bottom: 4pt; }}
          .tag {{ display: inline-block; background: {HEX_NAVY}; color: white;
                  padding: 2pt 8pt; border-radius: 5pt; font-size: 8pt;
                  font-weight: 700; letter-spacing: 1pt; }}
        </style>
        <span class="tag">PREFACE</span>
        <h1>How to use these notes</h1>
        <p>This pack collects sixteen chapters of Maharashtra geography in a
           modern, distraction-free layout. Every page has been re-typeset
           from a fresh OCR pass — no scanned watermarks, no logos, just clean
           Devanagari you can study from comfortably.</p>

        <h2>Reading order</h2>
        <ul>
          <li><b>Part 1</b> covers the core syllabus: formation of the state,
              political &amp; physical geography, rivers, climate, forests,
              energy, transport, tourism and minerals.</li>
          <li><b>Part 2</b> wraps the supporting topics — astronomy, the
              atmosphere and ISRO's space-launch chronology.</li>
        </ul>

        <h2>What to look for on each page</h2>
        <ul>
          <li><b>Saffron-bordered call-outs</b> highlight headline facts
              (origin, length, area, capacity, capital). Memorise these
              first.</li>
          <li><b>Bulleted lines</b> are exam-friendly fragments — keep them
              short in your revision flashcards.</li>
          <li><b>Numbered lists</b> are sequences worth memorising in the
              order shown (e.g. atmospheric layers, ISRO launches).</li>
        </ul>

        <h2>Best companion practice</h2>
        <p>Pair each chapter with a topic-wise quiz on mpscs.in. Five-question
           sets reinforce the highlight callouts in roughly five minutes per
           topic.</p>
        """,
    )


# --------------------------------------------------------------------------- #
# Table of contents (multi-page)
# --------------------------------------------------------------------------- #
def render_toc(doc: fitz.Document, content: dict) -> List[fitz.Page]:
    """Render the TOC across one or more pages. Returns the list of pages."""
    parts = {1: [], 2: []}
    for ch in content["chapters"]:
        parts[ch["part"]].append(ch)

    rows = []
    for part_id, label in (
        (1, ("PART 1 · MAHARASHTRA GEOGRAPHY", "महाराष्ट्र भूगोल")),
        (2, ("PART 2 · OTHER IMPORTANT TOPICS", "इतर महत्त्वाचे घटक")),
    ):
        rows.append(("part", label))
        for ch in parts[part_id]:
            rows.append(("chap", ch))

    # Render to a single htmlbox; we use flat <div> rows (no <table>) so the
    # mu-pdf html engine doesn't hoist part-headers above the chapters.
    page = doc.new_page(width=PAGE_W, height=PAGE_H)
    parts_html = []
    parts_html.append(
        f"""
        <style>
          body {{ font-family: 'Noto Sans Devanagari', sans-serif;
                  font-size: 10.5pt; color: {HEX_INK}; }}
          h1 {{ font-family: 'Noto Serif Devanagari', serif;
                color: {HEX_NAVY}; font-size: 24pt; font-weight: 800;
                margin-bottom: 2pt; }}
          .sub {{ color: {HEX_AMBER_DARK}; font-size: 9pt; font-weight: 700;
                  letter-spacing: 1.5pt; margin-bottom: 16pt; }}
          .part-band {{ width: 100%; border-collapse: collapse;
                  margin: 16pt 0 6pt; background: {HEX_NAVY}; }}
          .part-band td {{ padding: 6pt 10pt; color: white; font-weight: 700;
                  font-size: 9.5pt; letter-spacing: 1.5pt; }}
          .part-band td.mr {{ text-align: right;
                  font-family: 'Noto Serif Devanagari', serif;
                  font-weight: 600; letter-spacing: 0; color: #fbbf24; }}
          table.toc {{ width: 100%; border-collapse: collapse; }}
          table.toc td {{ padding: 5pt 4pt; vertical-align: top;
                  border-bottom: 0.5pt dotted {HEX_LINE}; }}
          td.num {{ width: 26pt; color: {HEX_AMBER_DARK}; font-weight: 700;
                  font-family: 'Noto Serif Devanagari', serif; font-size: 11pt; }}
          td.ttl .en {{ color: {HEX_NAVY}; font-weight: 700; }}
          td.ttl .mr {{ font-family: 'Noto Serif Devanagari', serif;
                  color: {HEX_INK_SOFT}; font-size: 10pt; }}
          td.pp {{ width: 60pt; text-align: right; color: {HEX_INK_SOFT};
                  font-size: 9pt; font-weight: 600; }}
        </style>
        <h1>Contents</h1>
        <div class="sub">अनुक्रमणिका &middot; table of contents</div>
        """
    )

    in_table = False
    for kind, payload in rows:
        if kind == "part":
            if in_table:
                parts_html.append("</table>")
                in_table = False
            en, mr = payload
            parts_html.append(
                f'<table class="part-band"><tr>'
                f'<td>{_esc(en)}</td>'
                f'<td class="mr">{_esc(mr)}</td>'
                f'</tr></table>'
            )
            parts_html.append('<table class="toc">')
            in_table = True
        else:
            ch = payload
            parts_html.append(
                f'<tr>'
                f'<td class="num">{_esc(ch["number"])}</td>'
                f'<td class="ttl"><div class="en">{_esc(ch["titleEn"])}</div>'
                f'<div class="mr">{_esc(ch["titleMr"])}</div></td>'
                f'<td class="pp">pp. {ch["pageStart"]}&ndash;{ch["pageEnd"]}</td>'
                f'</tr>'
            )
    if in_table:
        parts_html.append("</table>")

    rect = fitz.Rect(MARGIN_X, MARGIN_T, PAGE_W - MARGIN_X, PAGE_H - MARGIN_B)
    page.insert_htmlbox(rect, "".join(parts_html))
    return [page]


# --------------------------------------------------------------------------- #
# Chapter divider page
# --------------------------------------------------------------------------- #
def render_chapter_divider(page: fitz.Page, ch: dict) -> None:
    # Hero band
    page.draw_rect(fitz.Rect(0, 0, PAGE_W, PAGE_H * 0.55), color=None, fill=COL_NAVY)
    page.draw_rect(fitz.Rect(0, PAGE_H * 0.5, PAGE_W, PAGE_H * 0.55), color=None, fill=COL_AMBER)

    page.insert_htmlbox(
        fitz.Rect(MARGIN_X, 80, PAGE_W - MARGIN_X, 120),
        f"""
        <style>body {{ font-family: 'Noto Sans Devanagari', sans-serif;
                       color: #fbbf24; font-size: 9pt; letter-spacing: 2pt;
                       font-weight: 700; }}</style>
        <div>{('PART ONE · MAHARASHTRA GEOGRAPHY' if ch['part'] == 1 else 'PART TWO · OTHER IMPORTANT TOPICS')}</div>
        """,
    )

    page.insert_htmlbox(
        fitz.Rect(MARGIN_X, 140, PAGE_W - MARGIN_X, 220),
        f"""
        <style>body {{ font-family: 'Noto Serif Devanagari', serif;
                       color: white; font-size: 64pt; font-weight: 800;
                       letter-spacing: -2pt; }}
                .small {{ font-size: 14pt; color: #fde68a; font-weight: 600;
                          letter-spacing: 4pt; }}</style>
        <div><span class="small">CHAPTER</span> {_esc(ch['number'])}</div>
        """,
    )

    page.insert_htmlbox(
        fitz.Rect(MARGIN_X, 240, PAGE_W - MARGIN_X, 320),
        f"""
        <style>body {{ font-family: 'Noto Serif Devanagari', serif;
                       color: white; font-size: 28pt; font-weight: 700;
                       line-height: 1.15; }}</style>
        <div>{_esc(ch['titleEn'])}</div>
        """,
    )

    page.insert_htmlbox(
        fitz.Rect(MARGIN_X, PAGE_H * 0.5 + 12, PAGE_W - MARGIN_X, PAGE_H * 0.55),
        f"""
        <style>body {{ font-family: 'Noto Serif Devanagari', serif;
                       color: #1c1c1c; font-size: 22pt; font-weight: 800;
                       letter-spacing: 0.5pt; }}</style>
        <div>{_esc(ch['titleMr'])}</div>
        """,
    )

    # Tip card
    card_top = PAGE_H * 0.6
    page.draw_rect(
        fitz.Rect(MARGIN_X, card_top, PAGE_W - MARGIN_X, card_top + 110),
        color=COL_LINE,
        fill=COL_CREAM,
        width=0.6,
    )
    page.insert_htmlbox(
        fitz.Rect(MARGIN_X + 18, card_top + 12, PAGE_W - MARGIN_X - 18, card_top + 100),
        f"""
        <style>
          body {{ font-family: 'Noto Sans Devanagari', sans-serif;
                  color: {HEX_INK}; font-size: 10.5pt; line-height: 1.6; }}
          .lbl {{ color: {HEX_AMBER_DARK}; font-weight: 700; font-size: 8.5pt;
                  letter-spacing: 1.5pt; text-transform: uppercase; }}
          .tip {{ font-family: 'Noto Serif Devanagari', serif; font-size: 12pt;
                  font-weight: 600; color: {HEX_NAVY}; margin-top: 4pt;
                  line-height: 1.45; }}
        </style>
        <div class="lbl">Study tip</div>
        <div class="tip">{_esc(ch['tip'])}</div>
        """,
    )

    # Pages-in-chapter strip at bottom (table for left/right alignment)
    pp = ch["pageEnd"] - ch["pageStart"] + 1
    page.insert_htmlbox(
        fitz.Rect(MARGIN_X, PAGE_H - 130, PAGE_W - MARGIN_X, PAGE_H - 60),
        f"""
        <style>
          body {{ font-family: 'Noto Sans Devanagari', sans-serif;
                  color: {HEX_INK_SOFT}; font-size: 9.5pt; }}
          table {{ width: 100%; border-collapse: collapse; }}
          td {{ text-align: center; vertical-align: top; padding: 6pt 4pt;
                width: 50%; }}
          td.divider {{ border-left: 0.6pt solid {HEX_LINE}; }}
          .v {{ font-family: 'Noto Serif Devanagari', serif; color: {HEX_NAVY};
                font-size: 22pt; font-weight: 800; line-height: 1.1; }}
          .k {{ font-size: 8pt; letter-spacing: 1.5pt;
                color: {HEX_AMBER_DARK}; font-weight: 700; margin-top: 4pt; }}
        </style>
        <table><tr>
          <td><div class="v">{pp}</div>
              <div class="k">{'PAGE' if pp == 1 else 'PAGES'} IN THIS CHAPTER</div></td>
          <td class="divider"><div class="v">pp. {ch['pageStart']}&ndash;{ch['pageEnd']}</div>
              <div class="k">SOURCE PAGE RANGE</div></td>
        </tr></table>
        """,
    )


# --------------------------------------------------------------------------- #
# Content pages — auto-overflow body using a placement loop
# --------------------------------------------------------------------------- #
def render_chapter_body(
    doc: fitz.Document, ch: dict
) -> int:
    """Render this chapter's typeset content as N body pages and append them
    to the main `doc`. Uses fitz.DocumentWriter + Story for proper Devanagari
    multi-page flow, then `doc.insert_pdf` to merge the pages.

    Returns the number of pages added (zero if the chapter has no body)."""
    sections = ch.get("body", [])
    if not sections:
        return 0

    # Concatenate every page section into one long html so the story can flow
    # naturally across pages. Each source page becomes a labelled section.
    combined = []
    for sec in sections:
        combined.append(
            f'<div class="section-tag">Source page {sec["page"]}</div>'
        )
        combined.append(text_to_html(sec["text"]).replace(GLOBAL_CSS, ""))

    body_html = (
        GLOBAL_CSS
        + f"""
        <style>
          .section-tag {{
            color: {HEX_AMBER_DARK};
            font-size: 8pt; font-weight: 700; letter-spacing: 2pt;
            text-transform: uppercase; border-bottom: 0.4pt solid {HEX_LINE};
            padding-bottom: 2pt; margin: 14pt 0 6pt 0;
          }}
        </style>
        """
        + "".join(combined)
    )

    # Render into a temp in-memory PDF using Story
    buf = io.BytesIO()
    writer = fitz.DocumentWriter(buf)
    story = fitz.Story(html=body_html)
    mediabox = fitz.Rect(0, 0, PAGE_W, PAGE_H)
    where = fitz.Rect(
        MARGIN_X,
        MARGIN_T + 4,
        PAGE_W - MARGIN_X,
        PAGE_H - MARGIN_B - 6,
    )

    more = 1
    safety = 0
    while more:
        device = writer.begin_page(mediabox)
        more, _ = story.place(where)
        story.draw(device, None)
        writer.end_page()
        safety += 1
        if safety > 80:
            print(f"  WARN: chapter {ch['number']} runaway pagination, stopping")
            break
    writer.close()

    # Merge the pages
    buf.seek(0)
    sub = fitz.open("pdf", buf.read())
    n = sub.page_count
    doc.insert_pdf(sub)
    sub.close()
    return n


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #
def main() -> None:
    if not CONTENT_JSON.exists():
        raise SystemExit(
            f"Content JSON missing: {CONTENT_JSON}.\n"
            f"Run: python scripts/extract_mh_geography_ocr.py first."
        )

    print(f"Loading content from {CONTENT_JSON.name}")
    with open(CONTENT_JSON, "r", encoding="utf-8") as f:
        content = json.load(f)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    doc = fitz.open()

    # --- Cover ---------------------------------------------------------- #
    cover = doc.new_page(width=PAGE_W, height=PAGE_H)
    render_cover(cover, content["totalChapters"], content["totalPages"])

    # --- How-to-use ----------------------------------------------------- #
    htu = doc.new_page(width=PAGE_W, height=PAGE_H)
    render_how_to_use(htu)

    # --- TOC ------------------------------------------------------------ #
    toc_pages = render_toc(doc, content)
    print(f"  TOC: {len(toc_pages)} page(s)")

    # --- Per-chapter content ------------------------------------------- #
    chapter_section_starts: List[int] = []  # 0-based page indexes for chapter dividers
    for ch in content["chapters"]:
        div = doc.new_page(width=PAGE_W, height=PAGE_H)
        render_chapter_divider(div, ch)
        chapter_section_starts.append(div.number)

        n_body = render_chapter_body(doc, ch)
        print(
            f"  Ch {ch['number']} {ch['titleEn']:<28} "
            f"divider + {n_body} body page(s)"
        )

    # --- Closing card --------------------------------------------------- #
    end = doc.new_page(width=PAGE_W, height=PAGE_H)
    end.draw_rect(fitz.Rect(0, 0, PAGE_W, PAGE_H), color=None, fill=COL_NAVY)
    end.insert_htmlbox(
        fitz.Rect(MARGIN_X, PAGE_H * 0.35, PAGE_W - MARGIN_X, PAGE_H * 0.65),
        f"""
        <style>body {{ font-family: 'Noto Serif Devanagari', serif;
                       color: white; font-size: 32pt; font-weight: 800;
                       text-align: center; line-height: 1.2; }}
                .a {{ color: #fbbf24; }}
                p {{ margin-top: 18pt; font-family: 'Noto Sans Devanagari', sans-serif;
                     font-size: 11pt; font-weight: 500; color: #cbd5e1;
                     line-height: 1.5; }}</style>
        <div>You finished the <span class="a">geography</span> notes</div>
        <p>Pair this revision pack with topic-wise practice quizzes on
           <b>mpscs.in</b> · 5-question sets to lock in the headline facts.</p>
        """,
    )

    # --- Headers / footers (post-pass, now we know totals) -------------- #
    total = doc.page_count
    chapter_lookup = {}  # page_index -> chapter number
    cur_ch = None
    for i in range(doc.page_count):
        # Find which chapter this page belongs to (if any)
        if i in chapter_section_starts:
            ch_idx = chapter_section_starts.index(i)
            cur_ch = content["chapters"][ch_idx]
        chapter_lookup[i] = cur_ch

    for i in range(doc.page_count):
        page = doc[i]
        if i == 0:
            continue  # cover gets no furniture
        if i == doc.page_count - 1:
            continue  # closing
        ch = chapter_lookup.get(i)
        ch_label = (
            f"CH {ch['number']} · {ch['titleEn']}" if ch else "PREFACE / CONTENTS"
        )
        if i not in chapter_section_starts:
            add_running_header(page, "Maharashtra Geography · Don't know Academy", ch_label)
        add_footer(page, i + 1, total)

    # --- Metadata ------------------------------------------------------- #
    doc.set_metadata(
        {
            "title": "Maharashtra Geography — Complete Notes (2026 typeset edition)",
            "author": "Don't know Academy",
            "subject": "MPSC / Rajyaseva / UPSC / RTO AMVI revision notes",
            "keywords": "Maharashtra Geography, MPSC, Rajyaseva, UPSC, Marathi notes",
            "creator": "scripts/build_mh_geography_typeset.py",
        }
    )

    # --- Save (atomic) -------------------------------------------------- #
    doc.save(TMP_PDF, deflate=True, garbage=4)
    doc.close()

    try:
        if TARGET_PDF.exists():
            TARGET_PDF.unlink()
        os.replace(TMP_PDF, TARGET_PDF)
        size_kb = TARGET_PDF.stat().st_size / 1024
        print(f"\n[OK] Wrote {TARGET_PDF.relative_to(REPO_ROOT)} ({size_kb:.1f} KB · {total} pages)")
    except PermissionError:
        print(
            f"\n[WARN] Could not replace {TARGET_PDF.name} (it is open in another app).\n"
            f"      The new build is at: {TMP_PDF}\n"
            f"      Close the open PDF reader and rerun, or rename the .tmp.pdf manually."
        )


if __name__ == "__main__":
    main()
