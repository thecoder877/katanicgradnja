"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";
import { HoneypotField } from "@/components/security/HoneypotField";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-svh items-center justify-center bg-ink px-4 text-cream">
      <form action={action} className="relative w-full max-w-sm rounded-[12px] border border-line bg-surface p-8">
        <HoneypotField />
        <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-accent uppercase">
          {siteConfig.shortName}
        </p>
        <h1 className="mt-3 font-heading text-2xl font-semibold tracking-[-0.03em]">Prijava</h1>
        <p className="mt-2 text-sm text-muted">Pristup je samo za administratore.</p>

        <label className="mt-8 block text-xs font-semibold tracking-[0.14em] uppercase">
          E-mail
          <input
            name="email"
            type="email"
            autoComplete="username"
            maxLength={254}
            required
            className="mt-2 min-h-11 w-full rounded-[10px] border border-line bg-ink px-3 text-sm font-normal tracking-normal text-cream"
          />
        </label>
        <label className="mt-5 block text-xs font-semibold tracking-[0.14em] uppercase">
          Lozinka
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            maxLength={256}
            required
            className="mt-2 min-h-11 w-full rounded-[10px] border border-line bg-ink px-3 text-sm font-normal tracking-normal text-cream"
          />
        </label>

        {state?.error ? <p className="mt-4 text-sm text-accent">{state.error}</p> : null}

        <Button type="submit" className="mt-8 w-full" disabled={pending}>
          {pending ? "Prijava..." : "Prijavite se"}
        </Button>
      </form>
    </div>
  );
}
