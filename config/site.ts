/**
 * Central company configuration.
 *
 * Fill in empty fields before launch. Never duplicate these values in
 * individual components — always read from `siteConfig`.
 */
export type SiteContact = {
  name: string;
  phone: string;
  phoneLabel: string;
};

export const siteConfig = {
  name: "Katanić Gradnja 022",
  shortName: "Katanić Gradnja",
  legalName: "", // TODO: Confirm registered legal name.
  description:
    "Katanić Gradnja 022 — izgradnja kuća od temelja do krova, rekonstrukcije, adaptacije, ograde, behaton, bazeni i drugi građevinski radovi.",
  tagline: "Gradimo od temelja do krova.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "sr-Latn-RS",
  language: "sr-Latn",

  contacts: [
    { name: "Stefan", phone: "+38162712772", phoneLabel: "062 712 772" },
    { name: "Veljko", phone: "+381612026312", phoneLabel: "061 20 26 312" },
  ] satisfies SiteContact[],

  email: "",
  location: "Mali Radinci, Ruma",
  serviceArea: "",

  instagram: "https://www.instagram.com/katanicgradnja022/",
  instagramHandle: "@katanicgradnja022",

  logo: {
    svg: "/logo/katanic-gradnja-logo.svg",
    png: "/logo/katanic-gradnja-logo.png",
  },

  images: {
    og: "/images/projekti/izgradnja-kuce/06.jpg",
    hero: "/images/projekti/izgradnja-kuce/06.jpg",
    cta: "/images/projekti/izgradnja-kuce/10.jpg",
  },
} as const;

export type SiteConfig = typeof siteConfig;

export function hasValue(value: string | undefined): value is string {
  return Boolean(value && value.trim().length > 0);
}

export function getContacts(): SiteContact[] {
  return siteConfig.contacts.filter((contact) => hasValue(contact.phone));
}

export function toTelHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function getPhoneHref(): string | null {
  const [first] = getContacts();
  return first ? toTelHref(first.phone) : null;
}

export function getPhoneLabel(): string | null {
  const [first] = getContacts();
  return first ? first.phoneLabel : null;
}

export function getEmailHref(): string | null {
  if (!hasValue(siteConfig.email)) return null;
  return `mailto:${siteConfig.email}`;
}

export function absoluteUrl(path = "/"): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
