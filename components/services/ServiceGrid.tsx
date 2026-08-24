import { ServiceCard } from "@/components/services/ServiceCard";
import type { Service } from "@/types/service";

export function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service, index) => (
        <div key={service.slug} className={index === 0 ? "md:col-span-2 lg:col-span-1" : undefined}>
          <ServiceCard service={service} />
        </div>
      ))}
    </div>
  );
}
