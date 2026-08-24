"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { ContactPromptDialog } from "@/components/contact/ContactPromptDialog";
import { HoneypotField } from "@/components/security/HoneypotField";
import { Button } from "@/components/ui/button";
import {
  ACCEPTED_PHOTO_TYPES,
  MAX_PHOTO_COUNT,
  quoteRequestSchema,
  submitQuoteRequest,
  validateQuotePhotos,
  workTypes,
  type QuoteRequestInput,
} from "@/lib/quote-request";
import { cn } from "@/lib/utils";

const fieldClass =
  "mt-2 min-h-11 w-full rounded-[10px] border border-line-dark bg-white px-3 text-sm text-ink outline-none transition-colors focus:border-accent";

export function ContactForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [resultTone, setResultTone] = useState<"ok" | "warn" | "error">("ok");
  const [showInstagramPrompt, setShowInstagramPrompt] = useState(false);
  const closeInstagramPrompt = useCallback(() => setShowInstagramPrompt(false), []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<QuoteRequestInput>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      location: "",
      description: "",
      consent: undefined,
    },
  });

  const fileNames = useMemo(() => files.map((file) => file.name).join(", "), [files]);

  async function onSubmit(values: QuoteRequestInput, event?: BaseSyntheticEvent) {
    setResultMessage(null);
    const photoError = await validateQuotePhotos(files);
    if (photoError) {
      setFileError(photoError);
      return;
    }

    const formData = new FormData();
    const honeypot =
      event?.currentTarget instanceof HTMLFormElement
        ? String(new FormData(event.currentTarget).get("company_website") ?? "")
        : "";
    formData.set("company_website", honeypot);
    formData.set("name", values.name);
    formData.set("phone", values.phone);
    formData.set("email", values.email ?? "");
    formData.set("location", values.location ?? "");
    formData.set("workType", values.workType);
    formData.set("description", values.description);
    formData.set("consent", "true");
    for (const file of files) {
      formData.append("photos", file);
    }

    const result = await submitQuoteRequest(formData);

    if (result.ok) {
      setResultTone("ok");
      setResultMessage("Upit je primljen. Javićemo vam se u vezi sa daljim dogovorom.");
      reset();
      setFiles([]);
      return;
    }

    setResultTone(result.status === "not_configured" ? "warn" : "error");
    setResultMessage(result.message);
    if (result.status === "not_configured" || result.status === "error") {
      setShowInstagramPrompt(true);
    }
  }

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-5" noValidate>
      <HoneypotField />
      <div>
        <label htmlFor="name" className="text-sm font-medium">
          Ime i prezime
        </label>
        <input id="name" autoComplete="name" className={fieldClass} {...register("name")} />
        {errors.name ? <p className="mt-1 text-sm text-red-700">{errors.name.message}</p> : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="text-sm font-medium">
            Telefon
          </label>
          <input id="phone" type="tel" autoComplete="tel" className={fieldClass} {...register("phone")} />
          {errors.phone ? <p className="mt-1 text-sm text-red-700">{errors.phone.message}</p> : null}
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            E-mail <span className="text-muted-dark">(opciono)</span>
          </label>
          <input id="email" type="email" autoComplete="email" className={fieldClass} {...register("email")} />
          {errors.email ? <p className="mt-1 text-sm text-red-700">{errors.email.message}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="location" className="text-sm font-medium">
          Lokacija projekta <span className="text-muted-dark">(opciono)</span>
        </label>
        <input id="location" className={fieldClass} {...register("location")} />
      </div>

      <div>
        <label htmlFor="workType" className="text-sm font-medium">
          Vrsta radova
        </label>
        <select id="workType" className={fieldClass} {...register("workType")}>
          <option value="">Izaberite vrstu radova</option>
          {workTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.workType ? (
          <p className="mt-1 text-sm text-red-700">{errors.workType.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium">
          Opis projekta
        </label>
        <textarea
          id="description"
          rows={6}
          className={cn(fieldClass, "min-h-32 py-3")}
          {...register("description")}
        />
        {errors.description ? (
          <p className="mt-1 text-sm text-red-700">{errors.description.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="photos" className="text-sm font-medium">
          Fotografije <span className="text-muted-dark">(opciono, do {MAX_PHOTO_COUNT})</span>
        </label>
        <input
          id="photos"
          type="file"
          multiple
          accept={ACCEPTED_PHOTO_TYPES.join(",")}
          className="mt-2 block w-full text-sm file:mr-3 file:min-h-11 file:rounded-[10px] file:border-0 file:bg-ink file:px-4 file:text-sm file:font-semibold file:text-cream"
          onChange={(event) => {
            const next = Array.from(event.target.files ?? []);
            void validateQuotePhotos(next).then((error) => {
              setFileError(error);
              setFiles(error ? [] : next);
            });
          }}
        />
        {fileNames && !fileError ? (
          <p className="mt-2 text-sm text-muted-dark">{fileNames}</p>
        ) : null}
        {fileError ? <p className="mt-1 text-sm text-red-700">{fileError}</p> : null}
      </div>

      <div className="flex items-start gap-3">
        <input
          id="consent"
          type="checkbox"
          className="mt-1 h-4 w-4 accent-accent"
          {...register("consent")}
        />
        <label htmlFor="consent" className="text-sm leading-relaxed text-muted-dark">
          Saglasan/na sam da se navedeni podaci koriste radi odgovora na moj upit.
        </label>
      </div>
      {errors.consent ? <p className="text-sm text-red-700">{errors.consent.message}</p> : null}

      {resultMessage ? (
        <p
          className={cn(
            "rounded-[10px] border px-4 py-3 text-sm",
            resultTone === "ok" && "border-ink/10 bg-white text-ink",
            resultTone === "warn" && "border-accent/40 bg-cream-2 text-ink",
            resultTone === "error" && "border-red-200 bg-red-50 text-red-800",
          )}
          role="status"
        >
          {resultMessage}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting} size="lg">
        {isSubmitting ? "Slanje..." : "Pošaljite upit"}
      </Button>
    </form>
    <ContactPromptDialog open={showInstagramPrompt} onClose={closeInstagramPrompt} />
    </>
  );
}
