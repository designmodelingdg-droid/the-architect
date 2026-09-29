import Link from "next/link";
import { Section } from "@/components/site/section";
import { NIVELES } from "@/lib/site";

/*
 * 404 útil: dice que la ruta no existe y da las puertas. Las rutas de la web
 * anterior que sí tienen destino se redirigen en next.config.ts antes de
 * llegar aquí.
 */
export default function NoEncontrada() {
  return (
    <Section tone="base">
      <div className="mx-auto max-w-2xl">
        <span className="tag-tech">Error 404</span>
        <h1 className="mt-3 text-3xl font-bold text-navy md:text-4xl">Esta página no existe</h1>
        <p className="mt-4 leading-relaxed text-tinta-suave md:text-lg">
          Puede que el programa haya cambiado de dirección o que el enlace venga de la web anterior.
          Lo que buscas está seguramente en el catálogo.
        </p>
        <ul className="mt-8 grid gap-2 sm:grid-cols-2">
          <li><Link href="/programas" className="block rounded-xl border border-border bg-white px-5 py-4 font-heading font-bold text-navy hover:border-azul">Todo el catálogo</Link></li>
          {NIVELES.map((n) => (
            <li key={n.slug}><Link href={`/${n.slug}`} className="block rounded-xl border border-border bg-white px-5 py-4 font-heading font-bold text-navy hover:border-azul">{n.plural}</Link></li>
          ))}
          <li><Link href="/contacto" className="block rounded-xl border border-border bg-white px-5 py-4 font-heading font-bold text-navy hover:border-azul">Contacto y cita informativa</Link></li>
        </ul>
      </div>
    </Section>
  );
}
