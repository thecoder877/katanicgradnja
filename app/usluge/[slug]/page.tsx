import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTASection } from "@/components/home/CTASection";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ContentImage } from "@/components/media/ContentImage";
import { getPhoneHref } from "@/config/site";
import { getProjects } from "@/lib/content/projects";
import { getServiceBySlug, getServiceSlugs, withServiceProjectCovers } from "@/lib/content/services";
import { getServiceJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return pageMetadata({
    title: service.title,
    description: service.summary,
    path: `/usluge/${service.slug}`,
    image: service.coverImage,
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const projects = await getProjects();
  const resolved = withServiceProjectCovers([service], projects)[0] ?? service;
  const related = resolved.relatedCategory
    ? projects.filter((project) => project.category === resolved.relatedCategory).slice(0, 3)
    : [];
  const phoneHref = getPhoneHref() ?? "/kontakt";

  return (
    <>
      <JsonLd
        data={getServiceJsonLd({
          name: service.title,
          description: service.description,
          path: `/usluge/${service.slug}`,
          image: resolved.coverImage,
        })}
      />
      <section className="bg-cream pt-28 pb-16 lg:pt-32">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Početna", href: "/" },
              { label: "Usluge", href: "/usluge" },
              { label: service.title },
            ]}
          />
          <div className="mt-8 grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-accent uppercase">
                Usluga
              </p>
              <h1 className="mt-4 font-heading text-4xl leading-[1.02] font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                {service.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-dark">{service.description}</p>
              <ButtonLink href={phoneHref} className="mt-8">
                Pozovite za dogovor
              </ButtonLink>
            </div>
            <ContentImage
              src={resolved.coverImage}
              alt={service.title}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="aspect-[16/11]"
            />
          </div>
          <ul className="mt-12 grid gap-4 border-t border-line-dark pt-8 sm:grid-cols-3">
            {service.details.map((detail) => (
              <li key={detail} className="text-sm leading-relaxed text-muted-dark">
                {detail}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {related.length > 0 ? (
        <section className="bg-ink py-16 text-cream lg:py-24">
          <Container>
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.04em]">
              Povezani radovi
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {related.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <CTASection />
    </>
  );
}
