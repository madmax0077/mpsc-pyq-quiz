"use client";

import { useState, useEffect } from "react";
import { Quiz, Question, ParsedQuestion, OptionKey, CATEGORIES, Category, Language } from "@/lib/types";
import { saveQuiz, getAllQuizzes, deleteQuiz, exportQuizzes, importQuizzes } from "@/lib/storage";
import { useAuth } from "@/lib/auth-context";
import FileUploader from "./FileUploader";
import QuestionForm from "./QuestionForm";

function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

function emptyQuestion(): Question {
  return {
    id: uid(),
    text: "",
    options: { A: "", B: "", C: "", D: "" },
    correctAnswer: "A" as OptionKey,
    explanation: "",
  };
}

const CATEGORY_ICONS: Record<Category, string> = {
  Polity: "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z",
  History: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
  Geography: "M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 01-1.383-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 01-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 01-1.458-1.137l1.411-2.353a2.25 2.25 0 00.286-.76M11.25 2.5c3.083.307 5.768 1.934 7.393 4.393M15.75 21H5.25A2.25 2.25 0 013 18.75V5.25A2.25 2.25 0 015.25 3h1.5",
  Science: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5",
  "Current Affairs": "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z",
  Economics: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z",
  Aptitude: "M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z",
};

export default function AdminView() {
  const { changeAdminPassword } = useAuth();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [savedQuizzes, setSavedQuizzes] = useState<Quiz[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [bulkCategory, setBulkCategory] = useState<Category | "">("");
  const [quizLanguage, setQuizLanguage] = useState<Language>("english");
  const [quizTag, setQuizTag] = useState("");
  const [showChangePw, setShowChangePw] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  useEffect(() => {
    setSavedQuizzes(getAllQuizzes());
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleExtracted = (parsed: ParsedQuestion[]) => {
    const newQs: Question[] = parsed.map((p) => ({
      id: uid(),
      text: p.text,
      options: p.options,
      correctAnswer: "A" as OptionKey,
      explanation: "",
      imageUrl: p.imageUrl,
    }));
    setQuestions((prev) => [...prev, ...newQs]);
    showToast(`Extracted ${parsed.length} question(s)!`);
  };

  const addQuestion = () =>
    setQuestions((prev) => [...prev, emptyQuestion()]);

  const updateQuestion = (id: string, updated: Question) =>
    setQuestions((prev) => prev.map((q) => (q.id === id ? updated : q)));

  const removeQuestion = (id: string) =>
    setQuestions((prev) => prev.filter((q) => q.id !== id));

  const applyBulkCategory = () => {
    if (!bulkCategory) return;
    setQuestions((prev) =>
      prev.map((q) => (q.category ? q : { ...q, category: bulkCategory as Category })),
    );
    showToast(`Applied "${bulkCategory}" to all uncategorized questions.`);
    setBulkCategory("");
  };

  const handleSave = () => {
    if (!title.trim()) {
      showToast("Please enter a quiz title.");
      return;
    }
    const valid = questions.filter((q) => q.text.trim());
    if (valid.length === 0) {
      showToast("Add at least one question with text.");
      return;
    }

    const quiz: Quiz = {
      id: editingId || uid(),
      title: title.trim(),
      createdAt: new Date().toISOString(),
      questions: valid,
      language: quizLanguage,
      tag: quizTag.trim() || undefined,
    };
    saveQuiz(quiz);
    setSavedQuizzes(getAllQuizzes());
    showToast(editingId ? "Quiz updated!" : "Quiz saved!");
    setTitle("");
    setQuestions([]);
    setEditingId(null);
    setQuizLanguage("english");
    setQuizTag("");
  };

  const handleEdit = (quiz: Quiz) => {
    setTitle(quiz.title);
    setQuestions(quiz.questions);
    setEditingId(quiz.id);
    setQuizLanguage(quiz.language || "english");
    setQuizTag(quiz.tag || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteQuiz = (id: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    deleteQuiz(id);
    setSavedQuizzes(getAllQuizzes());
    if (editingId === id) {
      setTitle("");
      setQuestions([]);
      setEditingId(null);
    }
    showToast("Quiz deleted.");
  };

  const handleExport = () => {
    const json = exportQuizzes();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mpsc-pyq-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Backup downloaded!");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const count = importQuizzes(text);
        setSavedQuizzes(getAllQuizzes());
        showToast(`Imported ${count} new quiz(es). Existing quizzes updated.`);
      } catch {
        showToast("Import failed — invalid file format.");
      }
    };
    input.click();
  };

  const categoryCounts = savedQuizzes.reduce<Record<string, number>>((acc, quiz) => {
    for (const q of quiz.questions) {
      if (q.category) acc[q.category] = (acc[q.category] || 0) + 1;
    }
    return acc;
  }, {});

  const handleChangePassword = () => {
    if (!currentPw || !newPw || !confirmPw) {
      showToast("Please fill all password fields.");
      return;
    }
    if (newPw !== confirmPw) {
      showToast("New passwords do not match.");
      return;
    }
    const err = changeAdminPassword(currentPw, newPw);
    if (err) {
      showToast(err);
      return;
    }
    showToast("Password changed successfully!");
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setShowChangePw(false);
  };

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div className="animate-slide-up fixed bottom-6 right-6 z-50 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* Quiz Title + Language */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 dark:bg-slate-800 dark:border-slate-700">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Quiz Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. MPSC Prelims 2025 Set A"
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Quiz Language
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setQuizLanguage("english")}
              className={`flex-1 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all ${
                quizLanguage === "english"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-400"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setQuizLanguage("marathi")}
              className={`flex-1 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all ${
                quizLanguage === "marathi"
                  ? "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-400"
              }`}
            >
              मराठी (Marathi)
            </button>
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Paper Tag <span className="text-xs font-normal text-slate-400 dark:text-slate-500">(shown on each question in Practice by Subject)</span>
          </label>
          <input
            type="text"
            value={quizTag}
            onChange={(e) => setQuizTag(e.target.value)}
            placeholder="e.g. Group C 2024, Prelims 2025 Set A"
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* File Upload (Image + PDF) */}
      <FileUploader onQuestionsExtracted={handleExtracted} />

      {/* Bulk Category + Question Count Divider */}
      {questions.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:bg-slate-800 dark:border-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {questions.length} Question{questions.length !== 1 ? "s" : ""}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {questions.filter((q) => q.category).length} categorized
              </span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={bulkCategory}
                onChange={(e) => setBulkCategory(e.target.value as Category | "")}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"
              >
                <option value="">Bulk assign category...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                onClick={applyBulkCategory}
                disabled={!bulkCategory}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, i) => (
          <QuestionForm
            key={q.id}
            index={i}
            question={q}
            onChange={(updated) => updateQuestion(q.id, updated)}
            onDelete={() => removeQuestion(q.id)}
          />
        ))}
      </div>

      {/* Add / Save Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={addQuestion}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Question Manually
        </button>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          {editingId ? "Update Quiz" : "Save & Publish Quiz"}
        </button>

        {editingId && (
          <button
            onClick={() => {
              setTitle("");
              setQuestions([]);
              setEditingId(null);
              setQuizLanguage("english");
              setQuizTag("");
            }}
            className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* Category Stats */}
      {Object.keys(categoryCounts).length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Category-wise Questions (across all quizzes)
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CATEGORIES.map((cat) => {
              const count = categoryCounts[cat] || 0;
              if (count === 0) return null;
              return (
                <div
                  key={cat}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm dark:bg-slate-800 dark:border-slate-700"
                >
                  <svg className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={CATEGORY_ICONS[cat]} />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{cat}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{count} question{count !== 1 ? "s" : ""}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Saved Quizzes */}
      {savedQuizzes.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Saved Quizzes
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700"
                title="Download backup JSON"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Export
              </button>
              <button
                onClick={handleImport}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700"
                title="Import from backup JSON"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                Import
              </button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {savedQuizzes.map((quiz) => {
              const cats = [...new Set(quiz.questions.map((q) => q.category).filter(Boolean))];
              return (
                <div
                  key={quiz.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 truncate dark:text-slate-100">{quiz.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {quiz.questions.length} question{quiz.questions.length !== 1 ? "s" : ""} &middot;{" "}
                        {new Date(quiz.createdAt).toLocaleDateString()}
                        {quiz.language === "marathi" && (
                          <span className="ml-1.5 inline-block rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-semibold text-orange-600">मराठी</span>
                        )}
                        {quiz.tag && (
                          <span className="ml-1.5 inline-block rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-600">{quiz.tag}</span>
                        )}
                      </p>
                      {cats.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {cats.map((cat) => (
                            <span
                              key={cat}
                              className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleEdit(quiz)}
                        className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 transition-colors dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                        title="Edit"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition-colors dark:hover:bg-red-900/30"
                        title="Delete"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Change Password */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <button
          onClick={() => setShowChangePw(!showChangePw)}
          className="flex w-full items-center justify-between px-6 py-4 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Change Password</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Update your admin login credentials</p>
            </div>
          </div>
          <svg className={`h-5 w-5 text-slate-400 transition-transform ${showChangePw ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
        {showChangePw && (
          <div className="border-t border-slate-100 px-6 pb-5 pt-4 space-y-3 dark:border-slate-700">
            <input
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="Current password"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="New password (min 6 chars)"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="Confirm new password"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <button
              onClick={handleChangePassword}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Update Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
