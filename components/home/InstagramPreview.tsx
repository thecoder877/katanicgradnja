import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { SectionEyebrow, SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import type { Project } from "@/types/project";

export function InstagramPreview({ projects }: { projects: Project[] }) {
  const thumbs = projects.slice(0, 6);

  return (
    <section className="bg-cream pb-8 lg:pb-10">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionEyebrow>06 / Instagram</SectionEyebrow>
            <SectionHeading className="mt-4">Pratite naše radove</SectionHeading>
            <p className="mt-4 text-muted-dark">
              Aktuelne fotografije sa terena objavljujemo na Instagram nalogu{" "}
              {siteConfig.instagramHandle}.
            </p>
          </div>
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold"
          >
            Pogledajte Instagram
            <ArrowUpRight className="h-4 w-4 text-accent" />
          </a>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {thumbs.map((project) => (
            <a
              key={project.slug}
              href={siteConfig.instagram}
              target="_blank"
              rel="noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-[12px]"
            >
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none"
              />
              <span className="sr-only">Instagram — {project.title}</span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
