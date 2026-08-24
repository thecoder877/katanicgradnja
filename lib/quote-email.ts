import { Resend } from "resend";
import { QuoteRequestEmail } from "@/components/email/QuoteRequestEmail";
import { siteConfig } from "@/config/site";
import type { QuoteRequestInput } from "@/lib/quote-request";

const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function quoteRecipient() {
  return process.env.QUOTE_TO_EMAIL?.trim() || siteConfig.email;
}

export function isQuoteEmailConfigured() {
  return Boolean(getResendClient() && quoteRecipient());
}

export async function sendQuoteEmail(input: QuoteRequestInput, photos: File[]) {
  const resend = getResendClient();
  const to = quoteRecipient();
  if (!resend || !to) {
    return { ok: false as const, error: "missing_config" };
  }

  const attachments: { filename: string; content: Buffer }[] = [];
  let attachmentBytes = 0;

  for (const [index, file] of photos.entries()) {
    if (attachmentBytes + file.size > MAX_ATTACHMENT_BYTES) break;
    const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 80) || `fotografija-${index + 1}`;
    attachments.push({
      filename: safeName,
      content: Buffer.from(await file.arrayBuffer()),
    });
    attachmentBytes += file.size;
  }

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM?.trim() || "Katanić Gradnja <beth.t@example.com>",
    to: [to],
    replyTo: input.email || undefined,
    subject: `Novi upit: ${input.workType} — ${input.name}`,
    react: QuoteRequestEmail({
      ...input,
      photoCount: photos.length,
    }),
    attachments,
  });

  if (error) {
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const };
}
