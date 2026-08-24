import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ContentImage } from "@/components/media/ContentImage";
import { getProjectBySlug, getProjectSlugs, getRelatedProjects } from "@/lib/content/projects";
import { getBreadcrumbJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return pageMetadata({
    title: project.title,
    description: project.description ?? `${project.title} — ${project.category}.`,
    path: `/projekti/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const related = await getRelatedProjects(project);
  const galleryImages = project.images.filter((image) => image !== project.coverImage);

  return (
    <>
      <JsonLd
        data={getBreadcrumbJsonLd([
          { name: "Početna", path: "/" },
          { name: "Projekti", path: "/projekti" },
          { name: project.title, path: `/projekti/${project.slug}` },
        ])}
      />
      <article className="bg-cream pt-28 pb-16 lg:pt-32">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Početna", href: "/" },
              { label: "Projekti", href: "/projekti" },
              { label: project.title },
            ]}
          />
          <header className="mt-8 max-w-3xl">
            <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-accent uppercase">
              {project.category}
            </p>
            <h1 className="mt-4 font-heading text-4xl leading-[1.02] font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-dark">
              <div>
                <dt className="sr-only">Kategorija</dt>
                <dd>{project.category}</dd>
              </div>
              {project.location ? (
                <div>
                  <dt className="sr-only">Lokacija</dt>
                  <dd>{project.location}</dd>
                </div>
              ) : null}
              {project.year ? (
                <div>
                  <dt className="sr-only">Godina</dt>
                  <dd>{project.year}</dd>
                </div>
              ) : null}
            </dl>
          </header>
          <ContentImage
            src={project.coverImage}
            alt={project.title}
            sizes="100vw"
            priority
            className="mt-10 aspect-[16/9] max-h-[78vh]"
          />
          {project.description ? (
            <p className="mt-10 max-w-2xl text-lg leading-relaxed text-muted-dark">
              {project.description}
            </p>
          ) : null}
          {galleryImages.length > 0 ? (
            <div className="mt-12">
              <h2 className="mb-6 font-heading text-2xl font-semibold tracking-[-0.03em]">
                Galerija
              </h2>
              <ProjectGallery project={{ ...project, images: galleryImages }} />
            </div>
          ) : null}
        </Container>
      </article>

      <section className="bg-ink py-16 text-cream lg:py-24">
        <Container className="max-w-3xl">
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Imate sličan projekat?
          </h2>
          <p className="mt-4 text-cream/75">
            Pošaljite nam osnovne informacije i fotografije, a mi ćemo vam se javiti u vezi sa
            izvođenjem radova.
          </p>
          <ButtonLink href="/kontakt" className="mt-8">
            Zatražite ponudu
          </ButtonLink>
        </Container>
      </section>

      {related.length > 0 ? (
        <section className="bg-cream py-16 lg:py-24">
          <Container>
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.04em]">
              Drugi radovi
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProjectCard key={item.slug} project={item} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
