import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";

const defaultTitle = `${siteConfig.name} | Gradnja, rekonstrukcije i adaptacije`;

export const defaultMetadata: Metadata = {
  metadataBase: new URL(absoluteUrl()),
  title: {
    default: defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "sr_RS",
    url: absoluteUrl(),
    siteName: siteConfig.name,
    title: defaultTitle,
    description: siteConfig.description,
    images: [{ url: siteConfig.images.og }],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: siteConfig.description,
    images: [siteConfig.images.og],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const shareImage = image || siteConfig.images.og;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "sr_RS",
      url,
      siteName: siteConfig.name,
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [{ url: shareImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [shareImage],
    },
  };
}
