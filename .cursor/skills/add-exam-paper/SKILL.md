---
name: add-exam-paper
description: >-
  Add a new MPSC-style exam paper to the quiz site (public/quizzes.json) from a
  question-paper PDF and an answer-key PDF, producing parallel English and
  Marathi quizzes with coach-voice explanations, original question numbering,
  cancelled-question flags, and formatted match-the-pairs. Use whenever the user
  provides an exam/question paper plus an answer key (PDFs) and asks to add,
  ingest, or import it into the website or quizzes.json.
---

# Add Exam Paper

One repeatable pipeline: given a **question-paper PDF** and an **answer-key PDF**, produce two parallel quizzes (English + Marathi) in `public/quizzes.json`, previewed locally, and committed only after the user approves.

## Inputs to confirm first

1. Paths to the question-paper PDF and the answer-key PDF.
2. Which answer-key column is the target set. **Default: the first answer column = Set A** (confirm once; don't re-ask each run).
3. Exam title and a short id slug (e.g. `group-b-mains-2025`).

Then track progress with this checklist:

```
- [ ] 1. Extract question paper + answer key
- [ ] 2. Parse answer key -> number/letter map (+ cancelled)
- [ ] 3. Build English questions (original numbering 1..N)
- [ ] 4. Write coach-voice explanations (see reference.md)
- [ ] 5. Mirror to Marathi (same numbers/answers)
- [ ] 6. Format match-the-pairs
- [ ] 7. Validate (scripts/validate-quiz.mjs)
- [ ] 8. Preview on in-house port, get user sign-off
- [ ] 9. Commit only quiz files
```

## Step 1 — Extract

Prefer the digital text layer. Use the standalone parser's extractor (`lib/pdf-text.ts` in the `pdf-parser` project) or any text-layer read. For **scanned / image-only PDFs** the text layer is unreliable — render each page to a PNG and read it visually before transcribing. Never trust raw OCR for answers, math symbols, diagrams, or Devanagari.

## Step 2 — Answer key

Read the key into a JSON map, first column = Set A unless told otherwise. A `#` (or blank) marks a **cancelled** question.

```json
{ "1": "A", "2": "C", "33": "CANCELLED", "34": "B" }
```

Rules:
- Use the answer key **verbatim**. Do not override it with your own solving, even if a question looks like it should be a different letter. If the key and the visible question genuinely conflict, keep the key's letter and note the possible OCR/wording issue neutrally in the explanation.

## Step 3-4 — Build English questions

- Give every question its **original paper number** via the `number` field (1..N). If a question is unreadable/removed, **skip that number** — never renumber the rest.
- Fill `options` A-D, set `correctAnswer` from the key, set `cancelled: true` where the key says so.
- Write one `explanation` per question in the site's coach voice. **Read `reference.md` before writing explanations** — voice, structure, and the exact JSON schema live there.

## Step 5 — Marathi mirror

Duplicate the quiz with `"language": "marathi"`, ids suffixed `-mr-`, same `number` and `correctAnswer` per question. Translate `text`, `options`, and `explanation`. Keep the two quizzes strictly parallel (same numbers, same answers, same cancelled set).

## Step 6 — Match-the-pairs

Reformat two-list match questions to the site convention: a short header line, then **one pair per line**. Apply to both languages.

## Step 7 — Validate (must pass)

Apply the answer key deterministically, then validate:

```bash
node ".cursor/skills/add-exam-paper/scripts/apply-answer-key.mjs" public/quizzes.json <en-id>,<mr-id> <answerkey.json>
node ".cursor/skills/add-exam-paper/scripts/validate-quiz.mjs" public/quizzes.json <en-id> <mr-id>
```

Fix every reported error, then re-run until it prints `OK`.

## Step 8 — Preview

Start the site's dev server and give the user the local URL so they can review both papers. Wait for explicit approval.

## Step 9 — Commit

Only after sign-off, commit **quiz files only** (`public/quizzes.json`, and `lib/types.ts` / `components/StudentView.tsx` only if the numbering field changed). Never commit PDFs, extraction dumps, rendered images, or the PDF tool. Use a conventional-commit message, e.g. `feat(quiz): add <title> (EN + MR)`.

## Reference

- Schema, id conventions, and explanation voice: [reference.md](reference.md)
