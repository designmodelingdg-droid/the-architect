/*
 * JSON-LD del sitio: Organización + negocio profesional + sitio web,
 * en un solo grafo para buscadores y motores de búsqueda con IA.
 */
const GRAFO = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://dgdesignmodeling.com/#org",
      name: "Design Modeling DG",
      legalName: "MODELING-DG S.A.S.",
      taxID: "1793148549001",
      url: "https://dgdesignmodeling.com",
      logo: "https://dgdesignmodeling.com/images/logo-dg.png",
      email: "info@dgdesignmodeling.com",
      telephone: "+593984372010",
      sameAs: [
        "https://www.linkedin.com/company/design-modeling-dg/",
        "https://www.instagram.com/design_modeling_dg/",
        "https://www.tiktok.com/@designmodelingdg",
        "https://www.facebook.com/designmodelingdg",
        "https://x.com/DgModeling",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://dgdesignmodeling.com/#negocio",
      name: "Design Modeling DG — Consultoría BIM con inteligencia artificial",
      parentOrganization: { "@id": "https://dgdesignmodeling.com/#org" },
      description:
        "Consultoría en ingeniería estructural, arquitectura, modelado y coordinación BIM e implementación BIM, con software propio de IA (DG BIM Intelligence). Ecuador y Latinoamérica.",
      url: "https://dgdesignmodeling.com",
      telephone: "+593984372010",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Juana Terrazas N71-154",
        addressLocality: "Quito",
        addressCountry: "EC",
      },
      areaServed: ["Ecuador", "Latinoamérica", "España"],
      knowsAbout: [
        "BIM",
        "Ingeniería estructural",
        "Revit",
        "Coordinación de disciplinas",
        "Diseño sismorresistente",
        "Inteligencia artificial aplicada a la construcción",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://dgdesignmodeling.com/#web",
      url: "https://dgdesignmodeling.com",
      name: "Design Modeling DG",
      inLanguage: "es",
      publisher: { "@id": "https://dgdesignmodeling.com/#org" },
    },
  ],
};

export function DatosEstructurados() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(GRAFO) }}
    />
  );
}
