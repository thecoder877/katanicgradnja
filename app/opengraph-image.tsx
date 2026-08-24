import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — Gradimo od temelja do krova.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#111315",
          color: "#F5F3EE",
          padding: 72,
        }}
      >
        <div
          style={{
            color: "#C58A43",
            fontSize: 18,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 64,
            lineHeight: 1.02,
            letterSpacing: -2,
            fontWeight: 700,
            maxWidth: 900,
          }}
        >
          Gradimo od temelja do krova.
        </div>
      </div>
    ),
    { ...size },
  );
}
