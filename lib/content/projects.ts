import { projects as staticProjects } from "@/data/projects";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { mapAdminProject, mapProject } from "@/lib/supabase/map-project";
import {
  projectFilterOptions,
  type AdminProject,
  type Project,
  type ProjectCategory,
  type ProjectFilterValue,
} from "@/types/project";

const PROJECT_SELECT = "*, project_images(*)";

async function fetchRemoteProjects(publishedOnly: boolean): Promise<Project[] | null> {
  if (!isSupabaseConfigured()) return null;

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
    if (error || !data) return null;
    return data.map(mapProject);
  } catch {
    return null;
  }
}

export async function getProjects(): Promise<Project[]> {
  const remote = await fetchRemoteProjects(true);
  if (!remote) return staticProjects;

  const remoteSlugs = new Set(remote.map((project) => project.slug));
  const extras = staticProjects.filter((project) => !remoteSlugs.has(project.slug));
  return extras.length > 0 ? [...remote, ...extras] : remote;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getProjects();
  const featured = all.filter((project) => project.featured);
  return featured.length > 0 ? featured : all.slice(0, 6);
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
  return all
    .filter((item) => item.slug !== project.slug && item.category === project.category)
    .slice(0, limit);
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

export async function getAdminProjects(): Promise<AdminProject[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapAdminProject);
}
