import { describe, expect, it } from "vitest";
import { getPublishReadiness, parseProjectFields } from "../../lib/security/admin-schema";

function validForm() {
  const form = new FormData();
  form.set("title", "Krov u Rumi");
  form.set("category", "Krovovi");
  form.set("location", "Ruma");
  form.set("year", "2026");
  form.set("description", "Rekonstrukcija krova.");
  form.set("workItems", "Nova konstrukcija\n\nCrep");
  form.set("layout", "standard");
  return form;
}

describe("project admin schema", () => {
  it("normalizes bounded work items", () => {
    const result = parseProjectFields(validForm());
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.workItems).toEqual(["Nova konstrukcija", "Crep"]);
  });

  it("rejects more than twelve work items", () => {
    const form = validForm();
    form.set("workItems", Array.from({ length: 13 }, (_, index) => `Rad ${index + 1}`).join("\n"));
    expect(parseProjectFields(form).success).toBe(false);
  });

  it("requires local proof before publishing", () => {
    expect(
      getPublishReadiness({
        title: "Krov u Rumi",
        category: "Krovovi",
        location: "",
        images: [],
        coverImage: "",
      }),
    ).toEqual(["location", "image", "coverImage"]);
  });

  it("accepts a cover that belongs to the project", () => {
    expect(
      getPublishReadiness({
        title: "Krov u Rumi",
        category: "Krovovi",
        location: "Ruma",
        images: ["/krov.jpg"],
        coverImage: "/krov.jpg",
      }),
    ).toEqual([]);
  });
});
