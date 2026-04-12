import json

MAIN = "public/quizzes.json"
NEW_FILES = [
    "public/psi_pre_2010_english.json",
    "public/psi_pre_2010_marathi.json",
]

with open(MAIN, "r", encoding="utf-8") as f:
    quizzes = json.load(f)

existing_ids = {q["id"] for q in quizzes}
added = 0

for path in NEW_FILES:
    with open(path, "r", encoding="utf-8") as f:
        quiz = json.load(f)
    if quiz["id"] in existing_ids:
        print(f"SKIP (already exists): {quiz['id']}")
        continue
    quizzes.append(quiz)
    existing_ids.add(quiz["id"])
    added += 1
    print(f"ADDED: {quiz['id']}  ({len(quiz['questions'])} questions)")

with open(MAIN, "w", encoding="utf-8") as f:
    json.dump(quizzes, f, ensure_ascii=False, indent=2)

print(f"\nTotal quizzes now: {len(quizzes)}  (added {added})")
