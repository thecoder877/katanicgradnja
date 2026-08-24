"use client";

import { InstagramIcon } from "@/components/icons/InstagramIcon";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { mainNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type MobileNavigationProps = {
  open: boolean;
  onClose: () => void;
  pathname: string;
};

export function MobileNavigation({ open, onClose, pathname }: MobileNavigationProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>("a, button");
    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();

      if (event.key !== "Tab" || !panel) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      );
      if (focusable.length === 0) return;
      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault();
        lastEl.focus();
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-navigation"
      ref={panelRef}
      hidden={!open}
      className={cn(
        "border-t border-line bg-ink lg:hidden",
        open ? "block" : "hidden",
      )}
    >
      <Container className="flex min-h-[calc(100svh-4.25rem)] flex-col gap-8 py-8">
        <nav aria-label="Mobilna navigacija">
          <ul className="flex flex-col">
            {mainNavigation.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex min-h-14 items-center border-b border-line font-heading text-2xl tracking-[-0.03em]",
                      active ? "text-accent" : "text-cream",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto flex flex-col gap-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <ButtonLink href="/kontakt" onClick={onClose} size="lg">
            Zatražite ponudu
          </ButtonLink>
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-cream/80"
          >
            <InstagramIcon className="h-4 w-4" />
            Instagram {siteConfig.instagramHandle}
          </a>
        </div>
      </Container>
    </div>
  );
}
