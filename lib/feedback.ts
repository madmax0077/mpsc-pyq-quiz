/**
 * Community feedback board (Reddit-style posts + comments) backed by Firestore.
 *
 * Collections:
 *   feedback_posts/{id}
 *   feedback_posts/{id}/comments/{id}
 */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export const ADMIN_PUBLIC_NAME = "Don't know Academy";

export type FeedbackPost = {
  id: string;
  authorUid: string;
  authorName: string;
  authorPhoto: string | null;
  title: string;
  body: string;
  createdAt: Date | null;
};

export type FeedbackComment = {
  id: string;
  authorUid: string;
  authorName: string;
  authorPhoto: string | null;
  body: string;
  isAdminReply: boolean;
  createdAt: Date | null;
};

function asDate(value: Timestamp | null | undefined): Date | null {
  if (!value || typeof value.toDate !== "function") return null;
  return value.toDate();
}

function postsCol() {
  return collection(db, "feedback_posts");
}

function commentsCol(postId: string) {
  return collection(db, "feedback_posts", postId, "comments");
}

export function subscribeFeedbackPosts(
  onData: (posts: FeedbackPost[]) => void,
  onError?: (err: Error) => void,
): () => void {
  const q = query(postsCol(), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const posts: FeedbackPost[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          authorUid: String(data.authorUid || ""),
          authorName: String(data.authorName || "Aspirant"),
          authorPhoto: data.authorPhoto ? String(data.authorPhoto) : null,
          title: String(data.title || ""),
          body: String(data.body || ""),
          createdAt: asDate(data.createdAt as Timestamp | undefined),
        };
      });
      onData(posts);
    },
    (err) => onError?.(err),
  );
}

export function subscribeFeedbackComments(
  postId: string,
  onData: (comments: FeedbackComment[]) => void,
  onError?: (err: Error) => void,
): () => void {
  const q = query(commentsCol(postId), orderBy("createdAt", "asc"));
  return onSnapshot(
    q,
    (snap) => {
      const comments: FeedbackComment[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          authorUid: String(data.authorUid || ""),
          authorName: String(data.authorName || "Aspirant"),
          authorPhoto: data.authorPhoto ? String(data.authorPhoto) : null,
          body: String(data.body || ""),
          isAdminReply: Boolean(data.isAdminReply),
          createdAt: asDate(data.createdAt as Timestamp | undefined),
        };
      });
      onData(comments);
    },
    (err) => onError?.(err),
  );
}

function sanitizePhoto(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  // Google avatar URLs can be long; keep under Firestore rule limit.
  return trimmed.slice(0, 2000);
}

export async function createFeedbackPost(input: {
  uid: string;
  displayName: string;
  photoURL?: string | null;
  title: string;
  body: string;
}): Promise<void> {
  const title = input.title.trim().slice(0, 120);
  const body = input.body.trim().slice(0, 2000);
  if (!input.uid) throw new Error("Sign in required");
  if (body.length < 3) throw new Error("Please write a longer review");

  await addDoc(postsCol(), {
    authorUid: input.uid,
    authorName: (input.displayName || "Aspirant").trim().slice(0, 60),
    authorPhoto: sanitizePhoto(input.photoURL),
    title,
    body,
    createdAt: serverTimestamp(),
  });
}

export async function createFeedbackComment(input: {
  postId: string;
  uid: string;
  displayName: string;
  photoURL?: string | null;
  body: string;
  asAdmin?: boolean;
}): Promise<void> {
  const body = input.body.trim().slice(0, 1000);
  if (!input.uid) throw new Error("Sign in required");
  if (!input.postId) throw new Error("Missing post");
  if (body.length < 1) throw new Error("Comment cannot be empty");

  const isAdminReply = Boolean(input.asAdmin);
  await addDoc(commentsCol(input.postId), {
    authorUid: input.uid,
    authorName: isAdminReply
      ? ADMIN_PUBLIC_NAME
      : (input.displayName || "Aspirant").trim().slice(0, 60),
    authorPhoto: isAdminReply ? null : sanitizePhoto(input.photoURL),
    body,
    isAdminReply,
    createdAt: serverTimestamp(),
  });
}

/** Admin-only: delete any feedback comment (enforced by Firestore rules). */
export async function deleteFeedbackComment(postId: string, commentId: string): Promise<void> {
  if (!postId || !commentId) throw new Error("Missing comment");
  await deleteDoc(doc(db, "feedback_posts", postId, "comments", commentId));
}

/** Admin-only: delete a feedback post (enforced by Firestore rules). */
export async function deleteFeedbackPost(postId: string): Promise<void> {
  if (!postId) throw new Error("Missing post");
  await deleteDoc(doc(db, "feedback_posts", postId));
}

export function formatFeedbackTime(date: Date | null): string {
  if (!date) return "Just now";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}
