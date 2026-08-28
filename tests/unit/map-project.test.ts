import { describe, expect, it } from "vitest";
import { mapProject } from "../../lib/supabase/map-project";

const row = {
  id: "3e7fc174-6046-4aae-a307-bcf9795d681f",
  slug: "krov-ruma",
  title: "Krov Ruma",
  description: "",
  category: "Krovovi",
  location: "Ruma",
  year: 2026,
  featured: true,
  published: true,
  sort_order: 0,
  layout: "standard" as const,
  cover_image: "/krov.jpg",
  created_at: "2026-08-27T00:00:00.000Z",
  updated_at: "2026-08-27T00:00:00.000Z",
  project_images: [],
};

describe("mapProject", () => {
  it("normalizes a missing work-items value", () => {
    expect(mapProject({ ...row, work_items: null })).toMatchObject({ workItems: [] });
  });

  it("preserves ordered work items", () => {
    expect(mapProject({ ...row, work_items: ["Konstrukcija", "Crep"] })).toMatchObject({
      workItems: ["Konstrukcija", "Crep"],
    });
  });
});
