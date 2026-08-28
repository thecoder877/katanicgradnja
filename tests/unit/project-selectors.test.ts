import { describe, expect, it } from "vitest";
import { selectFeaturedProjects, selectRelatedProjects } from "../../types/project";
import type { Project } from "../../types/project";

const projects: Project[] = [
  { slug: "krov-ruma", title: "Krov Ruma", category: "Krovovi", coverImage: "/1.jpg", images: ["/1.jpg"], workItems: [], featured: true },
  { slug: "krov-jazak", title: "Krov Jazak", category: "Krovovi", coverImage: "/2.jpg", images: ["/2.jpg"], workItems: [] },
  { slug: "ograda", title: "Ograda", category: "Ograde", coverImage: "/3.jpg", images: ["/3.jpg"], workItems: [] },
];

describe("project selectors", () => {
  it("prefers explicitly featured projects", () => {
    expect(selectFeaturedProjects(projects)).toEqual([projects[0]]);
  });

  it("returns same-category projects without the current project", () => {
    expect(selectRelatedProjects(projects[0], projects, 3)).toEqual([projects[1]]);
  });
});
