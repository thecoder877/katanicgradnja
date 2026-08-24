"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

type SiteShellProps = {
  header: ReactNode;
  footer: ReactNode;
  bar: ReactNode;
  children: ReactNode;
};

export function SiteShell({ header, footer, bar, children }: SiteShellProps) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <div className="flex min-h-full flex-col">{children}</div>;
  }

  return (
    <>
      {header}
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      {footer}
      {bar}
    </>
  );
}
