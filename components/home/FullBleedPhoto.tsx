import Image from "next/image";
import { imageSizes } from "@/lib/images";

export function FullBleedPhoto() {
  return (
    <section className="relative min-h-[58vh] overflow-hidden bg-ink lg:min-h-[70vh]">
      <Image
        src="/images/projekti/izgradnja-kuce/11.jpg"
        alt="Detalj građevinskih radova na objektu"
        fill
        sizes={imageSizes.full}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-ink/25" />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
        <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-accent uppercase">
          Od prve lopate do završnih radova
        </p>
      </div>
    </section>
  );
}
