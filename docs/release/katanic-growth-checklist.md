# Katanic growth release checklist

## Pre objave

- [ ] Primeni `20260827000000_katanic_growth.sql` na ciljnu Supabase bazu.
- [ ] Podesi `ADMIN_EMAILS`; korisniku dodaj `app_metadata.role = admin`, pa uradi novu prijavu.
- [ ] U CMS-u postoje najmanje tri stvarna, objavljena projekta sa lokacijom i naslovnom fotografijom.
- [ ] Bar jedan stvarni projekat krova je objavljen; ne predstavljaj druge radove kao krovove.
- [ ] Istaknuti projekti imaju dobre naslovne fotografije i proverene lokacije.
- [ ] Prođi [RLS probe](./supabase-rls-probes.md).

## Automatske provere

```bash
npm test -- --run
npm run typecheck -- --incremental false
npm run lint
npm run build -- --webpack
npm run test:e2e
```

## Smoke test

- [ ] Početna, Krovovi, Projekti i jedna projektna stranica vraćaju 200.
- [ ] Telefon je prvi CTA na desktopu i telefonu i otvara `tel:` link.
- [ ] Forma ostaje sekundarni put.
- [ ] Galerija radi klikom, strelicama i Escape tasterom i vraća fokus.
- [ ] Kreiranje projekta daje draft; draft nije javno vidljiv.
- [ ] Draft sa lokacijom, slikom i naslovnom slikom može da se objavi i ponovo povuče.
- [ ] Direktan CMS kvar prikazuje kontrolisanu poruku, ne statički sadržaj kao da je ažuran.
