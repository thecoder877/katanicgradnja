import { headers } from "next/headers";
import { quoteRequestSchema, validateQuotePhotos, type QuoteRequestResult } from "@/lib/quote-request";
import { rateLimit } from "@/lib/security/rate-limit";
import { getPublicClientIp, isHoneypotTriggered } from "@/lib/security/request";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  const formData = await request.formData();

  if (isHoneypotTriggered(formData.get("company_website"))) {
    return json({ ok: true, status: "received" }, 200);
  }

  const ip = getPublicClientIp(await headers());
  if (!rateLimit(`quote:${ip}`, 8, 15 * 60 * 1000)) {
    return json(
      {
        ok: false,
        status: "error",
        message: "Previše zahteva. Pokušajte ponovo za nekoliko minuta.",
      },
      429,
    );
  }

  const parsed = quoteRequestSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    location: String(formData.get("location") ?? ""),
    workType: String(formData.get("workType") ?? ""),
    description: String(formData.get("description") ?? ""),
    consent: formData.get("consent") === "true",
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Proverite unete podatke.";
    return json({ ok: false, status: "validation_error", message }, 400);
  }

  const photos = formData
    .getAll("photos")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  const photoError = await validateQuotePhotos(photos);
  if (photoError) {
    return json({ ok: false, status: "upload_error", message: photoError }, 400);
  }

  const webhook = process.env.QUOTE_WEBHOOK_URL;

  if (!webhook) {
    const message =
      process.env.NODE_ENV === "development"
        ? "Integracija forme još nije konfigurisana. Upit nije poslat. Podesite QUOTE_WEBHOOK_URL ili drugi backend pre produkcije."
        : "Slanje upita trenutno nije aktivno. Kontaktirajte nas putem Instagrama.";

    return json({ ok: false, status: "not_configured", message }, 503);
  }

  try {
    const payload = {
      ...parsed.data,
      photoCount: photos.length,
      submittedAt: new Date().toISOString(),
    };

    const response = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.QUOTE_WEBHOOK_TOKEN
          ? `Bearer ${process.env.QUOTE_WEBHOOK_TOKEN}`
          : "",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return json(
        {
          ok: false,
          status: "error",
          message: "Upit trenutno nije mogao da se pošalje. Pokušajte ponovo.",
        },
        502,
      );
    }

    return json({ ok: true, status: "received" }, 200);
  } catch {
    return json(
      {
        ok: false,
        status: "error",
        message: "Upit trenutno nije mogao da se pošalje. Pokušajte ponovo.",
      },
      500,
    );
  }
}

function json(body: QuoteRequestResult, status: number) {
  return Response.json(body, { status });
}
