export type VectorClock = {
  [nodeId: string]: number;
};

export type Comment = {
  id: string;
  parentId?: string;
  text: string;
  createdAt: number;
  updatedAt: number;
  vectorClock: VectorClock;
};

export const commentSchema = {
  title: "comment",
  version: 0,
  description: "A comment with vector clock for offline sync",
  type: "object",
  primaryKey: "id",
  properties: {
    id: { type: "string", maxLength: 100 },
    parentId: { type: "string" },
    text: { type: "string" },
    createdAt: { type: "number" },
    updatedAt: { type: "number" },
    vectorClock: {
      type: "object",
      properties: {},
      additionalProperties: { type: "number" },
    },
  },
  required: ["id", "text", "createdAt", "updatedAt", "vectorClock"],
} as const;
