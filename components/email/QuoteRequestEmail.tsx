import { siteConfig } from "@/config/site";
import type { QuoteRequestInput } from "@/lib/quote-request";

type QuoteEmailProps = QuoteRequestInput & {
  photoCount: number;
};

export function QuoteRequestEmail({
  name,
  phone,
  email,
  location,
  workType,
  description,
  photoCount,
}: QuoteEmailProps) {
  return (
    <div>
      <h1>Novi upit sa sajta {siteConfig.name}</h1>
      <p>
        <strong>Ime:</strong> {name}
      </p>
      <p>
        <strong>Telefon:</strong> {phone}
      </p>
      <p>
        <strong>E-mail:</strong> {email || "nije naveden"}
      </p>
      <p>
        <strong>Lokacija:</strong> {location || "nije navedena"}
      </p>
      <p>
        <strong>Vrsta radova:</strong> {workType}
      </p>
      <p>
        <strong>Fotografije:</strong> {photoCount}
      </p>
      <p>
        <strong>Opis:</strong>
      </p>
      <p style={{ whiteSpace: "pre-wrap" }}>{description}</p>
    </div>
  );
}
