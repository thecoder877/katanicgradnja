export const projectCategories = [
  "Krovovi",
  "Izgradnja",
  "Rekonstrukcija",
  "Adaptacija",
  "Behaton",
  "Bazen",
  "Ograde",
  "Ostalo",
] as const;

export type ProjectCategory = (typeof projectCategories)[number];

export type ProjectLayout = "wide" | "tall" | "standard";

export type ProjectImageRecord = {
  id: string;
  src: string;
  storagePath: string | null;
};

export type Project = {
  id?: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  location?: string;
  year?: number;
  description?: string;
  coverImage: string;
  images: string[];
  workItems: string[];
  featured?: boolean;
  layout?: ProjectLayout;
  /**
   * Mark true while using generated/branded stand-ins
   * rather than original project photographs.
   */
  placeholderImages?: boolean;
};

export type ProjectCatalogResult =
  | { status: "ready"; projects: Project[]; source: "supabase" | "static" }
  | { status: "unavailable"; projects: []; source: "supabase" };

export type AdminProject = Project & {
  id: string;
  published: boolean;
  sortOrder: number;
  imageRecords: ProjectImageRecord[];
};

export type AdminProjectsResult =
  | { ok: true; projects: AdminProject[] }
  | { ok: false; projects: []; error: string };

export function isProjectCategory(value: string): value is ProjectCategory {
  return (projectCategories as readonly string[]).includes(value);
}

export const projectFilterOptions = [
  { value: "sve", label: "Sve", category: null },
  { value: "krovovi", label: "Krovovi", category: "Krovovi" },
  { value: "izgradnja", label: "Izgradnja", category: "Izgradnja" },
  { value: "rekonstrukcija", label: "Rekonstrukcija", category: "Rekonstrukcija" },
  { value: "adaptacija", label: "Adaptacija", category: "Adaptacija" },
  { value: "behaton", label: "Behaton", category: "Behaton" },
  { value: "bazeni", label: "Bazeni", category: "Bazen" },
  { value: "ograde", label: "Ograde", category: "Ograde" },
] as const satisfies ReadonlyArray<{
  value: string;
  label: string;
  category: ProjectCategory | null;
}>;

export type ProjectFilterValue = (typeof projectFilterOptions)[number]["value"];

export function selectFeaturedProjects(projects: Project[], limit = 6): Project[] {
  const featured = projects.filter((project) => project.featured);
  return (featured.length > 0 ? featured : projects).slice(0, limit);
}

export function selectRelatedProjects(project: Project, projects: Project[], limit = 3): Project[] {
  return projects
    .filter((item) => item.slug !== project.slug && item.category === project.category)
    .slice(0, limit);
}
