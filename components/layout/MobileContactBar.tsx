"use client";

import { FileText, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { getContacts, toTelHref } from "@/config/site";

export function MobileContactBar() {
  const pathname = usePathname();
  const contacts = getContacts();

  if (pathname === "/kontakt" || pathname.startsWith("/admin")) return null;

  const columns = contacts.length + 1;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {contacts.map((contact) => (
          <a
            key={contact.phone}
            href={toTelHref(contact.phone)}
            className="inline-flex min-h-12 flex-col items-center justify-center gap-0.5 px-1 text-cream"
          >
            <span className="inline-flex items-center gap-1 text-[0.7rem] font-semibold">
              <Phone className="h-3.5 w-3.5 text-accent" strokeWidth={1.8} />
              {contact.name}
            </span>
            <span className="text-[0.62rem] text-cream/70">{contact.phoneLabel}</span>
          </a>
        ))}
        <a
          href="/kontakt"
          className="inline-flex min-h-12 items-center justify-center gap-2 bg-accent text-sm font-semibold text-ink"
        >
          <FileText className="h-4 w-4" strokeWidth={1.8} />
          Upit
        </a>
      </div>
    </div>
  );
}
