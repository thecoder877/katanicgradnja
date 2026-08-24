"use client";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex min-h-[70vh] items-center bg-cream pt-24">
      <Container>
        <h1 className="font-heading text-4xl font-semibold tracking-[-0.04em]">
          Došlo je do greške.
        </h1>
        <p className="mt-4 max-w-md text-muted-dark">
          Stranica trenutno nije mogla da se učita. Pokušajte ponovo ili se vratite na početnu.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center rounded-[10px] bg-accent px-5 text-sm font-semibold text-ink"
          >
            Pokušajte ponovo
          </button>
          <ButtonLink href="/" variant="outline">
            Nazad na početnu
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
