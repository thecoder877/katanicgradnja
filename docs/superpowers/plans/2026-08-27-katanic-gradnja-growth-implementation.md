# Katanić Gradnja Growth Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing site into a phone-first local proof system with roofs first, richer real-project pages, a safer Supabase CMS and focused regression coverage.

**Architecture:** Keep services as curated TypeScript data and projects in exactly one runtime source: configured Supabase, or the static catalog only when Supabase is absent. Reuse the existing dynamic routes and UI primitives; add one cached project result with pure selectors, draft-first publishing and best-effort media compensation rather than new services or abstractions.

**Tech Stack:** Next.js 16.3.2, React 19.2.8, TypeScript 5, Tailwind CSS 4, Supabase JS 2, Zod 4, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-27-katanic-gradnja-growth-and-visual-refresh-design.md` and `docs/plans/2026-08-27-katanic-gradnja-growth-ceo-plan.md`

## Global Constraints

- Phone is the primary CTA; the contact form remains secondary.
- Put `Krovovi` first while keeping all current services visible.
- Target Ruma and surroundings; larger distant work is by agreement.
- Preserve the cream/charcoal/ochre visual language and use real project photos as proof.
- Do not add Kokonut UI, shadcn/Radix, Bklit, a calculator, CRM, chatbot or decorative motion.
- Keep Motion absent unless native dialog behavior cannot provide the required gallery exit.
- When Supabase is configured, it is authoritative: success, empty and unavailable are distinct states.
- Every new project starts with `published=false`; only complete projects can be published.
- Mutations require `app_metadata.role=admin`; an email allowlist is defense in depth and fails closed.
- Media recovery uses batch-prefixed paths and structured logs; no reconciliation table, cron or worker.

## File Map

- `types/project.ts`: shared project/category/result types and pure selectors' inputs.
- `lib/content/projects.ts`: configured-source decision, request memoization and public/admin result contracts.
- `lib/security/admin-schema.ts`: bounded project fields and publish-readiness input parsing.
- `lib/supabase/map-project.ts`, `lib/supabase/types.ts`: database-to-domain mapping for `work_items`.
- `app/admin/actions.ts`: draft-first create/update/publish and safe media mutation order.
- `components/admin/AdminDashboard.tsx`, `app/admin/page.tsx`: complete CMS fields and explicit load/action states.
- `supabase/migrations/20260827_katanic_growth.sql`: additive content field, category constraint and admin policies.
- `supabase/rollback/20260827_katanic_growth.sql`: tested emergency policy/category rollback.
- `data/services.ts`: locked roof service record, first in the catalog.
- `app/page.tsx`, `components/home/*`: shorter proof-to-call homepage.
- `app/usluge/[slug]/page.tsx`, `app/projekti/[slug]/page.tsx`: richer service/project proof and metadata.
- `components/projects/ProjectGallery.tsx`: accessible native dialog without a motion dependency.
- `lib/seo.ts`, `app/sitemap.ts`: deterministic project/service metadata.
- `vitest.config.ts`, `tests/unit/*`: pure/source/action regression tests.
- `playwright.config.ts`, `tests/e2e/public.spec.ts`: focused public smoke and accessibility flow.

---

### Task 1: Test Harness and Project Contracts

**Files:**
- Modify: `package.json`, `package-lock.json`, `types/project.ts`, `lib/security/admin-schema.ts`
- Create: `vitest.config.ts`, `tests/unit/admin-schema.test.ts`, `tests/unit/project-selectors.test.ts`

**Interfaces:**
- Produces: `Project.workItems: string[]`, `ProjectCatalogResult`, `parseProjectFields(FormData)`, `getPublishReadiness(ProjectDraft): string[]`, `selectFeaturedProjects(Project[])`, `selectRelatedProjects(Project, Project[], number)`.

- [ ] **Step 1: Add failing schema and selector tests**

```ts
it("normalizes bounded work items", () => {
  const form = new FormData();
  form.set("title", "Krov u Rumi");
  form.set("category", "Krovovi");
  form.set("location", "Ruma");
  form.set("year", "2026");
  form.set("workItems", "Nova konstrukcija\n\nCrep");
  form.set("layout", "standard");
  expect(parseProjectFields(form).data?.workItems).toEqual(["Nova konstrukcija", "Crep"]);
});

it("requires proof before publish", () => {
  expect(getPublishReadiness({ title: "Krov", category: "Krovovi", location: "", images: [], coverImage: "" }))
    .toEqual(["location", "image", "coverImage"]);
});
```

- [ ] **Step 2: Install and run Vitest to prove the tests fail**

Run: `npm install -D vitest @vitejs/plugin-react && npm test -- --run`

Expected: FAIL because the new contracts/functions do not exist.

- [ ] **Step 3: Add the minimal types, parser and pure selectors**

```ts
export type ProjectCatalogResult =
  | { status: "ready"; projects: Project[]; source: "supabase" | "static" }
  | { status: "unavailable"; projects: []; source: "supabase" };

export function selectFeaturedProjects(projects: Project[], limit = 6) {
  const featured = projects.filter((project) => project.featured);
  return (featured.length ? featured : projects).slice(0, limit);
}
```

Add `Krovovi`, `workItems`, location/year bounds and a publish-readiness helper requiring title, category, location, one image and a cover that belongs to that image list.

- [ ] **Step 4: Run the focused tests and typecheck**

Run: `npm test -- --run tests/unit/admin-schema.test.ts tests/unit/project-selectors.test.ts && npm run typecheck`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts types/project.ts lib/security/admin-schema.ts tests/unit
git commit -m "test: add project content contracts"
```

### Task 2: Supabase Authority, Mapping and Security Migration

**Files:**
- Modify: `lib/content/projects.ts`, `lib/supabase/map-project.ts`, `lib/supabase/types.ts`, `lib/supabase/admin.ts`, `app/admin/page.tsx`
- Create: `supabase/migrations/20260827_katanic_growth.sql`, `supabase/rollback/20260827_katanic_growth.sql`, `tests/unit/projects-content.test.ts`

**Interfaces:**
- Consumes: `ProjectCatalogResult`, pure selectors from Task 1.
- Produces: `getProjectCatalog(): Promise<ProjectCatalogResult>` wrapped in React `cache()`, plus selector-backed public helpers and `AdminProjectsResult`.

- [ ] **Step 1: Write failing source-authority and mapping tests**

```ts
it("does not revive static rows after configured Supabase returns empty", async () => {
  mockConfigured(true);
  mockRemote({ data: [], error: null });
  await expect(getProjectCatalog()).resolves.toMatchObject({ status: "ready", projects: [], source: "supabase" });
});

it("returns unavailable instead of static fallback on configured failure", async () => {
  mockConfigured(true);
  mockRemote({ data: null, error: { code: "PGRST000" } });
  await expect(getProjectCatalog()).resolves.toMatchObject({ status: "unavailable", projects: [] });
});
```

- [ ] **Step 2: Run the tests to verify failure**

Run: `npm test -- --run tests/unit/projects-content.test.ts`

Expected: FAIL because current code merges static and remote content and swallows errors.

- [ ] **Step 3: Implement authoritative result handling and mapping**

```ts
const loadProjectCatalog = cache(async (): Promise<ProjectCatalogResult> => {
  if (!isSupabaseConfigured()) return { status: "ready", projects: staticProjects, source: "static" };
  const result = await fetchRemoteProjects(true);
  if (!result.ok) return { status: "unavailable", projects: [], source: "supabase" };
  return { status: "ready", projects: result.projects, source: "supabase" };
});
```

Map `work_items ?? []`, return an explicit admin read error, and log only operation/error code without form bodies, tokens or bytes.

- [ ] **Step 4: Add the migration and rollback artifact**

```sql
alter table public.projects add column if not exists work_items text[] not null default '{}';
alter table public.projects drop constraint if exists projects_category_check;
alter table public.projects add constraint projects_category_check
  check (category in ('Izgradnja','Krovovi','Rekonstrukcija','Adaptacija','Behaton','Bazen','Ograde','Ostalo'));
```

Replace mutation policies for `projects`, `project_images` and `storage.objects` with predicates based on `(select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'`; keep anonymous reads restricted to published project content. The rollback restores the prior category constraint and policies but does not drop `work_items`.

- [ ] **Step 5: Run focused verification**

Run: `npm test -- --run tests/unit/projects-content.test.ts && npm run typecheck && npm run lint`

Expected: PASS. In preview, separately probe anonymous, ordinary-authenticated and admin roles before application rollout.

- [ ] **Step 6: Commit**

```bash
git add lib/content/projects.ts lib/supabase lib/security app/admin/page.tsx supabase tests/unit/projects-content.test.ts
git commit -m "feat: make project CMS authoritative and admin-only"
```

### Task 3: Draft-First Admin and Recoverable Media

**Files:**
- Modify: `app/admin/actions.ts`, `components/admin/AdminDashboard.tsx`
- Create: `lib/admin/media-batch.ts`, `tests/unit/media-batch.test.ts`, `tests/unit/publish-readiness.test.ts`

**Interfaces:**
- Consumes: `getPublishReadiness` and validated project fields.
- Produces: paths shaped as `{projectId}/{batchId}/{fileId}.{ext}`, `reconcileBatch(...)`, draft-first create/update actions and asymmetric delete actions.

- [ ] **Step 1: Write failing draft and compensation tests**

```ts
it("creates unpublished even when the create form requests publish", async () => {
  await createProjectAction(formWith({ published: "on" }));
  expect(projectInsert).toHaveBeenCalledWith(expect.objectContaining({ published: false }));
});

it("keeps the draft and cleans confirmed batch writes after an image-row failure", async () => {
  imageInsert.mockResolvedValueOnce({ error: { code: "23505" } });
  await createProjectAction(validCreateForm());
  expect(projectDelete).not.toHaveBeenCalled();
  expect(storageRemove).toHaveBeenCalledWith([expect.stringMatching(/^[^/]+\/[^/]+\/[^/]+\.(jpg|png|webp|avif)$/)]);
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- --run tests/unit/media-batch.test.ts tests/unit/publish-readiness.test.ts`

Expected: FAIL because create currently honors `published` immediately and media paths lack a batch id.

- [ ] **Step 3: Implement minimal draft-first mutation flow**

Create with `published:false`, upload into one batch, set a confirmed cover, then publish only on a later update when `getPublishReadiness` returns `[]`. On upload failure, keep the draft, delete only confirmed new image rows/objects, and emit a structured critical line only if cleanup cannot be confirmed.

```ts
const readiness = getPublishReadiness({ ...fields, images: rows.map((row) => row.src), coverImage });
if (fields.published && readiness.length) {
  return { ok: false, error: `Za objavu dopunite: ${readiness.join(", ")}.` };
}
```

- [ ] **Step 4: Implement asymmetric deletes**

Project: confirm `published=false`, remove managed Storage objects, then delete the DB project. Image: choose and persist a replacement cover when needed, unlink the image row, then best-effort remove its managed Storage object; `storage_path=null` skips Storage.

- [ ] **Step 5: Expose location, year, work items and draft status in admin UI**

Use ordinary controlled form fields and pending-disabled submit buttons. New-project copy must say it is saved as a draft; an existing draft lists missing publish requirements returned by the server.

- [ ] **Step 6: Verify and commit**

Run: `npm test -- --run tests/unit/media-batch.test.ts tests/unit/publish-readiness.test.ts && npm run typecheck && npm run lint`

Expected: PASS.

```bash
git add app/admin components/admin lib/admin tests/unit
git commit -m "feat: make project publishing recoverable"
```

### Task 4: Roof-First Public Experience and Accessible Gallery

**Files:**
- Modify: `data/services.ts`, `app/page.tsx`, `components/home/Hero.tsx`, `components/home/ServicesPreview.tsx`, `components/home/FeaturedProjects.tsx`, `components/home/ProcessSection.tsx`, `components/home/ServiceAreaNote.tsx`, `components/home/CTASection.tsx`, `app/usluge/[slug]/page.tsx`, `app/projekti/[slug]/page.tsx`, `components/projects/ProjectCard.tsx`, `components/projects/ProjectGallery.tsx`, `app/globals.css`
- Delete if no longer imported: `components/home/InstagramPreview.tsx`, `components/home/FullBleedPhoto.tsx`, `components/home/WhyChooseUs.tsx`
- Test: `tests/e2e/public.spec.ts`

**Interfaces:**
- Consumes: authoritative catalog result, enriched `Project`, locked `krovovi` service record.
- Produces: phone-first homepage, roof route, project proof blocks and accessible native gallery dialog.

- [ ] **Step 1: Add the exact roof service record first in `services`**

Use the locked title, summary, description and three details from the CEO plan. Set `relatedCategory: "Krovovi"`; use an approved real roof image when present, otherwise keep the service visually honest with the site-level image and no fake project claim.

- [ ] **Step 2: Write the failing public Playwright smoke**

```ts
test("phone-first roof and project flow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /pozov/i }).first()).toHaveAttribute("href", /^tel:/);
  await expect(page.getByRole("link", { name: /krovovi/i }).first()).toBeVisible();
  await page.goto("/usluge/krovovi");
  await expect(page.getByRole("heading", { name: "Krovovi" })).toBeVisible();
});
```

- [ ] **Step 3: Shorten the homepage to the approved hierarchy**

Render hero → all services with roofs first → real featured projects → call/visit/quote/build process → local area note → final phone CTA. Remove components only after `rg` confirms they have no imports.

- [ ] **Step 4: Enrich service and project routes**

Project pages display category, confirmed location/year, description, bounded work-item list, gallery and phone CTA. Service pages display the service facts first and related real projects only when they exist.

- [ ] **Step 5: Replace gallery overlay with native `<dialog>`**

Use `showModal()`, `close()`, native Escape handling, previous/next keys, focus return to the originating thumbnail and no transition under `prefers-reduced-motion`. Keep one-image galleries free of previous/next controls.

- [ ] **Step 6: Run UI checks and commit**

Run: `npm run typecheck && npm run lint && npm run build && npx playwright test tests/e2e/public.spec.ts`

Expected: PASS at desktop and 360/390/430 px projects; no horizontal page-scroll regression.

```bash
git add data/services.ts app components tests/e2e/public.spec.ts
git commit -m "feat: deliver roof-first proof-to-call experience"
```

### Task 5: Metadata, Release Gates and Documentation

**Files:**
- Modify: `lib/seo.ts`, `app/sitemap.ts`, route `generateMetadata` functions, `README.md`
- Create: `playwright.config.ts`, `docs/release/katanic-growth-checklist.md`, `tests/unit/seo.test.ts`
- Optional P2 only: modify `app/layout.tsx`, `package.json`, `package-lock.json` for `@vercel/analytics`.

**Interfaces:**
- Consumes: authoritative catalog result and real cover images.
- Produces: canonical/OG metadata, source-aware sitemap and a reproducible deployment/content audit.

- [ ] **Step 1: Write failing metadata tests**

```ts
it("uses project cover before the site OG fallback", () => {
  expect(projectMetadata(projectWithCover).openGraph?.images).toEqual([expect.objectContaining({ url: projectWithCover.coverImage })]);
});
```

- [ ] **Step 2: Implement deterministic metadata and sitemap behavior**

Use a real approved page/project image, then the site-level OG fallback. If the configured CMS is unavailable, omit project URLs from that sitemap generation and log the contained error; never inject static project slugs.

- [ ] **Step 3: Add the release/content checklist**

The checklist must require: at least three published remote projects; location and valid cover/image for every featured project; either one verified roof project or the approved roof service copy without claimed project proof; fresh admin JWT claim; anon/user/admin RLS probes; preview public smoke; reversible draft → complete → publish → unpublish mutation.

- [ ] **Step 4: Run the complete local gate**

Run: `npm test -- --run && npm run lint && npm run typecheck && npm run build && npx playwright test`

Expected: every command exits 0. Run Lighthouse three times against preview and accept median mobile LCP ≤ 2.5 s and CLS ≤ 0.1, or record the measured blocker before production.

- [ ] **Step 5: Perform compact pre-ship reviews**

Run a focused engineering review over the final diff and a rendered design review at desktop plus 360/390/430 px. Fix only release-blocking correctness, accessibility, security and hierarchy issues; record non-blocking polish separately.

- [ ] **Step 6: Commit**

```bash
git add lib/seo.ts app/sitemap.ts app README.md docs/release tests playwright.config.ts package.json package-lock.json
git commit -m "chore: add metadata and release gates"
```

## Self-Review

- Spec coverage: all accepted CEO scope is mapped to Tasks 1-5; before/after remains only in `TODOS.md`; skipped QR/review acquisition work is absent.
- Placeholder scan: no TBD, generic error-handling instruction or undefined follow-up task remains.
- Type consistency: `Project.workItems`, `ProjectCatalogResult`, `getProjectCatalog`, `getPublishReadiness`, selectors and batch path format are defined before consumption.
- Ponytail check: no new API route, CMS, design system, animation dependency, reconciliation service or analytics requirement was introduced.
