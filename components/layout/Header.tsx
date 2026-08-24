"use client";

import { Menu, X } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/media/Logo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { mainNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { MobileNavigation } from "./MobileNavigation";

type HeaderProps = {
  hasLogoSvg: boolean;
  hasLogoPng: boolean;
};

export function Header({ hasLogoSvg, hasLogoPng }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const toggleRef = useRef<HTMLButtonElement>(null);

  if (pathname !== menuPath) {
    setMenuPath(pathname);
    setOpen(false);
  }

  const isHome = pathname === "/";
  const solid = !isHome || scrolled || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-200 ease-out",
        solid
          ? "border-line bg-ink"
          : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-[4.25rem] items-center justify-between gap-4 lg:h-[4.75rem]">
        <Logo hasSvg={hasLogoSvg} hasPng={hasLogoPng} />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Glavna navigacija">
          {mainNavigation.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex min-h-11 items-center px-3 text-[0.82rem] font-medium tracking-[0.04em] uppercase transition-colors duration-200",
                  active ? "text-accent" : "text-cream/80 hover:text-cream",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noreferrer"
            className="hidden min-h-11 min-w-11 items-center justify-center text-cream/80 transition-colors duration-200 hover:text-accent md:inline-flex"
            aria-label={`Instagram ${siteConfig.instagramHandle}`}
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
          <ButtonLink href="/kontakt" className="hidden sm:inline-flex" size="default">
            Zatražite ponudu
          </ButtonLink>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center text-cream lg:hidden"
            aria-label={open ? "Zatvori meni" : "Otvori meni"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      <MobileNavigation
        open={open}
        onClose={() => {
          setOpen(false);
          toggleRef.current?.focus();
        }}
        pathname={pathname}
      />
    </header>
  );
}
