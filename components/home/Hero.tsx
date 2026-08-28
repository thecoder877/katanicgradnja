import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getPhoneHref, siteConfig } from "@/config/site";
import { imageSizes } from "@/lib/images";

const indicators = ["Ruma i okolina", "Direktan dogovor sa majstorom", "Obilazak pre ponude"];

export function Hero() {
  const phoneHref = getPhoneHref() ?? "/kontakt";

  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink lg:min-h-[92vh] lg:items-center">
      <Image
        src={siteConfig.images.hero}
        alt="Građevinski radovi — izgradnja objekta od temelja do krova"
        fill
        priority
        sizes={imageSizes.hero}
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-ink/70" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,19,21,0.72)_0%,rgba(17,19,21,0.28)_58%,rgba(17,19,21,0.18)_100%)]" />

      <Container className="hero-reveal relative z-10 w-full pt-28 pb-28 sm:pt-32 lg:pb-24">
        <p className="text-[0.7rem] font-semibold tracking-[0.28em] text-accent uppercase">
          {siteConfig.name}
        </p>
        <h1 className="mt-5 max-w-[14ch] font-heading text-[clamp(2.6rem,8vw,6.2rem)] leading-[0.95] font-semibold tracking-[-0.045em] text-cream">
          Gradimo od temelja do krova.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/78 sm:text-lg">
          Gradnja i rekonstrukcija kuća, krovovi i drugi građevinski radovi u Rumi i okolini.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <ButtonLink href={phoneHref} size="lg">
            Pozovite za dogovor
          </ButtonLink>
          <ButtonLink href="/projekti" variant="secondary" size="lg">
            Pogledajte izvedene radove
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>

        <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-cream/15 pt-6 text-[0.72rem] font-semibold tracking-[0.16em] text-cream/70 uppercase">
          {indicators.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
