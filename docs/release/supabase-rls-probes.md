# Supabase RLS probe

Pokreni ove provere na staging projektu posle migracije. Za mutacije koristi privremeni draft i obriši ga po završetku.

1. Kao anoniman korisnik: objavljeni projekti i njihove slike su čitljivi; draftovi nisu.
2. Kao prijavljen korisnik bez `app_metadata.role = admin`: admin lista, insert, update, delete i Storage upload moraju biti odbijeni.
3. Kao korisnik sa admin claim-om koji nije u `ADMIN_EMAILS`: aplikacija mora da odbije `/admin` pre mutacije.
4. Kao dozvoljeni admin: kreiraj draft, dodaj sliku, postavi naslovnu, objavi, povuci objavu i obriši probni projekat.
5. Posle brisanja potvrdi da nema reda u `projects`, `project_images` niti fajla u `project-images` bucket-u.

Za brzu proveru instaliranih pravila u SQL editoru:

```sql
select schemaname, tablename, policyname, roles, cmd
from pg_policies
where (schemaname = 'public' and tablename in ('projects', 'project_images'))
   or (schemaname = 'storage' and tablename = 'objects')
order by schemaname, tablename, policyname;
```
