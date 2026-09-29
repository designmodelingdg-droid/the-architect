import Image from "next/image";

/*
 * El logo de la academia lo entrega Dayana en su archivo original (naranja
 * sobre transparente) y no se redibuja. Hasta que exista en public/images, la
 * marca se escribe con la tipografía de títulos: nada de imágenes rotas en la
 * barra. next.config.ts comprueba el archivo en build y expone la bandera.
 */
const HAY_LOGO = process.env.LOGO_ACADEMY === "1";

export function Logo({ oscuro = false, className = "" }: { oscuro?: boolean; className?: string }) {
  if (HAY_LOGO) {
    return (
      <Image
        src={oscuro ? "/images/logo-academy-dark.png" : "/images/logo-academy.png"}
        alt="Design Modeling Academy"
        width={220}
        height={48}
        priority={!oscuro}
        className={className}
      />
    );
  }
  return (
    <span className={`inline-flex items-baseline gap-1 whitespace-nowrap font-heading font-extrabold leading-none ${oscuro ? "text-white" : "text-navy"} ${className}`} aria-label="Design Modeling Academy">
      <span className="text-[15px] tracking-tight sm:text-[19px]">Design Modeling</span>
      <span className="text-[15px] tracking-tight text-naranja sm:text-[19px]">Academy</span>
    </span>
  );
}
