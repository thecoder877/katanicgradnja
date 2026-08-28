import type { ProjectFields } from "@/lib/security/admin-schema";

export function projectUpdateValues(fields: ProjectFields) {
  return {
    title: fields.title,
    description: fields.description,
    category: fields.category,
    location: fields.location || null,
    year: fields.year ?? null,
    work_items: fields.workItems,
    featured: fields.featured,
    published: fields.published,
    layout: fields.layout,
  };
}

export function createProjectInsert(fields: ProjectFields, slug: string) {
  return {
    ...projectUpdateValues(fields),
    slug,
    published: false,
    cover_image: "",
  };
}
