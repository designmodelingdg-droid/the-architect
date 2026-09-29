"use client";

import { useMemo, useState } from "react";
import { TarjetaPrograma } from "./tarjeta-programa";
import { NIVELES, OTROS_TIPOS } from "@/lib/site";
import { NIVEL_EXIGENCIA, type TarjetaDatos } from "@/lib/formato";

/*
 * Filtros del catálogo, en cliente y sobre una lista cerrada de valores: tipo,
 * área, software y nivel de exigencia. Nadie llega buscando «BIM»; llega
 * buscando Revit, y por eso el software es un filtro de primer nivel.
 */
type Opcion = { slug: string; nombre: string };

const TIPOS: Opcion[] = [
  ...NIVELES.map((n) => ({ slug: n.tipo, nombre: n.plural })),
  { slug: "bloque", nombre: "Bloques del Máster" },
  { slug: "paquete", nombre: "Paquetes" },
  ...OTROS_TIPOS.filter((o) => o.tipo !== "paquete").map((o) => ({ slug: o.tipo, nombre: o.plural })),
  { slug: "suscripcion", nombre: "Suscripción" },
];

function Grupo({ etiqueta, valor, setValor, opciones }: { etiqueta: string; valor: string; setValor: (v: string) => void; opciones: Opcion[] }) {
  return (
  <fieldset className="min-w-0">
    <legend className="tag-tech mb-2 !text-tinta-suave">{etiqueta}</legend>
    <div className="flex flex-wrap gap-1.5">
      <button
        type="button"
        onClick={() => setValor("")}
        aria-pressed={valor === ""}
        className={`rounded-full border px-3 py-1.5 font-heading text-[11.5px] font-bold uppercase tracking-[0.08em] transition-colors ${valor === "" ? "border-navy bg-navy text-white" : "border-border bg-white text-tinta hover:border-azul"}`}
      >
        Todos
      </button>
      {opciones.map((o) => (
        <button
          key={o.slug}
          type="button"
          onClick={() => setValor(valor === o.slug ? "" : o.slug)}
          aria-pressed={valor === o.slug}
          className={`rounded-full border px-3 py-1.5 font-heading text-[11.5px] font-bold uppercase tracking-[0.08em] transition-colors ${valor === o.slug ? "border-navy bg-navy text-white" : "border-border bg-white text-tinta hover:border-azul"}`}
        >
          {o.nombre}
        </button>
      ))}
    </div>
  </fieldset>
);
}

export function FiltrosCatalogo({
  programas,
  areas,
  software,
  docentes,
  credenciales,
  tipoInicial = "",
}: {
  programas: TarjetaDatos[];
  areas: Opcion[];
  software: Opcion[];
  docentes: Record<string, string>;
  credenciales: Record<string, string>;
  tipoInicial?: string;
}) {
  const [tipo, setTipo] = useState(tipoInicial);
  const [area, setArea] = useState("");
  const [soft, setSoft] = useState("");
  const [nivel, setNivel] = useState("");

  const lista = useMemo(
    () =>
      programas.filter(
        (p) =>
          (!tipo || p.tipo === tipo) &&
          (!area || p.area === area) &&
          (!soft || (p.software ?? []).includes(soft)) &&
          (!nivel || p.nivel === nivel || p.nivel === "todos"),
      ),
    [programas, tipo, area, soft, nivel],
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-7 lg:sticky lg:top-24 lg:self-start">
        <Grupo etiqueta="Nivel" valor={tipo} setValor={setTipo} opciones={TIPOS} />
        <Grupo etiqueta="Software" valor={soft} setValor={setSoft} opciones={software} />
        <Grupo etiqueta="Área" valor={area} setValor={setArea} opciones={areas} />
        <Grupo etiqueta="Exigencia" valor={nivel} setValor={setNivel} opciones={Object.entries(NIVEL_EXIGENCIA).filter(([k]) => k !== "todos").map(([slug, nombre]) => ({ slug, nombre }))} />
      </aside>

      <div>
        <p className="mb-5 font-heading text-[12px] font-bold uppercase tracking-[0.14em] text-tinta-suave" aria-live="polite">
          {lista.length} {lista.length === 1 ? "programa" : "programas"}
        </p>
        {lista.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {lista.map((p) => (
              <TarjetaPrograma key={p.slug} p={p} docentes={docentes} credenciales={credenciales} />
            ))}
          </div>
        ) : (
          <div className="panel p-8 text-center">
            <p className="font-heading text-lg font-bold text-navy">No hay programas con esa combinación.</p>
            <p className="mt-2 text-[14px] text-tinta-suave">Quita un filtro, o escríbenos y te decimos qué programa se acerca más a lo que buscas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
