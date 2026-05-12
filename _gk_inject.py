"""Inject the GK 2025-26 Marathon quiz into public/quizzes.json, replacing any
previous version with the same id.

Reads _gk_questions.json, normalizes each question (cleans noise, validates
options/answers), and inserts a single ``topicOnly`` quiz entry with
``category = "Current Affairs"`` and ``topic = "GK 2025-26 Marathon"``.

The home-page tile (HomeClient.tsx) looks up this exact category/topic via the
directTopic prop, so the quiz lights up the second it's added here.
"""
from __future__ import annotations
import io, json, re, sys
from datetime import datetime, timezone
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

QUIZ_ID = 'topic-current-affairs-gk-2025-26-marathon'
QUIZ_TITLE = 'GK 2025-26 Marathon — Top 500 Current Affairs MCQs'
QUIZ_TAG = 'GK 2025-26 Marathon'
QUIZ_CATEGORY = 'Current Affairs'
QUIZ_TOPIC = 'GK 2025-26 Marathon'
SOURCE_TAG = 'gk-2025-26-marathon'

PUBLIC_JSON = Path('public/quizzes.json')
GK_QUESTIONS = Path('_gk_questions.json')


# Final cleanup pass on option / stem text to strip OCR garbage that slipped
# through the earlier parser.
WATERMARK_FRAGMENTS = [
    re.compile(r'@\s*Adda247\s*Maharashtra', re.IGNORECASE),
    re.compile(r'\bGRADE\s*UP\b', re.IGNORECASE),
    re.compile(r'\b[Ll]eading\b'),  # banner watermark
    re.compile(r'\b[C][Ii]?\s*\|\s*NEWS\b', re.IGNORECASE),
    re.compile(r'\bIMC\b', re.IGNORECASE),
]
JUNK_TOKEN_RE = re.compile(
    r'\b('  # noise tokens we see on every other slide
    r'CHAMPIONS|WELFARE|HAPPINESS|LIVE|SUMMIT|IMPACT|SPORT|VIDEOS|'
    r'KHELO|UM[A-Z]{2,}|FUTURE|TRIBAL|NEWS|MAGAZINE'
    r')\b',
    re.IGNORECASE,
)
# Stray Devanagari fragments with no word chars
BARE_DEV_RE = re.compile(r'\s+[\u0900-\u097F]{1,2}\s+')


def clean(text: str) -> str:
    t = text
    for r in WATERMARK_FRAGMENTS:
        t = r.sub('', t)

    # Iteratively peel off trailing decoration / watermark fragments from the
    # right end of the string. Each iteration runs every strip-rule; we stop
    # once a full pass leaves the string unchanged.
    for _ in range(6):
        before = t
        # 1) Stray trailing Devanagari runs.
        t = re.sub(r'[\u0900-\u097F]{3,}[^\.\?]*$', '', t).strip()
        t = re.sub(r'\s+[\u0900-\u097F][\w*|^/\-\u0900-\u097F]*$', '', t).strip()
        # 2) Trailing tokens with junk symbols (^, |, *, /, \, _).
        t = re.sub(r'\s+\S*[\^|*/\\_][\w*|\^\\_/\-]*\W*$', '', t).strip()
        # 3) Trailing ALL-CAPS multi-word banner runs.
        t = re.sub(r'\s+([A-Z]{3,}\s+){1,5}[A-Z]{3,}\W*$', '', t)
        # 4) Trailing single ALL-CAPS token (>=4 chars) following a normal word.
        t = re.sub(r'(\b[A-Za-z][A-Za-z]+)\s+[A-Z]{4,}\W*$', r'\1', t)
        # 5) Trailing short 2-4 char ALL-CAPS token after a real word.
        t = re.sub(r'(\b[A-Za-z]{3,})\s+[A-Z]{2,4}\W*$', r'\1', t)
        # 6) Trailing mixed-case junk token like "UnMPION", "Bdut".
        t = re.sub(r'\s+\b[A-Z][a-z]?[A-Z]{3,}\w*\W*$', '', t)
        if t == before:
            break
    # Strip leading or embedded "X. " option-prefix-noise inside the value.
    # Eg. "4. 2030" -> "2030"; "8. 2035" -> "2035".
    t = re.sub(r'^\s*\d{1,2}\s*\.\s+(?=\S)', '', t)
    # Strip a duplicate leading single letter (the option-letter prefix that
    # was already removed once but appears again, e.g. "A Donald Trump",
    # "D None of the above", "A 2nd").
    t = re.sub(r'^([A-D])\s+(?=[A-Z][a-z]|[A-Z][A-Z]|\d)', '', t)
    # Drop stray standalone non-ASCII fragments at the end.
    t = re.sub(r'\s+\b[A-Z\u0900-\u097F]\b\W*$', '', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t


def main() -> int:
    if not GK_QUESTIONS.exists():
        print(f'ERROR: {GK_QUESTIONS} not found. Run _gk_parse.py first.')
        return 1
    questions_raw = json.loads(GK_QUESTIONS.read_text(encoding='utf-8'))
    if not questions_raw:
        print('ERROR: no questions parsed')
        return 1

    created_at = datetime.now(timezone.utc).isoformat(timespec='seconds')
    out_questions = []
    skipped = 0
    for i, q in enumerate(questions_raw, 1):
        text = clean(q['text'])
        options_raw = q.get('options', {})
        options = {k: clean(options_raw.get(k, '')) for k in ('A', 'B', 'C', 'D')}
        # Drop a question if any option is empty after cleanup.
        if any(not options[k] for k in ('A', 'B', 'C', 'D')):
            skipped += 1
            continue
        # Drop if stem is too short / corrupt.
        if not text or len(text) < 12:
            skipped += 1
            continue
        ans = q.get('correctAnswer', 'A')
        if ans not in ('A', 'B', 'C', 'D'):
            ans = 'A'
        conf = float(q.get('answerConfidence', 0.0))
        unverified = bool(q.get('answerUnverified', False)) or conf < 0.10

        out_questions.append({
            'id': f'{QUIZ_ID}-q{i}',
            'text': text,
            'options': options,
            'correctAnswer': ans,
            'explanation': (
                '[Auto-extracted from Adda247 Maharashtra "Top 500 GK 2025-26" video — '
                'answer needs human verification.]' if unverified else ''
            ),
            'category': QUIZ_CATEGORY,
            'topic': QUIZ_TOPIC,
            'sourceTag': SOURCE_TAG,
        })

    print(f'usable questions: {len(out_questions)}   (skipped {skipped})')
    if not out_questions:
        print('ERROR: nothing to write.')
        return 1

    quiz_entry = {
        'id': QUIZ_ID,
        'title': QUIZ_TITLE,
        'createdAt': created_at,
        'questions': out_questions,
        'language': 'english',
        'topicOnly': True,
        'tag': QUIZ_TAG,
    }

    # Load existing quizzes.json, drop any prior version of this quiz, append.
    data = json.loads(PUBLIC_JSON.read_text(encoding='utf-8'))
    before = len(data)
    data = [q for q in data if q.get('id') != QUIZ_ID]
    data.append(quiz_entry)
    PUBLIC_JSON.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding='utf-8',
    )
    print(f'public/quizzes.json: {before} -> {len(data)} quizzes')
    return 0


if __name__ == '__main__':
    sys.exit(main())
