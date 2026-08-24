import { Container } from "@/components/ui/container";
import { SectionEyebrow, SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    number: "01",
    title: "Pošaljite upit",
    text: "Pošaljite nam opis radova, lokaciju i fotografije ukoliko ih imate.",
  },
  {
    number: "02",
    title: "Dogovor i procena",
    text: "Razgovaramo o obimu radova i potrebnim detaljima.",
  },
  {
    number: "03",
    title: "Ponuda",
    text: "Na osnovu dogovorenog obima definišu se uslovi izvođenja.",
  },
  {
    number: "04",
    title: "Izvođenje radova",
    text: "Po dogovoru počinje realizacija projekta.",
  },
];

export function ProcessSection() {
  return (
    <section className="bg-surface py-20 text-cream lg:py-28">
      <Container>
        <SectionEyebrow>04 / Proces</SectionEyebrow>
        <SectionHeading className="mt-4 text-cream">Kako počinjemo projekat</SectionHeading>
        <ol className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.number} className="border-t border-line pt-6">
              <p className="font-heading text-sm tracking-[0.16em] text-accent">{step.number}</p>
              <h3 className="mt-4 font-heading text-2xl font-semibold tracking-[-0.03em]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
