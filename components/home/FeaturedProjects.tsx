import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Container } from "@/components/ui/container";
import { SectionEyebrow, SectionHeading } from "@/components/ui/section-heading";
import type { Project } from "@/types/project";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  const [first, second, third, fourth, ...rest] = projects;

  return (
    <section className="bg-ink py-20 text-cream lg:py-28">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionEyebrow>02 / Radovi</SectionEyebrow>
            <SectionHeading className="mt-4 text-cream">Naši radovi</SectionHeading>
            <p className="mt-4 max-w-xl text-base text-muted">
              Pogledajte deo izvedenih projekata.
            </p>
          </div>
          <Link
            href="/projekti"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cream"
          >
            Svi projekti
            <ArrowUpRight className="h-4 w-4 text-accent" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {first ? (
            <ProjectCard key={first.slug} project={first} size="wide" className="lg:col-span-2" />
          ) : null}
          {third ? <ProjectCard key={third.slug} project={third} size="tall" /> : null}
          {second ? (
            <ProjectCard key={second.slug} project={second} size="wide" className="lg:col-span-2" />
          ) : null}
          {fourth ? <ProjectCard key={fourth.slug} project={fourth} /> : null}
          {rest.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              size={project.layout === "tall" ? "tall" : "standard"}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
