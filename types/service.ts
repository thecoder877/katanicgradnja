import type { ProjectCategory } from "@/types/project";

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  eyebrow?: string;
  summary: string;
  description: string;
  details: string[];
  coverImage: string;
  relatedCategory?: ProjectCategory;
  placeholderImages?: boolean;
};
