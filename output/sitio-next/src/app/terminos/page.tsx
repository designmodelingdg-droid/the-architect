import type { Metadata } from "next";
import { Section } from "@/components/site/section";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Términos y condiciones de uso del sitio y de los servicios de MODELING-DG S.A.S.",
};

const SECCIONES: [string, string[]][] = [
  [
    "1. Identificación",
    [
      "Este sitio web es operado por MODELING-DG S.A.S. (en adelante, «Design Modeling DG»), RUC 1793148549001, con domicilio en Juana Terrazas N71-154, Quito, Ecuador. Contacto: info@dgdesignmodeling.com · (+593) 98 4372010.",
    ],
  ],
  [
    "2. Objeto",
    [
      "Design Modeling DG presta servicios de consultoría en ingeniería estructural, arquitectura, modelado y coordinación BIM e implementación de metodología BIM, y licencia software propio de asistencia al proyecto (DG BIM Intelligence). Este sitio tiene fines informativos y comerciales: describe los servicios y permite iniciar el contacto con nuestro equipo.",
    ],
  ],
  [
    "3. Uso del sitio",
    [
      "El usuario se compromete a utilizar el sitio de forma lícita, sin vulnerar derechos de terceros ni afectar su funcionamiento. Queda prohibida la reproducción total o parcial de los contenidos con fines comerciales sin autorización escrita de Design Modeling DG.",
    ],
  ],
  [
    "4. Propuestas y contratación de servicios",
    [
      "El diagnóstico inicial que se agenda a través de este sitio no tiene costo ni genera obligación de contratar. Todo servicio se formaliza mediante propuesta escrita con alcance, plazos y precio, aceptada por ambas partes. Las condiciones particulares de cada proyecto (entregables, cronograma, honorarios, confidencialidad) se rigen por el contrato u orden de trabajo correspondiente, que prevalece sobre estos términos generales.",
    ],
  ],
  [
    "5. Confidencialidad de la información de proyectos",
    [
      "La información técnica que los clientes comparten para diagnósticos o servicios (planos, modelos BIM, memorias, presupuestos) se trata como confidencial, se usa únicamente para el fin acordado y no se comparte con terceros ajenos a la prestación del servicio.",
    ],
  ],
  [
    "6. Propiedad intelectual",
    [
      "Las marcas, logotipos, textos, imágenes, capturas de la plataforma y demás contenidos de este sitio pertenecen a Design Modeling DG o se usan con autorización de sus titulares. El software DG BIM Intelligence, sus componentes y su documentación son propiedad de Design Modeling DG; su uso se rige por la licencia contratada en cada caso.",
    ],
  ],
  [
    "7. Limitación de responsabilidad",
    [
      "La información publicada en este sitio es de carácter general y no constituye asesoría de ingeniería para un proyecto específico. Design Modeling DG no responde por decisiones tomadas únicamente con base en el contenido del sitio, ni por interrupciones o errores ajenos a su control razonable. La responsabilidad profesional sobre servicios contratados se regula en el contrato correspondiente.",
    ],
  ],
  [
    "8. Enlaces a terceros",
    [
      "El sitio puede enlazar a servicios de terceros (por ejemplo, WhatsApp, LinkedIn, Vimeo o Design Modeling Academy). Design Modeling DG no controla esos sitios ni responde por sus contenidos o políticas.",
    ],
  ],
  [
    "9. Modificaciones",
    [
      "Design Modeling DG puede actualizar estos términos en cualquier momento. La versión vigente es la publicada en esta página, con su fecha de actualización.",
    ],
  ],
  [
    "10. Ley aplicable",
    [
      "Estos términos se rigen por las leyes de la República del Ecuador. Cualquier controversia se someterá a los jueces competentes de Quito.",
    ],
  ],
];

export default function Terminos() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <span className="tag-tech">Legal</span>
        <h1 className="mt-3 text-3xl font-bold text-navy md:text-4xl">Términos y condiciones</h1>
        <p className="mt-3 text-[14px] text-tinta-suave">Última actualización: septiembre de 2026</p>
        <div className="mt-8 space-y-7">
          {SECCIONES.map(([t, ps]) => (
            <section key={t}>
              <h2 className="text-lg font-bold text-navy">{t}</h2>
              {ps.map((p) => (
                <p key={p.slice(0, 40)} className="mt-2 leading-relaxed text-tinta-suave">{p}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </Section>
  );
}
