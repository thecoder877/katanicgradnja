import { extensionForImageType, type SniffedImageType } from "@/lib/security/uploads";

export function managedImagePath(
  projectId: string,
  batchId: string,
  fileId: string,
  type: SniffedImageType,
): string {
  return `${projectId}/${batchId}/${fileId}.${extensionForImageType(type)}`;
}

export type BatchState = "COMPLETE" | "ABSENT" | "PARTIAL";

export async function reconcileAmbiguousBatch<T extends { state: BatchState }>(
  read: () => Promise<T | null>,
  cleanupPartial: (observed: T) => Promise<void>,
): Promise<BatchState | null> {
  const observed = await read();
  if (!observed) return null;
  if (observed.state === "PARTIAL") await cleanupPartial(observed);
  return observed.state;
}

export function classifyBatchState(
  databasePaths: string[],
  storagePaths: string[],
  expectedPaths: string[],
): BatchState {
  if (databasePaths.length === 0 && storagePaths.length === 0) return "ABSENT";

  const database = new Set(databasePaths);
  const storage = new Set(storagePaths);
  const complete =
    expectedPaths.length > 0 &&
    expectedPaths.every((path) => database.has(path) && storage.has(path));

  return complete ? "COMPLETE" : "PARTIAL";
}
