import { DOMINIO, NOMBRE, EMAIL, RAZON_SOCIAL, RUC, REDES, CONSULTORIA, LINKEDIN_EMPRESA } from "@/lib/site";

/*
 * JSON-LD del sitio: la academia como EducationalOrganization, hija de la
 * sociedad que la opera, más el sitio web. Los programas (Course +
 * CourseInstance) se añaden en cada página de programa desde el contenido,
 * no aquí. Es el único archivo del proyecto con dangerouslySetInnerHTML, y
 * solo con JSON compuesto en el servidor.
 */
const GRAFO = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${CONSULTORIA}/#org`,
      name: "Design Modeling DG",
      legalName: RAZON_SOCIAL,
      taxID: RUC,
      url: CONSULTORIA,
      sameAs: ["https://www.wikidata.org/wiki/Q141456227", LINKEDIN_EMPRESA],
    },
    {
      "@type": "EducationalOrganization",
      "@id": `${DOMINIO}/#academia`,
      name: NOMBRE,
      alternateName: "DMA",
      url: DOMINIO,
      logo: `${DOMINIO}/images/logo-academy.png`,
      email: EMAIL,
      telephone: "+593984372010",
      parentOrganization: { "@id": `${CONSULTORIA}/#org` },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Juana Terrazas N71-154",
        addressLocality: "Quito",
        addressRegion: "Pichincha",
        addressCountry: "EC",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "admissions",
          email: EMAIL,
          telephone: "+593984372010",
          areaServed: ["EC", "CO", "PE", "MX", "GT", "CR", "PA", "CL", "AR", "ES", "US"],
          availableLanguage: ["es"],
        },
      ],
      sameAs: REDES.map((r) => r.href),
      knowsAbout: [
        "BIM",
        "Ingeniería estructural",
        "Revit",
        "Robot Structural Analysis",
        "ETABS",
        "SAP2000",
        "CYPE",
        "Inteligencia artificial aplicada a la construcción",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${DOMINIO}/#web`,
      url: DOMINIO,
      name: NOMBRE,
      inLanguage: "es",
      publisher: { "@id": `${DOMINIO}/#academia` },
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
