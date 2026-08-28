alter table public.projects
  add column if not exists work_items text[] not null default '{}';

alter table public.projects alter column published set default false;

alter table public.projects drop constraint if exists projects_category_check;
alter table public.projects add constraint projects_category_check check (
  category in (
    'Krovovi',
    'Izgradnja',
    'Rekonstrukcija',
    'Adaptacija',
    'Behaton',
    'Bazen',
    'Ograde',
    'Ostalo'
  )
);

drop policy if exists "Authenticated can read all projects" on public.projects;
drop policy if exists "Authenticated can insert projects" on public.projects;
drop policy if exists "Authenticated can update projects" on public.projects;
drop policy if exists "Authenticated can delete projects" on public.projects;

create policy "Admins can read all projects"
  on public.projects for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins can insert projects"
  on public.projects for insert to authenticated
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins can update projects"
  on public.projects for update to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins can delete projects"
  on public.projects for delete to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Authenticated can read all project images" on public.project_images;
drop policy if exists "Authenticated can insert project images" on public.project_images;
drop policy if exists "Authenticated can update project images" on public.project_images;
drop policy if exists "Authenticated can delete project images" on public.project_images;

create policy "Admins can read all project images"
  on public.project_images for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins can insert project images"
  on public.project_images for insert to authenticated
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins can update project images"
  on public.project_images for update to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins can delete project images"
  on public.project_images for delete to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Authenticated can upload project image files" on storage.objects;
drop policy if exists "Authenticated can update project image files" on storage.objects;
drop policy if exists "Authenticated can delete project image files" on storage.objects;

create policy "Admins can upload project image files"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'project-images'
    and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
create policy "Admins can update project image files"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'project-images'
    and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  with check (
    bucket_id = 'project-images'
    and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
create policy "Admins can delete project image files"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'project-images'
    and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
