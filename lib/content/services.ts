import { services } from "@/data/services";
import type { Project } from "@/types/project";
import type { Service } from "@/types/service";

/**
 * Content accessors for services.
 * Swap the import in this file when moving to a CMS — page components
 * should keep calling these helpers rather than the data module.
 */
export function getServices(): Service[] {
  return services;
}

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getServiceSlugs(): string[] {
  return services.map((service) => service.slug);
}

/**
 * Use a real project photograph for each service card when that category
 * has published work. Until then, keep the curated service fallback and
 * mark it so the UI never presents it as project proof.
 */
export function withServiceProjectCovers(serviceList: Service[], projects: Project[]): Service[] {
  return serviceList.map((service) => {
    if (!service.relatedCategory) {
      return { ...service, placeholderImages: true };
    }

    const match =
      projects.find(
        (project) => project.category === service.relatedCategory && project.featured && project.coverImage,
      ) ??
      projects.find((project) => project.category === service.relatedCategory && project.coverImage);

    if (!match?.coverImage) {
      return { ...service, placeholderImages: true };
    }

    return { ...service, coverImage: match.coverImage, placeholderImages: false };
  });
}
