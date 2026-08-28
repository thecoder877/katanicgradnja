import { z } from "zod";
import { isProjectCategory, type ProjectLayout } from "@/types/project";

export const uuidSchema = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    "Neispravan identifikator.",
  );

export const projectFieldsSchema = z.object({
  title: z.string().trim().min(2, "Unesite naziv projekta.").max(120, "Naziv je predugačak."),
  description: z.string().trim().max(4000, "Opis je predugačak."),
  category: z.string().refine(isProjectCategory, "Izaberite kategoriju."),
  location: z.string().trim().max(120, "Lokacija je predugačka."),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  workItems: z
    .array(z.string().trim().min(1).max(160, "Stavka radova je predugačka."))
    .max(12, "Unesite najviše 12 stavki radova."),
  featured: z.boolean(),
  published: z.boolean(),
  layout: z.enum(["wide", "tall", "standard"]),
});

export type ProjectFields = z.infer<typeof projectFieldsSchema>;

export const loginFieldsSchema = z.object({
  email: z.email("Unesite e-mail.").max(254),
  password: z.string().min(1, "Unesite lozinku.").max(256),
});

export function parseLayout(value: string): ProjectLayout {
  if (value === "wide" || value === "tall") return value;
  return "standard";
}

export function parseProjectFields(formData: FormData) {
  const workItemsInput = String(formData.get("workItems") ?? "");
  const yearInput = String(formData.get("year") ?? "").trim();

  if (workItemsInput.length > 2000) {
    return projectFieldsSchema.safeParse({});
  }

  return projectFieldsSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    category: String(formData.get("category") ?? ""),
    location: String(formData.get("location") ?? ""),
    year: yearInput ? Number(yearInput) : undefined,
    workItems: workItemsInput
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    layout: parseLayout(String(formData.get("layout") ?? "standard")),
  });
}

type PublishReadinessInput = {
  title: string;
  category: string;
  location: string;
  images: string[];
  coverImage: string;
};

export function getPublishReadiness(project: PublishReadinessInput): string[] {
  const missing: string[] = [];
  if (!project.title.trim()) missing.push("title");
  if (!isProjectCategory(project.category)) missing.push("category");
  if (!project.location.trim()) missing.push("location");
  if (project.images.length === 0) missing.push("image");
  if (!project.coverImage || !project.images.includes(project.coverImage)) missing.push("coverImage");
  return missing;
}

export const MAX_ADMIN_PHOTO_BYTES = 12 * 1024 * 1024;
export const MAX_ADMIN_PHOTO_COUNT = 20;
