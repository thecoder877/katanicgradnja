import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { Container } from "@/components/ui/container";
import { SectionEyebrow, SectionHeading } from "@/components/ui/section-heading";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Kontakt",
  description:
    "Pošaljite osnovne informacije o radovima koje planirate i zatražite ponudu od Katanić Gradnja 022.",
  path: "/kontakt",
});

export default function ContactPage() {
  return (
    <section className="bg-cream pt-28 pb-20 lg:pt-32 lg:pb-28">
      <Container>
        <SectionEyebrow>Kontakt</SectionEyebrow>
        <SectionHeading as="h1" className="mt-4">
          Razgovarajmo o vašem projektu.
        </SectionHeading>
        <p className="mt-5 max-w-2xl text-muted-dark">
          Pošaljite nam osnovne informacije o radovima koje planirate. Ako imate fotografije
          postojećeg stanja, možete ih poslati zajedno sa upitom.
        </p>
        <div className="mt-12 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <ContactInfo />
          <div className="rounded-[12px] border border-line-dark bg-white p-5 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
