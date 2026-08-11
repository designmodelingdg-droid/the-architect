#!/usr/bin/env python3
"""
Generador del sitio de Design Modeling DG.

Produce un archivo HTML por página, cada uno listo para pegar en un único
widget HTML de Elementor (plantilla Canvas). El nav y el footer se repiten en
cada página porque Canvas no usa el header/footer del tema; los estilos viven
una sola vez en estilos-compartidos.css (WordPress → CSS adicional).

  python3 build.py            # genera las páginas para WordPress
  python3 build.py --local    # además genera _local/ con rutas relativas para previsualizar
"""
import os, re, sys, shutil

AQUI = os.path.dirname(os.path.abspath(__file__))

# Base de las imágenes generadas, ya subidas a la librería de medios.
# Si WordPress las coloca en otra carpeta de mes, cambiar solo esta línea.
IMG = "https://dgdesignmodeling.com/wp-content/uploads/2026/08/"
# Assets que ya existían en el sitio
WP  = "https://dgdesignmodeling.com/wp-content/uploads/"
AV  = "https://assets.cdn.filesafe.space/nkKbOarn5IwHeMv48uY9/media/"

LOGO    = WP + "2025/08/logo-dm-EX05-scaled.png"
DAYANA  = WP + "2025/09/DG-ING-DAYANA-WEB.png"
GABRIEL = WP + "2025/09/1.png"
WA      = "https://wa.me/593984372010"

# ---------------------------------------------------------------- NAV / FOOTER

MENU = [
    ("Servicios",          "/servicios/"),
    ("Plataforma",         "/dg-bim-intelligence/"),
    ("Quiénes somos",      "/quienes-somos/"),
    ("Acreditaciones",     "/acreditaciones/"),
    ("Bolsa de trabajo",   "/bolsa-de-trabajo/"),
    ("Blog",               "/blog/"),
    ("Contacto",           "/contactos/"),
]

def nav(activa=""):
    links = "\n".join(
        '        <a href="%s"%s>%s</a>' % (u, ' aria-current="page"' if u == activa else "", t)
        for t, u in MENU)
    moviles = "\n".join(
        '    <a href="%s"%s>%s</a>' % (u, ' aria-current="page"' if u == activa else "", t)
        for t, u in MENU)
    return f"""<nav class="dm-nav">
  <div class="nav-top">
    <div class="nav-top-inner">
      <a href="mailto:info@dgdesignmodeling.com">info@dgdesignmodeling.com</a>
      <a href="{WA}">(+593) 98 4372010</a>
      <a href="tel:+59325137246">(02) 513-7246</a>
    </div>
  </div>
  <input type="checkbox" id="dm-menu" class="nav-check" />
  <div class="nav-inner">
    <a href="/"><img class="nav-logo" src="{LOGO}" alt="Design Modeling DG — Consultoría BIM" /></a>
    <div class="nav-links">
{links}
    </div>
    <div style="display:flex;align-items:center;gap:8px">
      <a href="/contactos/" class="nav-cta">Agenda tu diagnóstico</a>
      <label for="dm-menu" class="nav-toggle" role="button" tabindex="0" aria-label="Abrir menú">&#9776;</label>
    </div>
  </div>
  <div class="nav-movil">
{moviles}
  </div>
</nav>"""

FOOTER = f"""<footer class="dm-footer">
  <div class="footer-grid">
    <div>
      <img class="footer-logo" src="{LOGO}" alt="Design Modeling DG" />
      <p class="footer-about">Consultoría BIM para proyectos estructurales y arquitectónicos. Partner y Centro de Formación Autorizado de Autodesk. Ecuador y Latinoamérica.</p>
      <div class="redes">
        <a href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook">Fb</a>
        <a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram">Ig</a>
        <a href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn">In</a>
        <a href="https://www.youtube.com/" target="_blank" rel="noopener" aria-label="YouTube">Yt</a>
        <a href="https://www.tiktok.com/" target="_blank" rel="noopener" aria-label="TikTok">Tk</a>
      </div>
    </div>
    <div class="footer-col">
      <h4>Servicios</h4>
      <a href="/servicios/#calculo">Cálculo estructural</a>
      <a href="/servicios/#arquitectura">Arquitectura y planos</a>
      <a href="/servicios/#coordinacion">Coordinación BIM</a>
      <a href="/servicios/#implementacion">Implementación BIM</a>
      <a href="/dg-bim-intelligence/">DG BIM Intelligence</a>
    </div>
    <div class="footer-col">
      <h4>Empresa</h4>
      <a href="/quienes-somos/">Quiénes somos</a>
      <a href="/acreditaciones/">Acreditaciones</a>
      <a href="/bolsa-de-trabajo/">Bolsa de trabajo</a>
      <a href="/blog/">Blog</a>
      <a href="https://designmodelingacademy.com/es/" target="_blank" rel="noopener">Design Modeling Academy</a>
    </div>
    <div class="footer-col">
      <h4>Conversemos</h4>
      <a href="mailto:info@dgdesignmodeling.com">info@dgdesignmodeling.com</a>
      <a href="{WA}" target="_blank" rel="noopener">(+593) 98 4372010</a>
      <a href="tel:+59325137246">(02) 513-7246</a>
      <span>Tomasa Mideros y Juana Terrazas OE4-86</span>
      <span>Quito, Ecuador</span>
    </div>
  </div>
  <div class="footer-bottom">
    <span>Copyright © 2026 MODELING-DG S.A.S · RUC: 1793148549001 · Todos los derechos reservados.</span>
    <span>
      <a href="/terminos-y-condiciones/">Términos y condiciones</a> ·
      <a href="/politicas-de-privacidad/">Políticas de privacidad</a> ·
      <a href="/politicas-de-cookies/">Cookies</a>
    </span>
  </div>
</footer>

<a class="dm-wa" href="{WA}?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20consultor%C3%ADa%20BIM" target="_blank" rel="noopener">Contactar a un asesor</a>"""

# ---------------------------------------------------------------- PIEZAS REUSABLES

AVALES = [(AV+"6a04d173601d54df8246caa4.png", "Autodesk Partner"),
          (AV+"6a04d1738c6475e185dfddb1.png", "Autodesk Authorized Training Center"),
          (AV+"6a04d1f0f7d455340c70e652.png", "Doctrina Qualitas"),
          (AV+"6a04d2928c6475e185e02739.png", "Sabal University"),
          (AV+"6a04d23b51d5d92ddcacf917.png", "Universidad de las Naciones"),
          (AV+"6a04d23b601d54df8246fbf7.png", "UAIII"),
          (AV+"6a04d23b8c6475e185e00d3e.png", "Sello de excelencia educativa")]

def marquee(label="Respaldados por"):
    uno = "\n".join('      <img src="%s" alt="%s" loading="lazy" />' % (u, a) for u, a in AVALES)
    dos = "\n".join('      <img src="%s" alt="" aria-hidden="true" loading="lazy" />' % u for u, _ in AVALES)
    return f"""<div class="authority">
  <p class="authority-label">{label}</p>
  <div class="authority-marquee">
    <div class="authority-track">
{uno}
{dos}
    </div>
  </div>
</div>"""

CLIENTES = [(WP+"2025/08/logo-de-empresa-mx-1-150x150-1.png", "SPI", ""),
            (WP+"2025/08/Diseno-sin-titulo-11-150x150-1.png", "VYMSA", " dark"),
            (WP+"2025/08/arconsa3-150x150-1.png", "ARCONSA — Estructuras de Acero", ""),
            (WP+"2025/08/SHARP-3-150x150-1-1.png", "Sharp CRM", ""),
            (WP+"2025/08/SHARP-5-150x150-1-1.png", "Inflect Consultoría", "")]

def logos_clientes():
    return '<div class="logos-grid">\n' + "\n".join(
        '      <div class="logo-tile%s"><img src="%s" alt="%s" loading="lazy" /></div>' % (c, u, a)
        for u, a, c in CLIENTES) + '\n    </div>'

FORM_BLOQUE = """<div class="form-card" id="formulario">
        <div class="form-header">
          <span class="badge-mini">Sin costo · Sin compromiso</span>
          <h3>Agenda tu diagnóstico</h3>
          <p>Revisamos tu proyecto y te decimos qué encontramos. Un consultor te contacta en 24 h.</p>
        </div>
        <div class="form-body">

          <!-- ▼▼ REEMPLAZAR POR EL IFRAME DE SHARP CRM ▼▼ -->
          <div class="form-placeholder">
            <div class="fp-title">Formulario pendiente de conectar</div>
            <div class="fp-text">Aquí va el formulario de Sharp CRM.<br>Mientras tanto, escríbenos directo:</div>
            <div class="form-alt">
              <a href="{WA}?text=Hola%2C%20quiero%20agendar%20un%20diagn%C3%B3stico%20de%20consultor%C3%ADa%20BIM" target="_blank" rel="noopener" class="btn btn-wa">Escríbenos por WhatsApp</a>
              <a href="mailto:info@dgdesignmodeling.com?subject=Diagn%C3%B3stico%20de%20consultor%C3%ADa%20BIM" class="btn btn-linea">info@dgdesignmodeling.com</a>
            </div>
          </div>
          <!--
            CUANDO TENGAS EL FORM ID, borra el div.form-placeholder de arriba y pega esto,
            reemplazando PEGAR_FORM_ID_AQUI por tu ID real de Sharp CRM:

            <iframe src="https://link.apisystem.tech/widget/form/PEGAR_FORM_ID_AQUI"
              id="inline-PEGAR_FORM_ID_AQUI" data-layout="{{'id':'INLINE'}}"
              data-trigger-type="alwaysShow" data-activation-type="alwaysActivated"
              data-deactivation-type="neverDeactivate" data-form-name="FORMULARIO CONSULTORIA BIM"
              data-height="620" data-layout-iframe-id="inline-PEGAR_FORM_ID_AQUI"
              data-form-id="PEGAR_FORM_ID_AQUI" title="FORMULARIO CONSULTORIA BIM"></iframe>
            <script src="https://link.apisystem.tech/js/form_embed.js"></script>
          -->
          <!-- ▲▲ FIN DEL BLOQUE A REEMPLAZAR ▲▲ -->

        </div>
        <div class="form-footer">Respuesta en menos de 24 h · Atendemos Ecuador y toda Latinoamérica</div>
      </div>""".replace("{WA}", WA)

def cta_final(titulo, texto, boton="Agenda tu diagnóstico gratuito"):
    return f"""<div class="cta-final">
  <h2>{titulo}</h2>
  <p>{texto}</p>
  <div class="btn-row">
    <a href="/contactos/" class="btn btn-naranja">{boton}</a>
    <a href="{WA}?text=Hola%2C%20quiero%20conversar%20sobre%20un%20proyecto" target="_blank" rel="noopener" class="btn btn-linea-claro">Escríbenos por WhatsApp</a>
  </div>
</div>"""

def page_hero(eyebrow, h1, lead, imagen, migas):
    m = " ".join('<a href="%s">%s</a><span>›</span>' % (u, t) for t, u in migas)
    return f"""<section class="page-hero" style="background-image: linear-gradient(135deg, rgba(0,30,48,0.93) 0%, rgba(0,62,92,0.84) 100%), url('{imagen}');">
  <div class="container">
    <div class="breadcrumb"><a href="/">Inicio</a><span>›</span>{m}</div>
    <span class="eyebrow">{eyebrow}</span>
    <h1>{h1}</h1>
    <p class="lead">{lead}</p>
  </div>
</section>"""

def envolver(titulo_comentario, activa, cuerpo):
    return f"""<!--
  {titulo_comentario} · Design Modeling DG
  PEGAR EN: WordPress → esta página → plantilla Elementor Canvas → un widget HTML.
  Los estilos vienen de estilos-compartidos.css (Apariencia → Personalizar → CSS adicional).
-->
<div class="dm">

{nav(activa)}

{cuerpo}

{FOOTER}

</div>"""

# ---------------------------------------------------------------- PÁGINAS
PAGINAS = {}

# ============================================================ INICIO
SERVICIOS_PREVIEW = [
    ("dm-servicio-estructural.jpg", "Cálculo Estructural",
     "Estructuras sismorresistentes para edificaciones nuevas y rehabilitación de existentes, con memoria de cálculo defendible ante cualquier revisión.", "/servicios/#calculo"),
    ("dm-servicio-arquitectura.jpg", "Arquitectura y Planos",
     "Planos arquitectónicos con instalaciones eléctricas, sanitarias e hidráulicas, listos para trámite municipal y para construir.", "/servicios/#arquitectura"),
    ("dm-servicio-coordinacion.jpg", "Modelado y Coordinación BIM",
     "Modelo federado de las tres disciplinas con detección sistemática de interferencias, y actualización durante la ejecución de obra.", "/servicios/#coordinacion"),
    ("dm-servicio-implementacion.jpg", "Implementación BIM en tu empresa",
     "Diagnóstico, estándares, flujos y capacitación para que tu organización trabaje en BIM sin improvisar.", "/servicios/#implementacion"),
]

_serv_cards = "\n".join(f"""      <article class="card">
        <div class="card-img"><img src="{IMG}{img}" alt="{t}" loading="lazy" /></div>
        <div class="card-body">
          <h3>{t}</h3>
          <p>{d}</p>
          <a href="{u}" class="link-mas">Ver el servicio →</a>
        </div>
      </article>""" for img, t, d, u in SERVICIOS_PREVIEW)

PAGINAS["inicio"] = envolver("HOME", "", f"""
<section class="home-hero" style="background-image: linear-gradient(135deg, rgba(0,30,48,0.90) 0%, rgba(0,62,92,0.74) 100%), url('{IMG}dm-hero.jpg');">
  <div class="container">
    <span class="eyebrow">Consultoría BIM · Ecuador y Latinoamérica</span>
    <h1>Ingeniería estructural y BIM para proyectos que <em>no admiten sorpresas</em></h1>
    <p class="lead">Diseñamos, calculamos y coordinamos proyectos estructurales y arquitectónicos con metodología BIM. Diez años resolviendo en el modelo lo que a otros les aparece en obra.</p>
    <div class="btn-row">
      <a href="/servicios/" class="btn btn-naranja">Ver nuestros servicios</a>
      <a href="/contactos/" class="btn btn-linea-claro">Agenda tu diagnóstico</a>
    </div>
    <div class="hero-stats">
      <div class="hero-stat"><div class="num">10+</div><div class="lbl">Años en proyectos BIM</div></div>
      <div class="hero-stat"><div class="num">Autodesk</div><div class="lbl">Partner autorizado</div></div>
      <div class="hero-stat"><div class="num">ARQ/EST/MEP</div><div class="lbl">Coordinación completa</div></div>
    </div>
  </div>
</section>

{marquee()}

<section>
  <div class="container">
    <div class="sec-head center">
      <span class="eyebrow">Qué hacemos</span>
      <h2>Consultoría BIM de punta a punta</h2>
      <p class="lead">Desde el cálculo de la estructura hasta la implementación de BIM en toda tu organización. Puedes contratar una pieza o el proceso completo.</p>
    </div>
    <div class="grid-2 mt-40">
{_serv_cards}
    </div>
    <div class="btn-row" style="justify-content:center;margin-top:36px">
      <a href="/servicios/" class="btn btn-linea">Ver todos los servicios</a>
    </div>
  </div>
</section>

<section class="bloque-oscuro">
  <div class="container">
    <div class="split">
      <div>
        <span class="eyebrow">Nuestra plataforma</span>
        <h2>DG BIM Intelligence</h2>
        <p class="lead">La desarrollamos porque ninguna herramienta del mercado nos daba lo que necesitábamos. Hoy la usamos en nuestros proyectos y la ofrecemos a nuestros clientes.</p>
        <ul class="feat-list">
          <li><strong>Detección de interferencias</strong>Conflictos entre arquitectura, estructura e instalaciones, clasificados por severidad.</li>
          <li><strong>Control de calidad del modelo</strong>Elementos sin clasificar, propiedades incompletas y warnings, antes de que el modelo llegue a obra.</li>
          <li><strong>Un tablero para cada rol</strong>El modelador ve su modelo, el coordinador los conflictos, la gerencia el avance.</li>
        </ul>
        <div class="btn-row">
          <a href="/dg-bim-intelligence/" class="btn btn-naranja">Conocer la plataforma</a>
        </div>
      </div>
      <div class="split-img"><img src="{IMG}dm-plataforma.jpg" alt="DG BIM Intelligence — panel de control del proyecto" loading="lazy" /></div>
    </div>
  </div>
</section>

<section class="bg-crema">
  <div class="container">
    <div class="sec-head center">
      <span class="eyebrow">El costo real</span>
      <h2>El error no está en el plano. Está en lo que nadie revisó a tiempo.</h2>
      <p class="lead">Los proyectos no se salen de presupuesto por una mala decisión de diseño. Se salen por conflictos entre disciplinas que nadie vio hasta que la cuadrilla ya estaba en sitio.</p>
    </div>
    <div class="grid-3 mt-40">
      <div class="card-acento">
        <h3>Retrabajo en sitio</h3>
        <p>Demoler, reubicar y volver a ejecutar lo que ya estaba construido. Materiales pagados dos veces y una cuadrilla parada mientras se decide qué hacer.</p>
      </div>
      <div class="card-acento">
        <h3>Frentes detenidos</h3>
        <p>El ducto choca con la viga. La estructura dice una cosa, instalaciones otra. El frente se congela hasta que alguien cede, y el cronograma se corre solo.</p>
      </div>
      <div class="card-acento">
        <h3>Adicionales que no negocias</h3>
        <p>Cada cambio no previsto entra como adicional. Y los adicionales, cuando la obra ya arrancó, nunca se negocian a tu favor.</p>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="container">
    <div class="sec-head center">
      <span class="eyebrow">Cómo trabajamos</span>
      <h2>Cuatro pasos, sin sorpresas a mitad de camino</h2>
      <p class="lead">Sabes desde el primer día qué recibes, cuándo lo recibes y cuánto cuesta.</p>
    </div>
    <div class="grid-4 mt-40">
      <div class="paso"><div class="paso-num">01</div><h3>Diagnóstico</h3><p>Revisamos tu proyecto y te decimos qué encontramos: riesgos, vacíos de información y qué se puede optimizar. Sin costo.</p></div>
      <div class="paso"><div class="paso-num">02</div><h3>Propuesta cerrada</h3><p>Alcance, entregables, plazos y precio por escrito. Si algo cambia, se conversa antes — no aparece en la factura.</p></div>
      <div class="paso"><div class="paso-num">03</div><h3>Ejecución</h3><p>Modelamos, calculamos y coordinamos. Tú sigues el avance real en DG BIM Intelligence, sin pedir reportes.</p></div>
      <div class="paso"><div class="paso-num">04</div><h3>Entrega</h3><p>Modelo federado, planos, memorias y reportes. Y si quieres, la plataforma queda activa para tu equipo.</p></div>
    </div>
  </div>
</section>

<section class="bg-crema">
  <div class="container">
    <div class="split">
      <div class="split-img"><img src="{IMG}dm-pg-empresa.jpg" alt="Estudio de ingeniería de Design Modeling DG" loading="lazy" /></div>
      <div>
        <span class="eyebrow">Quiénes somos</span>
        <h2>Una consultora dirigida por dos ingenieros, no por un comercial</h2>
        <p class="lead">Diez años diseñando y modelando estructuras con metodología BIM. Somos Partner y Centro de Formación Autorizado de Autodesk, y quien firma tu proyecto es quien lo revisa.</p>
        <a href="/quienes-somos/" class="link-mas">Conocer al equipo →</a>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="container">
    <div class="sec-head center">
      <span class="eyebrow">Confían en nosotros</span>
      <h2>Empresas y organizaciones que trabajan con Design Modeling</h2>
    </div>
    {logos_clientes()}
    <div class="btn-row" style="justify-content:center;margin-top:34px">
      <a href="/acreditaciones/" class="btn btn-linea">Ver nuestras acreditaciones</a>
    </div>
  </div>
</section>

<section class="bg-palido">
  <div class="container">
    <div class="split">
      <div>
        <span class="eyebrow">También formamos equipos</span>
        <h2>Design Modeling Academy</h2>
        <p class="lead">Además de la consultoría, formamos a los profesionales del sector: másters, diplomados universitarios y especializaciones en BIM, avalados por Autodesk y universidades internacionales. Si lo que buscas es capacitar a tu equipo, ese es el camino.</p>
        <div class="btn-row">
          <a href="https://designmodelingacademy.com/es/" target="_blank" rel="noopener" class="btn btn-azul">Ver la academia</a>
          <a href="/bolsa-de-trabajo/" class="btn btn-linea">Bolsa de trabajo</a>
        </div>
      </div>
      <div class="split-img"><img src="{IMG}dm-pg-acreditaciones.jpg" alt="Certificaciones y diplomas internacionales" loading="lazy" /></div>
    </div>
  </div>
</section>

<section id="contacto">
  <div class="container">
    <div class="contacto-grid">
      <div>
        <span class="eyebrow">Hablemos</span>
        <h2>Cuéntanos de tu proyecto</h2>
        <p class="lead">Treinta minutos de diagnóstico pueden ahorrarte semanas de retrabajo en obra. Sin costo y con una respuesta concreta sobre qué encontramos.</p>
        <div class="dato" style="margin-top:28px">
          <h4>Correo</h4>
          <a href="mailto:info@dgdesignmodeling.com">info@dgdesignmodeling.com</a>
        </div>
        <div class="dato">
          <h4>Teléfonos</h4>
          <a href="{WA}" target="_blank" rel="noopener">(+593) 98 4372010</a>
          <a href="tel:+59325137246">(02) 513-7246</a>
        </div>
        <div class="dato">
          <h4>Oficina</h4>
          <span>Tomasa Mideros y Juana Terrazas OE4-86</span>
          <span>Quito, Ecuador</span>
        </div>
      </div>
      {FORM_BLOQUE}
    </div>
  </div>
</section>
""")

# ============================================================ SERVICIOS
SERVICIOS_DETALLE = [
    ("calculo", "dm-servicio-estructural.jpg", "Cálculo Estructural",
     "Diseñamos y evaluamos estructuras sismorresistentes siguiendo códigos nacionales e internacionales. El servicio abarca desde la fase conceptual hasta la ingeniería de detalle.",
     ["Diseño de nuevas edificaciones",
      "Estudios de factibilidad",
      "Evaluación del estado actual de estructuras existentes",
      "Rehabilitación y evaluación sísmica",
      "Diseño y análisis de vibración",
      "Evaluación del desempeño estructural"]),
    ("arquitectura", "dm-servicio-arquitectura.jpg", "Arquitectura y Planos",
     "Documentación arquitectónica completa, lista para trámite municipal y para construir — no para volver a dibujar.",
     ["Planos arquitectónicos y de detalle constructivo",
      "Instalaciones eléctricas, sanitarias e hidráulicas",
      "Planos según normativa municipal",
      "Planos estructurales",
      "Plantas amobladas para presentación y venta de departamentos"]),
    ("coordinacion", "dm-servicio-coordinacion.jpg", "Modelado y Coordinación BIM",
     "Modelo federado de las tres disciplinas y detección sistemática de interferencias, con criterio estructural para decidir qué elemento cede.",
     ["Modelado y diseño BIM de edificios y estructuras",
      "Levantamiento BIM de edificaciones y sus instalaciones",
      "BIM «in situ» para gestión de cambios durante la obra",
      "BIM aplicado al diseño y cálculo estructural",
      "Asesoría y dirección técnica del proceso"]),
    ("implementacion", "dm-servicio-implementacion.jpg", "Implementación BIM en tu empresa",
     "Si tu organización quiere trabajar en BIM y no sabe por dónde empezar, acompañamos el proceso hasta que tu equipo camine solo.",
     ["Diagnóstico de madurez BIM de la organización",
      "Definición de estándares y flujos de trabajo",
      "Capacitación del equipo técnico",
      "Acompañamiento del primer proyecto piloto",
      "Implantación de DG BIM Intelligence como herramienta de gestión"]),
]

_serv_full = "\n".join(f"""
<section class="{'bg-crema' if i % 2 else ''}" id="{sid}">
  <div class="container">
    <div class="split">
      {'<div class="split-img"><img src="%s%s" alt="%s" loading="lazy" /></div>' % (IMG, img, t) if i % 2 else ''}
      <div>
        <span class="eyebrow">Servicio {i+1:02d}</span>
        <h2>{t}</h2>
        <p class="lead">{d}</p>
        <ul class="lista-check" style="margin-top:22px">
          {''.join('<li>%s</li>' % x for x in items)}
        </ul>
      </div>
      {'' if i % 2 else '<div class="split-img"><img src="%s%s" alt="%s" loading="lazy" /></div>' % (IMG, img, t)}
    </div>
  </div>
</section>""" for i, (sid, img, t, d, items) in enumerate(SERVICIOS_DETALLE))

PAGINAS["servicios"] = envolver("SERVICIOS", "/servicios/", f"""
{page_hero("Servicios", "Soluciones de ingeniería y construcción con metodología BIM",
           "Desde la fase conceptual hasta la ingeniería de detalle. Buscamos soluciones costo-efectivas para estructuras y edificaciones, nuevas o existentes, con diseño sismorresistente según códigos nacionales e internacionales.",
           IMG+"dm-servicio-coordinacion.jpg", [("Servicios", "/servicios/")])}

{marquee()}
{_serv_full}

<section>
  <div class="container">
    <div class="sec-head center">
      <span class="eyebrow">Capacidad técnica</span>
      <h2>Qué tipo de estructuras diseñamos</h2>
      <p class="lead">Nuestra experiencia cubre los sistemas y materiales que se usan realmente en la construcción de la región.</p>
    </div>
    <div class="grid-3 mt-40">
      <div class="card-acento">
        <h3>Materiales</h3>
        <p>Acero laminado en caliente · Acero laminado en frío · Mampostería estructural · Hormigón armado · Estructuras compuestas</p>
      </div>
      <div class="card-acento">
        <h3>Sistemas estructurales</h3>
        <p>Pórticos ordinarios y especiales a momento · Pórticos arriostrados excéntrica y concéntricamente · Sistemas duales · Muros de corte · Aislamiento sísmico</p>
      </div>
      <div class="card-acento">
        <h3>Tipologías</h3>
        <p>Edificaciones en altura · Naves industriales · Silos y tanques · Vivienda unifamiliar · Rehabilitación de estructuras existentes</p>
      </div>
    </div>
  </div>
</section>

<section class="bg-crema">
  <div class="container">
    <div class="sec-head center">
      <span class="eyebrow">Antes de agendar</span>
      <h2>¿Somos el equipo para tu proyecto?</h2>
      <p class="lead">Preferimos decirlo claro desde el inicio en vez de descubrirlo a mitad del contrato.</p>
    </div>
    <div class="grid-2 mt-40">
      <div class="for-card yes">
        <h3>Sí, si estás en esta situación</h3>
        <ul>
          <li>Tienes un <strong>proyecto de edificación</strong> y quieres el cálculo estructural y los planos resueltos con criterio técnico.</li>
          <li>Ya trabajas con modelos BIM pero <strong>las interferencias siguen apareciendo en obra</strong>.</li>
          <li>Eres constructora o promotora y quieres <strong>implementar BIM</strong> en tu operación sin improvisar.</li>
          <li>Necesitas <strong>visibilidad real del avance</strong> de un proyecto que hoy solo ves en reuniones semanales.</li>
          <li>Tienes una edificación existente y necesitas <strong>levantamiento y evaluación sísmica</strong>.</li>
        </ul>
      </div>
      <div class="for-card no">
        <h3>Probablemente todavía no</h3>
        <ul>
          <li>Buscas únicamente el precio más bajo del mercado, sin importar el criterio técnico detrás.</li>
          <li>Necesitas un plano firmado hoy mismo sin revisión previa del proyecto.</li>
          <li>Quieres formarte en BIM en vez de contratar el servicio — para eso está nuestra academia.</li>
          <li>Aún no tienes definido el alcance del proyecto ni quién toma las decisiones.</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="container-narrow">
    <div class="sec-head center">
      <span class="eyebrow">Preguntas frecuentes</span>
      <h2>Lo que nos preguntan antes de contratar</h2>
    </div>
    <div style="margin-top:36px">
      <details class="faq-item"><summary>¿Trabajan con proyectos que ya están en ejecución?</summary><div class="faq-content">Sí, y es más común de lo que parece. Hacemos <strong>levantamiento BIM de lo que ya está construido</strong> y modelamos lo que falta, para que el resto de la obra se coordine sobre información real y no sobre planos que ya cambiaron.</div></details>
      <details class="faq-item"><summary>Ya tenemos un modelador interno. ¿Para qué los necesitamos?</summary><div class="faq-content">Modelar y coordinar son cosas distintas. Un modelador construye su disciplina; la coordinación consiste en <strong>cruzar todas las disciplinas y resolver los conflictos</strong>, con criterio estructural para decidir qué elemento cede. Eso suele convivir bien con un equipo interno.</div></details>
      <details class="faq-item"><summary>¿Cuánto cuesta una consultoría BIM?</summary><div class="faq-content">Depende del alcance, la superficie y las disciplinas involucradas. Lo que sí es fijo: después del diagnóstico recibes una <strong>propuesta cerrada por escrito</strong> con alcance, plazos y precio. El diagnóstico no tiene costo.</div></details>
      <details class="faq-item"><summary>¿Trabajan fuera de Ecuador?</summary><div class="faq-content">Sí. Atendemos proyectos en toda Latinoamérica de forma remota, que es como se trabaja BIM de todas formas. La coordinación se hace sobre el modelo y las reuniones son por videollamada.</div></details>
      <details class="faq-item"><summary>¿Qué necesitan de nosotros para empezar?</summary><div class="faq-content">Para el diagnóstico basta con <strong>lo que tengas hoy</strong>: planos en PDF o CAD, un modelo en Revit, o incluso solo la descripción del proyecto y sus plazos.</div></details>
    </div>
  </div>
</section>

{cta_final("Cuéntanos de tu proyecto", "Treinta minutos de diagnóstico pueden ahorrarte semanas de retrabajo en obra. Sin costo y sin compromiso.")}
""")

# ============================================================ DG BIM INTELLIGENCE
PAGINAS["dg-bim-intelligence"] = envolver("DG BIM INTELLIGENCE", "/dg-bim-intelligence/", f"""
{page_hero("Nuestra plataforma", "DG BIM Intelligence",
           "El software que desarrollamos para gestionar nuestros propios proyectos BIM. Hoy lo ofrecemos a constructoras, promotoras y equipos de diseño que necesitan ver su proyecto entero en una sola pantalla.",
           IMG+"dm-plataforma.jpg", [("DG BIM Intelligence", "/dg-bim-intelligence/")])}

<section>
  <div class="container">
    <div class="sec-head center">
      <span class="eyebrow">Por qué existe</span>
      <h2>Ninguna herramienta del mercado nos daba lo que necesitábamos</h2>
      <p class="lead">Los detectores de interferencias entregan listas de miles de conflictos sin priorizar. Los gestores de proyecto no entienden de modelos. Nosotros necesitábamos las dos cosas en el mismo lugar, y con la información filtrada según quién la mira.</p>
    </div>
  </div>
</section>

<section class="bloque-oscuro">
  <div class="container">
    <div class="split">
      <div>
        <span class="eyebrow">Qué hace</span>
        <h2>Coordinación, calidad y avance en un solo tablero</h2>
        <ul class="feat-list">
          <li><strong>Detección de interferencias</strong>Conflictos entre arquitectura, estructura e instalaciones, clasificados por severidad — crítica, mayor o menor — con responsable asignado y estado de resolución.</li>
          <li><strong>Control de calidad del modelo</strong>Elementos sin clasificar, propiedades incompletas, warnings y nivel de detalle por disciplina, antes de que el modelo llegue a obra.</li>
          <li><strong>Seguimiento de cambios</strong>Historial de quién modificó qué y cuándo, con avance por disciplina y estado de cada issue abierto.</li>
          <li><strong>Vista 3D del modelo federado</strong>Navegación por niveles y categorías, con el desglose de elementos por tipo.</li>
        </ul>
      </div>
      <div class="split-img"><img src="{IMG}dm-plataforma.jpg" alt="Panel de coordinación de DG BIM Intelligence" loading="lazy" /></div>
    </div>
  </div>
</section>

<section class="bg-crema">
  <div class="container">
    <div class="sec-head center">
      <span class="eyebrow">Un tablero para cada rol</span>
      <h2>Nadie navega información que no le sirve</h2>
      <p class="lead">Tres perfiles, tres vistas distintas del mismo proyecto. Cada quien entra y ve lo que necesita decidir hoy.</p>
    </div>
    <div class="grid-3 mt-40">
      <div class="card-acento">
        <h3>Modelador BIM</h3>
        <p>Su disciplina: elementos totales, nivel de detalle promedio, elementos sin clasificar, propiedades completas, warnings y calidad del modelo.</p>
      </div>
      <div class="card-acento">
        <h3>Coordinador BIM</h3>
        <p>El cruce entre disciplinas: interferencias totales y críticas, pruebas ejecutadas, issues activos, modelos actualizados y la próxima reunión de coordinación.</p>
      </div>
      <div class="card-acento">
        <h3>Gerencia / BIM Manager</h3>
        <p>La lectura ejecutiva: avance global, reportes, validación general y configuración del proyecto — sin tener que abrir un modelo.</p>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="container">
    <div class="sec-head center">
      <span class="eyebrow">Cómo se contrata</span>
      <h2>Dos formas de usarla</h2>
    </div>
    <div class="grid-2 mt-40">
      <div class="for-card yes">
        <h3>Incluida en tu consultoría</h3>
        <p style="font-size:14.5px;color:#4b5563;line-height:1.6;margin-bottom:14px">Si nos contratas para modelar, calcular o coordinar tu proyecto, la plataforma viene incluida durante toda la ejecución. Es la forma en que te entregamos visibilidad del avance sin que tengas que pedir reportes.</p>
        <a href="/contactos/" class="link-mas">Agendar diagnóstico →</a>
      </div>
      <div class="for-card yes">
        <h3>Como software independiente</h3>
        <p style="font-size:14.5px;color:#4b5563;line-height:1.6;margin-bottom:14px">Si ya tienes tu propio equipo BIM y lo que necesitas es la herramienta de gestión, la licenciamos por separado, con acompañamiento en la puesta en marcha y capacitación de tu equipo.</p>
        <a href="/contactos/" class="link-mas">Solicitar una demo →</a>
      </div>
    </div>
  </div>
</section>

{cta_final("¿Quieres verla funcionando?", "Te mostramos la plataforma sobre un proyecto real y conversamos si encaja con tu operación.", "Solicita una demo")}
""")

# ============================================================ QUIÉNES SOMOS
PAGINAS["quienes-somos"] = envolver("QUIÉNES SOMOS", "/quienes-somos/", f"""
{page_hero("Quiénes somos", "Una consultora dirigida por ingenieros",
           "Diez años diseñando y modelando estructuras con metodología BIM para proyectos en Ecuador y Latinoamérica. Quien firma tu proyecto es quien lo revisa.",
           IMG+"dm-pg-empresa.jpg", [("Quiénes somos", "/quienes-somos/")])}

{marquee()}

<section>
  <div class="container">
    <div class="split">
      <div>
        <span class="eyebrow">La empresa</span>
        <h2>Qué hacemos y para quién</h2>
        <p class="lead">Somos una empresa dedicada al diseño y modelado de estructuras, enfocada en desarrollar proyectos de ingeniería con metodología BIM para diseños arquitectónicos y estructurales, con el compromiso de entregar soluciones inteligentes y económicas a nuestros clientes.</p>
        <p class="lead">Trabajamos con constructoras, promotoras, estudios de arquitectura y propietarios que necesitan que su proyecto llegue a obra sin conflictos entre disciplinas.</p>
      </div>
      <div class="split-img"><img src="{IMG}dm-servicio-coordinacion.jpg" alt="Modelo BIM federado" loading="lazy" /></div>
    </div>
  </div>
</section>

<section class="bg-crema">
  <div class="container">
    <div class="grid-3">
      <div class="card-acento">
        <h3>Nuestra política</h3>
        <p>Desarrollamos eficientemente los proyectos de ingeniería y arquitectura. Nos motiva la satisfacción de nuestros clientes y colaboradores, y nos inspira servir superando sus expectativas en tiempo, costo, cantidad y calidad requerida.</p>
      </div>
      <div class="card-acento">
        <h3>Nuestra visión</h3>
        <p>Lograr un segmento importante en el área de la construcción e ingeniería a nivel nacional e internacional, caracterizándonos por la innovación en el diseño y desarrollo de proyectos, a partir del uso de nuevas tecnologías.</p>
      </div>
      <div class="card-acento">
        <h3>Nuestra misión</h3>
        <p>Ejecutar proyectos con metodología BIM y tecnología propia, brindando servicios de asesoría que mejoren los procesos constructivos y aporten a la sostenibilidad y al desarrollo de la economía.</p>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="container">
    <div class="sec-head center">
      <span class="eyebrow">Quiénes respondemos</span>
      <h2>Detrás de cada proyecto hay dos ingenieros con nombre y apellido</h2>
    </div>
    <div class="grid-2 mt-40" style="max-width:1000px;margin-left:auto;margin-right:auto">
      <div class="persona">
        <div class="persona-foto"><img src="{DAYANA}" alt="Ing. Dayana Calderón Brunetti" loading="lazy" /></div>
        <p>Lidero la optimización administrativa y operativa de los proyectos, integrando procesos y tecnología para que cada cliente reciba resultados verificables y no solo entregables.</p>
        <div class="persona-nombre">Ing. Dayana Calderón Brunetti</div>
        <div class="persona-rol">Fundadora y CEO · Design Modeling DG</div>
      </div>
      <div class="persona">
        <div class="persona-foto"><img src="{GABRIEL}" alt="Ing. Gabriel Pantoja" loading="lazy" /></div>
        <p>Ingeniero Civil especializado en BIM Management y estructuras, con amplia experiencia en la integración de tecnologías Autodesk. Dirijo la parte técnica de cada proyecto que entra.</p>
        <div class="persona-nombre">Ing. Gabriel Pantoja</div>
        <div class="persona-rol">Cofundador · Director técnico BIM</div>
      </div>
    </div>
  </div>
</section>

<section class="bg-crema">
  <div class="container">
    <div class="sec-head center">
      <span class="eyebrow">Confían en nosotros</span>
      <h2>Empresas y organizaciones que trabajan con Design Modeling</h2>
    </div>
    {logos_clientes()}
  </div>
</section>

<section class="bg-palido">
  <div class="container">
    <div class="split">
      <div>
        <span class="eyebrow">La otra mitad</span>
        <h2>También formamos a los profesionales del sector</h2>
        <p class="lead">A través de <strong>Design Modeling Academy</strong> impartimos másters, diplomados universitarios internacionales y especializaciones en BIM, avalados por Autodesk y universidades internacionales, para toda Latinoamérica.</p>
        <div class="btn-row">
          <a href="https://designmodelingacademy.com/es/" target="_blank" rel="noopener" class="btn btn-azul">Ver la academia</a>
          <a href="/acreditaciones/" class="btn btn-linea">Nuestras acreditaciones</a>
        </div>
      </div>
      <div class="split-img"><img src="{IMG}dm-pg-acreditaciones.jpg" alt="Certificaciones internacionales" loading="lazy" /></div>
    </div>
  </div>
</section>

{cta_final("Conversemos de tu proyecto", "Te damos un diagnóstico honesto de lo que encontramos, sin costo y sin compromiso.")}
""")

# ============================================================ ACREDITACIONES
PAGINAS["acreditaciones"] = envolver("ACREDITACIONES", "/acreditaciones/", f"""
{page_hero("Acreditaciones", "Partner y Centro de Formación Autorizado de Autodesk",
           "Nuestro trabajo y nuestros programas están respaldados por Autodesk y por universidades e instituciones acreditadoras internacionales.",
           IMG+"dm-pg-acreditaciones.jpg", [("Acreditaciones", "/acreditaciones/")])}

{marquee("Nos respaldan")}

<section>
  <div class="container">
    <div class="sec-head center">
      <span class="eyebrow">Autodesk</span>
      <h2>Partner y Centro de Formación Autorizado</h2>
      <p class="lead">Ofrecemos formación especializada y certificaciones oficiales en software Autodesk, dirigidas a profesionales de diversas industrias. Ser centro autorizado significa que nuestros instructores están certificados y que los certificados que emitimos son verificables por Autodesk.</p>
    </div>
    <div class="grid-3 mt-40">
      <div class="card-acento">
        <h3>Autodesk Learning Partner</h3>
        <p>Autorizados para impartir formación oficial sobre el ecosistema Autodesk: Revit, Navisworks, Robot Structural Analysis y Dynamo, entre otros.</p>
      </div>
      <div class="card-acento">
        <h3>Authorized Training Center</h3>
        <p>Centro de formación autorizado, con instructores certificados y contenidos alineados a los estándares oficiales del fabricante.</p>
      </div>
      <div class="card-acento">
        <h3>Certificaciones verificables</h3>
        <p>Los certificados que emitimos incluyen código QR verificable digitalmente y se pueden publicar directamente en LinkedIn.</p>
      </div>
    </div>
  </div>
</section>

<section class="bg-crema">
  <div class="container">
    <div class="sec-head center">
      <span class="eyebrow">Avales académicos</span>
      <h2>Universidades e instituciones acreditadoras</h2>
      <p class="lead">Nuestros diplomados y másters cuentan con aval universitario internacional, con validez en Estados Unidos y Europa.</p>
    </div>
    <div class="grid-3 mt-40">
      <div class="card-acento">
        <h3>Doctrina Qualitas</h3>
        <p>Agencia Universitaria DQ y sello de Excelencia Educativa EQS, que acreditan la calidad de los programas formativos.</p>
      </div>
      <div class="card-acento">
        <h3>Círculo de Universidades Hispanoamericanas</h3>
        <p>Alfonso III el Magno — red universitaria que respalda los diplomados universitarios internacionales.</p>
      </div>
      <div class="card-acento">
        <h3>Universidades internacionales</h3>
        <p>Sabal University, Universidad de las Naciones, UAIII e ISTE Universidad, con títulos de validez internacional.</p>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="container">
    <div class="sec-head center">
      <span class="eyebrow">Qué significa para ti</span>
      <h2>Por qué importan las acreditaciones en una consultoría</h2>
    </div>
    <div class="grid-2 mt-40" style="max-width:900px;margin-left:auto;margin-right:auto">
      <div class="card-acento">
        <h3>Para tu proyecto</h3>
        <p>Que seamos centro autorizado de Autodesk implica que trabajamos con licencias oficiales, versiones vigentes y flujos alineados al estándar del fabricante. Tu modelo no queda atado a configuraciones improvisadas.</p>
      </div>
      <div class="card-acento">
        <h3>Para tu equipo</h3>
        <p>Si contratas la implementación de BIM en tu organización, la capacitación de tu equipo se certifica oficialmente — el conocimiento queda documentado y verificable, no solo en la cabeza de una persona.</p>
      </div>
    </div>
  </div>
</section>

{cta_final("¿Quieres trabajar con un equipo acreditado?", "Agenda un diagnóstico sin costo y conversamos sobre tu proyecto.")}
""")

# ============================================================ BOLSA DE TRABAJO
PAGINAS["bolsa-de-trabajo"] = envolver("BOLSA DE TRABAJO", "/bolsa-de-trabajo/", f"""
{page_hero("Bolsa de trabajo", "Vacantes verificadas para nuestros estudiantes y egresados",
           "Publicamos periódicamente ofertas laborales del sector de la construcción y el diseño, seleccionadas por su compatibilidad con el perfil de quienes se forman con nosotros.",
           IMG+"dm-pg-empresa.jpg", [("Bolsa de trabajo", "/bolsa-de-trabajo/")])}

<section>
  <div class="container">
    <div class="grid-3">
      <div class="card-acento">
        <h3>Vacantes exclusivas</h3>
        <p>Ofertas laborales dirigidas específicamente a estudiantes y egresados de nuestros programas, no listados públicos que ya vio todo el mercado.</p>
      </div>
      <div class="card-acento">
        <h3>Empresas verificadas</h3>
        <p>Revisamos y validamos la información de cada empresa que publica, para que postules con seguridad y sepas con quién estás hablando.</p>
      </div>
      <div class="card-acento">
        <h3>Acompañamiento</h3>
        <p>Orientación y herramientas para mejorar tu proceso de postulación: perfil profesional, portafolio de proyectos y preparación de entrevista.</p>
      </div>
    </div>
  </div>
</section>

<section class="bg-crema">
  <div class="container">
    <div class="split">
      <div>
        <span class="eyebrow">Cómo se accede</span>
        <h2>Transforma tu aprendizaje en experiencia laboral</h2>
        <p class="lead">Al inscribirte en un diplomado o curso por suscripción de Design Modeling Academy, obtienes acceso al grupo de Bolsa de Trabajo, donde publicamos vacantes periódicamente.</p>
        <p class="lead">Estas vacantes se caracterizan por tener una compatibilidad elevada con el perfil de nuestros egresados, en base a las competencias que trabajamos dentro de los planes de estudio. Además verificamos la veracidad de la información de las empresas que ofertan, para mayor seguridad en tu proceso.</p>
        <div class="btn-row">
          <a href="https://designmodelingacademy.com/es/" target="_blank" rel="noopener" class="btn btn-naranja">Ver los programas</a>
        </div>
      </div>
      <div class="split-img"><img src="{IMG}dm-pg-acreditaciones.jpg" alt="Egresados certificados" loading="lazy" /></div>
    </div>
  </div>
</section>

<section>
  <div class="container">
    <div class="sec-head center">
      <span class="eyebrow">Tu mejor oportunidad laboral</span>
      <h2>Trabajo en Ingeniería Civil o Arquitectura a tu alcance</h2>
      <p class="lead">Encuentra oportunidades para crecer profesionalmente en el sector de la construcción y el diseño.</p>
    </div>
    <div class="grid-2 mt-40" style="max-width:940px;margin-left:auto;margin-right:auto">
      <div class="card-acento">
        <h3>Compatibilidad con tu perfil</h3>
        <p>Gracias a la estructura de aprendizaje de Design Modeling Academy, desarrollas las aptitudes que el mercado laboral pide hoy. En la bolsa encontrarás empleos alineados a esas competencias.</p>
      </div>
      <div class="card-acento">
        <h3>Diversidad de sectores</h3>
        <p>Validamos la diversidad de sectores, empresas y niveles de perfil, para que cada egresado encuentre una oportunidad ajustada a su momento profesional.</p>
      </div>
    </div>
  </div>
</section>

<div class="cta-final">
  <h2>Abre las puertas a tu futuro profesional</h2>
  <p>Nuestros cursos y diplomados están diseñados para potenciar tus competencias, conectarte con el mercado y darte las herramientas para destacar en un entorno cada vez más competitivo.</p>
  <div class="btn-row">
    <a href="https://designmodelingacademy.com/es/" target="_blank" rel="noopener" class="btn btn-naranja">Conocer los programas</a>
    <a href="/contactos/" class="btn btn-linea-claro">Escríbenos</a>
  </div>
</div>
""")

# ============================================================ CONTACTOS
PAGINAS["contactos"] = envolver("CONTACTOS", "/contactos/", f"""
{page_hero("Contacto", "Cuéntanos de tu proyecto",
           "Treinta minutos de diagnóstico pueden ahorrarte semanas de retrabajo en obra. Sin costo, sin compromiso y con una respuesta concreta sobre qué encontramos.",
           IMG+"dm-hero.jpg", [("Contacto", "/contactos/")])}

<section>
  <div class="container">
    <div class="contacto-grid">
      <div>
        <span class="eyebrow">Dónde encontrarnos</span>
        <h2>MODELING-DG S.A.S</h2>
        <p class="lead" style="margin-bottom:30px">RUC: 1793148549001</p>
        <div class="dato">
          <h4>Oficina</h4>
          <span>Tomasa Mideros y Juana Terrazas OE4-86</span>
          <span>Quito, Ecuador</span>
        </div>
        <div class="dato">
          <h4>Correos</h4>
          <a href="mailto:info@dgdesignmodeling.com">info@dgdesignmodeling.com</a>
          <a href="mailto:designmodelingdg@gmail.com">designmodelingdg@gmail.com</a>
        </div>
        <div class="dato">
          <h4>Teléfonos</h4>
          <a href="tel:+59325137246">(02) 513-7246</a>
          <a href="{WA}" target="_blank" rel="noopener">(+593) 098 437-2010 · WhatsApp</a>
          <a href="tel:+593983742722">(+593) 098 374-2722</a>
        </div>
        <div class="dato">
          <h4>Horario de atención</h4>
          <span>Lunes a viernes, 9:00 a 18:00 (GMT-5)</span>
        </div>
      </div>
      {FORM_BLOQUE}
    </div>
  </div>
</section>

<section class="bg-crema">
  <div class="container">
    <div class="sec-head center">
      <span class="eyebrow">También por aquí</span>
      <h2>Accede a material exclusivo en nuestras redes</h2>
      <p class="lead">Publicamos herramientas, tutoriales y novedades pensadas para profesionales que quieren transformar la manera de diseñar y construir.</p>
      <div class="btn-row" style="justify-content:center;margin-top:26px">
        <a href="{WA}" target="_blank" rel="noopener" class="btn btn-wa">WhatsApp</a>
        <a href="https://www.instagram.com/" target="_blank" rel="noopener" class="btn btn-linea">Instagram</a>
        <a href="https://www.linkedin.com/" target="_blank" rel="noopener" class="btn btn-linea">LinkedIn</a>
        <a href="https://www.youtube.com/" target="_blank" rel="noopener" class="btn btn-linea">YouTube</a>
      </div>
    </div>
  </div>
</section>
""")

# ============================================================ BLOG (listado)
PAGINAS["blog"] = envolver("BLOG — LISTADO", "/blog/", f"""
{page_hero("Blog", "Ingeniería, BIM y construcción",
           "Artículos técnicos sobre metodología BIM, diseño estructural y gestión de proyectos, escritos por el equipo que los ejecuta.",
           IMG+"dm-pg-blog.jpg", [("Blog", "/blog/")])}

<section>
  <div class="container">

    <!--
      ESTADO ACTUAL: no hay artículos publicados, así que se muestra el aviso de abajo.
      CUANDO PUBLIQUES EL PRIMERO: borra el div.blog-vacio y descomenta el grid de tarjetas.
      Cada tarjeta se duplica por artículo. La plantilla del artículo está en blog-articulo.html.
    -->

    <div class="blog-vacio">
      <h3>Estamos preparando los primeros artículos</h3>
      <p>Muy pronto publicaremos contenido técnico sobre coordinación BIM, diseño sismorresistente y gestión de proyectos. Mientras tanto, escríbenos si tienes una duda concreta sobre tu proyecto.</p>
      <div class="btn-row" style="justify-content:center;margin-top:22px">
        <a href="/contactos/" class="btn btn-naranja">Hacer una consulta</a>
      </div>
    </div>

    <!--
    <div class="grid-3">
      <article class="card post-card">
        <div class="card-img"><img src="URL_DE_LA_IMAGEN" alt="" loading="lazy" /></div>
        <div class="card-body">
          <div class="post-meta">12 de agosto, 2026 · Coordinación BIM</div>
          <h3>Título del artículo</h3>
          <p>Entradilla de dos líneas que resuma de qué trata y por qué le interesa a quien lo lee.</p>
          <a href="/blog/slug-del-articulo/" class="link-mas">Leer el artículo →</a>
        </div>
      </article>
    </div>
    -->

  </div>
</section>

{cta_final("¿Tienes una duda técnica sobre tu proyecto?", "Agenda un diagnóstico sin costo y te damos una respuesta concreta.")}
""")

# ============================================================ BLOG (artículo)
PAGINAS["blog-articulo"] = envolver("BLOG — PLANTILLA DE ARTÍCULO", "/blog/", f"""
<!--
  PLANTILLA DE ARTÍCULO. Duplicar esta página por cada entrada y reemplazar:
  el título, la fecha, la categoría, la imagen de portada y el contenido de .articulo.
-->

{page_hero("Coordinación BIM", "Título del artículo, escrito como una frase completa",
           "Entradilla de una o dos líneas que adelante la idea central y le diga al lector por qué le conviene seguir leyendo.",
           IMG+"dm-pg-blog.jpg", [("Blog", "/blog/")])}

<section>
  <div class="container">
    <div class="articulo">
      <p class="post-meta" style="font-size:13px;margin-bottom:26px">Publicado el 12 de agosto de 2026 · por Ing. Gabriel Pantoja · 6 min de lectura</p>

      <p>Primer párrafo del artículo. Entra directo al punto: qué problema aborda y qué se va a resolver aquí. Nada de introducción de brochure.</p>

      <h2>Un subtítulo que ordena la idea</h2>
      <p>Desarrollo del argumento. Usa <strong>negritas</strong> para los términos que el lector va a querer encontrar cuando vuelva a escanear el texto.</p>

      <ul>
        <li>Un punto concreto y verificable.</li>
        <li>Otro punto, con un dato o una consecuencia real.</li>
      </ul>

      <blockquote>Una frase que valga la pena destacar, normalmente la conclusión práctica del apartado.</blockquote>

      <h2>Otro subtítulo</h2>
      <p>Más desarrollo. Si hay una imagen o un esquema, va aquí:</p>
      <img src="{IMG}dm-servicio-coordinacion.jpg" alt="Descripción de la imagen" loading="lazy" />

      <h2>Conclusión</h2>
      <p>Cierra con lo que el lector debería hacer distinto a partir de mañana.</p>
    </div>
  </div>
</section>

{cta_final("¿Tienes este problema en tu proyecto?", "Agenda un diagnóstico sin costo y te decimos qué encontramos.")}
""")

# ---------------------------------------------------------------- ESCRITURA

def main():
    for nombre, html in PAGINAS.items():
        ruta = os.path.join(AQUI, nombre + ".html")
        with open(ruta, "w", encoding="utf-8") as f:
            f.write(html)
        print("  %-26s %6.1f KB" % (nombre + ".html", os.path.getsize(ruta) / 1024))

    if "--local" in sys.argv:
        # versión previsualizable: CSS embebido y rutas de imagen relativas
        loc = os.path.join(AQUI, "_local")
        os.makedirs(loc, exist_ok=True)
        if os.path.isdir(os.path.join(loc, "assets")):
            shutil.rmtree(os.path.join(loc, "assets"))
        shutil.copytree(os.path.join(AQUI, "assets"), os.path.join(loc, "assets"))
        css = open(os.path.join(AQUI, "estilos-compartidos.css"), encoding="utf-8").read()
        css = re.sub(r"@import url\([^)]*\);", "", css)  # las fuentes se cargan con <link> en el preview
        fuentes = ('<link rel="preconnect" href="https://fonts.googleapis.com">'
                   '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
                   '<link href="https://fonts.googleapis.com/css2?family=Overpass:wght@500;600;700;800'
                   '&family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet">')
        locales = {
            LOGO: "assets/logo-dg.png", DAYANA: "assets/dayana.png", GABRIEL: "assets/gabriel.png",
        }
        for u, a, _ in CLIENTES:
            locales[u] = "assets/cli-%s.png" % {"SPI": "spi", "VYMSA": "vymsa",
                "ARCONSA — Estructuras de Acero": "arconsa", "Sharp CRM": "sharp",
                "Inflect Consultoría": "inflect"}[a]
        for i, (u, _) in enumerate(AVALES, 1):
            locales[u] = "assets/av%d.png" % i

        for nombre, html in PAGINAS.items():
            h = html
            for u, r in locales.items():
                h = h.replace(u, r)
            h = h.replace(IMG, "assets/")
            # enlaces internos → archivos locales
            for slug in PAGINAS:
                h = h.replace('href="/%s/"' % ("dg-bim-intelligence" if slug == "dg-bim-intelligence" else slug),
                              'href="%s.html"' % slug)
            h = h.replace('href="/"', 'href="inicio.html"')
            h = h.replace('href="/servicios/#', 'href="servicios.html#')
            h = ("<!doctype html><html lang=\"es\"><head><meta charset=\"utf-8\">"
                 "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">"
                 "<title>%s · Design Modeling DG</title>%s<style>%s</style></head><body>%s</body></html>"
                 % (nombre.replace("-", " ").title(), fuentes, css, h))
            open(os.path.join(loc, nombre + ".html"), "w", encoding="utf-8").write(h)
        print("\n  preview local en sitio/_local/inicio.html")

if __name__ == "__main__":
    print("Generando el sitio de Design Modeling DG…\n")
    main()
