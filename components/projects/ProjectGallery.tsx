"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";
import { imageSizes } from "@/lib/images";
import type { Project } from "@/types/project";

export function ProjectGallery({ project }: { project: Project }) {
  const [active, setActive] = useState<number | null>(null);
  const titleId = useId();
  const images = project.images.length > 0 ? project.images : [project.coverImage];

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(() => {
    setActive((value) => {
      if (value === null) return value;
      return (value + images.length - 1) % images.length;
    });
  }, [images.length]);
  const next = useCallback(() => {
    setActive((value) => {
      if (value === null) return value;
      return (value + 1) % images.length;
    });
  }, [images.length]);

  useEffect(() => {
    if (active === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, next, prev]);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {images.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => setActive(index)}
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
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/92 p-4"
        >
          <p id={titleId} className="sr-only">
            Galerija projekta {project.title}
          </p>
          <button
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
        </div>
      ) : null}
    </>
  );
}
