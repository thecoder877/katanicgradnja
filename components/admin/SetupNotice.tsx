import { siteConfig } from "@/config/site";

export function SetupNotice({ reason }: { reason?: "not_configured" | "forbidden" }) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-ink px-4 text-cream">
      <div className="max-w-md rounded-[12px] border border-line bg-surface p-8">
        <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-accent uppercase">
          {siteConfig.shortName}
        </p>
        <h1 className="mt-3 font-heading text-2xl font-semibold tracking-[-0.03em]">Admin</h1>
        {reason === "forbidden" ? (
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Ovaj nalog nema pristup admin panelu.
          </p>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Supabase još nije podešen. Dodajte <code className="text-cream">NEXT_PUBLIC_SUPABASE_URL</code> i
            ključ u <code className="text-cream">.env.local</code>, pa napravite admin nalog u Supabase
            dashboardu.
          </p>
        )}
      </div>
    </div>
  );
}
