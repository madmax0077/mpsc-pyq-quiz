import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open("public/topics.json", "r", encoding="utf-8") as f:
    topics = json.load(f)

print(f"Total topics: {len(topics)}")
for i, t in enumerate(topics):
    print(f"  {i+1}. {t['name']} ({len(t['questionIds'])} questions)")

with open("public/quizzes.json", "r", encoding="utf-8") as f:
    quizzes = json.load(f)

topic_quizzes = [q for q in quizzes if q.get("topicOnly")]
regular_quizzes = [q for q in quizzes if not q.get("topicOnly")]
total_topic_qs = sum(len(q["questions"]) for q in topic_quizzes)

print(f"\nTotal quizzes: {len(quizzes)}")
print(f"Topic quizzes: {len(topic_quizzes)}")
print(f"Regular quizzes: {len(regular_quizzes)}")
print(f"Total topic questions: {total_topic_qs}")
