"use client";

import { Phone } from "lucide-react";
import { useEffect } from "react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { Button, buttonVariants } from "@/components/ui/button";
import { getContacts, siteConfig, toTelHref } from "@/config/site";
import { cn } from "@/lib/utils";

type ContactPromptDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function ContactPromptDialog({ open, onClose }: ContactPromptDialogProps) {
  const contacts = getContacts();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-prompt-title"
        className="w-full max-w-sm rounded-[16px] border border-line-dark bg-white p-6 text-ink shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-accent uppercase">
          {siteConfig.shortName}
        </p>
        <h2 id="contact-prompt-title" className="mt-3 font-heading text-2xl font-semibold tracking-[-0.03em]">
          Kontaktirajte nas
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-dark">
          Slanje upita preko forme trenutno nije aktivno. Pozovite nas ili pišite na Instagram nalog{" "}
          {siteConfig.instagramHandle}.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {contacts.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {contacts.map((contact) => (
                <a
                  key={contact.phone}
                  href={toTelHref(contact.phone)}
                  className={cn(buttonVariants({ variant: "dark" }), "w-full")}
                >
                  <Phone className="h-4 w-4" strokeWidth={1.7} />
                  Pozovi {contact.name}
                </a>
              ))}
            </div>
          ) : null}
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}
          >
            <InstagramIcon className="h-4 w-4" />
            Otvori Instagram
          </a>
          <Button type="button" variant="outline" className="w-full" onClick={onClose}>
            Zatvori
          </Button>
        </div>
      </div>
    </div>
  );
}
