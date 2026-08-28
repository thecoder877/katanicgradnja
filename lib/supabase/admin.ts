import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { hasAdminAccess } from "@/lib/security/admin-access";

export type AdminSession =
  | { ok: true; email: string }
  | { ok: false; reason: "not_configured" | "unauthenticated" | "forbidden" };

export async function getAdminSession(): Promise<AdminSession> {
  if (!isSupabaseConfigured()) {
    return { ok: false, reason: "not_configured" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const email = typeof data?.claims?.email === "string" ? data.claims.email : "";

  if (error || !data?.claims || !email) {
    return { ok: false, reason: "unauthenticated" };
  }

  const appMetadata = data.claims.app_metadata;
  const role =
    appMetadata && typeof appMetadata === "object" && "role" in appMetadata
      ? String(appMetadata.role)
      : "";

  if (!hasAdminAccess({ email, role }, process.env.ADMIN_EMAILS ?? "")) {
    return { ok: false, reason: "forbidden" };
  }

  return { ok: true, email };
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.ok) {
    return { ...session, supabase: null };
  }

  return { ...session, supabase: await createClient() };
}
