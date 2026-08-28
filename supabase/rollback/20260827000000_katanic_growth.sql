-- Emergency rollback only. Prefer restoring the admin claim and keeping strict policies.
-- The expanded category constraint is intentionally retained: existing "Krovovi" rows
-- must not make the rollback fail or lose their category. Older app code displays an
-- unknown category as "Ostalo" until the growth migration is reapplied.
alter table public.projects alter column published set default true;

drop policy if exists "Admins can read all projects" on public.projects;
drop policy if exists "Admins can insert projects" on public.projects;
drop policy if exists "Admins can update projects" on public.projects;
drop policy if exists "Admins can delete projects" on public.projects;
drop policy if exists "Admins can read all project images" on public.project_images;
drop policy if exists "Admins can insert project images" on public.project_images;
drop policy if exists "Admins can update project images" on public.project_images;
drop policy if exists "Admins can delete project images" on public.project_images;
drop policy if exists "Admins can upload project image files" on storage.objects;
drop policy if exists "Admins can update project image files" on storage.objects;
drop policy if exists "Admins can delete project image files" on storage.objects;

create policy "Authenticated can read all projects" on public.projects for select to authenticated using (true);
create policy "Authenticated can insert projects" on public.projects for insert to authenticated with check (true);
create policy "Authenticated can update projects" on public.projects for update to authenticated using (true) with check (true);
create policy "Authenticated can delete projects" on public.projects for delete to authenticated using (true);
create policy "Authenticated can read all project images" on public.project_images for select to authenticated using (true);
create policy "Authenticated can insert project images" on public.project_images for insert to authenticated with check (true);
create policy "Authenticated can update project images" on public.project_images for update to authenticated using (true) with check (true);
create policy "Authenticated can delete project images" on public.project_images for delete to authenticated using (true);
create policy "Authenticated can upload project image files" on storage.objects for insert to authenticated with check (bucket_id = 'project-images');
create policy "Authenticated can update project image files" on storage.objects for update to authenticated using (bucket_id = 'project-images') with check (bucket_id = 'project-images');
create policy "Authenticated can delete project image files" on storage.objects for delete to authenticated using (bucket_id = 'project-images');
