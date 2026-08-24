import Link from "next/link";
import { isProjectFilterValue } from "@/lib/content/projects";
import { projectFilterOptions } from "@/types/project";
import { cn } from "@/lib/utils";

export function ProjectFilters({ current }: { current?: string }) {
  const active =
    current && isProjectFilterValue(current) ? current : "sve";

  return (
    <div
      role="group"
      aria-label="Filter projekata po vrsti radova"
      className="flex flex-wrap gap-2"
    >
      {projectFilterOptions.map((option) => {
        const isActive = active === option.value;
        const href =
          option.value === "sve" ? "/projekti" : `/projekti?category=${option.value}`;

        return (
          <Link
            key={option.value}
            href={href}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center rounded-[10px] border px-4 text-sm font-medium transition-colors duration-200",
              isActive
                ? "border-accent bg-accent text-ink"
                : "border-line-dark bg-transparent text-ink hover:border-ink/30",
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
