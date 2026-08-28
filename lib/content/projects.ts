import { projects as staticProjects } from "@/data/projects";
import { cache } from "react";
import { resolveProjectCatalog, type RemoteProjectResult } from "@/lib/content/project-catalog";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { mapAdminProject, mapProject } from "@/lib/supabase/map-project";
import {
  projectFilterOptions,
  type AdminProjectsResult,
  type Project,
  type ProjectCategory,
  type ProjectFilterValue,
  type ProjectCatalogResult,
  selectFeaturedProjects,
  selectRelatedProjects,
} from "@/types/project";

const PROJECT_SELECT = "*, project_images(*)";

async function fetchRemoteProjects(publishedOnly: boolean): Promise<RemoteProjectResult> {
  try {
    const supabase = createPublicClient();
    let query = supabase
      .from("projects")
      .select(PROJECT_SELECT)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (publishedOnly) {
      query = query.eq("published", true);
    }

    const { data, error } = await query;
    if (error || !data) {
      console.warn("projects.fetch_failed", { code: error?.code ?? "missing_data" });
      return { ok: false, errorCode: error?.code };
    }
    return { ok: true, projects: data.map(mapProject) };
  } catch (error) {
    console.warn("projects.fetch_failed", {
      code: error instanceof Error ? error.name : "unknown_error",
    });
    return { ok: false, errorCode: error instanceof Error ? error.name : "unknown_error" };
  }
}

const loadProjectCatalog = cache(async (): Promise<ProjectCatalogResult> => {
  const configured = isSupabaseConfigured();
  const remote = configured ? await fetchRemoteProjects(true) : null;
  return resolveProjectCatalog(configured, remote, staticProjects);
});

export const getProjectCatalog = loadProjectCatalog;

export async function getProjects(): Promise<Project[]> {
  return (await getProjectCatalog()).projects;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getProjects();
  return selectFeaturedProjects(all);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const all = await getProjects();
  return all.find((project) => project.slug === slug);
}

export async function getProjectSlugs(): Promise<string[]> {
  const all = await getProjects();
  return all.map((project) => project.slug);
}

export async function getProjectsByCategory(category: ProjectCategory): Promise<Project[]> {
  const all = await getProjects();
  return all.filter((project) => project.category === category);
}

export async function getRelatedProjects(project: Project, limit = 3): Promise<Project[]> {
  const all = await getProjects();
  return selectRelatedProjects(project, all, limit);
}

export function isProjectFilterValue(value: string | undefined): value is ProjectFilterValue {
  return projectFilterOptions.some((option) => option.value === value);
}

export async function filterProjects(categoryParam?: string): Promise<Project[]> {
  if (!categoryParam || categoryParam === "sve" || !isProjectFilterValue(categoryParam)) {
    return getProjects();
  }

  const option = projectFilterOptions.find((item) => item.value === categoryParam);
  if (!option?.category) return getProjects();
  return getProjectsByCategory(option.category);
}

export function getFilterLabel(categoryParam?: string): string {
  const option = projectFilterOptions.find((item) => item.value === categoryParam);
  return option?.label ?? "Sve";
}

export async function getAdminProjects(): Promise<AdminProjectsResult> {
  if (!isSupabaseConfigured()) return { ok: true, projects: [] };

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select(PROJECT_SELECT)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.warn("admin.projects_fetch_failed", { code: error?.code ?? "missing_data" });
      return { ok: false, projects: [], error: "Projekti nisu učitani. Pokušajte ponovo." };
    }
    return { ok: true, projects: data.map(mapAdminProject) };
  } catch (error) {
    console.warn("admin.projects_fetch_failed", {
      code: error instanceof Error ? error.name : "unknown_error",
    });
    return { ok: false, projects: [], error: "Projekti nisu učitani. Pokušajte ponovo." };
  }
}
