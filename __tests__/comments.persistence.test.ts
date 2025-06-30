import { addRxPlugin } from "rxdb";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import {
  commentSchema,
  Comment,
} from "../src/infrastructure/db/comment.schema";
import {
  addComment,
  deleteCommentCascade,
} from "../src/application/handlers/commentHandlers";
import { CommentsDatabase } from "../src/infrastructure/db/rxdb";

declare global {
  // eslint-disable-next-line no-var
  var __RXDB_PLUGINS_REGISTERED__: boolean | undefined;
}

if (!globalThis.__RXDB_PLUGINS_REGISTERED__) {
  addRxPlugin(RxDBLeaderElectionPlugin);
  addRxPlugin(RxDBUpdatePlugin);
  addRxPlugin(RxDBQueryBuilderPlugin);
  globalThis.__RXDB_PLUGINS_REGISTERED__ = true;
}

describe("Comments persistence and logic", () => {
  let db: CommentsDatabase;
  beforeEach(async () => {
    const { createRxDatabase } = await import("rxdb");
    // Use a unique name for each test run
    const dbName = "testdb_" + Math.random().toString(36).substring(2, 10);
    db = await createRxDatabase({
      name: dbName,
      storage: getRxStorageMemory(),
      multiInstance: false,
      eventReduce: true,
    });
    await db.addCollections({
      comments: { schema: commentSchema },
    });
  });

  afterEach(async () => {
    if (db && typeof db.destroy === "function") {
      await db.destroy();
    }
  });

  it("should persist a parent comment", async () => {
    await addComment({ db, text: "Parent", replyTo: null });
    let comments: Comment[] = (await db.comments.find().exec()).map((d: any) =>
      d.toJSON()
    );
    expect(comments.length).toBe(1);
    expect(comments[0].text).toBe("Parent");
  });

  it("should persist a reply to a comment", async () => {
    await addComment({ db, text: "Parent", replyTo: null });
    let comments: Comment[] = (await db.comments.find().exec()).map((d: any) =>
      d.toJSON()
    );
    const parentId = comments[0].id;
    await addComment({ db, text: "Child", replyTo: parentId });
    comments = (await db.comments.find().exec()).map((d: any) => d.toJSON());
    expect(comments.length).toBe(2);
    expect(
      comments.some((c) => c.text === "Child" && c.parentId === parentId)
    ).toBe(true);
  });

  it("should cascade delete a parent and its replies", async () => {
    await addComment({ db, text: "Parent", replyTo: null });
    let comments: Comment[] = (await db.comments.find().exec()).map((d: any) =>
      d.toJSON()
    );
    const parentId = comments[0].id;
    await addComment({ db, text: "Child", replyTo: parentId });
    // Fetch latest comments before deletion
    comments = (await db.comments.find().exec()).map((d: any) => d.toJSON());
    await deleteCommentCascade({ db, id: parentId, comments });
    comments = (await db.comments.find().exec()).map((d: any) => d.toJSON());
    expect(comments.length).toBe(0);
  });
});
