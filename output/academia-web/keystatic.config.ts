import { config, collection, singleton, fields } from "@keystatic/core";

/*
 * El catálogo de la academia vive aquí, como archivos en `content/`. Una sola
 * fuente y dos puertas: Claude por PR, y el equipo desde /keystatic con su
 * cuenta de GitHub. Todo lo que el sitio muestra de un programa, un docente o
 * una credencial sale de estas colecciones; nada se duplica en el código.
 *
 * El esquema de `programas` sigue el modelo de datos del LMS anterior
 * (auditoría del 29/09/2026): niveles, precios por país y en cuotas, modalidad,
 * certificados, relaciones especialización → cursos y máster → bonos.
 */

const IMG = (carpeta: string) => ({
  directory: `public/images/${carpeta}`,
  publicPath: `/images/${carpeta}/`,
});

const TIPOS = [
  { label: "Máster", value: "master" },
  { label: "Bloque del Máster", value: "bloque" },
  { label: "Diplomado", value: "diplomado" },
  { label: "Especialización", value: "especializacion" },
  { label: "Paquete", value: "paquete" },
  { label: "Curso", value: "curso" },
  { label: "Ruta de aprendizaje", value: "ruta" },
  { label: "Mentoría", value: "mentoria" },
  { label: "Guía o e-book", value: "guia" },
  { label: "Suscripción", value: "suscripcion" },
] as const;

export default config({
  storage: { kind: "local" },
  ui: {
    brand: { name: "Design Modeling Academy" },
    navigation: {
      Catálogo: ["programas", "testimonios", "eventos"],
      Escuela: ["docentes", "credenciales", "avales", "empresasClientes"],
      Filtros: ["areas", "software"],
      Páginas: ["inicio", "nosotros", "empresas"],
    },
  },

  collections: {
    programas: collection({
      label: "Programas",
      slugField: "titulo",
      path: "content/programas/*",
      format: { data: "yaml" },
      columns: ["tipo", "estado", "proximoInicio"],
      schema: {
        titulo: fields.slug({ name: { label: "Título", validation: { isRequired: true } } }),
        tipo: fields.select({ label: "Nivel", options: TIPOS, defaultValue: "curso" }),
        estado: fields.select({
          label: "Estado",
          options: [
            { label: "Público", value: "publico" },
            { label: "Oculto", value: "oculto" },
          ],
          defaultValue: "publico",
        }),
        destacado: fields.checkbox({ label: "Destacado en el inicio", defaultValue: false }),
        resumen: fields.text({ label: "Resumen (una o dos frases)", multiline: true, validation: { isRequired: true } }),
        descripcion: fields.text({ label: "Descripción larga", multiline: true }),
        paraQuien: fields.array(fields.text({ label: "Perfil" }), { label: "Para quién es", itemLabel: (p) => p.value }),
        aprenderas: fields.array(fields.text({ label: "Resultado" }), { label: "Qué vas a lograr", itemLabel: (p) => p.value }),
        beneficios: fields.array(fields.text({ label: "Beneficio" }), { label: "Beneficios", itemLabel: (p) => p.value }),

        modulos: fields.array(
          fields.object({
            titulo: fields.text({ label: "Título del módulo" }),
            descripcion: fields.text({ label: "Descripción", multiline: true }),
            sesiones: fields.array(
              fields.object({
                titulo: fields.text({ label: "Sesión" }),
                duracion: fields.text({ label: "Duración" }),
              }),
              { label: "Sesiones", itemLabel: (p) => p.fields.titulo.value },
            ),
          }),
          { label: "Plan de estudios", itemLabel: (p) => p.fields.titulo.value },
        ),

        horas: fields.integer({ label: "Horas certificadas" }),
        meses: fields.integer({ label: "Duración en meses" }),
        modalidad: fields.select({
          label: "Modalidad",
          options: [
            { label: "En vivo", value: "vivo" },
            { label: "Pregrabado", value: "pregrabado" },
            { label: "Mixto (en vivo y grabado)", value: "mixto" },
          ],
          defaultValue: "mixto",
        }),
        nivel: fields.select({
          label: "Nivel de exigencia",
          options: [
            { label: "Básico", value: "basico" },
            { label: "Intermedio", value: "intermedio" },
            { label: "Avanzado", value: "avanzado" },
            { label: "Todos los niveles", value: "todos" },
          ],
          defaultValue: "todos",
        }),
        proximoInicio: fields.date({ label: "Próximo inicio" }),

        mostrarPrecio: fields.checkbox({ label: "Mostrar precio en la web", defaultValue: true }),
        precios: fields.array(
          fields.object({
            opcion: fields.select({
              label: "Opción",
              options: [
                { label: "Pago único", value: "unico" },
                { label: "En cuotas", value: "cuotas" },
                { label: "Preventa", value: "preventa" },
                { label: "Mensual", value: "mensual" },
                { label: "Anual", value: "anual" },
              ],
              defaultValue: "unico",
            }),
            monto: fields.number({ label: "Monto", validation: { isRequired: true } }),
            moneda: fields.text({ label: "Moneda", defaultValue: "USD" }),
            pais: fields.text({ label: "País (vacío = todos)" }),
            tachado: fields.number({ label: "Precio tachado" }),
            cuotas: fields.integer({ label: "Número de cuotas" }),
          }),
          { label: "Precios", itemLabel: (p) => `${p.fields.opcion.value} · ${p.fields.moneda.value} ${p.fields.monto.value ?? ""} ${p.fields.pais.value}` },
        ),
        excluidoDeSuscripcion: fields.checkbox({ label: "Excluido de la suscripción Design Premium", defaultValue: false }),

        credenciales: fields.array(fields.relationship({ label: "Credencial", collection: "credenciales" }), { label: "Credenciales que otorga", itemLabel: (p) => p.value ?? "" }),
        docentes: fields.array(fields.relationship({ label: "Docente", collection: "docentes" }), { label: "Docentes", itemLabel: (p) => p.value ?? "" }),
        software: fields.array(fields.relationship({ label: "Software", collection: "software" }), { label: "Software", itemLabel: (p) => p.value ?? "" }),
        area: fields.relationship({ label: "Área", collection: "areas" }),
        incluye: fields.array(fields.relationship({ label: "Programa", collection: "programas" }), { label: "Incluye (cursos de una especialización, bonos de un máster)", itemLabel: (p) => p.value ?? "" }),

        imagen: fields.image({ label: "Imagen de tarjeta (414 × 237)", ...IMG("programas") }),
        portada: fields.image({ label: "Portada (1106 × 624)", ...IMG("programas") }),
        video: fields.url({ label: "Video de presentación (Vimeo)" }),
        brochure: fields.url({ label: "Brochure (PDF)" }),

        urlMatricula: fields.url({ label: "URL de matrícula en GHL" }),
        urlCita: fields.url({ label: "URL de cita informativa en GHL" }),
        whatsapp: fields.url({ label: "WhatsApp del programa" }),

        faq: fields.array(
          fields.object({
            pregunta: fields.text({ label: "Pregunta" }),
            respuesta: fields.text({ label: "Respuesta", multiline: true }),
          }),
          { label: "Preguntas frecuentes", itemLabel: (p) => p.fields.pregunta.value },
        ),
        testimonios: fields.array(fields.relationship({ label: "Testimonio", collection: "testimonios" }), { label: "Testimonios", itemLabel: (p) => p.value ?? "" }),

        slugAnterior: fields.text({ label: "Ruta en la web anterior (para redirigir)", description: "Por ejemplo /curso/robot-acero" }),
        alumnos: fields.integer({ label: "Alumnos matriculados (del LMS)" }),
      },
    }),

    docentes: collection({
      label: "Docentes",
      slugField: "nombre",
      path: "content/docentes/*",
      format: { data: "yaml" },
      schema: {
        nombre: fields.slug({ name: { label: "Nombre", validation: { isRequired: true } } }),
        titulacion: fields.text({ label: "Titulación", description: "Por ejemplo: Ingeniero Civil (Universidad Católica Andrés Bello)" }),
        rolFuera: fields.text({ label: "Rol fuera de la escuela", description: "Lo que hace en la práctica. Es la prueba de que enseña quien construye." }),
        bio: fields.text({ label: "Biografía", multiline: true }),
        foto: fields.image({ label: "Foto", ...IMG("docentes") }),
        linkedin: fields.url({ label: "LinkedIn" }),
        slugAnterior: fields.text({ label: "Ruta en la web anterior" }),
      },
    }),

    credenciales: collection({
      label: "Credenciales",
      slugField: "nombre",
      path: "content/credenciales/*",
      format: { data: "yaml" },
      schema: {
        nombre: fields.slug({ name: { label: "Nombre" } }),
        emisor: fields.text({ label: "Quién la emite" }),
        queCertifica: fields.text({ label: "Qué certifica", multiline: true }),
        registroOficial: fields.text({ label: "Registro oficial", description: "Por ejemplo: SENESCYT, Licencia FL 11494" }),
        logo: fields.image({ label: "Logo del emisor (archivo original)", ...IMG("credenciales") }),
        url: fields.url({ label: "Sitio del emisor" }),
        orden: fields.integer({ label: "Orden", defaultValue: 99 }),
      },
    }),

    avales: collection({
      label: "Avales y partners",
      slugField: "nombre",
      path: "content/avales/*",
      format: { data: "yaml" },
      schema: {
        nombre: fields.slug({ name: { label: "Nombre" } }),
        tipo: fields.text({ label: "Tipo de relación", description: "Authorized Training Center, Learning Partner, Authorized Partner…" }),
        desde: fields.text({ label: "Desde" }),
        logo: fields.image({ label: "Logo (archivo original)", ...IMG("avales") }),
        url: fields.url({ label: "Enlace de verificación" }),
      },
    }),

    areas: collection({
      label: "Áreas",
      slugField: "nombre",
      path: "content/areas/*",
      format: { data: "yaml" },
      schema: {
        nombre: fields.slug({ name: { label: "Nombre" } }),
        descripcion: fields.text({ label: "Descripción", multiline: true }),
      },
    }),

    software: collection({
      label: "Software",
      slugField: "nombre",
      path: "content/software/*",
      format: { data: "yaml" },
      schema: {
        nombre: fields.slug({ name: { label: "Nombre" } }),
        fabricante: fields.text({ label: "Fabricante" }),
      },
    }),

    testimonios: collection({
      label: "Testimonios",
      slugField: "nombre",
      path: "content/testimonios/*",
      format: { data: "yaml" },
      schema: {
        nombre: fields.slug({ name: { label: "Nombre" } }),
        cargo: fields.text({ label: "Cargo" }),
        pais: fields.text({ label: "País" }),
        programa: fields.relationship({ label: "Programa", collection: "programas" }),
        resultado: fields.text({ label: "Resultado concreto", multiline: true, description: "Qué cambió. Sin resultado no se publica." }),
        fuente: fields.url({ label: "Fuente de la reseña" }),
        verificado: fields.checkbox({ label: "Cargo y país verificados contra la reseña original", defaultValue: false }),
        foto: fields.image({ label: "Foto", ...IMG("testimonios") }),
      },
    }),

    eventos: collection({
      label: "Eventos",
      slugField: "titulo",
      path: "content/eventos/*",
      format: { data: "yaml" },
      schema: {
        titulo: fields.slug({ name: { label: "Título" } }),
        fecha: fields.datetime({ label: "Fecha y hora" }),
        modalidad: fields.text({ label: "Modalidad", defaultValue: "Online, en vivo" }),
        resumen: fields.text({ label: "Resumen", multiline: true }),
        url: fields.url({ label: "Landing de inscripción (GHL)" }),
      },
    }),

    empresasClientes: collection({
      label: "Empresas cliente",
      slugField: "nombre",
      path: "content/empresas-clientes/*",
      format: { data: "yaml" },
      schema: {
        nombre: fields.slug({ name: { label: "Nombre" } }),
        logo: fields.image({ label: "Logo", ...IMG("empresas") }),
        url: fields.url({ label: "Sitio" }),
      },
    }),
  },

  singletons: {
    inicio: singleton({
      label: "Inicio",
      path: "content/inicio",
      format: { data: "yaml" },
      schema: {
        anuncio: fields.text({ label: "Anuncio de la barra superior" }),
        anuncioUrl: fields.url({ label: "Enlace del anuncio" }),
        destacados: fields.array(fields.relationship({ label: "Programa", collection: "programas" }), { label: "Programas destacados", itemLabel: (p) => p.value ?? "" }),
      },
    }),
    nosotros: singleton({
      label: "Nosotros",
      path: "content/nosotros",
      format: { data: "yaml" },
      schema: {
        historia: fields.text({ label: "Historia", multiline: true }),
        cifras: fields.array(
          fields.object({
            valor: fields.text({ label: "Valor" }),
            etiqueta: fields.text({ label: "Etiqueta" }),
            fuente: fields.text({ label: "De dónde sale", description: "LMS, matrículas, certificados emitidos…" }),
          }),
          { label: "Cifras con fuente", itemLabel: (p) => `${p.fields.valor.value} ${p.fields.etiqueta.value}` },
        ),
      },
    }),
    empresas: singleton({
      label: "Empresas",
      path: "content/empresas",
      format: { data: "yaml" },
      schema: {
        intro: fields.text({ label: "Introducción", multiline: true }),
        modalidades: fields.array(
          fields.object({
            nombre: fields.text({ label: "Modalidad" }),
            descripcion: fields.text({ label: "Descripción", multiline: true }),
          }),
          { label: "Modalidades", itemLabel: (p) => p.fields.nombre.value },
        ),
      },
    }),
  },
});
