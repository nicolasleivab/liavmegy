import { useEffect, useRef, useState } from "react";
import { initDB, CommentsDatabase } from "../../infrastructure/db/rxdb";
import { Comment } from "../../infrastructure/db/comment.schema";
import { addComment, deleteCommentCascade } from "../handlers/commentHandlers";

export type UsePostsResult = {
  comments: Comment[];
  input: string;
  setInput: (val: string) => void;
  replyTo: string | null;
  setReplyTo: (id: string | null) => void;
  handleAdd: (e: React.FormEvent) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  db: CommentsDatabase;
};

export default function usePosts(): UsePostsResult {
  const [db, setDb] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const dbInstance = await initDB();
      setDb(dbInstance);
      setLoading(false);
      const observable = dbInstance.comments
        .find()
        .sort({ createdAt: "asc" }).$;
      const subscription = observable.subscribe((docs: any[]) => {
        setComments(docs.map((d) => d.toJSON()));
      });
      // TODO: Integrate offline sync flow for future implementation.
      //   syncWithServer(dbInstance);
      return () => subscription.unsubscribe();
    })();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addComment({ db, text: input, replyTo, inputRef });
    setInput("");
    setReplyTo(null);
  };

  const handleDelete = async (id: string) => {
    await deleteCommentCascade({ db, id, comments });
  };

  return {
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
  };
}
