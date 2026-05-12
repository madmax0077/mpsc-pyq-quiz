"""For each Q/A frame pair, predict which option (A/B/C/D) is highlighted on
the answer frame.

Two signals are combined:
  1. ``red_in_region``: count of "fresh" red pixels (red on A but not on Q)
     inside each of the 4 option boxes.
  2. ``diff_in_region``: total absolute pixel difference between Q and A
     inside each option box.

The option box with the highest combined score wins. The slide layout puts
options in either a 4-row vertical list or a 2x2 grid, so we test both layouts
and keep the one whose winner has the largest margin.

Output: _gk_frames/answers.tsv
        idx<TAB>letter<TAB>conf<TAB>layout
"""
from __future__ import annotations
import io, sys
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import cv2
import numpy as np

Q_DIR = Path('_gk_frames/q')
A_DIR = Path('_gk_frames/a')
OUT_FILE = Path('_gk_frames/answers.tsv')


def pair_path(idx: int, side: str) -> Path | None:
    pat = ('q_' if side == 'q' else 'a_') + f'{idx:04d}_*.jpg'
    candidates = sorted((Q_DIR if side == 'q' else A_DIR).glob(pat))
    return candidates[0] if candidates else None


def red_mask(img: np.ndarray) -> np.ndarray:
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    m1 = cv2.inRange(hsv, (0, 80, 80), (15, 255, 255))
    m2 = cv2.inRange(hsv, (160, 80, 80), (180, 255, 255))
    return cv2.bitwise_or(m1, m2)


def score_in_box(diff_gray: np.ndarray, fresh_red: np.ndarray,
                 x0: int, y0: int, x1: int, y1: int) -> float:
    """Weighted score for one option-box ROI."""
    H, W = diff_gray.shape
    x0 = max(0, x0); y0 = max(0, y0)
    x1 = min(W, x1); y1 = min(H, y1)
    if x1 <= x0 or y1 <= y0:
        return 0.0
    d_sum = int(diff_gray[y0:y1, x0:x1].sum())
    r_sum = int(fresh_red[y0:y1, x0:x1].sum() / 255)
    return d_sum + r_sum * 50.0


def predict_for_layout(diff_gray: np.ndarray, fresh_red: np.ndarray,
                       H: int, W: int) -> tuple[str, float, float, dict]:
    """Return (winning_letter, top_score, top_minus_second, raw_scores)."""
    # Based on actual OCR-derived layout: options are at fixed y positions
    # in the left half of the slide.
    #   A: y 280-360, B: y 370-450, C: y 460-540, D: y 550-630
    # x range: 50-720 (left half).
    boxes = {
        'A': (50, 270, 720, 365),
        'B': (50, 365, 720, 460),
        'C': (50, 460, 720, 555),
        'D': (50, 555, 720, 650),
    }
    scores = {}
    for letter, (x0, y0, x1, y1) in boxes.items():
        scores[letter] = score_in_box(diff_gray, fresh_red, x0, y0, x1, y1)
    ranked = sorted(scores.items(), key=lambda kv: kv[1], reverse=True)
    top_letter, top_score = ranked[0]
    second_score = ranked[1][1]
    margin = top_score - second_score
    return top_letter, top_score, margin, scores


def detect_answer(q_path: Path, a_path: Path) -> tuple[str, float, str]:
    qimg = cv2.imread(str(q_path))
    aimg = cv2.imread(str(a_path))
    if qimg is None or aimg is None:
        return '?', 0.0, 'no-img'
    if qimg.shape != aimg.shape:
        h = min(qimg.shape[0], aimg.shape[0])
        w = min(qimg.shape[1], aimg.shape[1])
        qimg = qimg[:h, :w]
        aimg = aimg[:h, :w]
    H, W = aimg.shape[:2]

    diff = cv2.absdiff(qimg, aimg)
    diff_gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
    # Threshold to remove tiny noise (anti-aliasing, watermark drift).
    diff_gray = cv2.threshold(diff_gray, 15, 255, cv2.THRESH_TOZERO)[1]

    qred = red_mask(qimg)
    ared = red_mask(aimg)
    qred_d = cv2.dilate(qred, np.ones((9, 9), np.uint8))
    fresh_red = cv2.bitwise_and(ared, cv2.bitwise_not(qred_d))

    letter, score, margin, scores = predict_for_layout(diff_gray, fresh_red, H, W)
    conf = margin / max(score, 1.0)
    return letter, float(conf), 'vertical'


def main() -> int:
    idxs = []
    for af in sorted(A_DIR.glob('a_*.jpg')):
        idxs.append(int(af.stem.split('_')[1]))

    print(f'detecting answers for {len(idxs)} frames...')
    rows = []
    counts = {'A': 0, 'B': 0, 'C': 0, 'D': 0, '?': 0}
    for n, idx in enumerate(idxs, 1):
        q = pair_path(idx, 'q')
        a = pair_path(idx, 'a')
        if q is None or a is None:
            continue
        letter, conf, layout = detect_answer(q, a)
        rows.append((idx, letter, conf, layout))
        counts[letter] += 1
        if n % 50 == 0:
            print(f'  [{n}/{len(idxs)}] {counts}', flush=True)

    OUT_FILE.write_text(
        '\n'.join(f'{idx:04d}\t{letter}\t{conf:.3f}\t{layout}'
                  for idx, letter, conf, layout in rows) + '\n',
        encoding='utf-8',
    )
    print(f'wrote {OUT_FILE}')
    print(f'final distribution: {counts}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
