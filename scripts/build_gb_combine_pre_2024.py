"""
Experimental builder for Group B Combined Pre 2024 (English + Marathi JSON).

The official *combined* PDF often has an incomplete text layer (missing `N.` markers,
missing English blocks, two-column ordering issues). This script does a best-effort
PyMuPDF extraction plus the official first-column answer key from the same PDF.

Requires: pip install pymupdf

Usage:
  python scripts/build_gb_combine_pre_2024.py "path/to/Group_B_Combine_Pre_2024.pdf"
  python scripts/build_gb_combine_pre_2024.py "path/to/scan.pdf" --strict

Outputs (always 100 questions per file):
  public/gb_combine_pre_2024_english.json
  public/gb_combine_pre_2024_marathi.json

OCR gaps get placeholder stems unless `--strict`. Then run `python merge_into_quizzes.py`
(or replace existing quizzes in `public/quizzes.json` by id).
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from collections import defaultdict

try:
    import fitz  # PyMuPDF
except ImportError:
    print("Install PyMuPDF: pip install pymupdf", file=sys.stderr)
    sys.exit(1)

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))


def _is_qnum(s: str) -> bool:
    return s.isdigit() and 1 <= int(s) <= 100


def parse_gb_booklet_column0(pdf_path: str) -> dict[int, str]:
    """
    First answer column (Set A) for Group B Combined Pre 2024 key PDF.
    Skips spurious 10-word blocks (e.g. Marathi footer) that break the Group C-only parser.
    """
    doc = fitz.open(pdf_path)
    col0: dict[int, str] = {}

    def ingest_page(page: fitz.Page, max_blk: int) -> None:
        by_blk: dict[int, list[tuple[float, float, str]]] = defaultdict(list)
        for w in page.get_text("words"):
            x0, y0, x1, y1, t, blk, *_ = w
            t = (t or "").strip()
            if not t:
                continue
            by_blk[int(blk)].append(((x0 + x1) / 2, (y0 + y1) / 2, t))
        for blk in sorted(by_blk.keys()):
            if blk > max_blk:
                continue
            arr = by_blk[blk]
            if len(arr) != 10:
                continue
            ts = [t for _, _, t in sorted(arr, key=lambda z: z[0])]
            if not (_is_qnum(ts[0]) and _is_qnum(ts[5])):
                continue
            q1, q2 = int(ts[0]), int(ts[5])
            col0[q1] = ts[1]
            col0[q2] = ts[6]

    ingest_page(doc[0], max_blk=39)
    ingest_page(doc[1], max_blk=30)

    # Q25/Q50 special row on page 0
    page = doc[0]
    by_blk: dict[int, list[tuple[float, float, str]]] = defaultdict(list)
    for w in page.get_text("words"):
        x0, y0, x1, y1, t, blk, *_ = w
        t = (t or "").strip()
        if not t:
            continue
        by_blk[int(blk)].append(((x0 + x1) / 2, (y0 + y1) / 2, t))
    for blk in sorted(by_blk.keys()):
        arr = by_blk[blk]
        if len(arr) != 13:
            continue
        ts = [t for _, _, t in sorted(arr, key=lambda z: z[0])]
        if "25" in ts and "50" in ts:
            i25, i50 = ts.index("25"), ts.index("50")
            col0[25] = ts[i25 + 2]
            col0[50] = ts[i50 + 2]

    # Q75/Q100 band on page 1 block 25
    page = doc[1]
    by_blk = defaultdict(list)
    for w in page.get_text("words"):
        x0, y0, x1, y1, t, blk, *_ = w
        t = (t or "").strip()
        if not t:
            continue
        by_blk[int(blk)].append(((x0 + x1) / 2, (y0 + y1) / 2, t, x0, y0, x1, y1))
    arr = by_blk.get(25, [])
    ref_y = None
    for _x, y, t, *_ in arr:
        if t == "75":
            ref_y = y
            break
    band: list[tuple[float, str]] = []
    skip_footer = {"Date:-", "4th", "March,", "2025"}
    for x, y, t, *_ in arr:
        if ref_y is not None and abs(y - ref_y) < 10 and t not in skip_footer:
            band.append((x, t))
    band.sort()
    ts = [t for _, t in band]
    if ts and ts[0] == "75" and "100" in ts:
        i100 = ts.index("100")
        col0[75] = ts[1]
        col0[100] = ts[i100 + 1]

    doc.close()
    return col0


def to_app_shape(col0: dict[int, str]) -> dict[str, dict]:
    digit_to_letter = {"1": "A", "2": "B", "3": "C", "4": "D"}
    out: dict[str, dict] = {}
    for n in range(1, 101):
        raw = col0.get(n, "")
        if raw in ("#", "X", "x", "-", "-1-"):
            out[str(n)] = {"cancelled": True, "raw": raw}
        elif raw in digit_to_letter:
            out[str(n)] = {"correctAnswer": digit_to_letter[raw], "raw": raw}
        else:
            raise ValueError(f"Q{n}: unexpected key token {raw!r}")
    return out

def _devanagari_ratio(s: str) -> float:
    if not s:
        return 0.0
    dev = sum(1 for c in s if "\u0900" <= c <= "\u097f")
    return dev / len(s)


def _latin_ratio(s: str) -> float:
    if not s:
        return 0.0
    lat = sum(1 for c in s if ord(c) < 128 and c.isprintable())
    return lat / len(s)


def page_blocks_text(page: fitz.Page) -> str:
    """
    Two-column MCQ layout: left column top-to-bottom, then right column.
    Classify each *block* by its left edge (bbox[0]), not the horizontal centre,
    so wide OCR lines are not treated as the wrong column.
    """
    d = page.get_text("dict")
    w_cut = page.rect.width * 0.48
    rows: list[tuple[int, float, float, str]] = []
    for b in d["blocks"]:
        if b.get("type") != 0:
            continue
        bbox = b["bbox"]
        x0, y0 = bbox[0], bbox[1]
        txt = "".join(s["text"] for ln in b.get("lines", []) for s in ln.get("spans", []))
        txt = " ".join(txt.split())
        if not txt.strip():
            continue
        col = 0 if x0 < w_cut else 1
        rows.append((col, y0, x0, txt))
    rows.sort(key=lambda t: (t[0], round(t[1] / 2) * 2, t[2]))
    return "\n".join(t[3] for t in rows)


def merge_body_text(doc: fitz.Document) -> str:
    parts: list[str] = []
    for i in range(3, len(doc)):
        parts.append(page_blocks_text(doc[i]))
    return "\n".join(parts)


def clean_body(raw: str) -> str:
    lines = []
    for ln in raw.splitlines():
        s = ln.strip()
        if not s:
            continue
        if s in {"H19", "het 4", "he 9", "hie 8", "fst 19", "Re 24", "ee 29", "es 10"}:
            continue
        if re.fullmatch(r"\d{1,2}", s) and len(s) <= 2:
            continue
        if "SPACE FOR ROUGH WORK" in s or "कच्च्या कामासाठी" in s:
            continue
        lines.append(s)
    return "\n".join(lines)


def find_english_start(lines: list[str]) -> int | None:
    """First line that looks like the English stem (Latin-heavy, not a lone Marathi option row)."""
    for i, ln in enumerate(lines):
        if re.match(r"^\(\d\)\s*$", ln) or re.match(r"^\(\d\)\s+[अआइई]", ln):
            continue
        if len(ln) < 14:
            continue
        if _devanagari_ratio(ln) > 0.28:
            continue
        if _latin_ratio(ln) < 0.48:
            continue
        if re.match(r"^[a-dA-D]\.\s", ln) and i > 0 and _devanagari_ratio(lines[i - 1]) > 0.15:
            continue
        return i
    return None


def normalize_devanagari_option_marks(s: str) -> str:
    """OCR PDFs often use (१)(२)(३)(४) instead of (1)-(4)."""
    dmap = {"१": "1", "२": "2", "३": "3", "४": "4"}

    def repl(m: re.Match) -> str:
        return "(" + dmap.get(m.group(1), m.group(1)) + ")"

    return re.sub(r"\(([१२३४])\)", repl, s)


def extract_four_options(chunk: str) -> list[str] | None:
    chunk = normalize_devanagari_option_marks(chunk)
    opts: list[str] = []
    for d in range(1, 5):
        m = re.search(rf"\({d}\)\s*", chunk)
        if not m:
            return None
        start = m.end()
        if d < 4:
            m_next = re.search(rf"\({d + 1}\)\s*", chunk[start:])
            if not m_next:
                return None
            end = start + m_next.start()
        else:
            end = len(chunk)
        text = re.sub(r"\s+", " ", chunk[start:end]).strip()
        if len(text) < 1:
            return None
        opts.append(text)
    return opts


FALLBACK_OPTS = [
    "Answer choice (1) — text missing in PDF extract; see official PDF.",
    "Answer choice (2) — text missing in PDF extract; see official PDF.",
    "Answer choice (3) — text missing in PDF extract; see official PDF.",
    "Answer choice (4) — text missing in PDF extract; see official PDF.",
]


def _valid_exam_question_marker(m: re.Match, text: str) -> bool:
    """Drop table rows like '7.|(1)…' or '3.|घेड…' that are not real question starts."""
    tail = text[m.end() : m.end() + 160].lstrip()
    if len(tail) < 6:
        return False
    c0 = tail[0]
    if c0 in "|()[]":
        return False
    # Devanagari digit + dot artifacts
    if c0 in "१२३४५६७८९०":
        return False
    return True


def _placeholder_chunk(qn: int) -> str:
    return (
        f"{qn}. [Stem not extracted from PDF text layer — open official paper PDF.]\n"
        "(1) Option A\n(2) Option B\n(3) Option C\n(4) Option D\n"
        "Which row is correct?\n(1) Option A\n(2) Option B\n(3) Option C\n(4) Option D"
    )


def split_questions_ordered(body: str, pad_to_100: bool) -> list[str]:
    """
    Map text to exactly 100 question chunks. Accepts only `N.` markers in order
    (skips duplicate column repeats). Missing OCR markers become placeholder chunks.
    If pad_to_100 is False and any slot would be placeholder, returns [].
    """
    text = body.strip()
    # Require "N." (not "N H19"); H19 appears inside questions and breaks splits.
    pat = re.compile(r"(?:^|\n)(100|[1-9]\d?)\.\s")
    ms = [m for m in pat.finditer(text) if _valid_exam_question_marker(m, text)]
    starts: list[int | None] = [None] * 100
    want = 1
    for m in ms:
        n = int(m.group(1))
        if n < want or n > 100:
            continue
        while want < n:
            want += 1
        if want == n:
            starts[want - 1] = m.start()
            want += 1
    chunks: list[str] = []
    for i in range(100):
        st = starts[i]
        qn = i + 1
        if st is None:
            if not pad_to_100:
                return []
            chunks.append(_placeholder_chunk(qn))
            continue
        nxt = len(text)
        for j in range(i + 1, 100):
            if starts[j] is not None:
                nxt = starts[j]
                break
        chunks.append(text[st:nxt].strip())
    return chunks


def guess_category(en_stem: str) -> str:
    s = en_stem.lower()
    if any(w in s for w in ("constitution", "article ", "parliament", "president", "governor", "election commission", "fundamental")):
        return "Indian Polity"
    if any(w in s for w in ("river", "mountain", "soil", "climate", "district", "maharashtra", "geography", "map")):
        return "Geography"
    if any(w in s for w in ("cell", "dna", "species", "plant", "animal", "disease", "health", "heart", "blood", "mammal")):
        return "Science"
    if any(w in s for w in ("budget", "economy", "gdp", "bank", "tax", "market", "rupee")):
        return "Economics"
    if any(w in s for w in ("environment", "climate change", "pollution", "forest", "solar")):
        return "Environment"
    if any(w in s for w in ("grammar", "passage", "synonym", "antonym", "english")):
        return "English"
    if any(w in s for w in ("marathi", "वाक्य", "शब्द")):
        return "Marathi"
    if any(w in s for w in ("percent", "ratio", "probability", "series", "average", "interest", "speed", "time and work")):
        return "Aptitude"
    if any(w in s for w in ("2023", "2024", "scheme", "minister", "policy", "national ", "international")):
        return "Current Affairs"
    return "History"


def normalize_loose_option_parens(chunk: str) -> str:
    """OCR sometimes emits `4) text` instead of `(4) text` on its own line."""
    return re.sub(r"(?:^|\n)([1-4])\)\s+", r"\n(\1) ", chunk)


def parse_one_chunk(qn: int, chunk: str) -> tuple[dict | None, dict | None]:
    chunk = normalize_loose_option_parens(chunk)
    lines = [ln.strip() for ln in chunk.splitlines() if ln.strip()]
    if not lines:
        return None, None
    first = lines[0]
    m = re.match(r"^(100|[1-9]\d?)\.\s*(.*)$", first)
    if m:
        lines[0] = m.group(2).strip()
    en_i = find_english_start(lines)
    if en_i is None:
        mr_lines = lines
        en_lines = lines
    else:
        mr_lines = lines[:en_i]
        en_lines = lines[en_i:]
    mr_blob = "\n".join(mr_lines).strip()
    en_blob = "\n".join(en_lines).strip()

    en_stem_lines: list[str] = []
    en_rest_start = 0
    for j, ln in enumerate(en_lines):
        if re.match(r"^\(\d\)\s*", ln):
            en_rest_start = j
            break
        en_stem_lines.append(ln)
    en_stem = "\n".join(en_stem_lines).strip()
    en_opts_chunk = "\n".join(en_lines[en_rest_start:])

    mr_opts_chunk = ""
    mr_stem = mr_blob
    for j, ln in enumerate(mr_lines):
        if re.match(r"^\(\d\)\s*", ln):
            mr_stem = "\n".join(mr_lines[:j]).strip()
            mr_opts_chunk = "\n".join(mr_lines[j:])
            break

    en_opts = extract_four_options(en_opts_chunk)
    if not en_opts:
        en_opts = extract_four_options(mr_blob + "\n" + en_opts_chunk)
    mr_opts = extract_four_options(mr_opts_chunk) if mr_opts_chunk else None
    if not mr_opts:
        mr_opts = extract_four_options(mr_blob)
    if not mr_opts and en_opts:
        mr_opts = en_opts
    if not en_opts and mr_opts:
        en_opts = mr_opts
    if not en_opts or not mr_opts:
        en_opts = FALLBACK_OPTS
        mr_opts = FALLBACK_OPTS

    return (
        {"stem": mr_stem, "options": mr_opts},
        {"stem": en_stem, "options": en_opts},
    )


def apply_key(
    mr_q: dict,
    en_q: dict,
    qn: int,
    key_info: dict,
) -> tuple[dict, dict]:
    kid = str(qn)
    info = key_info[kid]
    base_mr = {
        "id": f"gb_combine_pre_2024_mr_{qn}",
        "text": mr_q["stem"],
        "options": mr_q["options"],
        "explanation": "",
        "category": guess_category(en_q["stem"]),
    }
    base_en = {
        "id": f"gb_combine_pre_2024_en_{qn}",
        "text": en_q["stem"],
        "options": en_q["options"],
        "explanation": "",
        "category": guess_category(en_q["stem"]),
    }
    if info.get("cancelled"):
        base_mr["cancelled"] = True
        base_en["cancelled"] = True
    else:
        base_mr["correctAnswer"] = info["correctAnswer"]
        base_en["correctAnswer"] = info["correctAnswer"]
    return base_mr, base_en


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "pdf",
        nargs="?",
        default="",
        help="Path to the combined question PDF (default: common Downloads filenames).",
    )
    ap.add_argument(
        "--strict",
        action="store_true",
        help="Exit if any question number 1–100 has no PDF marker (default: use placeholders for OCR gaps).",
    )
    args = ap.parse_args()
    dl = os.path.join(os.path.expanduser("~"), "Downloads")
    candidates = [
        args.pdf.strip(),
        os.path.join(dl, "Group_B_Combine_Pre_2024 (1).pdf"),
        os.path.join(dl, "Group_B_Combine_Pre_2024.pdf"),
    ]
    pdf_path = next((os.path.abspath(p) for p in candidates if p and os.path.isfile(p)), "")
    if not pdf_path:
        print("PDF not found. Tried:", [p for p in candidates if p], file=sys.stderr)
        sys.exit(1)

    doc = fitz.open(pdf_path)
    col0 = parse_gb_booklet_column0(pdf_path)
    missing = [q for q in range(1, 101) if q not in col0]
    if missing:
        print("Answer key incomplete:", missing, file=sys.stderr)
        sys.exit(2)
    key_map = to_app_shape(col0)

    body = clean_body(merge_body_text(doc))
    doc.close()

    chunks = split_questions_ordered(body, pad_to_100=not args.strict)
    if len(chunks) != 100:
        print(f"Internal error: expected 100 chunks, got {len(chunks)}.", file=sys.stderr)
        sys.exit(3)

    mr_questions: list[dict] = []
    en_questions: list[dict] = []

    for qn, ch in enumerate(chunks, start=1):
        parsed = parse_one_chunk(qn, ch)
        if parsed[0] is None:
            print(f"WARN: parse failed Q{qn}", file=sys.stderr)
            continue
        mr_q, en_q = parsed
        mr_questions.append(apply_key(mr_q, en_q, qn, key_map)[0])
        en_questions.append(apply_key(mr_q, en_q, qn, key_map)[1])

    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    if len(en_questions) != 100:
        print(f"ERROR: expected 100 questions, got {len(en_questions)}.", file=sys.stderr)
        sys.exit(3)

    tag = "Group B Combined Pre - 2024"
    created = "2024-12-01T10:00:00.000Z"

    en_quiz = {
        "id": "gb_combine_pre_2024_en",
        "title": "MPSC Group B Combined Pre 2024 (English)",
        "createdAt": created,
        "language": "english",
        "tag": tag,
        "questions": en_questions,
    }
    mr_quiz = {
        "id": "gb_combine_pre_2024_mr",
        "title": "MPSC Group B Combined Pre 2024 (मराठी)",
        "createdAt": created,
        "language": "marathi",
        "tag": tag,
        "questions": mr_questions,
    }

    for path, quiz in (
        (os.path.join(base, "public", "gb_combine_pre_2024_english.json"), en_quiz),
        (os.path.join(base, "public", "gb_combine_pre_2024_marathi.json"), mr_quiz),
    ):
        with open(path, "w", encoding="utf-8") as f:
            json.dump(quiz, f, ensure_ascii=False, indent=2)
        print("Wrote", path, "—", len(quiz["questions"]), "questions")


if __name__ == "__main__":
    main()
