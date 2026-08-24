import type { Service } from "@/types/service";

// TODO: Replace cover images with original Katanić Gradnja photographs.

export const services: Service[] = [
  {
    slug: "izgradnja-kuca",
    title: "Izgradnja kuća",
    shortTitle: "Izgradnja",
    summary:
      "Kompletno izvođenje radova od pripreme i temelja do krova i završnih građevinskih faza.",
    description:
      "Izvodimo radove na izgradnji stambenih objekata — od pripreme terena i temelja, preko zidanja, armiračkih i betonskih radova, do krova i završnih građevinskih faza. Obim se definiše dogovorom za svaki projekat.",
    details: [
      "Priprema terena i temelji",
      "Zidanje, armiranje i betoniranje",
      "Krovni radovi i završne građevinske faze",
    ],
    coverImage: "/images/services/izgradnja.png",
    relatedCategory: "Izgradnja",
    placeholderImages: true,
  },
  {
    slug: "rekonstrukcije",
    title: "Rekonstrukcije",
    shortTitle: "Rekonstrukcija",
    summary: "Obnova i rekonstrukcija postojećih stambenih i drugih objekata.",
    description:
      "Radimo rekonstrukcije postojećih objekata — od intervencija na konstrukciji i krovu do obnove fasade i prilagođavanja prostora. Svaki zahvat se usklađuje sa stanjem objekta i dogovorenim obimom radova.",
    details: [
      "Obnova postojećih objekata",
      "Radovi na konstrukciji, krovu i fasadi",
      "Prilagođavanje objekta novim potrebama",
    ],
    coverImage: "/images/services/rekonstrukcije.png",
    relatedCategory: "Rekonstrukcija",
    placeholderImages: true,
  },
  {
    slug: "adaptacije",
    title: "Adaptacije",
    shortTitle: "Adaptacija",
    summary: "Preuređenje i prilagođavanje postojećeg prostora novim potrebama.",
    description:
      "Adaptacije obuhvataju preuređenje postojećeg prostora: izmene rasporeda, otvaranje ili zatvaranje otvora, i prateće građevinske radove potrebne da prostor odgovara novoj nameni.",
    details: [
      "Izmene unutrašnjeg rasporeda",
      "Građevinski radovi u postojećem objektu",
      "Prilagođavanje prostora novoj nameni",
    ],
    coverImage: "/images/services/adaptacije.png",
    relatedCategory: "Adaptacija",
    placeholderImages: true,
  },
  {
    slug: "ograde",
    title: "Ograde",
    shortTitle: "Ograde",
    summary: "Izrada i rekonstrukcija ograda i pripadajućih građevinskih elemenata.",
    description:
      "Izrađujemo i rekonstruišemo ograde uz pripadajuće građevinske radove — temelje, stubove i završnu obradu prema dogovorenom rešenju.",
    details: [
      "Nove ograde i rekonstrukcija postojećih",
      "Temelji, stubovi i prateći elementi",
      "Usklađivanje sa uređenjem dvorišta",
    ],
    coverImage: "/images/services/ograde.png",
    relatedCategory: "Ograde",
    placeholderImages: true,
  },
  {
    slug: "behaton",
    title: "Behaton",
    shortTitle: "Behaton",
    summary:
      "Priprema podloge i postavljanje behaton elemenata za dvorišta, prilaze i staze.",
    description:
      "Postavljamo behaton na dvorištima, prilazima i stazama. Rad uključuje pripremu podloge, slaganje elemenata i uređenje ivica, prema dogovorenom rasporedu.",
    details: [
      "Priprema podloge",
      "Postavljanje behaton elemenata",
      "Prilazi, staze i dvorišne površine",
    ],
    coverImage: "/images/services/behaton.png",
    relatedCategory: "Behaton",
    placeholderImages: true,
  },
  {
    slug: "bazeni",
    title: "Bazeni",
    shortTitle: "Bazeni",
    summary:
      "Građevinski radovi na izgradnji i uređenju bazena i prostora oko bazena.",
    description:
      "Izvodimo građevinske radove na izgradnji bazena i uređenju prostora oko bazena. Tehnički detalji, oprema i završna obrada definišu se u dogovoru za konkretan projekat.",
    details: [
      "Građevinski radovi na bazenu",
      "Uređenje prostora oko bazena",
      "Usklađivanje sa ostalim spoljnim radovima",
    ],
    coverImage: "/images/services/bazeni.png",
    relatedCategory: "Bazen",
    placeholderImages: true,
  },
  {
    slug: "masinsko-malterisanje",
    title: "Mašinsko malterisanje",
    shortTitle: "Malterisanje",
    summary: "Efikasno izvođenje mašinskog malterisanja zidova i drugih površina.",
    description:
      "Izvodimo mašinsko malterisanje zidova i drugih površina kao deo širih građevinskih radova ili kao zaseban zahvat, prema dogovorenoj površini i vrsti maltera.",
    details: [
      "Mašinsko malterisanje zidova",
      "Priprema površina",
      "Rad kao deo šireg projekta ili zasebno",
    ],
    coverImage: "/images/services/malterisanje.png",
    placeholderImages: true,
  },
];
