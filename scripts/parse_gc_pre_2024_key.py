"""
Extract MPSC Group C Combined Preliminary 2024 final answer-key digits from the official PDF.

Layout (PyMuPDF word blocks):
- Page 0: most rows are 10 words (sorted by x): Qn, a,b,c,d, Qm, a,b,c,d — use the first
  digit column (Set A / first booklet) as column 0.
- Page 0: one row has Q25/Q50 with pipe separators; column 0 is the first digit after each Q.
- Page 1: rows 51–99 same 10-word pattern; last row mixes Q75/Q100 with footer text — filter
  words on the same y-band as the "75" label, then sort by x.

Requires: pip install pymupdf

Usage:
  python scripts/parse_gc_pre_2024_key.py path/to/Combine\\ Group\\ C\\ 2024\\ Pre.pdf
  python scripts/parse_gc_pre_2024_key.py path/to/file.pdf --json out.json
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict

try:
    import fitz  # type: ignore
except ImportError:
    print("Install PyMuPDF: pip install pymupdf", file=sys.stderr)
    sys.exit(1)


def parse_column0(pdf_path: str) -> dict[int, str]:
    """question_no -> '1'..'4' | '#' for cancelled (first booklet column)."""
    doc = fitz.open(pdf_path)
    col0: dict[int, str] = {}

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
        if len(arr) == 10:
            ts = [t for _, _, t in sorted(arr, key=lambda z: z[0])]
            q1 = int(ts[0])
            q2 = int(ts[5])
            col0[q1] = ts[1]
            col0[q2] = ts[6]
        elif len(arr) == 13:
            ts = [t for _, _, t in sorted(arr, key=lambda z: z[0])]
            if "25" in ts and "50" in ts:
                i25 = ts.index("25")
                i50 = ts.index("50")
                col0[25] = ts[i25 + 2]
                col0[50] = ts[i50 + 2]

    page = doc[1]
    by_blk = defaultdict(list)
    for w in page.get_text("words"):
        x0, y0, x1, y1, t, blk, *_ = w
        t = (t or "").strip()
        if not t:
            continue
        by_blk[int(blk)].append(((x0 + x1) / 2, (y0 + y1) / 2, t, x0, y0, x1, y1))

    for blk in range(2, 26):
        if blk not in by_blk:
            continue
        arr = by_blk[blk]
        if len(arr) != 10:
            continue
        ts = [t for x, y, t, *_ in sorted(arr, key=lambda z: z[0])]
        q1 = int(ts[0])
        q2 = int(ts[5])
        col0[q1] = ts[1]
        col0[q2] = ts[6]

    arr = by_blk.get(26, [])
    ref_y = None
    for x, y, t, *_ in arr:
        if t == "75":
            ref_y = y
            break
    band: list[tuple[float, str]] = []
    skip_footer = {"Date:-", "3rd", "July,", "2025"}
    for x, y, t, *_ in arr:
        if ref_y is not None and abs(y - ref_y) < 8 and t not in skip_footer:
            band.append((x, t))
    band.sort()
    ts = [t for _, t in band]
    if ts and ts[0] == "75" and "100" in ts:
        i100 = ts.index("100")
        col0[75] = ts[1]
        col0[100] = ts[i100 + 1]

    return col0


def to_app_shape(col0: dict[int, str]) -> dict[str, dict]:
    """1-based keys as strings; cancelled True when digit is # or X."""
    out: dict[str, dict] = {}
    digit_to_letter = {"1": "A", "2": "B", "3": "C", "4": "D"}
    for n in range(1, 101):
        raw = col0[n]
        if raw in ("#", "X", "x"):
            out[str(n)] = {"cancelled": True, "raw": raw}
        else:
            letter = digit_to_letter.get(raw)
            if letter is None:
                raise ValueError(f"Q{n}: unexpected key token {raw!r}")
            out[str(n)] = {"correctAnswer": letter, "raw": raw}
    return out


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("pdf", help="Path to Combine Group C 2024 Pre official key PDF")
    ap.add_argument("--json", metavar="FILE", help="Write full map (question -> answer info) as JSON")
    args = ap.parse_args()

    col0 = parse_column0(args.pdf)
    missing = [q for q in range(1, 101) if q not in col0]
    if missing:
        print("Missing questions:", missing, file=sys.stderr)
        sys.exit(2)

    shaped = to_app_shape(col0)
    if args.json:
        with open(args.json, "w", encoding="utf-8") as f:
            json.dump(shaped, f, ensure_ascii=False, indent=2)
        print("Wrote", args.json)
    else:
        json.dump(shaped, sys.stdout, ensure_ascii=False, indent=2)
        print(file=sys.stdout)


if __name__ == "__main__":
    main()
