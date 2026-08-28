"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { imageSizes } from "@/lib/images";
import type { Project } from "@/types/project";

export function ProjectGallery({ project }: { project: Project }) {
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const images = (project.images.length > 0 ? project.images : [project.coverImage]).filter(Boolean);

  const close = useCallback(() => dialogRef.current?.close(), []);
  const prev = useCallback(() => {
    setActive((value) => (value === null ? value : (value + images.length - 1) % images.length));
  }, [images.length]);
  const next = useCallback(() => {
    setActive((value) => (value === null ? value : (value + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (active === null || !dialogRef.current || dialogRef.current.open) return;
    dialogRef.current.showModal();
    closeButtonRef.current?.focus();
  }, [active]);

  const isOpen = active !== null;
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {images.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={(event) => {
              triggerRef.current = event.currentTarget;
              setActive(index);
            }}
            className="group relative block overflow-hidden rounded-[12px] bg-surface text-left"
          >
            <span className="sr-only">Otvori fotografiju {index + 1} u galeriji</span>
            <div className={index === 0 ? "relative aspect-[16/10]" : "relative aspect-[4/3]"}>
              <Image
                src={src}
                alt={`${project.title} — fotografija ${index + 1}`}
                fill
                sizes={imageSizes.gallery}
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none"
              />
            </div>
          </button>
        ))}
      </div>

      {active !== null ? (
        <dialog
          ref={dialogRef}
          aria-labelledby={titleId}
          onClose={() => {
            setActive(null);
            triggerRef.current?.focus();
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") prev();
            if (event.key === "ArrowRight") next();
          }}
          className="m-auto h-svh w-screen max-w-none border-0 bg-transparent p-4 text-cream backdrop:bg-ink/92 open:flex open:items-center open:justify-center"
        >
          <p id={titleId} className="sr-only">
            Galerija projekta {project.title}
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            className="absolute top-4 right-4 inline-flex min-h-11 min-w-11 items-center justify-center text-cream"
            aria-label="Zatvori galeriju"
          >
            <X className="h-6 w-6" />
          </button>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={prev}
                className="absolute left-3 inline-flex min-h-11 min-w-11 items-center justify-center text-cream sm:left-6"
                aria-label="Prethodna fotografija"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-3 inline-flex min-h-11 min-w-11 items-center justify-center text-cream sm:right-6"
                aria-label="Sledeća fotografija"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          ) : null}
          <div className="relative h-[min(82vh,900px)] w-[min(92vw,1200px)]">
            <Image
              src={images[active]}
              alt={`${project.title} — fotografija ${active + 1}`}
              fill
              sizes="92vw"
              className="object-contain"
            />
          </div>
        </dialog>
      ) : null}
    </>
  );
}
