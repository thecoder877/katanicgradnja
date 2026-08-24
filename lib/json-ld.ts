import { absoluteUrl, getContacts, hasValue, siteConfig } from "@/config/site";

function compact<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== ""),
  );
}

export function getBusinessJsonLd() {
  const phones = getContacts().map((contact) => contact.phone);

  return compact({
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: siteConfig.name,
    url: absoluteUrl(),
    description: siteConfig.description,
    image: absoluteUrl(siteConfig.images.og),
    logo: absoluteUrl(siteConfig.logo.svg),
    sameAs: [siteConfig.instagram],
    telephone: phones.length === 1 ? phones[0] : phones.length > 1 ? phones : undefined,
    email: hasValue(siteConfig.email) ? siteConfig.email : undefined,
    areaServed: hasValue(siteConfig.serviceArea)
      ? {
          "@type": "AdministrativeArea",
          name: siteConfig.serviceArea,
        }
      : undefined,
    address: hasValue(siteConfig.location)
      ? {
          "@type": "PostalAddress",
          addressLocality: siteConfig.location,
          addressCountry: "RS",
        }
      : undefined,
  });
}

export function getBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function getServiceJsonLd(input: {
  name: string;
  description: string;
  path: string;
  image: string;
}) {
  return compact({
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    image: input.image ? absoluteUrl(input.image) : undefined,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: siteConfig.name,
      url: absoluteUrl(),
    },
    areaServed: hasValue(siteConfig.serviceArea) ? siteConfig.serviceArea : undefined,
  });
}
