import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { LoginForm } from "@/components/admin/LoginForm";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { getAdminProjects } from "@/lib/content/projects";
import { getAdminSession } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session.ok && session.reason === "not_configured") {
    return <SetupNotice reason="not_configured" />;
  }

  if (!session.ok && session.reason === "forbidden") {
    return <SetupNotice reason="forbidden" />;
  }

  if (!session.ok) {
    return <LoginForm />;
  }

  const projects = await getAdminProjects();
  return <AdminDashboard email={session.email} projects={projects} />;
}
