import { Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { getContacts, getEmailHref, hasValue, siteConfig, toTelHref } from "@/config/site";

export function ContactInfo() {
  const contacts = getContacts();
  const emailHref = getEmailHref();

  const items = [
    ...contacts.map((contact) => ({
      icon: Phone,
      label: contact.name,
      value: contact.phoneLabel,
      href: toTelHref(contact.phone),
    })),
    emailHref && hasValue(siteConfig.email)
      ? {
          icon: Mail,
          label: "E-mail",
          value: siteConfig.email,
          href: emailHref,
        }
      : null,
    {
      icon: InstagramIcon,
      label: "Instagram",
      value: siteConfig.instagramHandle,
      href: siteConfig.instagram,
      external: true,
    },
    hasValue(siteConfig.location)
      ? {
          icon: MapPin,
          label: "Lokacija",
          value: siteConfig.location,
        }
      : null,
    hasValue(siteConfig.serviceArea)
      ? {
          icon: MapPin,
          label: "Područje rada",
          value: siteConfig.serviceArea,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold tracking-[-0.03em]">Kontakt</h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-dark">
        Pošaljite upit putem forme. Ako imate fotografije postojećeg stanja, priložite ih uz
        opis radova.
      </p>
      <ul className="mt-8 space-y-5">
        {items.map((item) => {
          const content = (
            <>
              <item.icon className="mt-0.5 h-4 w-4 text-accent" strokeWidth={1.7} />
              <span>
                <span className="block text-[0.68rem] font-semibold tracking-[0.16em] text-muted-dark uppercase">
                  {item.label}
                </span>
                <span className="mt-1 block text-base text-ink">{item.value}</span>
              </span>
            </>
          );

          return (
            <li key={`${item.label}-${item.value}`}>
              {"href" in item && item.href ? (
                <a
                  href={item.href}
                  target={"external" in item && item.external ? "_blank" : undefined}
                  rel={"external" in item && item.external ? "noreferrer" : undefined}
                  className="flex min-h-11 items-start gap-3"
                >
                  {content}
                </a>
              ) : (
                <div className="flex items-start gap-3">{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
