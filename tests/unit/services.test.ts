import { describe, expect, it } from "vitest";
import { services } from "../../data/services";
import { withServiceProjectCovers } from "../../lib/content/services";

describe("roof service", () => {
  it("is the first visible service with the approved local copy", () => {
    expect(services[0]).toMatchObject({
      slug: "krovovi",
      title: "Krovovi",
      shortTitle: "Krovovi",
      summary:
        "Izrada novih i rekonstrukcija postojećih krovova u Rumi i okolini, prema stanju objekta i dogovorenom obimu.",
      relatedCategory: "Krovovi",
    });
  });

  it("keeps the curated fallback image until a real roof project exists", () => {
    expect(withServiceProjectCovers([services[0]], [])[0]).toMatchObject({
      coverImage: services[0].coverImage,
      placeholderImages: true,
    });
  });
});
