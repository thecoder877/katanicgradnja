# Katanić Gradnja 022

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
npm run build
npm start
```

## Podaci o firmi

Kontakt podaci su u [`config/site.ts`](config/site.ts):

- telefoni: Stefan (`062 712 772`) i Veljko (`061 20 26 312`)
- e-mail (prazno dok se ne potvrdi)
- lokacija: Mali Radinci, Ruma
- Instagram
- kanonski URL sajta (`NEXT_PUBLIC_SITE_URL`)

Prazna polja se **ne prikazuju**. Ne unositi izmišljene podatke.

## Projekti i fotografije

Javna galerija čita projekte iz **Supabase** baze. Ako baza nije dostupna, koristi se rezervni katalog u [`data/projects.ts`](data/projects.ts).

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
3. Isključite javnu registraciju: **Authentication → Providers → Email → Confirm email / Allow new users** (isključite signup).
4. Prijavite se na `http://localhost:3000/admin`.

Sa panela možete:

- dodati novi projekat
- uploadovati i obrisati fotografije
- postaviti naslovnu sliku
- objaviti ili skloniti projekat
- obrisati projekat

Na Vercel dodajte iste `NEXT_PUBLIC_SUPABASE_*` promenljive kao u `.env.local`.

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
4. Napraviti admin nalog u Supabase i isključiti javni signup.
5. Pokrenuti `npm run build`.

Preporučeni hosting: **Vercel**.
