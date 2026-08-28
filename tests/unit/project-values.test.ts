import { describe, expect, it } from "vitest";
import { createProjectInsert, projectUpdateValues } from "../../lib/admin/project-values";

const fields = {
  title: "Krov u Rumi",
  description: "Rekonstrukcija krova",
  category: "Krovovi" as const,
  location: "Ruma",
  year: 2026,
  workItems: ["Konstrukcija", "Crep"],
  featured: true,
  published: true,
  layout: "standard" as const,
};

describe("project persistence values", () => {
  it("always creates a new project as an unpublished draft", () => {
    expect(createProjectInsert(fields, "krov-u-rumi")).toMatchObject({
      slug: "krov-u-rumi",
      location: "Ruma",
      year: 2026,
      work_items: ["Konstrukcija", "Crep"],
      published: false,
      cover_image: "",
    });
  });

  it("keeps the requested publish value for a validated update", () => {
    expect(projectUpdateValues(fields)).toMatchObject({ published: true, work_items: fields.workItems });
  });
});
