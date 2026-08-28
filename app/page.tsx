import { CTASection } from "@/components/home/CTASection";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Hero } from "@/components/home/Hero";
import { ProcessSection } from "@/components/home/ProcessSection";
import { ServiceAreaNote } from "@/components/home/ServiceAreaNote";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { getFeaturedProjects, getProjects } from "@/lib/content/projects";
import { getServices, withServiceProjectCovers } from "@/lib/content/services";

export default async function HomePage() {
  const projects = await getProjects();
  const featured = await getFeaturedProjects();
  const services = withServiceProjectCovers(getServices(), projects);

  return (
    <>
      <Hero />
      <ServicesPreview services={services} />
      <FeaturedProjects projects={featured} />
      <ProcessSection />
      <ServiceAreaNote />
      <CTASection />
    </>
  );
}
