/**
 * Generates branded architectural placeholder PNGs.
 * TODO: Replace these files with original Katanić Gradnja photographs.
 */
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function crc32(buf) {
  let crc = ~0;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (~crc) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function writePng(path, width, height, pixels) {
  const raw = Buffer.alloc((width * 3 + 1) * height);
  for (let y = 0; y < height; y++) {
    const row = y * (width * 3 + 1);
    raw[row] = 0;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 3;
      const dest = row + 1 + x * 3;
      raw[dest] = pixels[i];
      raw[dest + 1] = pixels[i + 1];
      raw[dest + 2] = pixels[i + 2];
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;

  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, png);
}

function hex(color) {
  return [
    parseInt(color.slice(1, 3), 16),
    parseInt(color.slice(3, 5), 16),
    parseInt(color.slice(5, 7), 16),
  ];
}

function mix(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function inPoly(x, y, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i][0];
    const yi = pts[i][1];
    const xj = pts[j][0];
    const yj = pts[j][1];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 0.00001) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function inRect(x, y, r) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

function hash(n) {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

function draw(width, height, scene) {
  const bg = hex(scene.bg);
  const fg = hex(scene.fg);
  const accent = hex(scene.accent);
  const pixels = Buffer.alloc(width * height * 3);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const nx = x / width;
      const ny = y / height;
      const vignette = Math.min(1, Math.hypot(nx - 0.5, ny - 0.42) * 1.15);
      let color = mix(bg, hex("#0a0c0d"), vignette * 0.55 + ny * 0.2);
      const grain = (hash(x * 19.1 + y * 7.3 + scene.seed) - 0.5) * 10;
      color = [
        Math.max(0, Math.min(255, color[0] + grain)),
        Math.max(0, Math.min(255, color[1] + grain)),
        Math.max(0, Math.min(255, color[2] + grain)),
      ];

      for (const shape of scene.shapes) {
        const hit =
          shape.type === "poly"
            ? inPoly(nx, ny, shape.pts)
            : inRect(nx, ny, shape);
        if (hit) {
          const shade = mix(fg, accent, shape.accent ? 1 : 0);
          const depth = shape.depth ?? 0.18;
          color = mix(color, shade, depth);
        }
      }

      if (scene.line && Math.abs(ny - scene.line) < 0.0025 && nx > 0.08 && nx < 0.42) {
        color = mix(color, accent, 0.85);
      }

      const i = (y * width + x) * 3;
      pixels[i] = color[0];
      pixels[i + 1] = color[1];
      pixels[i + 2] = color[2];
    }
  }

  return pixels;
}

const house = {
  bg: "#14181b",
  fg: "#2a3036",
  accent: "#C58A43",
  seed: 11,
  line: 0.78,
  shapes: [
    { type: "poly", pts: [[0.18, 0.72], [0.42, 0.38], [0.66, 0.72]], depth: 0.28 },
    { type: "rect", x: 0.24, y: 0.58, w: 0.36, h: 0.24, depth: 0.22 },
    { type: "rect", x: 0.38, y: 0.64, w: 0.08, h: 0.18, depth: 0.12 },
    { type: "rect", x: 0.7, y: 0.08, w: 0.22, h: 0.84, depth: 0.1 },
  ],
};

const rebuild = {
  bg: "#171412",
  fg: "#3a342e",
  accent: "#9B6731",
  seed: 23,
  line: 0.82,
  shapes: [
    { type: "rect", x: 0.12, y: 0.28, w: 0.46, h: 0.52, depth: 0.2 },
    { type: "rect", x: 0.18, y: 0.36, w: 0.1, h: 0.12, depth: 0.08 },
    { type: "rect", x: 0.32, y: 0.36, w: 0.1, h: 0.12, depth: 0.08 },
    { type: "rect", x: 0.58, y: 0.18, w: 0.28, h: 0.62, depth: 0.16 },
    { type: "rect", x: 0.12, y: 0.78, w: 0.74, h: 0.006, accent: true, depth: 0.7 },
  ],
};

const pool = {
  bg: "#12161a",
  fg: "#243038",
  accent: "#C58A43",
  seed: 41,
  line: 0.2,
  shapes: [
    { type: "rect", x: 0.16, y: 0.32, w: 0.68, h: 0.38, depth: 0.26 },
    { type: "rect", x: 0.2, y: 0.36, w: 0.6, h: 0.3, depth: 0.12 },
    { type: "rect", x: 0.16, y: 0.7, w: 0.68, h: 0.08, depth: 0.18 },
  ],
};

const yard = {
  bg: "#161410",
  fg: "#3b352c",
  accent: "#C58A43",
  seed: 57,
  line: 0.16,
  shapes: [
    { type: "rect", x: 0.1, y: 0.62, w: 0.8, h: 0.22, depth: 0.16 },
    { type: "rect", x: 0.14, y: 0.66, w: 0.08, h: 0.04, depth: 0.28 },
    { type: "rect", x: 0.26, y: 0.66, w: 0.08, h: 0.04, depth: 0.22 },
    { type: "rect", x: 0.38, y: 0.66, w: 0.08, h: 0.04, depth: 0.28 },
    { type: "rect", x: 0.5, y: 0.66, w: 0.08, h: 0.04, depth: 0.2 },
    { type: "rect", x: 0.62, y: 0.66, w: 0.08, h: 0.04, depth: 0.26 },
    { type: "rect", x: 0.18, y: 0.18, w: 0.28, h: 0.36, depth: 0.18 },
  ],
};

const foundation = {
  bg: "#131618",
  fg: "#2e3438",
  accent: "#C58A43",
  seed: 73,
  line: 0.74,
  shapes: [
    { type: "rect", x: 0.08, y: 0.58, w: 0.84, h: 0.18, depth: 0.2 },
    { type: "rect", x: 0.14, y: 0.42, w: 0.04, h: 0.2, depth: 0.28 },
    { type: "rect", x: 0.24, y: 0.38, w: 0.04, h: 0.24, depth: 0.24 },
    { type: "rect", x: 0.34, y: 0.4, w: 0.04, h: 0.22, depth: 0.3 },
    { type: "rect", x: 0.5, y: 0.22, w: 0.36, h: 0.54, depth: 0.14 },
  ],
};

const fence = {
  bg: "#15171a",
  fg: "#32363c",
  accent: "#9B6731",
  seed: 89,
  line: 0.22,
  shapes: [
    { type: "rect", x: 0.1, y: 0.28, w: 0.06, h: 0.5, depth: 0.24 },
    { type: "rect", x: 0.22, y: 0.28, w: 0.06, h: 0.5, depth: 0.2 },
    { type: "rect", x: 0.34, y: 0.28, w: 0.06, h: 0.5, depth: 0.26 },
    { type: "rect", x: 0.46, y: 0.28, w: 0.06, h: 0.5, depth: 0.18 },
    { type: "rect", x: 0.1, y: 0.4, w: 0.42, h: 0.03, depth: 0.22 },
    { type: "rect", x: 0.62, y: 0.2, w: 0.28, h: 0.58, depth: 0.12 },
  ],
};

const facade = {
  bg: "#181614",
  fg: "#3a3530",
  accent: "#C58A43",
  seed: 101,
  line: 0.86,
  shapes: [
    { type: "rect", x: 0.2, y: 0.12, w: 0.6, h: 0.76, depth: 0.18 },
    { type: "rect", x: 0.28, y: 0.22, w: 0.12, h: 0.16, depth: 0.1 },
    { type: "rect", x: 0.46, y: 0.22, w: 0.12, h: 0.16, depth: 0.1 },
    { type: "rect", x: 0.28, y: 0.46, w: 0.12, h: 0.16, depth: 0.1 },
    { type: "rect", x: 0.46, y: 0.46, w: 0.12, h: 0.16, depth: 0.1 },
  ],
};

const plaster = {
  bg: "#1a1714",
  fg: "#4a433a",
  accent: "#C58A43",
  seed: 127,
  line: 0.18,
  shapes: [
    { type: "rect", x: 0.08, y: 0.1, w: 0.84, h: 0.8, depth: 0.12 },
    { type: "rect", x: 0.08, y: 0.1, w: 0.34, h: 0.8, depth: 0.18 },
    { type: "rect", x: 0.08, y: 0.72, w: 0.84, h: 0.008, accent: true, depth: 0.65 },
  ],
};

const hero = {
  ...house,
  seed: 3,
  bg: "#101214",
  shapes: [
    { type: "poly", pts: [[0.02, 0.92], [0.36, 0.34], [0.7, 0.92]], depth: 0.22 },
    { type: "rect", x: 0.16, y: 0.58, w: 0.4, h: 0.34, depth: 0.2 },
    { type: "rect", x: 0.58, y: 0.18, w: 0.38, h: 0.74, depth: 0.12 },
    { type: "rect", x: 0.1, y: 0.84, w: 0.28, h: 0.008, accent: true, depth: 0.8 },
  ],
};

const files = [
  ["public/images/hero/hero-cover.png", 1920, 1280, hero],
  ["public/images/hero/cta-cover.png", 1920, 900, facade],
  ["public/images/about/about-cover.png", 1600, 1100, rebuild],
  ["public/images/about/about-work.png", 1400, 1600, foundation],
  ["public/images/services/izgradnja.png", 1400, 1000, house],
  ["public/images/services/rekonstrukcije.png", 1400, 1000, rebuild],
  ["public/images/services/adaptacije.png", 1400, 1000, facade],
  ["public/images/services/ograde.png", 1400, 1000, fence],
  ["public/images/services/behaton.png", 1400, 1000, yard],
  ["public/images/services/bazeni.png", 1400, 1000, pool],
  ["public/images/services/malterisanje.png", 1400, 1000, plaster],
  ["public/images/projects/project-01/cover.png", 1600, 1100, rebuild],
  ["public/images/projects/project-01/01.png", 1600, 1100, facade],
  ["public/images/projects/project-01/02.png", 1200, 1500, foundation],
  ["public/images/projects/project-02/cover.png", 1600, 1200, house],
  ["public/images/projects/project-02/01.png", 1600, 1100, foundation],
  ["public/images/projects/project-02/02.png", 1400, 1600, house],
  ["public/images/projects/project-03/cover.png", 1400, 1600, facade],
  ["public/images/projects/project-03/01.png", 1600, 1100, facade],
  ["public/images/projects/project-04/cover.png", 1600, 1100, pool],
  ["public/images/projects/project-04/01.png", 1600, 1100, yard],
  ["public/images/projects/project-05/cover.png", 1600, 1200, yard],
  ["public/images/projects/project-05/01.png", 1400, 1000, fence],
  ["public/images/projects/project-06/cover.png", 1600, 1100, foundation],
  ["public/images/projects/project-06/01.png", 1600, 1100, house],
  ["public/images/projects/project-07/cover.png", 1400, 1500, house],
  ["public/images/projects/project-07/01.png", 1600, 1100, facade],
  ["public/images/projects/project-08/cover.png", 1600, 1100, fence],
  ["public/images/projects/project-08/01.png", 1400, 1200, yard],
];

for (const [rel, w, h, scene] of files) {
  const path = join(root, rel);
  writePng(path, w, h, draw(w, h, scene));
  console.log("wrote", rel);
}
