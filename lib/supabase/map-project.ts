import { isProjectCategory, type AdminProject, type Project, type ProjectLayout } from "@/types/project";
import type { Database } from "@/lib/supabase/types";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type ImageRow = Database["public"]["Tables"]["project_images"]["Row"];

type ProjectWithImages = ProjectRow & {
  project_images: ImageRow[] | null;
};

function layoutOf(value: string): ProjectLayout {
  if (value === "wide" || value === "tall" || value === "standard") return value;
  return "standard";
}

function categoryOf(value: string) {
  return isProjectCategory(value) ? value : "Ostalo";
}

function sortedImages(rows: ImageRow[] | null) {
  return [...(rows ?? [])].sort((a, b) => a.sort_order - b.sort_order);
}

export function mapProject(row: ProjectWithImages): Project {
  const images = sortedImages(row.project_images);
  const srcs = images.map((image) => image.src);
  const cover = row.cover_image || srcs[0] || "";

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: categoryOf(row.category),
    location: row.location ?? undefined,
    year: row.year ?? undefined,
    description: row.description || undefined,
    coverImage: cover,
    images: srcs.length > 0 ? srcs : cover ? [cover] : [],
    featured: row.featured,
    layout: layoutOf(row.layout),
  };
}

export function mapAdminProject(row: ProjectWithImages): AdminProject {
  const images = sortedImages(row.project_images);
  const mapped = mapProject(row);

  return {
    ...mapped,
    id: row.id,
    published: row.published,
    sortOrder: row.sort_order,
    imageRecords: images.map((image) => ({
      id: image.id,
      src: image.src,
      storagePath: image.storage_path,
    })),
  };
}
