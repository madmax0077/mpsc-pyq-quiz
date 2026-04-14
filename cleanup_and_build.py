import json
import os

base_dir = os.path.dirname(os.path.abspath(__file__))

# Read existing quizzes.json
with open(os.path.join(base_dir, "public", "quizzes.json"), "r", encoding="utf-8") as f:
    quizzes = json.load(f)

# Keep only non-topicOnly quizzes
kept = [q for q in quizzes if not q.get("topicOnly", False)]
print(f"Removed {len(quizzes) - len(kept)} topicOnly quizzes, kept {len(kept)} regular quizzes")

# Save cleaned quizzes
with open(os.path.join(base_dir, "public", "quizzes.json"), "w", encoding="utf-8") as f:
    json.dump(kept, f, ensure_ascii=False, indent=2)

# Clear topics.json
with open(os.path.join(base_dir, "public", "topics.json"), "w", encoding="utf-8") as f:
    json.dump([], f, ensure_ascii=False, indent=2)

print("Cleanup complete! topics.json cleared, topicOnly quizzes removed.")
