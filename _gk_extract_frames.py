"""Extract one "question-reveal" frame at every scene change in the GK video,
plus a companion frame 5s later that should contain the highlighted correct
answer. Frames are written to ``_gk_frames/q/`` and ``_gk_frames/a/`` as JPEG.

Run once. Idempotent (re-runs overwrite). Takes ~3–6 minutes.
"""
from __future__ import annotations
import io, re, subprocess, sys
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

VIDEO = r"C:\Users\patiswap\Downloads\Last 6 Months Current Affairs 2025-26  Top 500 Most Important Current Affairs  Current GK 2025-26_720p.mp4"
OUT_DIR = Path('_gk_frames')
Q_DIR = OUT_DIR / 'q'
A_DIR = OUT_DIR / 'a'
for d in (Q_DIR, A_DIR):
    d.mkdir(parents=True, exist_ok=True)

# 1) Discover scene-change timestamps with ffmpeg.
print('detecting scene changes (this scans the whole video, ~30 s)...')
proc = subprocess.run(
    [
        'ffmpeg', '-hide_banner', '-i', VIDEO,
        '-vf', "select='gt(scene,0.30)',showinfo",
        '-vsync', 'vfr', '-f', 'null', 'NUL',
    ],
    capture_output=True, text=True, encoding='utf-8', errors='replace',
)
stderr = proc.stderr or ''
timestamps = []
for m in re.finditer(r'pts_time:([0-9.]+)', stderr):
    timestamps.append(float(m.group(1)))
print(f'found {len(timestamps)} scene-change timestamps')
# Always add t=0 (the very first slide may not register as a "change") and
# drop any duplicates that ended up very close together.
timestamps = sorted(set([0.0] + timestamps))
filtered = [timestamps[0]]
for t in timestamps[1:]:
    if t - filtered[-1] >= 3.0:  # skip rapid flicker scene changes
        filtered.append(t)
timestamps = filtered
print(f'after dedup (>=3 s apart): {len(timestamps)} questions expected')

# 2) Extract one frame at each timestamp + one 5s later (for answer highlight).
def grab(t: float, path: Path) -> bool:
    if path.exists():
        return True
    r = subprocess.run(
        [
            'ffmpeg', '-hide_banner', '-loglevel', 'error', '-ss', f'{t:.3f}',
            '-i', VIDEO, '-frames:v', '1', '-q:v', '3', str(path),
        ],
        capture_output=True,
    )
    return r.returncode == 0 and path.exists()

ok = 0
for i, t in enumerate(timestamps, 1):
    q_path = Q_DIR / f'q_{i:04d}_t{t:07.1f}.jpg'
    a_path = A_DIR / f'a_{i:04d}_t{t+5.0:07.1f}.jpg'
    if grab(t + 1.5, q_path):  # +1.5s to skip transition flash
        ok += 1
    grab(t + 6.5, a_path)
    if i % 25 == 0:
        print(f'  extracted {i}/{len(timestamps)} pairs')
print(f'done: {ok} question frames, {len(list(A_DIR.glob("*.jpg")))} answer frames')

# 3) Write index file so OCR pass knows what to process.
idx = OUT_DIR / 'index.txt'
with idx.open('w', encoding='utf-8') as f:
    for i, t in enumerate(timestamps, 1):
        f.write(f'{i:04d}\t{t:.3f}\n')
print('wrote', idx)
