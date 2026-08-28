# Katanić Gradnja 022
<img width="1920" height="8456" alt="oneclickshot" src="https://github.com/user-attachments/assets/45244eae-7300-4966-8732-977b927a117a" />

Sajt građevinske firme **Katanić Gradnja 022**.

## Pokretanje

```bash
npm install
cp .env.example .env.local
npm run dev
```

Otvori [http://localhost:3000](http://localhost:3000).

Korisne komande:

```bash
npm run lint
npm run typecheck
npm test -- --run
npm run build
npm start
```

## Projekti i fotografije

Javna galerija čita projekte iz **Supabase** baze kada su Supabase promenljive podešene. Tada je baza autoritativna: uspešan prazan rezultat ostaje prazan, a greška prikazuje privremeno nedostupno stanje. Rezervni katalog u [`data/projects.ts`](data/projects.ts) koristi se samo kada Supabase uopšte nije konfigurisan.

Fotografije iz `public/images` su grupisane po nazivu fajla:

```text
public/images/projekti/izgradnja-kuce/
public/images/projekti/rekonstrukcija/
public/images/projekti/bazen/
public/images/projekti/stubovi-ograde/
```

Kad budete dodavali nove slike, najlakše je kroz skriveni admin na `/admin`. Nove fotografije idu u Supabase Storage, a starije lokalne putanje ostaju dok ih ne obrišete u panelu.

## Admin (`/admin`)

Stranica **nije** u meniju. Otvara se samo preko URL-a.

1. U [Supabase dashboard](https://supabase.com/dashboard/project/zloqbwwapmmlrutjvwfj) otvorite **Authentication → Users → Add user**.
2. Unesite e-mail i lozinku. Uključite **Auto Confirm User** da se nalog odmah može koristiti.
3. Korisniku postavite `app_metadata.role` na `admin`; ne koristite `user_metadata` za autorizaciju.
4. Podesite obavezni `ADMIN_EMAILS` na isti e-mail. Prazna allowlista namerno odbija pristup.
5. Isključite javnu registraciju: **Authentication → Providers → Email → Confirm email / Allow new users** (isključite signup).
6. Primenite migraciju `supabase/migrations/20260827000000_katanic_growth.sql`, zatim se odjavite i ponovo prijavite da JWT dobije novu admin ulogu.
7. Prijavite se na `http://localhost:3000/admin`.

Sa panela možete:

- dodati novi projekat kao neobjavljen draft
- uploadovati i obrisati fotografije
- postaviti naslovnu sliku
- objaviti ili skloniti projekat
- obrisati projekat

Na Vercel dodajte iste `NEXT_PUBLIC_SUPABASE_*` i `ADMIN_EMAILS` promenljive kao u `.env.local`. Pre produkcije proverite da običan autentifikovan korisnik ne može menjati projekte, slike ili Storage.

## SEO

- podrazumevani metadata: [`lib/seo.ts`](lib/seo.ts)
- JSON-LD: [`lib/json-ld.ts`](lib/json-ld.ts)
- `app/sitemap.ts`, `app/robots.ts` (`/admin` je zabranjen za indekse)

Pre produkcije podesiti `NEXT_PUBLIC_SITE_URL`.

## Forma za upit

Frontend validacija je spremna. Slanje ide na `/api/quote`. Dok `QUOTE_WEBHOOK_URL` nije podešen, forma ne pretvara da je poruka poslata.

## Pre objave

1. Potvrditi tekst na `/politika-privatnosti`.
2. Podesiti `NEXT_PUBLIC_SITE_URL`.
3. Povezati dostavu upita (`QUOTE_WEBHOOK_URL`).
4. Napraviti admin nalog, postaviti `app_metadata.role=admin`, podesiti `ADMIN_EMAILS` i isključiti javni signup.
5. Proveriti da udaljeni CMS ima najmanje tri objavljena projekta i da svaki istaknuti projekat ima potvrđenu lokaciju, naslovnu i bar jednu fotografiju.
6. Pokrenuti `npm test -- --run`, `npm run lint`, `npm run typecheck` i `npm run build`.

Preporučeni hosting: **Vercel**.
