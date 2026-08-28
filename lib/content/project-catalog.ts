import type { Project, ProjectCatalogResult } from "@/types/project";

export type RemoteProjectResult =
  | { ok: true; projects: Project[] }
  | { ok: false; errorCode?: string };

export function resolveProjectCatalog(
  configured: boolean,
  remote: RemoteProjectResult | null,
  staticProjects: Project[],
): ProjectCatalogResult {
  if (!configured) return { status: "ready", projects: staticProjects, source: "static" };
  if (remote?.ok) return { status: "ready", projects: remote.projects, source: "supabase" };
  return { status: "unavailable", projects: [], source: "supabase" };
}
