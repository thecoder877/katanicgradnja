import { describe, expect, it } from "vitest";
import { pageMetadata } from "../../lib/seo";

describe("pageMetadata", () => {
  it("uses the supplied real page image for Open Graph and Twitter", () => {
    const metadata = pageMetadata({
      title: "Krov u Rumi",
      description: "Rekonstrukcija krova.",
      path: "/projekti/krov-u-rumi",
      image: "/images/krov.jpg",
    });

    expect(metadata.openGraph).toMatchObject({ images: [{ url: "/images/krov.jpg" }] });
    expect(metadata.twitter).toMatchObject({ images: ["/images/krov.jpg"] });
  });

  it("falls back to the site image when no page image exists", () => {
    const metadata = pageMetadata({ title: "Krovovi", description: "Krovni radovi.", path: "/usluge/krovovi" });
    expect(metadata.openGraph).toMatchObject({ images: [{ url: expect.stringContaining("/images/") }] });
  });
});
