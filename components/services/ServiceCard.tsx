import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ContentImage } from "@/components/media/ContentImage";
import { cn } from "@/lib/utils";
import type { Service } from "@/types/service";

export function ServiceCard({
  service,
  featured = false,
}: {
  service: Service;
  featured?: boolean;
}) {
  return (
    <article className="group h-full">
      <Link
        href={`/usluge/${service.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-[12px] bg-cream-2"
      >
        <ContentImage
          src={service.coverImage}
          alt=""
          sizes={featured ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
          className={cn("aspect-[16/10]", featured && "md:aspect-[16/9]")}
          radius={false}
          imageClassName="transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
        />
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-heading text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
              {service.title}
            </h3>
            <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-accent transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" />
          </div>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-dark">
            {service.summary}
          </p>
          <span className="mt-5 text-sm font-semibold text-ink">Saznajte više</span>
        </div>
      </Link>
    </article>
  );
}
