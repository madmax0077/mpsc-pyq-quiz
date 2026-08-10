"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  ADMIN_PUBLIC_NAME,
  createFeedbackComment,
  createFeedbackPost,
  deleteFeedbackComment,
  deleteFeedbackPost,
  formatFeedbackTime,
  subscribeFeedbackComments,
  subscribeFeedbackPosts,
  type FeedbackComment,
  type FeedbackPost,
} from "@/lib/feedback";

export default function FeedbackBoard() {
  const { loading, studentUser, isAdmin } = useAuth();
  const [posts, setPosts] = useState<FeedbackPost[]>([]);
  const [loadError, setLoadError] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [formError, setFormError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  // Signed-in aspirant OR allow-listed admin may post/comment.
  const canWrite = Boolean(studentUser || isAdmin);
  const writer = studentUser
    ? {
        uid: studentUser.uid,
        name: studentUser.displayName || "Aspirant",
        photo: studentUser.photoURL,
      }
    : null;

  useEffect(() => {
    return subscribeFeedbackPosts(setPosts, (err) => {
      console.warn("[feedback]", err);
      setLoadError("Could not load feedback. Please refresh, or deploy Firestore rules for feedback_posts.");
    });
  }, []);

  const submitPostSafe = async () => {
    const { auth } = await import("@/lib/firebase");
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setFormError("Please sign in to post feedback.");
      return;
    }
    setPosting(true);
    setFormError("");
    try {
      await createFeedbackPost({
        uid,
        displayName: isAdmin && !studentUser ? ADMIN_PUBLIC_NAME : writer?.name || "Aspirant",
        photoURL: writer?.photo,
        title,
        body,
      });
      setTitle("");
      setBody("");
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Could not post");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Back to home"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Feedback</h1>
          </div>
          <Link
            href="/donate"
            className="shrink-0 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800 ring-1 ring-amber-200 hover:bg-amber-200 dark:bg-amber-950/50 dark:text-amber-200 dark:ring-amber-800"
          >
            ☕ Coffee
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-5 px-4 py-8 sm:px-6">
        <section className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/50 p-5 dark:border-amber-900/40 dark:from-amber-950/30 dark:to-orange-950/20 sm:p-6">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Leave a kind note</h2>
          <p className="mt-2 rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 text-xs leading-5 text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
            Found a problem with a question (wrong answer, typo, unclear option)? Please use the{" "}
            <strong>Report</strong> button on that question in the quiz — not this page — so we can fix it faster.
          </p>

          {loading ? (
            <p className="mt-4 text-sm text-slate-400">Checking sign-in…</p>
          ) : !canWrite ? (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="inline-flex rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
              >
                Sign in to post
              </Link>
              <span className="text-xs text-slate-500">Guests can still read posts below.</span>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short title (optional)"
                maxLength={120}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Cheer us on with a short note — what made practice easier today? Suggestions welcome…"
                rows={4}
                maxLength={2000}
                className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
              {formError && <p className="text-sm text-red-500">{formError}</p>}
              <button
                type="button"
                disabled={posting || body.trim().length < 3}
                onClick={() => void submitPostSafe()}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {posting ? "Posting…" : "Post feedback"}
              </button>
            </div>
          )}
        </section>

        {loadError && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
            {loadError}
          </p>
        )}

        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              expanded={expanded === post.id}
              onToggle={() => setExpanded((id) => (id === post.id ? null : post.id))}
              canWrite={canWrite}
              isAdmin={isAdmin}
              writerName={writer?.name || (isAdmin ? ADMIN_PUBLIC_NAME : "")}
              writerPhoto={writer?.photo}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

function PostCard({
  post,
  expanded,
  onToggle,
  canWrite,
  isAdmin,
  writerName,
  writerPhoto,
}: {
  post: FeedbackPost;
  expanded: boolean;
  onToggle: () => void;
  canWrite: boolean;
  isAdmin: boolean;
  writerName: string;
  writerPhoto?: string | null;
}) {
  const [comments, setComments] = useState<FeedbackComment[]>([]);
  const [reply, setReply] = useState("");
  const [asAdmin, setAsAdmin] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingPost, setDeletingPost] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    return subscribeFeedbackComments(post.id, setComments);
  }, [expanded, post.id]);

  const send = async () => {
    const { auth } = await import("@/lib/firebase");
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setErr("Please sign in to comment");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      await createFeedbackComment({
        postId: post.id,
        uid,
        displayName: writerName || "Aspirant",
        photoURL: writerPhoto,
        body: reply,
        asAdmin: isAdmin && asAdmin,
      });
      setReply("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not comment");
    } finally {
      setBusy(false);
    }
  };

  const removeComment = async (commentId: string) => {
    if (!isAdmin) return;
    if (!window.confirm("Delete this comment? This cannot be undone.")) return;
    setDeletingId(commentId);
    setErr("");
    try {
      await deleteFeedbackComment(post.id, commentId);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not delete comment");
    } finally {
      setDeletingId(null);
    }
  };

  const removePost = async () => {
    if (!isAdmin) return;
    if (!window.confirm("Delete this entire post and hide it from the board?")) return;
    setDeletingPost(true);
    setErr("");
    try {
      await deleteFeedbackPost(post.id);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not delete post");
      setDeletingPost(false);
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          {post.authorPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.authorPhoto} alt="" className="h-9 w-9 rounded-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
              {(post.authorName || "?").slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{post.authorName}</p>
              <p className="text-[11px] text-slate-400">{formatFeedbackTime(post.createdAt)}</p>
              {isAdmin && (
                <button
                  type="button"
                  disabled={deletingPost}
                  onClick={() => void removePost()}
                  className="ml-auto text-[11px] font-semibold text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
                >
                  {deletingPost ? "Deleting…" : "Delete post"}
                </button>
              )}
            </div>
            {post.title && (
              <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-50">{post.title}</h3>
            )}
            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {post.body}
            </p>
            <button
              type="button"
              onClick={onToggle}
              className="mt-3 text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              {expanded ? "Hide replies" : "Thanks & replies"}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-4 dark:border-slate-700 dark:bg-slate-900/40 sm:px-5">
          <ul className="space-y-3">
            {comments.length === 0 && (
              <li className="text-xs text-slate-400">No comments yet — start the thread.</li>
            )}
            {comments.map((c) => (
              <li key={c.id} className="flex gap-2.5">
                {c.isAdminReply ? (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-white">
                    DNA
                  </div>
                ) : c.authorPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.authorPhoto} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {(c.authorName || "?").slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200/80 dark:bg-slate-800 dark:ring-slate-700">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={`text-xs font-bold ${c.isAdminReply ? "text-amber-700 dark:text-amber-300" : "text-slate-700 dark:text-slate-200"}`}>
                      {c.authorName}
                    </p>
                    {c.isAdminReply && (
                      <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                        Official
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">{formatFeedbackTime(c.createdAt)}</span>
                    {isAdmin && (
                      <button
                        type="button"
                        disabled={deletingId === c.id}
                        onClick={() => void removeComment(c.id)}
                        className="ml-auto text-[10px] font-semibold text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
                      >
                        {deletingId === c.id ? "Deleting…" : "Delete"}
                      </button>
                    )}
                  </div>
                  <p className="mt-0.5 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{c.body}</p>
                </div>
              </li>
            ))}
          </ul>

          {canWrite ? (
            <div className="mt-4 space-y-2">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={2}
                maxLength={1000}
                placeholder="Add a kind reply or thanks…"
                className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
              {isAdmin && (
                <label className="flex items-center gap-2 text-xs font-medium text-amber-800 dark:text-amber-200">
                  <input
                    type="checkbox"
                    checked={asAdmin}
                    onChange={(e) => setAsAdmin(e.target.checked)}
                    className="rounded border-amber-300"
                  />
                  Reply as {ADMIN_PUBLIC_NAME} (official)
                </label>
              )}
              {err && <p className="text-xs text-red-500">{err}</p>}
              <button
                type="button"
                disabled={busy || !reply.trim()}
                onClick={() => void send()}
                className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-bold text-white hover:bg-slate-900 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-700"
              >
                {busy ? "Sending…" : asAdmin && isAdmin ? "Post official reply" : "Reply"}
              </button>
            </div>
          ) : (
            <p className="mt-3 text-xs text-slate-500">
              <Link href="/login" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
                Sign in
              </Link>{" "}
              to leave a kind reply.
            </p>
          )}
        </div>
      )}
    </article>
  );
}
