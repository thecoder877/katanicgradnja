"use client";

import { useRef, useState } from "react";
import {
  createProjectAction,
  deleteImageAction,
  deleteProjectAction,
  logoutAction,
  setCoverAction,
  updateProjectAction,
  uploadImagesAction,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { projectCategories, type AdminProject } from "@/types/project";

export function AdminDashboard({
  email,
  projects,
  loadError,
}: {
  email: string;
  projects: AdminProject[];
  loadError: string | null;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);

  async function run(action: (formData: FormData) => Promise<{ ok: boolean; error?: string }>, formData: FormData) {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setPending(true);
    setMessage(null);
    try {
      const result = await action(formData);
      if (!result.ok) setMessage(result.error ?? "Akcija nije uspela.");
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  }

  return (
    <div className="min-h-svh bg-ink text-cream" aria-busy={pending}>
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-[0.68rem] font-semibold tracking-[0.2em] text-accent uppercase">
              {siteConfig.shortName}
            </p>
            <h1 className="font-heading text-xl font-semibold">Projekti i fotografije</h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted sm:inline">{email}</span>
            <form action={logoutAction}>
              <Button type="submit" variant="secondary" className="min-h-10 px-4 text-xs">
                Odjava
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-10 px-4 py-10">
        {loadError ? (
          <p role="alert" className="rounded-[10px] border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm">
            {loadError}
          </p>
        ) : null}
        {message ? <p className="rounded-[10px] border border-accent/40 bg-accent/10 px-4 py-3 text-sm">{message}</p> : null}

        <section className="rounded-[12px] border border-line bg-surface p-6">
          <h2 className="font-heading text-lg font-semibold">Novi projekat</h2>
          <p className="mt-1 text-sm text-muted">
            Novi projekat se prvo čuva kao draft. Objavite ga tek kada dopunite lokaciju i fotografije.
          </p>
          <form
            className="mt-6 grid gap-4"
            action={(formData) => run(createProjectAction, formData)}
          >
            <ProjectFields />
            <label className="text-xs font-semibold tracking-[0.14em] uppercase">
              Fotografije
              <input
                name="photos"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                disabled={pending}
                className="mt-2 block w-full text-sm font-normal tracking-normal file:mr-3 file:rounded-[8px] file:border-0 file:bg-accent file:px-3 file:py-2 file:text-ink"
              />
            </label>
            <Button type="submit" disabled={pending} className="justify-self-start">
              {pending ? "Čuvanje…" : "Sačuvaj projekat"}
            </Button>
          </form>
        </section>

        <section className="space-y-6">
          <h2 className="font-heading text-lg font-semibold">Postojeći projekti</h2>
          {!loadError && projects.length === 0 ? (
            <p className="text-sm text-muted">Još nema projekata u bazi.</p>
          ) : (
            projects.map((project) => (
              <article key={project.id} className="rounded-[12px] border border-line bg-surface p-6">
                {!project.published ? <DraftReadiness project={project} /> : null}
                <form className="grid gap-4" action={(formData) => run(updateProjectAction, formData)}>
                  <input type="hidden" name="id" value={project.id} />
                  <ProjectFields project={project} />
                  <div className="flex flex-wrap gap-3">
                    <Button type="submit" disabled={pending}>Sačuvaj izmene</Button>
                  </div>
                </form>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {project.imageRecords.map((image) => (
                    <div key={image.id} className="overflow-hidden rounded-[10px] bg-ink">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image.src} alt="" className="aspect-[4/3] w-full object-cover" />
                      <div className="flex gap-2 p-2">
                        <form action={(formData) => run(setCoverAction, formData)}>
                          <input type="hidden" name="projectId" value={project.id} />
                          <input type="hidden" name="src" value={image.src} />
                          <button
                            type="submit"
                            disabled={pending}
                            className="min-h-10 px-2 text-xs text-cream/80 hover:text-accent"
                          >
                            {project.coverImage === image.src ? "Naslovna" : "Postavi naslovnu"}
                          </button>
                        </form>
                        <form action={(formData) => run(deleteImageAction, formData)}>
                          <input type="hidden" name="projectId" value={project.id} />
                          <input type="hidden" name="imageId" value={image.id} />
                          <button disabled={pending} type="submit" className="min-h-10 px-2 text-xs text-cream/80 hover:text-accent disabled:opacity-50">
                            Obriši
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
                  action={(formData) => run(uploadImagesAction, formData)}
                >
                  <input type="hidden" name="id" value={project.id} />
                  <label className="flex-1 text-xs font-semibold tracking-[0.14em] uppercase">
                    Dodaj fotografije
                    <input
                      name="photos"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      multiple
                      disabled={pending}
                      className="mt-2 block w-full text-sm font-normal tracking-normal file:mr-3 file:rounded-[8px] file:border-0 file:bg-cream file:px-3 file:py-2 file:text-ink"
                    />
                  </label>
                  <Button type="submit" variant="secondary" disabled={pending}>
                    Upload
                  </Button>
                </form>

                <form
                  className="mt-6 border-t border-line pt-4"
                  action={(formData) => run(deleteProjectAction, formData)}
                >
                  <input type="hidden" name="id" value={project.id} />
                  <Button type="submit" variant="outline" disabled={pending} className="border-accent/40 text-accent hover:bg-accent/10">
                    Obriši projekat
                  </Button>
                </form>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

function DraftReadiness({ project }: { project: AdminProject }) {
  const missing = [
    !project.location?.trim() ? "lokaciju" : null,
    project.imageRecords.length === 0 ? "bar jednu fotografiju" : null,
    !project.coverImage || !project.imageRecords.some((image) => image.src === project.coverImage)
      ? "naslovnu fotografiju"
      : null,
  ].filter(Boolean);

  return (
    <p className="mb-5 rounded-[10px] border border-accent/30 bg-accent/10 px-4 py-3 text-sm">
      {missing.length > 0
        ? `Draft — pre objave dopunite: ${missing.join(", ")}.`
        : "Draft je spreman za objavu."}
    </p>
  );
}

function ProjectFields({ project }: { project?: AdminProject }) {
  return (
    <>
      <label className="text-xs font-semibold tracking-[0.14em] uppercase">
        Naziv
        <input
          name="title"
          required
          defaultValue={project?.title}
          className="mt-2 min-h-11 w-full rounded-[10px] border border-line bg-ink px-3 text-sm font-normal tracking-normal text-cream"
        />
      </label>
      <label className="text-xs font-semibold tracking-[0.14em] uppercase">
        Kategorija
        <select
          name="category"
          defaultValue={project?.category ?? "Izgradnja"}
          className="mt-2 min-h-11 w-full rounded-[10px] border border-line bg-ink px-3 text-sm font-normal tracking-normal text-cream"
        >
          {projectCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs font-semibold tracking-[0.14em] uppercase">
        Opis
        <textarea
          name="description"
          rows={3}
          defaultValue={project?.description ?? ""}
          className="mt-2 w-full rounded-[10px] border border-line bg-ink px-3 py-2 text-sm font-normal tracking-normal text-cream"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-semibold tracking-[0.14em] uppercase">
          Lokacija
          <input
            name="location"
            defaultValue={project?.location ?? ""}
            maxLength={120}
            className="mt-2 min-h-11 w-full rounded-[10px] border border-line bg-ink px-3 text-sm font-normal tracking-normal text-cream"
          />
        </label>
        <label className="text-xs font-semibold tracking-[0.14em] uppercase">
          Godina
          <input
            name="year"
            type="number"
            min={1900}
            max={new Date().getFullYear() + 1}
            defaultValue={project?.year ?? ""}
            className="mt-2 min-h-11 w-full rounded-[10px] border border-line bg-ink px-3 text-sm font-normal tracking-normal text-cream"
          />
        </label>
      </div>
      <label className="text-xs font-semibold tracking-[0.14em] uppercase">
        Izvedeni radovi — jedna stavka po redu
        <textarea
          name="workItems"
          rows={4}
          maxLength={2000}
          defaultValue={project?.workItems.join("\n") ?? ""}
          className="mt-2 w-full rounded-[10px] border border-line bg-ink px-3 py-2 text-sm font-normal tracking-normal text-cream"
        />
      </label>
      <label className="text-xs font-semibold tracking-[0.14em] uppercase">
        Raspored kartice
        <select
          name="layout"
          defaultValue={project?.layout ?? "standard"}
          className="mt-2 min-h-11 w-full rounded-[10px] border border-line bg-ink px-3 text-sm font-normal tracking-normal text-cream"
        >
          <option value="standard">Standard</option>
          <option value="wide">Široka</option>
          <option value="tall">Visoka</option>
        </select>
      </label>
      <div className="flex flex-wrap gap-6 text-sm font-normal tracking-normal">
        <label className="inline-flex items-center gap-2">
          <input name="featured" type="checkbox" defaultChecked={project?.featured ?? false} />
          Istaknut
        </label>
        <label className="inline-flex items-center gap-2">
          <input name="published" type="checkbox" defaultChecked={project?.published ?? false} />
          Objavljen
        </label>
      </div>
    </>
  );
}
