"use client";

import { Question, OptionKey, CATEGORIES, Category, TOPIC_TAGS } from "@/lib/types";

const OPTION_KEYS: OptionKey[] = ["A", "B", "C", "D"];

const CATEGORY_COLORS: Record<Category, { bg: string; text: string; border: string; ring: string }> = {
  "Indian Polity":    { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    ring: "ring-blue-100" },
  History:   { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   ring: "ring-amber-100" },
  Geography: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", ring: "ring-emerald-100" },
  Science:   { bg: "bg-purple-50",  text: "text-purple-700",  border: "border-purple-200",  ring: "ring-purple-100" },
  "Current Affairs": { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200", ring: "ring-pink-100" },
  Economics: { bg: "bg-teal-50",    text: "text-teal-700",    border: "border-teal-200",    ring: "ring-teal-100" },
  Aptitude:  { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200",  ring: "ring-orange-100" },
  English:   { bg: "bg-cyan-50",    text: "text-cyan-700",    border: "border-cyan-200",    ring: "ring-cyan-100" },
  Marathi:   { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200",    ring: "ring-rose-100" },
  Environment: { bg: "bg-lime-50",  text: "text-lime-700",    border: "border-lime-200",    ring: "ring-lime-100" },
};

interface Props {
  index: number;
  question: Question;
  onChange: (updated: Question) => void;
  onDelete: () => void;
}

export default function QuestionForm({ index, question, onChange, onDelete }: Props) {
  const update = (patch: Partial<Question>) => {
    onChange({ ...question, ...patch });
  };

  const updateOption = (key: OptionKey, value: string) => {
    onChange({
      ...question,
      options: { ...question.options, [key]: value },
    });
  };

  const catColor = question.category ? CATEGORY_COLORS[question.category] : null;

  return (
    <div className="animate-fade-in rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:bg-slate-800 dark:border-slate-700">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-5 py-3 dark:border-slate-700 dark:bg-slate-800/60">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
            Q{index + 1}
          </span>
          {question.category && catColor && (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${catColor.bg} ${catColor.text} ${catColor.border} border`}>
              {question.category}
            </span>
          )}
          {question.topicTag && (
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200">
              {question.topicTag}
            </span>
          )}
        </div>
        <button
          onClick={onDelete}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          title="Delete question"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Question text */}
        <textarea
          value={question.text}
          onChange={(e) => update({ text: e.target.value })}
          placeholder="Enter the question text..."
          rows={2}
          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500"
        />

        {/* Diagram image */}
        {question.imageUrl && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 dark:bg-slate-700 dark:border-slate-600">
            <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">Diagram / Figure (from PDF page)</p>
            <img
              src={question.imageUrl}
              alt="Question diagram"
              className="max-h-72 w-full rounded object-contain"
            />
            <button
              onClick={() => update({ imageUrl: undefined })}
              className="mt-1 text-xs text-red-500 hover:text-red-700"
            >
              Remove image
            </button>
          </div>
        )}

        {/* Options */}
        <div className="grid gap-3 sm:grid-cols-2">
          {OPTION_KEYS.map((key) => (
            <div key={key} className="flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {key}
              </span>
              <input
                type="text"
                value={question.options[key]}
                onChange={(e) => updateOption(key, e.target.value)}
                placeholder={`Option ${key}`}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>
          ))}
        </div>

        {/* Correct Answer + Category + Topic — grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Correct Answer */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Correct Answer
            </label>
            <div className="flex gap-2">
              {OPTION_KEYS.map((key) => (
                <label
                  key={key}
                  className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                    question.correctAnswer === key
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-600"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    value={key}
                    checked={question.correctAnswer === key}
                    onChange={() => update({ correctAnswer: key })}
                    className="sr-only"
                  />
                  {key}
                </label>
              ))}
            </div>
          </div>

          {/* Category (Subject Tag) */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Subject Tag
            </label>
            <select
              value={question.category || ""}
              onChange={(e) => {
                const newCat = (e.target.value || undefined) as Category | undefined;
                const patch: Partial<Question> = { category: newCat };
                if (newCat !== question.category) patch.topicTag = undefined;
                update(patch);
              }}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
                question.category && catColor
                  ? `${catColor.border} ${catColor.bg} ${catColor.text} focus:${catColor.ring}`
                  : "border-slate-200 text-slate-600 focus:border-indigo-400 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
              }`}
            >
              <option value="">No subject</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Topic Tag (dependent on Subject) */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Topic Tag {!question.category && <span className="text-slate-400 normal-case">(select subject first)</span>}
            </label>
            <select
              value={question.topicTag || ""}
              onChange={(e) => update({ topicTag: e.target.value || undefined })}
              disabled={!question.category || (question.category ? TOPIC_TAGS[question.category].length === 0 : true)}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
                !question.category
                  ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed dark:border-slate-600 dark:bg-slate-800 dark:text-slate-500"
                  : question.topicTag
                    ? "border-violet-300 bg-violet-50 text-violet-700 focus:ring-violet-100 dark:border-violet-600 dark:bg-violet-900/20 dark:text-violet-300"
                    : "border-slate-200 text-slate-600 focus:border-violet-400 focus:ring-violet-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
              }`}
            >
              <option value="">
                {!question.category
                  ? "Select subject first..."
                  : question.category && TOPIC_TAGS[question.category].length === 0
                    ? `No topics defined for ${question.category}`
                    : "No topic"}
              </option>
              {question.category && TOPIC_TAGS[question.category].map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Explanation */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Explanation (optional)
          </label>
          <textarea
            value={question.explanation}
            onChange={(e) => update({ explanation: e.target.value })}
            placeholder="Explain why this is the correct answer..."
            rows={2}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
      </div>
    </div>
  );
}
