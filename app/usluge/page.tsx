import { CTASection } from "@/components/home/CTASection";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { Container } from "@/components/ui/container";
import { SectionEyebrow, SectionHeading } from "@/components/ui/section-heading";
import { getProjects } from "@/lib/content/projects";
import { getServices, withServiceProjectCovers } from "@/lib/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Usluge",
  description:
    "Izgradnja kuća, rekonstrukcije, adaptacije, ograde, behaton, bazeni i mašinsko malterisanje.",
  path: "/usluge",
});

export default async function ServicesPage() {
  const services = withServiceProjectCovers(getServices(), await getProjects());

  return (
    <>
      <section className="bg-ink pt-28 pb-16 text-cream lg:pt-32 lg:pb-20">
        <Container>
          <SectionEyebrow className="text-accent">Usluge</SectionEyebrow>
          <SectionHeading as="h1" className="mt-4 text-cream">
            Sve što je potrebno za vaš projekat.
          </SectionHeading>
          <p className="mt-5 max-w-2xl text-cream/75">
            Od izgradnje objekata od temelja do krova, preko rekonstrukcija i adaptacija, do
            uređenja dvorišta, ograda, behatona i bazena.
          </p>
        </Container>
      </section>
      <section className="bg-cream py-16 lg:py-24">
        <Container>
          <ServiceGrid services={services} />
        </Container>
      </section>
      <CTASection />
    </>
  );
}
