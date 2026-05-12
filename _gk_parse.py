"""Parse the OCR + answer-detection output into a clean structured Q&A list
ready to be inserted into ``public/quizzes.json``.

Input:
  - _gk_frames/ocr_worker_{a,b,c,d}.jsonl  (raw OCR per frame)
  - _gk_frames/answers.tsv                 (per-frame detected letter)

Output:
  - _gk_questions.json                     (clean list of question dicts)
  - _gk_parse_report.txt                   (diagnostics / skipped frames)
"""
from __future__ import annotations
import io, json, re, sys
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

OUT_DIR = Path('_gk_frames')
WORKERS = ['a', 'b', 'c', 'd']

# Devanagari → ASCII digit map.
DEV2ASCII = str.maketrans('०१२३४५६७८९', '0123456789')


def load_ocr() -> dict[int, list]:
    data: dict[int, list] = {}
    for w in WORKERS:
        p = OUT_DIR / f'ocr_worker_{w}.jsonl'
        if not p.exists():
            continue
        for line in p.open(encoding='utf-8'):
            try:
                d = json.loads(line)
            except Exception:
                continue
            data[d['idx']] = d['lines']
    return data


def load_answers() -> dict[int, tuple[str, float]]:
    p = OUT_DIR / 'answers.tsv'
    out: dict[int, tuple[str, float]] = {}
    if not p.exists():
        return out
    for line in p.read_text(encoding='utf-8').splitlines():
        parts = line.split('\t')
        if len(parts) >= 3:
            idx = int(parts[0])
            out[idx] = (parts[1], float(parts[2]))
    return out


# Regex helpers.
QNUM_RE = re.compile(r'^\s*([\u0966-\u096F\d]{1,3})\s*[.\u0964:]?\s*$')
QNUM_PREFIX_RE = re.compile(r'^\s*([\u0966-\u096F\d]{1,3})\s*[.\u0964:]\s*')
OPT_LETTER_RE = re.compile(r'^\s*([A-D])\s*[.:\)\(]\s*', re.IGNORECASE)
OPT_LETTER_BARE_RE = re.compile(r'^\s*([A-D])\s*$', re.IGNORECASE)
# Junk patterns to drop.
JUNK_RES = [
    re.compile(r'^[\s\W_]*$'),  # only whitespace/punctuation
    re.compile(r'^@?(adda247|imc|news|champions|welfare|happiness|live|grade up)$', re.IGNORECASE),
    re.compile(r'^(answer|reveal|select|tap|click)$', re.IGNORECASE),
    re.compile(r'^\W*$'),
]
# Strip these mid-text fragments.
STRIP_RES = [
    re.compile(r'@\s*Adda247\s*Maharashtra', re.IGNORECASE),
    re.compile(r'\bGRADE\s*UP\b', re.IGNORECASE),
]


def dev_to_int(s: str) -> int | None:
    s = s.translate(DEV2ASCII)
    try:
        return int(re.sub(r'\D', '', s))
    except Exception:
        return None


def is_junk(text: str) -> bool:
    t = text.strip()
    if not t:
        return True
    for r in JUNK_RES:
        if r.match(t):
            return True
    # Very short non-letter/digit text (likely watermark fragments).
    if len(t) <= 2 and not re.search(r'[A-Za-z\u0900-\u097F]', t):
        return True
    return False


def clean_text(text: str) -> str:
    t = text
    for r in STRIP_RES:
        t = r.sub('', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t


def parse_frame(idx: int, lines: list) -> dict | None:
    """Convert OCR output for one frame into a question dict, or None if the
    frame doesn't appear to be a real question slide.
    """
    if not lines:
        return None

    # Each "line" is [bbox_polygon, text, conf].
    items = []
    for bbox, text, conf in lines:
        ys = [p[1] for p in bbox]
        xs = [p[0] for p in bbox]
        y0, y1 = min(ys), max(ys)
        x0, x1 = min(xs), max(xs)
        cy = (y0 + y1) / 2
        cx = (x0 + x1) / 2
        items.append({
            'x0': x0, 'y0': y0, 'x1': x1, 'y1': y1,
            'cx': cx, 'cy': cy, 'h': y1 - y0, 'w': x1 - x0,
            'text': text, 'conf': conf,
        })

    # 1) Question number: the leftmost item near y < 130 with mostly digits.
    qnum: int | None = None
    qnum_item = None
    for it in items:
        if it['cy'] > 130 or it['cx'] > 200:
            continue
        m = QNUM_RE.match(it['text'])
        if m:
            n = dev_to_int(m.group(1))
            if n is not None and 1 <= n <= 999:
                if qnum is None or it['cx'] < (qnum_item['cx'] if qnum_item else 9999):
                    qnum = n
                    qnum_item = it
    # Sometimes the question number is embedded in the question text line, e.g.
    # "२३. Who is the author of...". Try to extract it.
    if qnum is None:
        for it in items:
            if it['cy'] > 130 or it['cx'] > 200:
                continue
            m = QNUM_PREFIX_RE.match(it['text'])
            if m:
                n = dev_to_int(m.group(1))
                if n is not None and 1 <= n <= 999:
                    qnum = n
                    break

    # 2) Identify option rows by y-position. Slides use vertical layout:
    #     A: y ~280-360, B: ~370-450, C: ~460-540, D: ~550-630
    # Group OCR items by which option row their centroid falls in.
    bands = {
        'A': (260, 360),
        'B': (360, 460),
        'C': (460, 555),
        'D': (555, 660),
    }
    rows: dict[str, list[dict]] = {k: [] for k in bands}
    for it in items:
        # Restrict to LEFT half (options never extend past x=720 in our slides).
        if it['cx'] > 800:
            continue
        for letter, (y_lo, y_hi) in bands.items():
            if y_lo <= it['cy'] < y_hi:
                rows[letter].append(it)
                break

    options: dict[str, str] = {}
    for letter, row_items in rows.items():
        if not row_items:
            continue
        row_items.sort(key=lambda r: r['x0'])
        # Concatenate text. Strip the leading "A." / "A" / similar prefix.
        joined = ' '.join(it['text'] for it in row_items)
        joined = OPT_LETTER_RE.sub('', joined, count=1)
        joined = re.sub(r'^[\s.:)\(]+', '', joined)
        joined = clean_text(joined)
        # If the result is empty or junk, skip this option.
        if not joined or is_junk(joined):
            continue
        # Drop any trailing watermark fragments (often single chars).
        joined = re.sub(r'\s+[A-Z]$', '', joined)
        joined = re.sub(r'\s+\W$', '', joined)
        options[letter] = joined

    # 3) Question text: items at y < 260 (above option A), x > 100 (right of
    # the leftmost question-number column), and x < 1200, excluding the
    # detected qnum item.
    q_items = []
    for it in items:
        if it['cy'] >= 260:
            continue
        if it['cx'] < 100:
            continue
        if it['cx'] > 1180:
            continue
        if qnum_item is not None and it is qnum_item:
            continue
        if is_junk(it['text']):
            continue
        q_items.append(it)
    q_items.sort(key=lambda r: (r['cy'], r['cx']))
    stem = ' '.join(it['text'] for it in q_items)
    stem = QNUM_PREFIX_RE.sub('', stem)  # strip leading "N." if it merged in
    stem = clean_text(stem)
    # Convert Devanagari digits inside stem/options to ASCII digits.
    stem = stem.translate(DEV2ASCII)
    options = {k: v.translate(DEV2ASCII) for k, v in options.items()}

    # 4) Sanity checks: require at least 3 options recovered and a non-trivial
    # stem with a "?" or 20+ chars.
    if len(options) < 3:
        return None
    if not stem or (len(stem) < 15 and '?' not in stem):
        return None

    return {
        'frame_idx': idx,
        'qnum': qnum,
        'text': stem,
        'options': options,
    }


def main() -> int:
    ocr = load_ocr()
    answers = load_answers()
    print(f'frames with OCR: {len(ocr)} / 367')
    print(f'frames with answer: {len(answers)} / 367')

    questions = []
    skipped = []
    for idx in sorted(ocr.keys()):
        out = parse_frame(idx, ocr[idx])
        if out is None:
            skipped.append((idx, 'parse-failed'))
            continue
        for k in ('A', 'B', 'C', 'D'):
            out['options'].setdefault(k, '')
        letter, conf = answers.get(idx, ('?', 0.0))
        out['correctAnswer'] = letter if letter in ('A', 'B', 'C', 'D') else 'A'
        out['answerConfidence'] = conf
        if letter not in ('A', 'B', 'C', 'D') or not out['options'].get(letter):
            out['answerUnverified'] = True
        else:
            out['answerUnverified'] = False
        questions.append(out)

    # ---- Deduplicate questions that came from adjacent scene changes ----
    # Use a normalized signature on the question stem + option A. When two
    # frames produce the same signature, keep the one with HIGHER answer
    # confidence (and as a tiebreaker, the higher frame index, which usually
    # has the answer rendered more clearly).
    def sig(q):
        # Normalize text: lowercase, strip non-word chars, collapse l/I/1 etc.
        s = re.sub(r'\W+', '', q['text'].lower())
        # Treat common OCR-confused chars as equivalent so near-identical OCR
        # renderings of the same slide collapse to the same signature.
        s = s.translate(str.maketrans({'l': '1', 'i': '1', 'o': '0'}))
        return s[:60]
    by_sig: dict[str, dict] = {}
    for q in questions:
        k = sig(q)
        prev = by_sig.get(k)
        if prev is None:
            by_sig[k] = q
        else:
            # Keep the one with higher confidence (then later frame).
            if (q['answerConfidence'], q['frame_idx']) > (prev['answerConfidence'], prev['frame_idx']):
                by_sig[k] = q
    deduped = list(by_sig.values())
    print(f'dedup: {len(questions)} -> {len(deduped)}')
    questions = deduped

    # Sort by qnum if available, else frame_idx.
    questions.sort(key=lambda q: (q.get('qnum') or 10000, q['frame_idx']))

    out_path = Path('_gk_questions.json')
    out_path.write_text(
        json.dumps(questions, ensure_ascii=False, indent=2),
        encoding='utf-8',
    )
    print(f'wrote {out_path} : {len(questions)} questions  '
          f'({len(skipped)} skipped)')

    rep_path = Path('_gk_parse_report.txt')
    with rep_path.open('w', encoding='utf-8') as f:
        f.write(f'Frames OCRd : {len(ocr)}\n')
        f.write(f'Parsed Q    : {len(questions)}\n')
        f.write(f'Skipped     : {len(skipped)}\n\n')
        for idx, reason in skipped:
            f.write(f'  idx {idx:04d}  {reason}\n')
        f.write('\n--- Unverified-answer questions ---\n')
        for q in questions:
            if q['answerUnverified']:
                f.write(f"  idx {q['frame_idx']:04d}  qnum {q.get('qnum')}  "
                        f"ans={q['correctAnswer']} conf={q['answerConfidence']:.2f}  "
                        f"text={q['text'][:80]}\n")
    print(f'wrote {rep_path}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
