"""Parallel-friendly OCR worker. Each instance OCRs a numeric range of frame
indices [start, end) and writes results to its own JSONL file. Multiple
workers can run concurrently without contention.

Usage:  python _gk_ocr_worker.py <worker_id> <start_idx> <end_idx>

Output: _gk_frames/ocr_worker_<worker_id>.jsonl
"""
from __future__ import annotations
import io, json, sys, time
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import easyocr

if len(sys.argv) != 4:
    print('usage: _gk_ocr_worker.py <worker_id> <start_idx> <end_idx>')
    sys.exit(1)
worker_id = sys.argv[1]
start_idx = int(sys.argv[2])
end_idx = int(sys.argv[3])

A_DIR = Path('_gk_frames/a')
OUT_DIR = Path('_gk_frames')
OUT_FILE = OUT_DIR / f'ocr_worker_{worker_id}.jsonl'

frames = []
for f in sorted(A_DIR.glob('a_*.jpg')):
    idx = int(f.stem.split('_')[1])
    if start_idx <= idx < end_idx:
        frames.append((idx, f))
print(f'[w{worker_id}] handling indices [{start_idx}, {end_idx}) -> {len(frames)} frames')

done = set()
if OUT_FILE.exists():
    for line in OUT_FILE.open(encoding='utf-8'):
        try:
            done.add(json.loads(line)['idx'])
        except Exception:
            pass
print(f'[w{worker_id}] already done: {len(done)}')

t0 = time.time()
reader = easyocr.Reader(['hi', 'en'], gpu=False, verbose=False)
print(f'[w{worker_id}] reader ready ({time.time()-t0:.1f}s)')

out = OUT_FILE.open('a', encoding='utf-8')
total_t = 0.0
todo = [(i, f) for i, f in frames if i not in done]
print(f'[w{worker_id}] todo: {len(todo)}')

for n, (idx, f) in enumerate(todo, 1):
    t0 = time.time()
    result = reader.readtext(str(f), detail=1, paragraph=False)
    lines = []
    for bbox, text, conf in result:
        lines.append([
            [[int(p[0]), int(p[1])] for p in bbox],
            text,
            float(conf),
        ])
    out.write(json.dumps({'idx': idx, 'frame': f.name, 'lines': lines}, ensure_ascii=False) + '\n')
    out.flush()
    total_t += time.time() - t0
    if n % 5 == 0 or n == len(todo):
        avg = total_t / n
        eta = (len(todo) - n) * avg
        print(f'[w{worker_id}] {n}/{len(todo)} idx={idx} avg={avg:.1f}s eta={eta/60:.1f}min',
              flush=True)
out.close()
print(f'[w{worker_id}] done in {total_t/60:.1f}min')
