const JPEG = [0xff, 0xd8, 0xff];
const PNG = [0x89, 0x50, 0x4e, 0x47];

export type SniffedImageType = "jpeg" | "png" | "webp" | "avif";

export async function sniffImageType(file: File): Promise<SniffedImageType | null> {
  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (header.length < 12) return null;

  if (header[0] === JPEG[0] && header[1] === JPEG[1] && header[2] === JPEG[2]) return "jpeg";
  if (header[0] === PNG[0] && header[1] === PNG[1] && header[2] === PNG[2] && header[3] === PNG[3]) {
    return "png";
  }

  const riff = String.fromCharCode(header[0], header[1], header[2], header[3]);
  const webp = String.fromCharCode(header[8], header[9], header[10], header[11]);
  if (riff === "RIFF" && webp === "WEBP") return "webp";

  const brand = String.fromCharCode(...header.slice(4, 16));
  if (brand.includes("ftypavif") || brand.includes("ftypavis") || brand.includes("ftypmif1")) {
    return "avif";
  }

  return null;
}

export function extensionForImageType(type: SniffedImageType): string {
  if (type === "png") return "png";
  if (type === "webp") return "webp";
  if (type === "avif") return "avif";
  return "jpg";
}

export async function validateImageFiles(
  files: File[],
  options: { maxBytes: number; maxCount: number; allowAvif?: boolean },
): Promise<string | null> {
  if (files.length > options.maxCount) {
    return `Možete priložiti najviše ${options.maxCount} fotografija.`;
  }

  for (const file of files) {
    if (file.size > options.maxBytes) {
      return `Fotografija ${file.name} je veća od dozvoljene veličine.`;
    }

    const sniffed = await sniffImageType(file);
    if (!sniffed) {
      return `Fajl ${file.name} nije ispravna fotografija.`;
    }
    if (sniffed === "avif" && !options.allowAvif) {
      return "Dozvoljeni formati fotografija su JPG, PNG i WEBP.";
    }
  }

  return null;
}
