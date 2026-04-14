import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

data = json.load(open('public/quizzes.json', 'r', encoding='utf-8'))
print(f"Total quizzes: {len(data)}")
for q in data:
    title = q["title"][:60]
    nq = len(q["questions"])
    to = q.get("topicOnly", False)
    print(f"  {q['id']}: {title} ({nq} qs, topicOnly={to})")

print()
topics = json.load(open('public/topics.json', 'r', encoding='utf-8'))
print(f"Total topics: {len(topics)}")
for t in topics:
    name = t["name"][:60]
    cat = t["category"]
    nq = len(t["questionIds"])
    print(f"  {t['id']}: {name} ({cat}, {nq} qs)")
