drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
  on public.projects
  for select
  to anon
  using (published = true);

drop policy if exists "Public can read images of published projects" on public.project_images;
create policy "Public can read images of published projects"
  on public.project_images
  for select
  to anon
  using (
    exists (
      select 1
      from public.projects p
      where p.id = project_id
        and p.published = true
    )
  );
