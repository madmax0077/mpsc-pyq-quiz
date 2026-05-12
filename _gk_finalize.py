"""Wait until all 4 OCR workers have finished (or the user kills them), then
run parse + inject once more so the GK 2025-26 quiz in public/quizzes.json
reflects every parseable frame.

Safe to run any time. If workers are still going, it will block (printing
progress every ~60 s) until they exit.
"""
from __future__ import annotations
import io, json, subprocess, sys, time
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

EXPECTED_TOTAL = 367
A_DIR = Path('_gk_frames/a')


def workers_busy() -> bool:
    """Return True if any python.exe process is currently running our worker."""
    try:
        out = subprocess.check_output(
            ['wmic', 'process', 'where', "name='python.exe'", 'get',
             'CommandLine', '/format:value'],
            text=True, errors='replace', stderr=subprocess.DEVNULL,
        )
    except Exception:
        return False
    return '_gk_ocr_worker.py' in out


def ocr_count() -> int:
    n = 0
    for w in ('a', 'b', 'c', 'd'):
        p = Path(f'_gk_frames/ocr_worker_{w}.jsonl')
        if p.exists():
            n += sum(1 for _ in p.open(encoding='utf-8'))
    return n


def main() -> int:
    total_frames = len(list(A_DIR.glob('*.jpg')))
    print(f'total frames in _gk_frames/a/: {total_frames}')
    start = time.time()
    while True:
        n = ocr_count()
        busy = workers_busy()
        elapsed = time.time() - start
        print(f'  ocr {n}/{total_frames}  busy={busy}  elapsed={elapsed/60:.1f}min',
              flush=True)
        if not busy or n >= total_frames:
            break
        time.sleep(60)
    print('OCR phase complete. running final parse + inject...')

    # Run the parse and inject scripts in order.
    rc = subprocess.run([sys.executable, '_gk_parse.py']).returncode
    if rc != 0:
        print('_gk_parse.py failed')
        return rc
    rc = subprocess.run([sys.executable, '_gk_inject.py']).returncode
    if rc != 0:
        print('_gk_inject.py failed')
        return rc

    # Final summary.
    data = json.loads(Path('public/quizzes.json').read_text(encoding='utf-8'))
    gk = next((q for q in data
               if q['id'] == 'topic-current-affairs-gk-2025-26-marathon'), None)
    if gk:
        print()
        print(f'DONE. GK 2025-26 Marathon quiz now has {len(gk["questions"])} '
              f'questions in public/quizzes.json.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
