import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { getProjectSlugs } from "@/lib/content/projects";
import { getServiceSlugs } from "@/lib/content/services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/usluge",
    "/projekti",
    "/o-nama",
    "/kontakt",
    "/politika-privatnosti",
  ];

  const serviceRoutes = getServiceSlugs().map((slug) => `/usluge/${slug}`);
  const projectRoutes = (await getProjectSlugs()).map((slug) => `/projekti/${slug}`);

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes].map((path) => ({
    url: absoluteUrl(path || "/"),
    lastModified: new Date(),
  }));
}
