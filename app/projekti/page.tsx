import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { Container } from "@/components/ui/container";
import { SectionEyebrow, SectionHeading } from "@/components/ui/section-heading";
import { filterProjects } from "@/lib/content/projects";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Naši projekti",
  description:
    "Deo radova koje smo realizovali kroz izgradnju, rekonstrukcije, adaptacije i uređenje eksterijera.",
  path: "/projekti",
});

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function ProjectsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const projects = await filterProjects(category);

  return (
    <section className="bg-cream pt-28 pb-20 lg:pt-32 lg:pb-28">
      <Container>
        <SectionEyebrow>Projekti</SectionEyebrow>
        <SectionHeading as="h1" className="mt-4">
          Naši projekti
        </SectionHeading>
        <p className="mt-5 max-w-2xl text-muted-dark">
          Deo radova koje smo realizovali kroz izgradnju, rekonstrukcije, adaptacije i uređenje
          eksterijera.
        </p>
        <div className="mt-10">
          <ProjectFilters current={category} />
          {projects.length === 0 ? (
            <p className="mt-10 text-muted-dark">Trenutno nema projekata u ovoj kategoriji.</p>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  size={
                    project.layout === "tall"
                      ? "tall"
                      : project.layout === "wide" || index % 5 === 0
                        ? "wide"
                        : "standard"
                  }
                  className={
                    project.layout === "wide" || index % 5 === 0 ? "lg:col-span-2" : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
