import React, { useState } from "react";
import styles from "./Comment.module.css";
import Button from "../Button/Button";
import { Comment as CommentType } from "../../../infrastructure/db/comment.schema";
import { CommentsDatabase } from "../../../infrastructure/db/rxdb";

export type CommentNode = CommentType & {
  children: CommentNode[];
};

type CommentProps = {
  comments: CommentType[];
  input: string;
  setInput: (val: string) => void;
  replyTo: string | null;
  setReplyTo: (id: string | null) => void;
  handleAdd: (e: React.FormEvent) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  db: CommentsDatabase;
  maxNesting?: number;
};

const buildTree = (comments: CommentType[]): CommentNode[] => {
  const map = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];
  comments.forEach((c) => map.set(c.id, { ...c, children: [] }));
  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
};

const Comment: React.FC<CommentProps> = ({
  comments,
  input,
  setInput,
  replyTo,
  setReplyTo,
  handleAdd,
  handleDelete,
  loading,
  inputRef,
  db,
  maxNesting = 1,
}) => {
  const [openReplies, setOpenReplies] = useState<{
    [commentId: string]: boolean;
  }>({});

  const handleToggleReplies = (commentId: string) => {
    setOpenReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const renderComments = (nodes: CommentNode[], level = 0) => {
    return (
      <ul className={styles.commentList}>
        {nodes.map((node) => {
          const hasReplies = node.children.length > 0;
          const isAccordion = level === 0 && hasReplies;
          const repliesOpen = openReplies[node.id];
          return (
            <li
              key={node.id}
              className={
                styles.commentItem + (level > 0 ? " " + styles.nested : "")
              }
            >
              <div className={styles.commentHeader}>
                <span className={styles.commentText}>{node.text}</span>
                <div className={styles.commentActions}>
                  {level < maxNesting && (
                    <Button theme="default" onClick={() => setReplyTo(node.id)}>
                      Reply
                    </Button>
                  )}
                  <Button theme="danger" onClick={() => handleDelete(node.id)}>
                    Delete
                  </Button>
                </div>
              </div>
              {isAccordion && (
                <div className={styles.repliesAccordion}>
                  <Button
                    className={styles.repliesToggle}
                    style={{
                      padding: 0,
                      background: "none",
                      fontSize: "0.95em",
                    }}
                    onClick={() => handleToggleReplies(node.id)}
                  >
                    {repliesOpen ? "Hide" : "View"} {node.children.length} repl
                    {node.children.length === 1 ? "y" : "ies"}
                  </Button>
                  <div
                    className={styles.repliesContent}
                    style={{
                      maxHeight: repliesOpen ? 500 : 0,
                      opacity: repliesOpen ? 1 : 0,
                      transition:
                        "max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s",
                      overflow: "hidden",
                    }}
                  >
                    {repliesOpen && renderComments(node.children, level + 1)}
                  </div>
                </div>
              )}
              {!isAccordion &&
                node.children.length > 0 &&
                renderComments(node.children, level + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  const tree = buildTree(comments);

  if (loading) {
    return <div>Loading database...</div>;
  }

  return (
    <div className={styles.commentsContainer}>
      <h2>Comments</h2>
      {renderComments(tree)}
      <form className={styles.addCommentForm} onSubmit={handleAdd}>
        <input
          ref={inputRef}
          className={styles.addCommentInput}
          type="text"
          placeholder={replyTo ? "Reply to comment..." : "Add a comment..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!db}
        />
        <Button theme="primary" type="submit" disabled={!db}>
          {replyTo ? "Reply" : "Add"}
        </Button>
        {replyTo && (
          <Button type="button" onClick={() => setReplyTo(null)}>
            Cancel
          </Button>
        )}
      </form>
    </div>
  );
};

export default Comment;
