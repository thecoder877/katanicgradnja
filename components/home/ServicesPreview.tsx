import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Container } from "@/components/ui/container";
import { SectionEyebrow, SectionHeading } from "@/components/ui/section-heading";
import type { Service } from "@/types/service";

export function ServicesPreview({ services }: { services: Service[] }) {
  const [first, second, ...rest] = services;

  return (
    <section className="bg-cream py-20 lg:py-28">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionEyebrow>01 / Usluge</SectionEyebrow>
            <SectionHeading className="mt-4">Sve što je potrebno za vaš projekat.</SectionHeading>
          </div>
          <Link
            href="/usluge"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink"
          >
            Sve usluge
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {first ? (
            <div className="md:col-span-2">
              <ServiceCard service={first} featured />
            </div>
          ) : null}
          {second ? <ServiceCard service={second} /> : null}
          {rest.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </Container>
    </section>
  );
}
