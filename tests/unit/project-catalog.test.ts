import { describe, expect, it } from "vitest";
import { resolveProjectCatalog } from "../../lib/content/project-catalog";
import type { Project } from "../../types/project";

const staticProjects: Project[] = [
  {
    slug: "static",
    title: "Static",
    category: "Ostalo",
    coverImage: "/static.jpg",
    images: ["/static.jpg"],
    workItems: [],
  },
];

describe("project catalog authority", () => {
  it("uses static projects only when Supabase is not configured", () => {
    expect(resolveProjectCatalog(false, null, staticProjects)).toEqual({
      status: "ready",
      projects: staticProjects,
      source: "static",
    });
  });

  it("keeps a successful empty Supabase catalog empty", () => {
    expect(resolveProjectCatalog(true, { ok: true, projects: [] }, staticProjects)).toEqual({
      status: "ready",
      projects: [],
      source: "supabase",
    });
  });

  it("reports configured Supabase failure without static fallback", () => {
    expect(resolveProjectCatalog(true, { ok: false, errorCode: "PGRST000" }, staticProjects)).toEqual({
      status: "unavailable",
      projects: [],
      source: "supabase",
    });
  });
});
