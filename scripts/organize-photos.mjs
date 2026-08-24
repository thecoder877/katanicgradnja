import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "public", "images");
const dest = {
  bazen: path.join(root, "projekti", "bazen"),
  kuca: path.join(root, "projekti", "izgradnja-kuce"),
  ograde: path.join(root, "projekti", "stubovi-ograde"),
  rekonstrukcija: path.join(root, "projekti", "rekonstrukcija"),
  jazak: path.join(root, "projekti", "izgradnja-kuce-jazak"),
  vikendica: path.join(root, "projekti", "izgradnja-vikendice"),
  nadogradnja: path.join(root, "projekti", "nadogradnja-kuce"),
};

for (const dir of Object.values(dest)) {
  mkdirSync(dir, { recursive: true });
}

copyFileSync(path.join(root, "bazen (1).jpg"), path.join(dest.bazen, "01.jpg"));
copyFileSync(path.join(root, "bazen (2).jpg"), path.join(dest.bazen, "02.jpg"));

for (let i = 0; i <= 11; i += 1) {
  const name = String(i + 1).padStart(2, "0");
  copyFileSync(
    path.join(root, `izgradnjakuceodtemeljadokrova_${i}.jpg`),
    path.join(dest.kuca, `${name}.jpg`),
  );
}

for (let i = 1; i <= 4; i += 1) {
  copyFileSync(
    path.join(root, `izrada_stubova_ograde (${i}).jpg`),
    path.join(dest.ograde, `0${i}.jpg`),
  );
}

for (let i = 1; i <= 4; i += 1) {
  // Files are named .heic but encoded as JPEG.
  copyFileSync(
    path.join(root, `rekonstrukcija (${i}).heic`),
    path.join(dest.rekonstrukcija, `0${i}.jpg`),
  );
}

for (let i = 1; i <= 4; i += 1) {
  copyFileSync(
    path.join(root, `izgradnjakucejazak_${i}.jpg`),
    path.join(dest.jazak, `0${i}.jpg`),
  );
}
copyFileSync(path.join(root, "izgradnjakucejazak-5.jpg"), path.join(dest.jazak, "05.jpg"));

for (let i = 1; i <= 8; i += 1) {
  copyFileSync(
    path.join(root, `izgradnjavikendice_${i}.jpg`),
    path.join(dest.vikendica, `0${i}.jpg`),
  );
}

for (let i = 1; i <= 5; i += 1) {
  copyFileSync(
    path.join(root, `nadogradnjakuce_${i}.jpg`),
    path.join(dest.nadogradnja, `0${i}.jpg`),
  );
}

console.log("Project photos organized under public/images/projekti/");
