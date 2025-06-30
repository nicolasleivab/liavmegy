import { resolveConflicts } from "../src/services/conflictResolution";
import { Comment } from "../src/infrastructure/db/comment.schema";

describe("resolveConflicts", () => {
  it("should keep the latest updated comment (LWW)", () => {
    const now = Date.now();
    const local: Comment = {
      id: "1",
      text: "Local",
      createdAt: now - 1000,
      updatedAt: now - 500,
      vectorClock: { local: now - 500 },
    };
    const remote: Comment = {
      id: "1",
      text: "Remote",
      createdAt: now - 1000,
      updatedAt: now,
      vectorClock: { remote: now },
    };
    const result = resolveConflicts([local, remote]);
    expect(result.length).toBe(1);
    expect(result[0].text).toBe("Remote");
  });

  it("should merge multiple comments by id, keeping latest", () => {
    const now = Date.now();
    const comments: Comment[] = [
      {
        id: "1",
        text: "A",
        createdAt: now,
        updatedAt: now,
        vectorClock: { a: now },
      },
      {
        id: "2",
        text: "B",
        createdAt: now,
        updatedAt: now,
        vectorClock: { b: now },
      },
      {
        id: "1",
        text: "A2",
        createdAt: now,
        updatedAt: now + 1000,
        vectorClock: { a: now + 1000 },
      },
    ];
    const result = resolveConflicts(comments);
    expect(result.length).toBe(2);
    expect(result.find((c) => c.id === "1")!.text).toBe("A2");
    expect(result.find((c) => c.id === "2")!.text).toBe("B");
  });
});
