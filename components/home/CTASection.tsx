import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import { imageSizes } from "@/lib/images";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-cream lg:py-32">
      <Image
        src={siteConfig.images.cta}
        alt=""
        fill
        sizes={imageSizes.full}
        className="object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-ink/70" />
      <Container className="relative z-10 max-w-3xl">
        <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-accent uppercase">
          Upit
        </p>
        <h2 className="mt-4 font-heading text-4xl leading-[1.05] font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
          Planirate gradnju ili renoviranje?
        </h2>
        <p className="mt-5 max-w-xl text-base text-cream/75">
          Pošaljite nam detalje projekta i kontaktiraćemo vas radi daljeg dogovora.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/kontakt" size="lg">
            Zatražite ponudu
          </ButtonLink>
          <ButtonLink
            href={siteConfig.instagram}
            target="_blank"
            rel="noreferrer"
            variant="secondary"
            size="lg"
          >
            Instagram
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
