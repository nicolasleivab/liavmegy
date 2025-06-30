import { v4 as uuidv4 } from "uuid";
import { Comment, VectorClock } from "../../infrastructure/db/comment.schema";
import { CommentsDatabase } from "../../infrastructure/db/rxdb";

// Add a comment to the DB
export async function addComment({
  db,
  text,
  replyTo,
  inputRef,
}: {
  db: CommentsDatabase;
  text: string;
  replyTo: string | null;
  inputRef?: React.RefObject<HTMLInputElement>;
}): Promise<void> {
  if (!text.trim() || !db) return;
  const now = Date.now();
  const nodeId = "local";
  const vectorClock: VectorClock = { [nodeId]: now };
  try {
    await db.comments.insert({
      id: uuidv4(),
      parentId: replyTo || null,
      text,
      createdAt: now,
      updatedAt: now,
      vectorClock,
    } as Comment);
    if (inputRef && inputRef.current) inputRef.current.focus();
  } catch (err) {
    console.error("Error inserting comment:", err);
  }
}

// Cascade delete a comment and all its children
export async function deleteCommentCascade({
  db,
  id,
  comments,
}: {
  db: CommentsDatabase;
  id: string;
  comments: Comment[];
}): Promise<void> {
  if (!db) return;
  const toDelete = new Set<string>();
  const collectChildren = (parentId: string) => {
    toDelete.add(parentId);
    comments.forEach((c) => {
      if (c.parentId === parentId) {
        collectChildren(c.id);
      }
    });
  };
  collectChildren(id);
  for (const delId of toDelete) {
    const doc = await db.comments.findOne({ selector: { id: delId } }).exec();
    if (doc) await doc.remove();
  }
}
