import Image from "next/image";
import { AVALES } from "@/lib/site";

export function AvalesMarquee({ label = "Respaldados por" }: { label?: string }) {
  return (
    <section aria-label={label} className="border-y border-border bg-white py-7">
      <p className="tag-tech mb-4 text-center">{label}</p>
      <div className="dm-marquee-mask overflow-hidden">
        <div className="dm-marquee-track flex w-max items-center gap-14 md:gap-16">
          {[...AVALES, ...AVALES].map((a, i) => (
            <div key={i} className="flex h-14 items-center px-2 opacity-80 grayscale transition-all hover:opacity-100 hover:grayscale-0">
              <Image
                src={a.src}
                alt={i < AVALES.length ? a.alt : ""}
                aria-hidden={i >= AVALES.length}
                width={150}
                height={44}
                className="h-8 w-auto max-w-[130px] object-contain md:h-9"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
