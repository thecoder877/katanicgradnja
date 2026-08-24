import { Container } from "@/components/ui/container";
import { getServices } from "@/lib/content/services";
import { hasValue, siteConfig } from "@/config/site";

export function ServiceAreaNote() {
  const services = getServices();

  return (
    <section className="bg-cream py-16 lg:py-20">
      <Container className="grid gap-10 border-y border-line-dark py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-accent uppercase">
            05 / Obim radova
          </p>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Građevinski radovi prema dogovorenom obimu.
          </h2>
          <p className="mt-4 max-w-xl text-muted-dark">
            {hasValue(siteConfig.serviceArea)
              ? `Radove izvodimo na području: ${siteConfig.serviceArea}.`
              : "Pošaljite nam informacije o projektu i lokaciji, a javićemo se u vezi sa izvođenjem radova."}
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm font-medium">
          {services.map((service) => (
            <li key={service.slug} className="border-b border-line-dark py-3">
              {service.shortTitle}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
