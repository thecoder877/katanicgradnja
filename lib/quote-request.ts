import { z } from "zod";
import { validateImageFiles } from "@/lib/security/uploads";

export const workTypes = [
  "Izgradnja kuće",
  "Rekonstrukcija",
  "Adaptacija",
  "Ograda",
  "Behaton",
  "Bazen",
  "Mašinsko malterisanje",
  "Ostalo",
] as const;

export type WorkType = (typeof workTypes)[number];

export const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
export const MAX_PHOTO_COUNT = 8;
export const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"] as const;

export const quoteRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Unesite ime i prezime.")
    .max(120, "Ime i prezime je predugačko."),
  phone: z
    .string()
    .trim()
    .min(6, "Unesite broj telefona.")
    .max(40, "Broj telefona je predugačak."),
  email: z
    .union([z.literal(""), z.email("Unesite ispravnu e-mail adresu.")])
    .optional(),
  location: z.string().trim().max(160, "Lokacija je predugačka.").optional(),
  workType: z.enum(workTypes, "Izaberite vrstu radova."),
  description: z
    .string()
    .trim()
    .min(10, "Opišite projekat ukratko (najmanje 10 karaktera).")
    .max(4000, "Opis je predugačak."),
  consent: z.literal(true, "Potrebna je saglasnost da bismo mogli da odgovorimo na upit."),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;

export type QuoteRequestResult =
  | { ok: true; status: "received" }
  | { ok: false; status: "not_configured" | "validation_error" | "upload_error" | "error"; message: string };

export async function validateQuotePhotos(files: File[]): Promise<string | null> {
  return validateImageFiles(files, {
    maxBytes: MAX_PHOTO_BYTES,
    maxCount: MAX_PHOTO_COUNT,
    allowAvif: false,
  });
}

/**
 * Frontend/API abstraction for quote requests.
 * Backend delivery (email, webhook, or database) is added later.
 */
export async function submitQuoteRequest(formData: FormData): Promise<QuoteRequestResult> {
  const response = await fetch("/api/quote", {
    method: "POST",
    body: formData,
  });

  try {
    const data = (await response.json()) as QuoteRequestResult;
    return data;
  } catch {
    return {
      ok: false,
      status: "error",
      message: "Slanje upita trenutno nije moguće. Pokušajte ponovo ili nas kontaktirajte na Instagramu.",
    };
  }
}
