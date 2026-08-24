import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center bg-ink pt-24 text-cream">
      <Container>
        <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-accent uppercase">404</p>
        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
          Stranica nije pronađena.
        </h1>
        <p className="mt-4 max-w-md text-cream/70">
          Tražena stranica ne postoji ili je premeštena.
        </p>
        <ButtonLink href="/" className="mt-8">
          Nazad na početnu
        </ButtonLink>
      </Container>
    </section>
  );
}
