import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  hasSvg: boolean;
  hasPng: boolean;
  className?: string;
};

export function Logo({ hasSvg, hasPng, className }: LogoProps) {
  const showMark = hasSvg || hasPng;

  return (
    <Link
      href="/"
      className={cn("flex min-h-11 items-center gap-3 text-cream", className)}
      aria-label={`${siteConfig.name} — početna`}
    >
      {showMark ? <LogoMark className="h-9 w-9 shrink-0" /> : null}
      <span className="font-heading text-[0.8rem] leading-tight font-semibold tracking-[0.14em] uppercase sm:text-[0.85rem]">
        <span className="block">Katanić</span>
        <span className="block text-cream/80">Gradnja 022</span>
      </span>
    </Link>
  );
}

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 42 L40 16 L68 42"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M20 42 V68 H60 V42"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        d="M36 68 V54 H44 V68"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path d="M18 72 H62" stroke="#C58A43" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
