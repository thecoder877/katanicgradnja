import Image from "next/image";
import { CTASection } from "@/components/home/CTASection";
import { Container } from "@/components/ui/container";
import { SectionEyebrow, SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "O nama",
  description:
    "Katanić Gradnja 022 bavi se izvođenjem građevinskih radova — od izgradnje objekata od temelja do krova, preko rekonstrukcija i adaptacija, do uređenja dvorišta, ograda, behatona i bazena.",
  path: "/o-nama",
});

const work = ["Novogradnja", "Rekonstrukcija", "Adaptacija", "Spoljni građevinski radovi"];

export default function AboutPage() {
  return (
    <>
      <section className="bg-ink pt-28 pb-16 text-cream lg:pt-32 lg:pb-20">
        <Container className="max-w-3xl">
          <SectionEyebrow>O nama</SectionEyebrow>
          <SectionHeading as="h1" className="mt-4 text-cream">
            {siteConfig.name}
          </SectionHeading>
          <p className="mt-6 text-lg leading-relaxed text-cream/78">
            Katanić Gradnja 022 bavi se izvođenjem različitih građevinskih radova — od izgradnje
            objekata od temelja do krova, preko rekonstrukcija i adaptacija, do uređenja dvorišta,
            ograda, behatona i bazena.
          </p>
        </Container>
      </section>

      <section className="relative min-h-[52vh] overflow-hidden bg-surface lg:min-h-[68vh]">
        <Image
          src="/images/projekti/izgradnja-kuce/04.jpg"
          alt="Građevinski radovi Katanić Gradnja 022"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </section>

      <section className="bg-cream py-20 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-accent uppercase">
              Šta radimo
            </p>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Radovi na objektu i oko objekta.
            </h2>
            <ul className="mt-8 space-y-3">
              {work.map((item) => (
                <li key={item} className="border-b border-line-dark py-3 text-lg">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[12px] bg-surface sm:aspect-[16/11] lg:aspect-[4/5]">
            <Image
              src="/images/projekti/stubovi-ograde/02.jpg"
              alt="Izvođenje radova na terenu"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      <section className="bg-cream-2 py-16 lg:py-24">
        <Container className="max-w-3xl">
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.04em]">Pristup radu</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-dark">
            Na svakom projektu najvažniji su dobar dogovor, kvalitetno izvođenje i jasno
            definisani radovi.
          </p>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
