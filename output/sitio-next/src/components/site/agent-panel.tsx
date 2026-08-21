"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE = [0.23, 1, 0.32, 1] as const;

const FILAS = [
  { k: "Hallazgo", v: "12 interferencias críticas en coordinación MEP — ducto Ø400 vs viga V-23, nivel N+8.", tone: "naranja" },
  { k: "Evidencia", v: "Elemento, disciplina, nivel y regla aplicada. Confianza del criterio: 92%.", tone: "azul" },
  { k: "Impacto", v: "Riesgo de RFI, retrabajo en obra y atraso de secuencia constructiva.", tone: "azul" },
  { k: "Acción", v: "Reubicar montante 0.40 m al eje B. Prioridad alta para modelador y coordinador.", tone: "verde" },
] as const;

export function AgentPanel() {
  const reduced = useReducedMotion();
  return (
    <div className="panel-oscuro relative overflow-hidden p-0" role="img" aria-label="DG BIM Intelligence analizando un proyecto: hallazgo, evidencia, impacto y acción recomendada">
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-3">
        <span className="font-heading text-[11px] font-bold uppercase tracking-[0.13em] text-azul-palido/60">
          DG BIM Intelligence — Proyecto 042
        </span>
        <span className="flex items-center gap-1.5 font-heading text-[10px] font-bold uppercase tracking-widest text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden /> razonando
        </span>
      </div>
      <div className="space-y-3.5 p-5">
        {FILAS.map((f, i) => (
          <motion.div
            key={f.k}
            initial={reduced ? false : { opacity: 0, transform: "translateY(10px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.9 + i * 0.55 }}
            className="grid grid-cols-[92px_1fr] items-start gap-3"
          >
            <span
              className={`mt-0.5 rounded px-1.5 py-0.5 text-center font-heading text-[10px] font-bold uppercase tracking-wider ${
                f.tone === "naranja"
                  ? "bg-naranja/18 text-naranja-claro"
                  : f.tone === "verde"
                  ? "bg-emerald-400/12 text-emerald-300"
                  : "bg-azul-medio/25 text-azul-palido"
              }`}
            >
              {f.k}
            </span>
            <p className="text-[13.5px] leading-relaxed text-azul-palido/90">{f.v}</p>
          </motion.div>
        ))}
        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: reduced ? 0 : 3.3 }}
          className="pt-1 font-heading text-[11px] font-semibold text-azul-palido/55"
        >
          Siguiente: verificar pases estructurales del N+9 <span className="cursor-agente" aria-hidden />
        </motion.p>
      </div>
    </div>
  );
}
