import { Comment } from "../infrastructure/db/comment.schema";

// Last Write Wins (LWW) strategy
export function resolveConflicts(comments: Comment[]): Comment[] {
  // Implement LWW or other strategies here
  // For now, we just return the latest by updatedAt
  const map = new Map<string, Comment>();
  for (const c of comments) {
    if (!map.has(c.id) || map.get(c.id)!.updatedAt < c.updatedAt) {
      map.set(c.id, c);
    }
  }
  return Array.from(map.values());
}
