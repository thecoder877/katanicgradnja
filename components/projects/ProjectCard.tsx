import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ContentImage } from "@/components/media/ContentImage";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

type ProjectCardProps = {
  project: Project;
  className?: string;
  size?: "standard" | "wide" | "tall";
};

const sizeClass = {
  standard: "aspect-[4/3]",
  wide: "aspect-[16/10] md:aspect-[16/9]",
  tall: "aspect-[4/5]",
};

export function ProjectCard({ project, className, size = "standard" }: ProjectCardProps) {
  return (
    <article className={cn("group", className)}>
      <Link href={`/projekti/${project.slug}`} className="block">
        <div className="relative overflow-hidden rounded-[12px]">
          <ContentImage
            src={project.coverImage}
            alt={project.title}
            sizes={
              size === "wide"
                ? "(min-width: 1024px) 66vw, 100vw"
                : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            }
            className={sizeClass[size]}
            radius={false}
            imageClassName="transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
          />
          <div className="absolute inset-0 bg-ink/20 transition-colors duration-300 group-hover:bg-ink/40" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-accent uppercase">
              {project.category}
            </p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <h3 className="font-heading text-xl leading-tight font-semibold text-cream sm:text-2xl">
                {project.title}
              </h3>
              <ArrowUpRight className="mb-0.5 h-5 w-5 shrink-0 text-cream transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" />
            </div>
            {project.location ? (
              <p className="mt-1 text-sm text-cream/70">{project.location}</p>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
