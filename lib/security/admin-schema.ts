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
  featured: z.boolean(),
  published: z.boolean(),
  layout: z.enum(["wide", "tall", "standard"]),
});

export const loginFieldsSchema = z.object({
  email: z.email("Unesite e-mail.").max(254),
  password: z.string().min(1, "Unesite lozinku.").max(256),
});

export function parseLayout(value: string): ProjectLayout {
  if (value === "wide" || value === "tall") return value;
  return "standard";
}

export function parseProjectFields(formData: FormData) {
  return projectFieldsSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    category: String(formData.get("category") ?? ""),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    layout: parseLayout(String(formData.get("layout") ?? "standard")),
  });
}

export const MAX_ADMIN_PHOTO_BYTES = 12 * 1024 * 1024;
export const MAX_ADMIN_PHOTO_COUNT = 20;
