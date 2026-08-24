import type { Project } from "@/types/project";

const izgradnjaImages = Array.from({ length: 12 }, (_, index) => {
  const name = String(index + 1).padStart(2, "0");
  return `/images/projekti/izgradnja-kuce/${name}.jpg`;
});

const rekonstrukcijaImages = ["01", "02", "03", "04"].map(
  (name) => `/images/projekti/rekonstrukcija/${name}.jpg`,
);

const bazenImages = ["01", "02"].map((name) => `/images/projekti/bazen/${name}.jpg`);

const ogradeImages = ["01", "02", "03", "04"].map(
  (name) => `/images/projekti/stubovi-ograde/${name}.jpg`,
);

const jazakImages = ["01", "02", "03", "04", "05"].map(
  (name) => `/images/projekti/izgradnja-kuce-jazak/${name}.jpg`,
);

const vikendicaImages = ["01", "02", "03", "04", "05", "06", "07", "08"].map(
  (name) => `/images/projekti/izgradnja-vikendice/${name}.jpg`,
);

const nadogradnjaImages = ["01", "02", "03", "04", "05"].map(
  (name) => `/images/projekti/nadogradnja-kuce/${name}.jpg`,
);

/**
 * Static project catalog used when Supabase is not configured or unreachable.
 * Photograph groups follow the original filenames in `public/images`.
 */
export const projects: Project[] = [
  {
    slug: "izgradnja-kuce-od-temelja-do-krova",
    title: "Izgradnja kuće od temelja do krova",
    category: "Izgradnja",
    description:
      "Izgradnja stambenog objekta kroz dogovorene građevinske faze, od temelja do krova.",
    coverImage: izgradnjaImages[0],
    images: izgradnjaImages,
    featured: true,
    layout: "wide",
  },
  {
    slug: "rekonstrukcija",
    title: "Rekonstrukcija",
    category: "Rekonstrukcija",
    description: "Rekonstrukcija postojećeg objekta u dogovorenom obimu radova.",
    coverImage: rekonstrukcijaImages[0],
    images: rekonstrukcijaImages,
    featured: true,
    layout: "wide",
  },
  {
    slug: "izgradnja-bazena",
    title: "Izgradnja bazena",
    category: "Bazen",
    description: "Građevinski radovi na izgradnji bazena.",
    coverImage: bazenImages[0],
    images: bazenImages,
    featured: true,
    layout: "standard",
  },
  {
    slug: "izrada-stubova-ograde",
    title: "Izrada stubova ograde",
    category: "Ograde",
    description: "Izrada stubova ograde i pripadajućih građevinskih elemenata.",
    coverImage: ogradeImages[0],
    images: ogradeImages,
    featured: true,
    layout: "tall",
  },
  {
    slug: "izgradnja-kuce-jazak",
    title: "Izgradnja kuće, Jazak",
    category: "Izgradnja",
    location: "Jazak",
    description: "Izgradnja stambenog objekta u Jazaku.",
    coverImage: jazakImages[0],
    images: jazakImages,
    featured: true,
    layout: "wide",
  },
  {
    slug: "izgradnja-vikendice",
    title: "Izgradnja vikendice",
    category: "Izgradnja",
    description: "Izgradnja vikendice kroz dogovorene građevinske faze.",
    coverImage: vikendicaImages[0],
    images: vikendicaImages,
    featured: true,
    layout: "standard",
  },
  {
    slug: "nadogradnja-kuce",
    title: "Nadogradnja kuće",
    category: "Rekonstrukcija",
    description: "Nadogradnja postojećeg stambenog objekta.",
    coverImage: nadogradnjaImages[0],
    images: nadogradnjaImages,
    featured: true,
    layout: "tall",
  },
];
