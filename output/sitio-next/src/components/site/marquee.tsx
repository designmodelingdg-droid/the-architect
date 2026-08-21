import Image from "next/image";
import { AVALES } from "@/lib/site";

export function AvalesMarquee({ label = "Respaldados por" }: { label?: string }) {
  return (
    <section aria-label={label} className="border-b border-border bg-crema py-7">
      <p className="mb-4 text-center text-[11px] font-bold uppercase tracking-[2.5px] text-naranja">{label}</p>
      <div className="dm-marquee-mask overflow-hidden">
        <div className="dm-marquee-track flex w-max items-center gap-14 md:gap-16">
          {[...AVALES, ...AVALES].map((a, i) => (
            <Image
              key={i}
              src={a.src}
              alt={i < AVALES.length ? a.alt : ""}
              aria-hidden={i >= AVALES.length}
              width={160}
              height={48}
              className="h-9 w-auto max-w-[140px] object-contain opacity-90 md:h-12 md:max-w-[165px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
