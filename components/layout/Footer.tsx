import { InstagramIcon } from "@/components/icons/InstagramIcon";
import Link from "next/link";
import { Logo } from "@/components/media/Logo";
import { Container } from "@/components/ui/container";
import { footerServiceLinks, legalNavigation, mainNavigation } from "@/config/navigation";
import { getContacts, hasValue, siteConfig, toTelHref } from "@/config/site";

type FooterProps = {
  hasLogoSvg: boolean;
  hasLogoPng: boolean;
};

export function Footer({ hasLogoSvg, hasLogoPng }: FooterProps) {
  const year = new Date().getFullYear();
  const contacts = getContacts();

  return (
    <footer className="border-t border-line bg-ink text-cream">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div className="max-w-sm">
          <Logo hasSvg={hasLogoSvg} hasPng={hasLogoPng} />
          <p className="mt-5 text-sm leading-relaxed text-muted">
            Gradnja, rekonstrukcije, adaptacije i izvođenje drugih građevinskih radova.
          </p>
        </div>

        <div>
          <h2 className="text-[0.7rem] font-semibold tracking-[0.2em] text-accent uppercase">
            Navigacija
          </h2>
          <ul className="mt-4 space-y-2">
            {mainNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center text-sm text-cream/80 transition-colors hover:text-cream"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[0.7rem] font-semibold tracking-[0.2em] text-accent uppercase">
            Usluge
          </h2>
          <ul className="mt-4 space-y-2">
            {footerServiceLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center text-sm text-cream/80 transition-colors hover:text-cream"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[0.7rem] font-semibold tracking-[0.2em] text-accent uppercase">
            Kontakt
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {contacts.map((contact) => (
              <li key={contact.phone}>
                <a
                  href={toTelHref(contact.phone)}
                  className="inline-flex min-h-11 items-center text-cream/80 hover:text-cream"
                >
                  {contact.name}: {contact.phoneLabel}
                </a>
              </li>
            ))}
            {hasValue(siteConfig.email) ? (
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex min-h-11 items-center text-cream/80 hover:text-cream"
                >
                  {siteConfig.email}
                </a>
              </li>
            ) : null}
            {hasValue(siteConfig.location) ? (
              <li className="flex min-h-11 items-center text-cream/80">{siteConfig.location}</li>
            ) : null}
            {hasValue(siteConfig.serviceArea) ? (
              <li className="flex min-h-11 items-center text-cream/80">
                Područje rada: {siteConfig.serviceArea}
              </li>
            ) : null}
            <li>
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-cream/80 hover:text-cream"
              >
                <InstagramIcon className="h-4 w-4" />
                Instagram — {siteConfig.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-3 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. Sva prava zadržana.
          </p>
          <div className="flex gap-4">
            {legalNavigation.map((item) => (
              <Link key={item.href} href={item.href} className="min-h-11 inline-flex items-center hover:text-cream">
                {item.label}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
