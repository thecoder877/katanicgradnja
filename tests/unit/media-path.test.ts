import { describe, expect, it } from "vitest";
import {
  classifyBatchState,
  managedImagePath,
  reconcileAmbiguousBatch,
} from "../../lib/admin/media-path";

describe("managedImagePath", () => {
  it("keeps project, batch and file identity in the storage path", () => {
    expect(managedImagePath("project-id", "batch-id", "file-id", "jpeg")).toBe(
      "project-id/batch-id/file-id.jpg",
    );
  });

  it("classifies confirmed storage and database state", () => {
    expect(classifyBatchState([], [], ["a"])).toBe("ABSENT");
    expect(classifyBatchState(["a"], ["a"], ["a"])).toBe("COMPLETE");
    expect(classifyBatchState(["a"], [], ["a"])).toBe("PARTIAL");
    expect(classifyBatchState(["a"], ["a"], ["a", "b"])).toBe("PARTIAL");
  });

  it("accepts a complete ambiguous batch without cleanup", async () => {
    let cleaned = false;
    const state = await reconcileAmbiguousBatch(
      async () => ({ state: "COMPLETE" as const, paths: ["a"] }),
      async () => {
        cleaned = true;
      },
    );

    expect(state).toBe("COMPLETE");
    expect(cleaned).toBe(false);
  });

  it("cleans only a partial ambiguous batch", async () => {
    const cleaned: string[] = [];
    const state = await reconcileAmbiguousBatch(
      async () => ({ state: "PARTIAL" as const, paths: ["a"] }),
      async (observed) => {
        cleaned.push(...observed.paths);
      },
    );

    expect(state).toBe("PARTIAL");
    expect(cleaned).toEqual(["a"]);
  });
});
