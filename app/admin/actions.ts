"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { toSlug } from "@/lib/slug";
import {
  MAX_ADMIN_PHOTO_BYTES,
  MAX_ADMIN_PHOTO_COUNT,
  loginFieldsSchema,
  parseProjectFields,
  uuidSchema,
} from "@/lib/security/admin-schema";
import { rateLimit } from "@/lib/security/rate-limit";
import { getPublicClientIp, isHoneypotTriggered } from "@/lib/security/request";
import { extensionForImageType, sniffImageType, validateImageFiles } from "@/lib/security/uploads";

const BUCKET = "project-images";

type ActionResult = { ok: true } | { ok: false; error: string };

function revalidatePublic(slug?: string) {
  revalidatePath("/");
  revalidatePath("/projekti");
  revalidatePath("/usluge");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/projekti/${slug}`);
}

function filesFromForm(formData: FormData): File[] {
  return formData
    .getAll("photos")
    .filter((value): value is File => value instanceof File && value.size > 0);
}

function contentTypeFor(type: "jpeg" | "png" | "webp" | "avif") {
  if (type === "png") return "image/png";
  if (type === "webp") return "image/webp";
  if (type === "avif") return "image/avif";
  return "image/jpeg";
}

export async function loginAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  if (isHoneypotTriggered(formData.get("company_website"))) {
    return { error: "Prijava nije uspela. Proverite podatke." };
  }

  const parsed = loginFieldsSchema.safeParse({
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Unesite e-mail i lozinku." };
  }

  const ip = getPublicClientIp(await headers());
  if (!rateLimit(`login:${ip}:${parsed.data.email.toLowerCase()}`, 5, 15 * 60 * 1000)) {
    return { error: "Previše pokušaja. Pokušajte kasnije." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Prijava nije uspela. Proverite podatke." };
  }

  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin");
}

export async function createProjectAction(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok || !admin.supabase) {
    return { ok: false, error: "Niste prijavljeni." };
  }

  const parsed = parseProjectFields(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Proverite unete podatke." };
  }

  const files = filesFromForm(formData);
  const fileError = await validateImageFiles(files, {
    maxBytes: MAX_ADMIN_PHOTO_BYTES,
    maxCount: MAX_ADMIN_PHOTO_COUNT,
    allowAvif: true,
  });
  if (fileError) return { ok: false, error: fileError };

  const { title, description, category, featured, published, layout } = parsed.data;
  let slug = toSlug(title);
  if (!slug) slug = `projekat-${Date.now()}`;

  const { data: existing } = await admin.supabase.from("projects").select("slug").eq("slug", slug).maybeSingle();
  if (existing) slug = `${slug}-${crypto.randomUUID().slice(0, 6)}`;

  const { data: created, error } = await admin.supabase
    .from("projects")
    .insert({
      slug,
      title,
      description,
      category,
      featured,
      published,
      layout,
      cover_image: "",
    })
    .select("id")
    .single();

  if (error || !created) {
    return { ok: false, error: "Projekat nije sačuvan." };
  }

  const upload = await uploadFiles(admin.supabase, created.id, title, files, 0);
  if (!upload.ok) return upload;

  if (upload.srcs[0]) {
    await admin.supabase
      .from("projects")
      .update({ cover_image: upload.srcs[0], updated_at: new Date().toISOString() })
      .eq("id", created.id);
  }

  revalidatePublic(slug);
  return { ok: true };
}

export async function updateProjectAction(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok || !admin.supabase) {
    return { ok: false, error: "Niste prijavljeni." };
  }

  const idParsed = uuidSchema.safeParse(String(formData.get("id") ?? ""));
  if (!idParsed.success) return { ok: false, error: "Nedostaje projekat." };

  const parsed = parseProjectFields(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Proverite unete podatke." };
  }

  const { data: current, error: currentError } = await admin.supabase
    .from("projects")
    .select("slug")
    .eq("id", idParsed.data)
    .single();

  if (currentError || !current) return { ok: false, error: "Projekat nije pronađen." };

  const { title, description, category, featured, published, layout } = parsed.data;
  const { error } = await admin.supabase
    .from("projects")
    .update({
      title,
      description,
      category,
      featured,
      published,
      layout,
      updated_at: new Date().toISOString(),
    })
    .eq("id", idParsed.data);

  if (error) return { ok: false, error: "Izmene nisu sačuvane." };

  revalidatePublic(current.slug);
  return { ok: true };
}

export async function deleteProjectAction(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok || !admin.supabase) {
    return { ok: false, error: "Niste prijavljeni." };
  }

  const idParsed = uuidSchema.safeParse(String(formData.get("id") ?? ""));
  if (!idParsed.success) return { ok: false, error: "Nedostaje projekat." };

  const { data: project } = await admin.supabase
    .from("projects")
    .select("slug")
    .eq("id", idParsed.data)
    .single();
  const { data: images } = await admin.supabase
    .from("project_images")
    .select("storage_path")
    .eq("project_id", idParsed.data);

  const paths = (images ?? []).map((image) => image.storage_path).filter((path): path is string => Boolean(path));
  if (paths.length > 0) {
    await admin.supabase.storage.from(BUCKET).remove(paths);
  }

  const { error } = await admin.supabase.from("projects").delete().eq("id", idParsed.data);
  if (error) return { ok: false, error: "Projekat nije obrisan." };

  revalidatePublic(project?.slug);
  return { ok: true };
}

export async function uploadImagesAction(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok || !admin.supabase) {
    return { ok: false, error: "Niste prijavljeni." };
  }

  const idParsed = uuidSchema.safeParse(String(formData.get("id") ?? ""));
  if (!idParsed.success) return { ok: false, error: "Nedostaje projekat." };

  const files = filesFromForm(formData);
  if (files.length === 0) return { ok: false, error: "Izaberite fotografije." };

  const { data: existingRows } = await admin.supabase
    .from("project_images")
    .select("id")
    .eq("project_id", idParsed.data);

  const remainingSlots = MAX_ADMIN_PHOTO_COUNT - (existingRows?.length ?? 0);
  if (remainingSlots <= 0) {
    return { ok: false, error: `Projekat već ima ${MAX_ADMIN_PHOTO_COUNT} fotografija.` };
  }

  const fileError = await validateImageFiles(files, {
    maxBytes: MAX_ADMIN_PHOTO_BYTES,
    maxCount: remainingSlots,
    allowAvif: true,
  });
  if (fileError) return { ok: false, error: fileError };

  const { data: project } = await admin.supabase
    .from("projects")
    .select("slug, title, cover_image")
    .eq("id", idParsed.data)
    .single();

  if (!project) return { ok: false, error: "Projekat nije pronađen." };

  const { data: existing } = await admin.supabase
    .from("project_images")
    .select("sort_order")
    .eq("project_id", idParsed.data)
    .order("sort_order", { ascending: false })
    .limit(1);

  const startOrder = (existing?.[0]?.sort_order ?? -1) + 1;
  const upload = await uploadFiles(admin.supabase, idParsed.data, project.title, files, startOrder);
  if (!upload.ok) return upload;

  if (!project.cover_image && upload.srcs[0]) {
    await admin.supabase
      .from("projects")
      .update({ cover_image: upload.srcs[0], updated_at: new Date().toISOString() })
      .eq("id", idParsed.data);
  }

  revalidatePublic(project.slug);
  return { ok: true };
}

export async function deleteImageAction(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok || !admin.supabase) {
    return { ok: false, error: "Niste prijavljeni." };
  }

  const imageId = uuidSchema.safeParse(String(formData.get("imageId") ?? ""));
  const projectId = uuidSchema.safeParse(String(formData.get("projectId") ?? ""));
  if (!imageId.success || !projectId.success) return { ok: false, error: "Nedostaje fotografija." };

  const { data: image } = await admin.supabase
    .from("project_images")
    .select("src, storage_path, project_id")
    .eq("id", imageId.data)
    .eq("project_id", projectId.data)
    .single();

  if (!image) return { ok: false, error: "Fotografija nije pronađena." };

  const { data: project } = await admin.supabase
    .from("projects")
    .select("slug, cover_image")
    .eq("id", projectId.data)
    .single();

  if (image.storage_path) {
    await admin.supabase.storage.from(BUCKET).remove([image.storage_path]);
  }

  const { error } = await admin.supabase
    .from("project_images")
    .delete()
    .eq("id", imageId.data)
    .eq("project_id", projectId.data);
  if (error) return { ok: false, error: "Fotografija nije obrisana." };

  if (project && project.cover_image === image.src) {
    const { data: remaining } = await admin.supabase
      .from("project_images")
      .select("src")
      .eq("project_id", projectId.data)
      .order("sort_order", { ascending: true })
      .limit(1);

    await admin.supabase
      .from("projects")
      .update({
        cover_image: remaining?.[0]?.src ?? "",
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId.data);
  }

  revalidatePublic(project?.slug);
  return { ok: true };
}

export async function setCoverAction(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok || !admin.supabase) {
    return { ok: false, error: "Niste prijavljeni." };
  }

  const projectId = uuidSchema.safeParse(String(formData.get("projectId") ?? ""));
  const src = String(formData.get("src") ?? "").trim();
  if (!projectId.success || !src || src.length > 2048) {
    return { ok: false, error: "Nedostaje fotografija." };
  }

  const { data: image } = await admin.supabase
    .from("project_images")
    .select("src")
    .eq("project_id", projectId.data)
    .eq("src", src)
    .maybeSingle();

  if (!image) return { ok: false, error: "Fotografija ne pripada ovom projektu." };

  const { data: project } = await admin.supabase
    .from("projects")
    .select("slug")
    .eq("id", projectId.data)
    .single();
  const { error } = await admin.supabase
    .from("projects")
    .update({ cover_image: image.src, updated_at: new Date().toISOString() })
    .eq("id", projectId.data);

  if (error) return { ok: false, error: "Naslovna fotografija nije promenjena." };
  revalidatePublic(project?.slug);
  return { ok: true };
}

async function uploadFiles(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectId: string,
  title: string,
  files: File[],
  startOrder: number,
): Promise<ActionResult & { srcs: string[] }> {
  const srcs: string[] = [];

  for (const [index, file] of files.entries()) {
    const sniffed = await sniffImageType(file);
    if (!sniffed) {
      return { ok: false, error: `Fajl ${file.name} nije ispravna fotografija.`, srcs };
    }

    const path = `${projectId}/${crypto.randomUUID()}.${extensionForImageType(sniffed)}`;
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: contentTypeFor(sniffed),
      upsert: false,
    });

    if (uploadError) {
      return { ok: false, error: "Upload fotografije nije uspeo.", srcs };
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const { error: insertError } = await supabase.from("project_images").insert({
      project_id: projectId,
      src: data.publicUrl,
      alt: title.slice(0, 120),
      sort_order: startOrder + index,
      storage_path: path,
    });

    if (insertError) {
      return { ok: false, error: "Fotografija je uploadovana, ali nije upisana u bazu.", srcs };
    }

    srcs.push(data.publicUrl);
  }

  return { ok: true, srcs };
}
