"""
Merge new exam JSON files into public/quizzes.json (same workflow as merge_psi2010.py).

EXISTING PATTERN ON THIS SITE
-----------------------------
1. Create one JSON file per paper under public/, e.g.:
     public/my_exam_english.json
     public/my_exam_marathi.json

2. Each file is ONE quiz object with this shape (see public/csg_pre_2025_english.json):

   {
     "id": "my_exam_en",                    # unique snake_case id; use _en / _mr suffixes
     "title": "MPSC ... (English)",        # title shown in app; mirror Marathi title for MR file
     "createdAt": "2025-01-02T10:00:00.000Z",
     "questions": [
       {
         "id": "my_exam_en_1",             # stable string ids recommended
         "text": "Question stem...",
         "options": ["A text", "B", "C", "D"],   # OR {"A":"...", "B":"...", "C":"...", "D":"..."}
         "correctAnswer": "A",             # "A" | "B" | "C" | "D"
         "explanation": "",
         "category": "History"             # one of lib/types.ts CATEGORIES
         // optional: "topic": "Modern India"   # for Topic Wise; omit if not used
       }
     ],
     "language": "english"                 # required: "english" or "marathi"
     // optional: "tag": "Group C 2025"   # shown as paper tag in Practice by Subject
   }

3. Append paths to NEW_FILES below, then run from repo root:

     python merge_into_quizzes.py

4. Commit public/quizzes.json (and keep the standalone public/*.json files in git if you use them as source).

CATEGORIES (must match lib/types.ts)
------------------------------------
Indian Polity, History, Geography, Science, Current Affairs, Economics,
Aptitude, English, Marathi, Environment
"""

import json
import os

BASE = os.path.dirname(os.path.abspath(__file__))
MAIN = os.path.join(BASE, "public", "quizzes.json")

# Add your new paper JSON paths here (same pattern as merge_psi2010.py).
NEW_FILES: list[str] = [
    # "public/group_c_combined_pre_2025_english.json",
    # "public/group_c_combined_pre_2025_marathi.json",
]


def main() -> None:
    paths = [p for p in NEW_FILES if p and not p.lstrip().startswith("#")]
    if not paths:
        print("Edit NEW_FILES in merge_into_quizzes.py to list your public/*.json paths, then run again.")
        return

    with open(MAIN, "r", encoding="utf-8") as f:
        quizzes = json.load(f)

    existing_ids = {q["id"] for q in quizzes}
    added = 0

    for rel in paths:
        rel = rel.strip()
        path = os.path.join(BASE, rel.replace("/", os.sep))
        if not os.path.isfile(path):
            print(f"MISSING FILE (skip): {path}")
            continue
        with open(path, "r", encoding="utf-8") as f:
            quiz = json.load(f)
        qid = quiz.get("id")
        if not qid:
            print(f"SKIP (no id): {rel}")
            continue
        if qid in existing_ids:
            print(f"SKIP (already in quizzes.json): {qid}")
            continue
        quizzes.append(quiz)
        existing_ids.add(qid)
        n = len(quiz.get("questions") or [])
        added += 1
        print(f"ADDED: {qid}  ({n} questions)  from {rel}")

    with open(MAIN, "w", encoding="utf-8") as f:
        json.dump(quizzes, f, ensure_ascii=False, indent=2)

    print(f"\nTotal quizzes: {len(quizzes)}  (newly added this run: {added})")


if __name__ == "__main__":
    main()
