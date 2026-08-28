"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createProjectInsert, projectUpdateValues } from "@/lib/admin/project-values";
import {
  classifyBatchState,
  managedImagePath,
  reconcileAmbiguousBatch,
  type BatchState,
} from "@/lib/admin/media-path";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { toSlug } from "@/lib/slug";
import {
  MAX_ADMIN_PHOTO_BYTES,
  MAX_ADMIN_PHOTO_COUNT,
  getPublishReadiness,
  loginFieldsSchema,
  parseProjectFields,
  uuidSchema,
} from "@/lib/security/admin-schema";
import { rateLimit } from "@/lib/security/rate-limit";
import { getPublicClientIp, isHoneypotTriggered } from "@/lib/security/request";
import { sniffImageType, validateImageFiles } from "@/lib/security/uploads";

const BUCKET = "project-images";
const readinessLabels: Record<string, string> = {
  title: "naziv",
  category: "kategoriju",
  location: "lokaciju",
  image: "najmanje jednu fotografiju",
  coverImage: "naslovnu fotografiju",
};

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

  const { title } = parsed.data;
  let slug = toSlug(title);
  if (!slug) slug = `projekat-${Date.now()}`;

  const { data: existing } = await admin.supabase.from("projects").select("slug").eq("slug", slug).maybeSingle();
  if (existing) slug = `${slug}-${crypto.randomUUID().slice(0, 6)}`;

  const { data: created, error } = await admin.supabase
    .from("projects")
    .insert(createProjectInsert(parsed.data, slug))
    .select("id")
    .single();

  if (error || !created) {
    return { ok: false, error: "Projekat nije sačuvan." };
  }

  const upload = await uploadFiles(admin.supabase, created.id, title, files, 0);
  if (!upload.ok) return upload;

  if (upload.srcs[0]) {
    const { error: coverError } = await admin.supabase
      .from("projects")
      .update({ cover_image: upload.srcs[0], updated_at: new Date().toISOString() })
      .eq("id", created.id);
    if (coverError) {
      console.error("project.cover_update_failed", { projectId: created.id, code: coverError.code });
      return { ok: false, error: "Draft je sačuvan, ali naslovna fotografija nije potvrđena." };
    }
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
    .select("slug, cover_image, project_images(src)")
    .eq("id", idParsed.data)
    .single();

  if (currentError || !current) return { ok: false, error: "Projekat nije pronađen." };

  if (parsed.data.published) {
    const images = (current.project_images ?? []).map((image) => image.src);
    const missing = getPublishReadiness({
      title: parsed.data.title,
      category: parsed.data.category,
      location: parsed.data.location,
      images,
      coverImage: current.cover_image,
    });
    if (missing.length > 0) {
      return {
        ok: false,
        error: `Za objavu dopunite: ${missing.map((item) => readinessLabels[item] ?? item).join(", ")}.`,
      };
    }
  }

  const { error } = await admin.supabase
    .from("projects")
    .update({
      ...projectUpdateValues(parsed.data),
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

  const { data: project, error: projectError } = await admin.supabase
    .from("projects")
    .select("slug, published")
    .eq("id", idParsed.data)
    .single();
  const { data: images, error: imagesError } = await admin.supabase
    .from("project_images")
    .select("storage_path")
    .eq("project_id", idParsed.data);

  if (projectError || !project) return { ok: false, error: "Projekat nije pronađen." };
  if (imagesError) return { ok: false, error: "Fotografije projekta nisu učitane." };

  const { error: unpublishError } = await admin.supabase
    .from("projects")
    .update({ published: false, updated_at: new Date().toISOString() })
    .eq("id", idParsed.data);
  if (unpublishError) return { ok: false, error: "Projekat nije obrisan." };

  const paths = (images ?? [])
    .map((image) => image.storage_path)
    .filter((path): path is string => Boolean(path));
  if (paths.length > 0) {
    const { error: storageError } = await admin.supabase.storage.from(BUCKET).remove(paths);
    if (storageError) {
      console.error("project.delete_storage_failed", { projectId: idParsed.data, code: storageError.name });
      revalidatePublic(project.slug);
      return { ok: false, error: "Projekat je sakriven, ali brisanje fotografija nije uspelo." };
    }
  }

  const { error } = await admin.supabase.from("projects").delete().eq("id", idParsed.data);
  if (error) {
    console.error("project.delete_db_failed", { projectId: idParsed.data, code: error.code });
    return { ok: false, error: "Projekat je sakriven, ali brisanje nije završeno." };
  }

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

  const { data: existingRows, error: existingRowsError } = await admin.supabase
    .from("project_images")
    .select("id")
    .eq("project_id", idParsed.data);
  if (existingRowsError) return { ok: false, error: "Fotografije projekta nisu učitane." };

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

  const { data: existing, error: orderError } = await admin.supabase
    .from("project_images")
    .select("sort_order")
    .eq("project_id", idParsed.data)
    .order("sort_order", { ascending: false })
    .limit(1);
  if (orderError) return { ok: false, error: "Redosled fotografija nije učitan." };

  const startOrder = (existing?.[0]?.sort_order ?? -1) + 1;
  const upload = await uploadFiles(admin.supabase, idParsed.data, project.title, files, startOrder);
  if (!upload.ok) return upload;

  if (!project.cover_image && upload.srcs[0]) {
    const { error: coverError } = await admin.supabase
      .from("projects")
      .update({ cover_image: upload.srcs[0], updated_at: new Date().toISOString() })
      .eq("id", idParsed.data);
    if (coverError) {
      console.error("project.cover_update_failed", { projectId: idParsed.data, code: coverError.code });
      return { ok: false, error: "Fotografije su sačuvane, ali naslovna nije potvrđena." };
    }
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

  const { data: project, error: projectError } = await admin.supabase
    .from("projects")
    .select("slug, cover_image, published")
    .eq("id", projectId.data)
    .single();
  if (projectError || !project) return { ok: false, error: "Projekat nije pronađen." };

  if (project.cover_image === image.src) {
    const { data: remaining, error: remainingError } = await admin.supabase
      .from("project_images")
      .select("src")
      .eq("project_id", projectId.data)
      .neq("id", imageId.data)
      .order("sort_order", { ascending: true })
      .limit(1);
    if (remainingError) return { ok: false, error: "Naslovna fotografija nije promenjena." };

    const nextCover = remaining?.[0]?.src ?? "";
    const { error: coverError } = await admin.supabase
      .from("projects")
      .update({
        cover_image: nextCover,
        published: nextCover ? project.published : false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId.data);
    if (coverError) return { ok: false, error: "Naslovna fotografija nije promenjena." };
  }

  const { error } = await admin.supabase
    .from("project_images")
    .delete()
    .eq("id", imageId.data)
    .eq("project_id", projectId.data);
  if (error) return { ok: false, error: "Fotografija nije obrisana." };

  if (image.storage_path) {
    const { error: storageError } = await admin.supabase.storage.from(BUCKET).remove([image.storage_path]);
    if (storageError) {
      console.error("image.cleanup_failed", {
        projectId: projectId.data,
        imageId: imageId.data,
        storagePath: image.storage_path,
        code: storageError.name,
      });
      revalidatePublic(project?.slug);
      return { ok: false, error: "Fotografija je uklonjena sa sajta, ali fajl nije očišćen." };
    }
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
  const expectedPaths: string[] = [];
  const batchId = crypto.randomUUID();

  for (const [index, file] of files.entries()) {
    const sniffed = await sniffImageType(file);
    if (!sniffed) {
      await cleanupBatch(supabase, projectId, batchId, expectedPaths);
      return { ok: false, error: `Fajl ${file.name} nije ispravna fotografija.`, srcs };
    }

    const path = managedImagePath(projectId, batchId, crypto.randomUUID(), sniffed);
    expectedPaths.push(path);
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: contentTypeFor(sniffed),
      upsert: false,
    });

    if (uploadError) {
      const stored = await storageObjectExists(supabase, projectId, batchId, path);
      if (!stored) {
        const recovered = await reconcileAmbiguousUpload(supabase, projectId, batchId, expectedPaths);
        if (recovered === "COMPLETE") {
          const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
          srcs.push(data.publicUrl);
          continue;
        }
        return { ok: false, error: "Upload fotografije nije uspeo.", srcs };
      }
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
      const inserted = await imageRowExists(supabase, projectId, path);
      if (!inserted) {
        const recovered = await reconcileAmbiguousUpload(supabase, projectId, batchId, expectedPaths);
        if (recovered === "COMPLETE") {
          srcs.push(data.publicUrl);
          continue;
        }
        return { ok: false, error: "Fotografija je uploadovana, ali nije upisana u bazu.", srcs };
      }
    }

    srcs.push(data.publicUrl);
  }

  return { ok: true, srcs };
}

async function cleanupBatch(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectId: string,
  batchId: string,
  expectedPaths: string[],
) {
  const observed = await readBatchState(supabase, projectId, batchId, expectedPaths);
  if (!observed) return;
  if (observed.state === "ABSENT") return;

  await cleanupObservedBatch(supabase, projectId, batchId, expectedPaths, observed);
}

type BatchObservation = {
  state: BatchState;
  databasePaths: string[];
  storagePaths: string[];
};

async function reconcileAmbiguousUpload(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectId: string,
  batchId: string,
  expectedPaths: string[],
) {
  return reconcileAmbiguousBatch(
    () => readBatchState(supabase, projectId, batchId, expectedPaths),
    (observed) => cleanupObservedBatch(supabase, projectId, batchId, expectedPaths, observed),
  );
}

async function cleanupObservedBatch(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectId: string,
  batchId: string,
  expectedPaths: string[],
  observed: BatchObservation,
) {

  if (observed.databasePaths.length > 0) {
    const { error: rowError } = await supabase
      .from("project_images")
      .delete()
      .eq("project_id", projectId)
      .in("storage_path", observed.databasePaths);
    if (rowError) {
      console.error("media.batch_cleanup_failed", {
        projectId,
        batchId,
        state: observed.state,
        step: "database",
        code: rowError.code,
      });
      return;
    }
  }

  if (observed.storagePaths.length > 0) {
    const { error: storageError } = await supabase.storage.from(BUCKET).remove(observed.storagePaths);
    if (storageError) {
      console.error("media.batch_cleanup_failed", {
        projectId,
        batchId,
        state: observed.state,
        step: "storage",
        code: storageError.name,
      });
      return;
    }
  }

  const remaining = await readBatchState(supabase, projectId, batchId, expectedPaths);
  if (remaining && remaining.state !== "ABSENT") {
    console.error("media.batch_cleanup_failed", {
      projectId,
      batchId,
      state: remaining.state,
      step: "verification",
      databasePaths: remaining.databasePaths,
      storagePaths: remaining.storagePaths,
    });
  }
}

async function storageObjectExists(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectId: string,
  batchId: string,
  path: string,
) {
  const folder = `${projectId}/${batchId}`;
  const { data, error } = await supabase.storage.from(BUCKET).list(folder, { limit: MAX_ADMIN_PHOTO_COUNT });
  if (error) return false;
  return (data ?? []).some((file) => `${folder}/${file.name}` === path);
}

async function imageRowExists(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectId: string,
  path: string,
) {
  const { data, error } = await supabase
    .from("project_images")
    .select("id")
    .eq("project_id", projectId)
    .eq("storage_path", path)
    .maybeSingle();
  return !error && Boolean(data);
}

async function readBatchState(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectId: string,
  batchId: string,
  expectedPaths: string[],
): Promise<BatchObservation | null> {
  const folder = `${projectId}/${batchId}`;
  const prefix = `${folder}/`;
  const [{ data: rows, error: rowsError }, { data: objects, error: objectsError }] = await Promise.all([
    supabase
      .from("project_images")
      .select("storage_path")
      .eq("project_id", projectId)
      .like("storage_path", `${prefix}%`),
    supabase.storage.from(BUCKET).list(folder, { limit: MAX_ADMIN_PHOTO_COUNT }),
  ]);

  if (rowsError || objectsError) {
    console.error("media.batch_readback_failed", {
      projectId,
      batchId,
      step: "readback",
      databaseCode: rowsError?.code,
      storageCode: objectsError?.name,
    });
    return null;
  }

  const databasePaths = (rows ?? [])
    .map((row) => row.storage_path)
    .filter((path): path is string => Boolean(path));
  const storagePaths = (objects ?? []).map((file) => `${prefix}${file.name}`);

  return {
    state: classifyBatchState(databasePaths, storagePaths, expectedPaths),
    databasePaths,
    storagePaths,
  };
}
