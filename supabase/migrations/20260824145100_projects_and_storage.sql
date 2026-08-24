create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  category text not null check (
    category in (
      'Izgradnja',
      'Rekonstrukcija',
      'Adaptacija',
      'Behaton',
      'Bazen',
      'Ograde',
      'Ostalo'
    )
  ),
  location text,
  year integer,
  featured boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  layout text not null default 'standard' check (layout in ('wide', 'tall', 'standard')),
  cover_image text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  src text not null,
  alt text not null default '',
  sort_order integer not null default 0,
  storage_path text,
  created_at timestamptz not null default now()
);

create index if not exists project_images_project_id_sort_idx
  on public.project_images (project_id, sort_order);

create index if not exists projects_published_sort_idx
  on public.projects (published, sort_order, created_at desc);

alter table public.projects enable row level security;
alter table public.project_images enable row level security;

create policy "Public can read published projects"
  on public.projects
  for select
  to anon
  using (published = true);

create policy "Authenticated can read all projects"
  on public.projects
  for select
  to authenticated
  using (true);

create policy "Authenticated can insert projects"
  on public.projects
  for insert
  to authenticated
  with check (true);

create policy "Authenticated can update projects"
  on public.projects
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete projects"
  on public.projects
  for delete
  to authenticated
  using (true);

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

create policy "Authenticated can read all project images"
  on public.project_images
  for select
  to authenticated
  using (true);

create policy "Authenticated can insert project images"
  on public.project_images
  for insert
  to authenticated
  with check (true);

create policy "Authenticated can update project images"
  on public.project_images
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete project images"
  on public.project_images
  for delete
  to authenticated
  using (true);

grant select, insert, update, delete on table public.projects to authenticated;
grant select on table public.projects to anon;
grant select, insert, update, delete on table public.project_images to authenticated;
grant select on table public.project_images to anon;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-images',
  'project-images',
  true,
  15728640,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']::text[]
)
on conflict (id) do nothing;

create policy "Public can read project image files"
  on storage.objects
  for select
  to public
  using (bucket_id = 'project-images');

create policy "Authenticated can upload project image files"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'project-images');

create policy "Authenticated can update project image files"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'project-images')
  with check (bucket_id = 'project-images');

create policy "Authenticated can delete project image files"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'project-images');
