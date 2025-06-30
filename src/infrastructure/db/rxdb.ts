// Ensure RxDB error messages are shown in development
if (typeof process === "undefined") {
  (window as any).process = { env: { NODE_ENV: "development" } };
} else if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

import { createRxDatabase, addRxPlugin } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

// Plugins
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";

import { commentSchema } from "./comment.schema";

// Register plugins only once per process
if (!(globalThis as any).__RXDB_PLUGINS_REGISTERED__) {
  addRxPlugin(RxDBLeaderElectionPlugin);
  addRxPlugin(RxDBUpdatePlugin);
  addRxPlugin(RxDBQueryBuilderPlugin);
  (globalThis as any).__RXDB_PLUGINS_REGISTERED__ = true;
}

export const initDB = async () => {
  const db = await createRxDatabase({
    name: "commentsdb",
    storage: getRxStorageDexie(),
    multiInstance: true,
    eventReduce: true,
  });

  await db.addCollections({
    comments: {
      schema: commentSchema,
    },
  });

  return db;
};
