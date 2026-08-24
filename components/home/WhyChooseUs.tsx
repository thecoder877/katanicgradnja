import { Building2, Hammer, MessageCircle, Shapes } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionEyebrow, SectionHeading } from "@/components/ui/section-heading";

const items = [
  {
    icon: Hammer,
    title: "Kompletno izvođenje",
    text: "Od grubih građevinskih radova do završnih faza projekta.",
  },
  {
    icon: Shapes,
    title: "Različite vrste radova",
    text: "Gradnja, rekonstrukcije, adaptacije i radovi na uređenju eksterijera.",
  },
  {
    icon: MessageCircle,
    title: "Direktna komunikacija",
    text: "Kontaktirajte nas direktno i pošaljite detalje projekta.",
  },
  {
    icon: Building2,
    title: "Radovi na terenu",
    text: "Fokus na praktičnom izvođenju i konkretnim građevinskim rešenjima.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-cream py-20 lg:py-28">
      <Container>
        <SectionEyebrow>03 / Pristup</SectionEyebrow>
        <SectionHeading className="mt-4">Pouzdano izvođenje građevinskih radova.</SectionHeading>
        <div className="mt-12 grid gap-8 border-t border-line-dark pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <article key={item.title}>
              <item.icon className="h-5 w-5 text-accent" strokeWidth={1.6} />
              <h3 className="mt-4 font-heading text-xl font-semibold tracking-[-0.03em]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-dark">{item.text}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
