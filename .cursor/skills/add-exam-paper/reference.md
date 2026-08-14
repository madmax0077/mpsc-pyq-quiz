# Reference — schema & explanation voice

## Quiz JSON schema

`public/quizzes.json` is an array of quiz objects.

```jsonc
{
  "id": "group-b-mains-2025-english",          // slug + "-english" / "-marathi"
  "title": "Group B Mains 2025 - General Studies & Intelligence Test (Set A)",
  "language": "marathi",                         // OMIT for English; set only on the Marathi quiz
  "questions": [
    {
      "id": "gbm25-1",                           // "<short>-<n>" (EN) / "<short>-mr-<n>" (MR)
      "text": "…question text…",                 // use \n for line breaks (series, match lists)
      "options": { "A": "…", "B": "…", "C": "…", "D": "…" },
      "correctAnswer": "A",                      // one of A-D; from the answer key
      "explanation": "…coach voice…",
      "category": "Aptitude",                    // Aptitude, Polity, Economics, History, Geography, Science, …
      "number": 1,                               // ORIGINAL paper number; survives skipped items
      "cancelled": true                          // ONLY on questions the key cancelled
    }
  ]
}
```

Rules:
- English quiz has **no** `language` field; Marathi quiz has `"language": "marathi"`.
- EN and MR must be parallel: identical set of `number`s, identical `correctAnswer` per number, identical `cancelled` set.
- `number` drives on-screen numbering (via `StudentView.tsx`), so skipped/removed questions must keep the gap.

## Explanation voice (coach, not AI)

Match the existing entries: a human MPSC coach talking a student through it. **Do not** end with a robotic `Hence (X).`

Structure each explanation as:
1. A varied opener naming the option — rotate phrasing, don't reuse one template.
   - "Working through it, option A is the one."
   - "Straight to the answer — option A."
   - "The right pick is option B."
   - "The verified answer here is option C."
   - "The examiner has marked option D."
2. The core reasoning in one or two plain sentences (the actual why).
3. Optionally, a short revision nudge — but keep it **neutral / all-purpose**, not tied to a subject that doesn't fit (e.g. "re-read the stem once before finalising", "MPSC revisits this point every few prelim cycles"). Do not claim "arithmetic" on a non-math item.

For questions where the key seems to disagree with the visible text (likely OCR/wording), defer to the key neutrally: state the key's answer and note the original paper may differ subtly — never argue against the key.

### Examples (from the live paper)

```
Working through it, option A is the one. Amit's mother's sister's son is Amit's cousin, and that cousin is Swara's father. So Amit is one generation above Swara — her uncle.
```

```
Straight to the answer — option A. Taking the youngest age as x, the five ages are x, x+3, x+6, x+9, x+12. Their sum 5x+30 = 50 gives x = 4, so the youngest child is 4 years old. The three wrong options are close-fitting distractors, so re-read the stem once before finalising.
```

Marathi explanations follow the same structure in natural Marathi (e.g. opener "सोडवत गेल्यास पर्याय A येतो.").

## Match-the-pairs format

```
Match the pairs:
List I - List II
(a) X - (i) P
(b) Y - (ii) Q
(c) Z - (iii) R
(d) W - (iv) S
```

Store with `\n` between lines; one pair per line; header first.
