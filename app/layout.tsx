import type { Metadata, Viewport } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import { Inter, Manrope } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileContactBar } from "@/components/layout/MobileContactBar";
import { SiteShell } from "@/components/layout/SiteShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { getBusinessJsonLd } from "@/lib/json-ld";
import { defaultMetadata } from "@/lib/seo";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  themeColor: "#111315",
  width: "device-width",
  initialScale: 1,
};

function logoExists(file: "svg" | "png") {
  return existsSync(path.join(process.cwd(), "public", "logo", `katanic-gradnja-logo.${file}`));
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  const hasLogoSvg = logoExists("svg");
  const hasLogoPng = logoExists("png");

  return (
    <html
      lang={siteConfig.language}
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream font-sans text-ink">
        <JsonLd data={getBusinessJsonLd()} />
        <SiteShell
          header={<Header hasLogoSvg={hasLogoSvg} hasLogoPng={hasLogoPng} />}
          footer={<Footer hasLogoSvg={hasLogoSvg} hasLogoPng={hasLogoPng} />}
          bar={<MobileContactBar />}
        >
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
