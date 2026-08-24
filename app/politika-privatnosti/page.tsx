import { Container } from "@/components/ui/container";
import { getContacts, hasValue, siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Politika privatnosti",
  description: `Obaveštenje o obradi podataka koje ${siteConfig.name} prikuplja putem kontakt forme.`,
  path: "/politika-privatnosti",
});

export default function PrivacyPage() {
  const company = hasValue(siteConfig.legalName) ? siteConfig.legalName : siteConfig.name;
  const contactLine = [
    hasValue(siteConfig.email) ? siteConfig.email : null,
    ...getContacts().map((contact) => `${contact.name} ${contact.phoneLabel}`),
    siteConfig.instagramHandle,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="bg-cream pt-28 pb-20 lg:pt-32 lg:pb-28">
      <Container className="max-w-3xl">
        <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-accent uppercase">
          Dokument
        </p>
        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-[-0.04em]">
          Politika privatnosti
        </h1>
        <p className="mt-4 text-sm text-muted-dark">
          Predložak teksta. Polja označena kao „potrebno potvrditi“ treba proveriti pre
          objavljivanja.
        </p>

        <div className="mt-10 space-y-8 text-[0.95rem] leading-relaxed text-ink">
          <section>
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.03em]">
              Ko obrađuje podatke
            </h2>
            <p className="mt-3 text-muted-dark">
              Podatke sa ovog sajta prima {company}.{" "}
              <span className="text-ink">
                [POTREBNO POTVRDITI: pun naziv privrednog subjekta, adresa, PIB/MB]
              </span>
            </p>
            <p className="mt-3 text-muted-dark">Kontakt: {contactLine}</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.03em]">
              Koje podatke prikupljamo
            </h2>
            <p className="mt-3 text-muted-dark">
              Putem kontakt forme možete poslati ime i prezime, telefon, e-mail adresu, lokaciju
              projekta, vrstu radova, opis projekta i, po želji, fotografije.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.03em]">
              Svrha obrade
            </h2>
            <p className="mt-3 text-muted-dark">
              Podaci se koriste isključivo da bismo odgovorili na vaš upit i dogovorili obim
              eventualnih radova. Ne koristimo ih za automatizovano profilisanje.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.03em]">
              Čuvanje i treća lica
            </h2>
            <p className="mt-3 text-muted-dark">
              Podaci se čuvaju onoliko koliko je potrebno za odgovor na upit i eventualnu
              realizaciju posla. Hosting sajta može biti na infrastrukturi treće strane (npr.
              Vercel).{" "}
              <span className="text-ink">
                [POTREBNO POTVRDITI: način čuvanja poruka, e-mail provajder, rok čuvanja]
              </span>
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.03em]">
              Vaša prava
            </h2>
            <p className="mt-3 text-muted-dark">
              Možete zatražiti uvid, ispravku ili brisanje podataka koje ste nam poslali, u
              meri u kojoj je to primenljivo. Zahtev pošaljite putem istog kanala koji koristite
              za kontakt.
            </p>
          </section>
        </div>
      </Container>
    </section>
  );
}
