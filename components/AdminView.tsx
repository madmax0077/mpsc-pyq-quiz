"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Quiz, Question, ParsedQuestion, OptionKey, CATEGORIES, Category, Language, SubjectTopics } from "@/lib/types";
import { normalizeQuiz, normalizeQuestion } from "@/lib/questionUtils";
import {
  saveQuiz,
  getAllQuizzes,
  deleteQuiz,
  importQuizzes,
  getSubjectTopics,
  saveSubjectTopics,
  getExcludedBundledQuizIds,
  excludeBundledQuizId,
  unexcludeBundledQuizId,
} from "@/lib/storage";
import { mergeBundledAndLocal } from "@/lib/quizCatalog";
import { useAuth } from "@/lib/auth-context";
import FileUploader from "./FileUploader";
import QuestionForm from "./QuestionForm";
import SearchBar, { type SearchNavigatePayload } from "./SearchBar";

function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

function emptyQuestion(): Question {
  return {
    id: uid(),
    text: "",
    options: { A: "", B: "", C: "", D: "" },
    correctAnswer: "A" as OptionKey,
    cancelled: false,
    explanation: "",
  };
}

const CATEGORY_ICONS: Record<Category, string> = {
  "Indian Polity": "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z",
  History: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
  Geography: "M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 01-1.383-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 01-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 01-1.458-1.137l1.411-2.353a2.25 2.25 0 00.286-.76M11.25 2.5c3.083.307 5.768 1.934 7.393 4.393M15.75 21H5.25A2.25 2.25 0 013 18.75V5.25A2.25 2.25 0 015.25 3h1.5",
  Science: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5",
  "Current Affairs": "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z",
  Economics: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z",
  Aptitude: "M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z",
  English: "M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802",
  Marathi: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  Environment: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z",
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
  // Subject-topic registry (new tag-based system)
  const [subjectTopics, setSubjectTopics] = useState<SubjectTopics>({});
  const [showTopicManager, setShowTopicManager] = useState(false);
  const [stManageCat, setStManageCat] = useState<Category | "">("");
  const [stNewTopic, setStNewTopic] = useState("");
  // Bulk topic assignment
  const [bulkTopic, setBulkTopic] = useState("");
  const [bundledQuizzes, setBundledQuizzes] = useState<Quiz[]>([]);
  const [scrollToQuestionId, setScrollToQuestionId] = useState<string | null>(null);
  /** Bumps when bundled export-exclusion list changes so lists refresh. */
  const [exclusionVersion, setExclusionVersion] = useState(0);

  type AdminConfirmAction =
    | { kind: "delete-saved"; id: string; title: string }
    | { kind: "remove-override"; id: string; title: string }
    | { kind: "exclude-bundled"; id: string; title: string };

  const [confirmAction, setConfirmAction] = useState<AdminConfirmAction | null>(null);

  const reloadBundledQuizzes = useCallback(() => {
    fetch("/quizzes.json", { cache: "no-store" })
      .then((r) => r.json())
      .then((raw: Quiz[]) => {
        if (Array.isArray(raw)) setBundledQuizzes(raw.filter((q) => q.id !== "__copyright__").map(normalizeQuiz));
      })
      .catch(() => {});
    setSavedQuizzes(getAllQuizzes());
  }, []);

  useEffect(() => {
    setSavedQuizzes(getAllQuizzes());
    setSubjectTopics(getSubjectTopics());
    reloadBundledQuizzes();
  }, [reloadBundledQuizzes]);

  /** When Firestore `settings/quiz_data.revision` changes, all clients should refetch quizzes.json. */
  useEffect(() => {
    let unsub: (() => void) | undefined;
    let cancelled = false;
    import("@/lib/firebase")
      .then((m) => {
        if (cancelled || !m.subscribeQuizDataRevision) return;
        unsub = m.subscribeQuizDataRevision(() => {
          reloadBundledQuizzes();
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      unsub?.();
    };
  }, [reloadBundledQuizzes]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleExtracted = (parsed: ParsedQuestion[]) => {
    const newQs: Question[] = parsed.map((p) =>
      normalizeQuestion({
        id: uid(),
        text: p.text,
        options: p.options,
        correctAnswer: "A" as OptionKey,
        cancelled: false,
        explanation: "",
        imageUrl: p.imageUrl,
      }),
    );
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
      questions: valid.map((q) => normalizeQuestion(q)),
      language: quizLanguage,
      tag: quizTag.trim() || undefined,
    };
    saveQuiz(quiz);
    setSavedQuizzes(getAllQuizzes());
    const overridesBundled = bundledQuizzes.some((q) => q.id === quiz.id);
    if (editingId) {
      showToast(
        overridesBundled
          ? "Quiz updated. Practice mode on this device will use your edited version."
          : "Quiz updated!",
      );
    } else {
      showToast("Quiz saved!");
    }
    setTitle("");
    setQuestions([]);
    setEditingId(null);
    setQuizLanguage("english");
    setQuizTag("");
  };

  const handleEdit = (quiz: Quiz) => {
    setTitle(quiz.title);
    setQuestions(quiz.questions.map((q) => normalizeQuestion(q)));
    setEditingId(quiz.id);
    setQuizLanguage(quiz.language || "english");
    setQuizTag(quiz.tag || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const runConfirmedAction = () => {
    if (!confirmAction) return;
    const a = confirmAction;
    setConfirmAction(null);

    if (a.kind === "exclude-bundled") {
      if (!excludeBundledQuizId(a.id)) {
        showToast("Could not update list. Allow site data / local storage.");
        return;
      }
      setExclusionVersion((v) => v + 1);
      if (editingId === a.id) {
        setTitle("");
        setQuestions([]);
        setEditingId(null);
        setQuizLanguage("english");
        setQuizTag("");
      }
      showToast("Paper removed from export list. Export quizzes.json and replace in repo when ready.");
      return;
    }

    if (!deleteQuiz(a.id)) {
      showToast("Could not delete. Allow site data / local storage, or free disk space.");
      return;
    }
    setSavedQuizzes(getAllQuizzes());
    if (editingId === a.id) {
      setTitle("");
      setQuestions([]);
      setEditingId(null);
      setQuizLanguage("english");
      setQuizTag("");
    }
    showToast(
      a.kind === "remove-override"
        ? "Local copy removed — bundled paper is used again in Practice."
        : "Question paper deleted from this browser.",
    );
  };

  const handleExport = () => {
    if (bundledQuizzes.length === 0) {
      showToast("Question bank is still loading — wait a moment, then export again.");
      return;
    }
    const catalog = mergeBundledAndLocal(bundledQuizzes, getAllQuizzes(), {
      excludeBundledIds: getExcludedBundledQuizIds(),
    });
    const json = JSON.stringify(catalog, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quizzes.json";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded quizzes.json — replace public/quizzes.json, then push.");
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
        reloadBundledQuizzes();
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

  const topicsForCurrentCategory = useMemo(() => {
    const result: Record<string, string[]> = {};
    for (const cat of CATEGORIES) {
      result[cat] = subjectTopics[cat] || [];
    }
    return result;
  }, [subjectTopics]);

  const handleAddSubjectTopic = () => {
    if (!stManageCat || !stNewTopic.trim()) return;
    const updated = { ...subjectTopics };
    const list = updated[stManageCat] || [];
    const name = stNewTopic.trim();
    if (list.includes(name)) {
      showToast("This topic already exists.");
      return;
    }
    updated[stManageCat] = [...list, name];
    saveSubjectTopics(updated);
    setSubjectTopics(updated);
    setStNewTopic("");
    showToast(`Added "${name}" to ${stManageCat}.`);
  };

  const handleRemoveSubjectTopic = (cat: string, topicName: string) => {
    if (!confirm(`Remove topic "${topicName}" from ${cat}? Questions tagged with it will keep the tag.`)) return;
    const updated = { ...subjectTopics };
    updated[cat] = (updated[cat] || []).filter((t) => t !== topicName);
    if (updated[cat].length === 0) delete updated[cat];
    saveSubjectTopics(updated);
    setSubjectTopics(updated);
    showToast(`Removed "${topicName}" from ${cat}.`);
  };

  const applyBulkTopic = () => {
    if (!bulkTopic) return;
    setQuestions((prev) =>
      prev.map((q) => (q.category && !q.topic ? { ...q, topic: bulkTopic } : q)),
    );
    showToast(`Applied topic "${bulkTopic}" to all questions without a topic.`);
    setBulkTopic("");
  };

  const availableBulkTopics = useMemo(() => {
    const cats = new Set(questions.map((q) => q.category).filter(Boolean));
    const all: string[] = [];
    for (const cat of cats) {
      for (const t of (subjectTopics[cat!] || [])) {
        if (!all.includes(t)) all.push(t);
      }
    }
    return all;
  }, [questions, subjectTopics]);

  /** Saved copies that override a bundled paper (same quiz id in localStorage). */
  const savedQuizIds = useMemo(() => new Set(savedQuizzes.map((q) => q.id)), [savedQuizzes]);

  const excludedBundledIds = useMemo(() => {
    void exclusionVersion;
    return getExcludedBundledQuizIds();
  }, [exclusionVersion]);

  const visibleBundledQuizzes = useMemo(
    () => bundledQuizzes.filter((q) => !excludedBundledIds.has(q.id)),
    [bundledQuizzes, excludedBundledIds],
  );

  const excludedBundledQuizzes = useMemo(
    () => bundledQuizzes.filter((q) => excludedBundledIds.has(q.id)),
    [bundledQuizzes, excludedBundledIds],
  );

  const quizById = useMemo(() => {
    const map = new Map<string, Quiz>();
    for (const q of savedQuizzes) map.set(q.id, q);
    for (const q of bundledQuizzes) {
      if (!map.has(q.id)) map.set(q.id, q);
    }
    return map;
  }, [savedQuizzes, bundledQuizzes]);

  const allSearchableQuestions = useMemo(() => {
    const result: { question: Question; quizTitle: string; quizId: string }[] = [];
    for (const quiz of quizById.values()) {
      const tag = quiz.tag || quiz.title;
      for (const q of quiz.questions) {
        result.push({ question: q, quizTitle: tag, quizId: quiz.id });
      }
    }
    return result;
  }, [quizById]);

  const handleSearchNavigate = useCallback(
    (payload: SearchNavigatePayload) => {
      const quiz = quizById.get(payload.quizId);
      if (!quiz) return;
      setTitle(quiz.title);
      setQuestions(quiz.questions.map((q) => normalizeQuestion(q)));
      setEditingId(quiz.id);
      setQuizLanguage(quiz.language || "english");
      setQuizTag(quiz.tag || "");
      setScrollToQuestionId(payload.question.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [quizById],
  );

  useEffect(() => {
    if (!scrollToQuestionId || questions.length === 0) return;
    const timer = setTimeout(() => {
      const el = document.querySelector(`[data-question-id="${scrollToQuestionId}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-indigo-400", "ring-offset-2");
        setTimeout(() => el.classList.remove("ring-2", "ring-indigo-400", "ring-offset-2"), 3000);
      }
      setScrollToQuestionId(null);
    }, 400);
    return () => clearTimeout(timer);
  }, [scrollToQuestionId, questions]);

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

      {confirmAction && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-confirm-title"
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-600 dark:bg-slate-800">
            <h3 id="admin-confirm-title" className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {confirmAction.kind === "exclude-bundled"
                ? "Remove from export file?"
                : confirmAction.kind === "remove-override"
                  ? "Remove saved copy?"
                  : "Delete question paper?"}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {confirmAction.kind === "exclude-bundled" && (
                <>
                  <span className="font-medium text-slate-800 dark:text-slate-100">«{confirmAction.title}»</span> will be
                  omitted from the next <span className="font-mono text-xs">Export</span> download. Replace{" "}
                  <span className="font-mono text-xs">public/quizzes.json</span> with that file and push so it disappears
                  for everyone. After deploy, increment Firestore{" "}
                  <span className="font-mono text-xs">settings/quiz_data.revision</span> so open apps refetch the bundle.
                </>
              )}
              {confirmAction.kind === "remove-override" && (
                <>
                  Remove your saved copy of{" "}
                  <span className="font-medium text-slate-800 dark:text-slate-100">«{confirmAction.title}»</span>? Practice
                  will use the built-in bundled version again for this device.
                </>
              )}
              {confirmAction.kind === "delete-saved" && (
                <>
                  Permanently delete{" "}
                  <span className="font-medium text-slate-800 dark:text-slate-100">«{confirmAction.title}»</span> from this
                  browser? This cannot be undone.
                </>
              )}
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={runConfirmedAction}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
              >
                {confirmAction.kind === "remove-override"
                  ? "Remove"
                  : confirmAction.kind === "exclude-bundled"
                    ? "Remove from export"
                    : "Delete paper"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search across all quizzes */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Admin Dashboard</h2>
        <SearchBar
          allQuestions={allSearchableQuestions}
          onNavigateToQuestion={handleSearchNavigate}
          navigateLabel={(p) => `Edit in "${p.quizTitle}"`}
        />
      </div>

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

      {/* Bulk Category + Topic + Question Count Divider */}
      {questions.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {questions.length} Question{questions.length !== 1 ? "s" : ""}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {questions.filter((q) => q.category).length} categorized
                {" · "}
                {questions.filter((q) => q.topic).length} with topic
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
          {availableBulkTopics.length > 0 && (
            <div className="flex flex-wrap items-center justify-end gap-2">
              <select
                value={bulkTopic}
                onChange={(e) => setBulkTopic(e.target.value)}
                className="rounded-lg border border-violet-200 px-3 py-1.5 text-sm text-violet-600 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 dark:bg-slate-700 dark:border-violet-600 dark:text-violet-300"
              >
                <option value="">Bulk assign topic...</option>
                {availableBulkTopics.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <button
                onClick={applyBulkTopic}
                disabled={!bulkTopic}
                className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={q.id} data-question-id={q.id}>
            <QuestionForm
              index={i}
              question={q}
              onChange={(updated) => updateQuestion(q.id, updated)}
              onDelete={() => removeQuestion(q.id)}
              availableTopics={q.category ? (topicsForCurrentCategory[q.category] || []) : []}
            />
          </div>
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

      {/* Saved question papers (this browser only) */}
      <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Saved question papers
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700"
                title="Full catalog: bundled papers + your saved edits (use as public/quizzes.json)"
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
          {savedQuizzes.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50/80 px-4 py-6 text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-800/40 dark:text-slate-400">
              No papers saved in this browser yet. Upload a PDF or image above, or open a bundled paper with Edit and save — it will appear here. Use{" "}
              <span className="font-medium text-slate-700 dark:text-slate-300">Delete paper</span> on a card to remove it from this device only.
            </p>
          ) : (
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
                      <div className="flex flex-col gap-1 shrink-0 sm:flex-row sm:items-center">
                        <button
                          type="button"
                          onClick={() => handleEdit(quiz)}
                          className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 transition-colors dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                          title="Edit paper"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmAction({ kind: "delete-saved", id: quiz.id, title: quiz.title })}
                          className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors dark:border-red-800 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/30"
                          title="Delete this paper from this browser"
                        >
                          <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      {/* Bundled Quizzes (from quizzes.json) */}
      {bundledQuizzes.length > 0 && (
        <div>
          <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
            Bundled Question Papers
            <span className="ml-2 text-xs font-normal text-slate-400 dark:text-slate-500">
              ({bundledQuizzes.length} papers from quizzes.json)
            </span>
          </h3>
          <p className="mb-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Live refresh for all users: after you deploy an updated{" "}
            <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">quizzes.json</span>, increment{" "}
            <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">settings/quiz_data.revision</span>{" "}
            in Firestore after each deploy.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {visibleBundledQuizzes.map((quiz) => {
              const cats = [...new Set(quiz.questions.map((q) => q.category).filter(Boolean))];
              return (
                <div
                  key={quiz.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:bg-slate-800 dark:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 truncate dark:text-slate-100">{quiz.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {quiz.questions.length} question{quiz.questions.length !== 1 ? "s" : ""}
                        {quiz.language === "marathi" && (
                          <span className="ml-1.5 inline-block rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-semibold text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">मराठी</span>
                        )}
                        {quiz.language === "english" && (
                          <span className="ml-1.5 inline-block rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">English</span>
                        )}
                        {quiz.tag && (
                          <span className="ml-1.5 inline-block rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">{quiz.tag}</span>
                        )}
                      </p>
                      {cats.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {cats.slice(0, 5).map((cat) => (
                            <span
                              key={cat}
                              className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                            >
                              {cat}
                            </span>
                          ))}
                          {cats.length > 5 && (
                            <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400 dark:bg-slate-700 dark:text-slate-500">
                              +{cats.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center">
                      <button
                        type="button"
                        onClick={() => handleEdit(quiz)}
                        className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 transition-colors dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                        title="Load into editor — Save writes to this browser and overrides the bundled paper in Practice until you clear site data"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          savedQuizIds.has(quiz.id)
                            ? setConfirmAction({ kind: "remove-override", id: quiz.id, title: quiz.title })
                            : setConfirmAction({ kind: "exclude-bundled", id: quiz.id, title: quiz.title })
                        }
                        className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1.5 text-[10px] font-semibold text-red-700 hover:bg-red-100 transition-colors dark:border-red-800 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/30"
                        title={
                          savedQuizIds.has(quiz.id)
                            ? "Remove your saved copy for this device"
                            : "Remove from next Export (quizzes.json); then replace in repo for everyone"
                        }
                      >
                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Remove
                      </button>
                      <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                        Bundled
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {excludedBundledQuizzes.length > 0 && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-800 dark:bg-amber-950/30">
              <p className="mb-3 text-sm font-semibold text-amber-900 dark:text-amber-200">
                Excluded from next export ({excludedBundledQuizzes.length})
              </p>
              <ul className="space-y-2">
                {excludedBundledQuizzes.map((q) => (
                  <li key={q.id} className="flex items-center justify-between gap-2 text-sm text-slate-800 dark:text-slate-200">
                    <span className="truncate">{q.title}</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (unexcludeBundledQuizId(q.id)) {
                          setExclusionVersion((v) => v + 1);
                          showToast("Paper included in export again.");
                        }
                      }}
                      className="shrink-0 text-xs font-semibold text-indigo-700 hover:underline dark:text-indigo-400"
                    >
                      Restore
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Subject Topics Management */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <button
          onClick={() => setShowTopicManager(!showTopicManager)}
          className="flex w-full items-center justify-between px-6 py-4 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Manage Subject Topics</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {Object.values(subjectTopics).flat().length} topic{Object.values(subjectTopics).flat().length !== 1 ? "s" : ""} across {Object.keys(subjectTopics).length} subject{Object.keys(subjectTopics).length !== 1 ? "s" : ""} &middot; Tag questions for Topic Wise practice
              </p>
            </div>
          </div>
          <svg className={`h-5 w-5 text-slate-400 transition-transform ${showTopicManager ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {showTopicManager && (
          <div className="border-t border-slate-100 px-6 pb-5 pt-4 space-y-5 dark:border-slate-700">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Add Topic to a Subject</h4>
              <select
                value={stManageCat}
                onChange={(e) => setStManageCat(e.target.value as Category | "")}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-600 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"
              >
                <option value="">Select a subject...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat} ({(subjectTopics[cat] || []).length} topics)</option>
                ))}
              </select>

              {stManageCat && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={stNewTopic}
                      onChange={(e) => setStNewTopic(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleAddSubjectTopic(); }}
                      placeholder={`New topic for ${stManageCat} (e.g. British Rule, Newton's Laws)`}
                      className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                    <button
                      onClick={handleAddSubjectTopic}
                      disabled={!stNewTopic.trim()}
                      className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  {(subjectTopics[stManageCat] || []).length > 0 && (
                    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-600">
                      <p className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Topics in {stManageCat} ({(subjectTopics[stManageCat] || []).length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(subjectTopics[stManageCat] || []).map((topicName) => (
                          <span
                            key={topicName}
                            className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/20 dark:border-violet-700 dark:text-violet-300"
                          >
                            {topicName}
                            <button
                              onClick={() => handleRemoveSubjectTopic(stManageCat, topicName)}
                              className="rounded-full p-0.5 text-violet-400 hover:bg-violet-200 hover:text-violet-700 transition-colors dark:hover:bg-violet-800 dark:hover:text-violet-200"
                            >
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Summary of all subjects with topics */}
            {Object.keys(subjectTopics).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">All Subject Topics</h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {CATEGORIES.filter((cat) => (subjectTopics[cat] || []).length > 0).map((cat) => (
                    <div
                      key={cat}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:bg-slate-700/50 dark:border-slate-600"
                    >
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{cat}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {(subjectTopics[cat] || []).map((t) => (
                          <span key={t} className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:bg-slate-700/30 dark:border-slate-600">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold">How it works:</span> Create topic names here, then tag each question with a topic using the dropdown in the question editor above. Students will see these topics in Topic Wise practice mode.
              </p>
            </div>
          </div>
        )}
      </div>

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
