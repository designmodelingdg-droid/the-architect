#!/usr/bin/env python3
"""
Empaqueta el sitio completo en un solo HTML autocontenido para previsualizar.

Toma las páginas generadas por build.py, las mete todas en un archivo con un
router mínimo en JS (una página visible a la vez), incrusta las imágenes como
data URI y las fuentes como @font-face, y no deja ninguna petición externa.

  python3 build_artifact.py
"""
import base64, os, re, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
import build as B

ASSETS = os.path.join(AQUI, "assets")
FUENTES = "/tmp/claude-0/-home-user-the-architect/d08cb00c-821f-56bd-a12b-65ebb1b2d901/scratchpad/fonts/inline-fonts.css"

ORDEN = ["inicio", "servicios", "dg-bim-intelligence", "quienes-somos",
         "acreditaciones", "bolsa-de-trabajo", "contactos", "blog", "blog-articulo"]

def data_uri(nombre):
    ruta = os.path.join(ASSETS, nombre)
    mime = "image/jpeg" if nombre.endswith(".jpg") else "image/png"
    return "data:%s;base64,%s" % (mime, base64.b64encode(open(ruta, "rb").read()).decode())

# mapa URL remota -> archivo local
REMOTO = {B.LOGO: "logo-dg.png", B.DAYANA: "dayana.png", B.GABRIEL: "gabriel.png"}
for u, a, _ in B.CLIENTES:
    REMOTO[u] = "cli-%s.png" % {"SPI": "spi", "VYMSA": "vymsa",
        "ARCONSA — Estructuras de Acero": "arconsa", "Sharp CRM": "sharp",
        "Inflect Consultoría": "inflect"}[a]
for i, (u, _) in enumerate(B.AVALES, 1):
    REMOTO[u] = "av%d.png" % i

def cuerpo_de(nombre):
    """Extrae el contenido de la página, sin el nav ni el footer (van una sola vez)."""
    html = B.PAGINAS[nombre]
    html = re.sub(r"<nav class=\"dm-nav\">.*?</nav>", "", html, flags=re.S)
    html = re.sub(r"<footer class=\"dm-footer\">.*?</footer>", "", html, flags=re.S)
    html = re.sub(r"<a class=\"dm-wa\".*?</a>", "", html, flags=re.S)
    html = re.sub(r"^<!--.*?-->", "", html, flags=re.S).strip()
    html = re.sub(r"^<div class=\"dm\">", "", html).strip()
    html = re.sub(r"</div>\s*$", "", html).strip()
    return html

def main():
    secciones = []
    for n in ORDEN:
        secciones.append('<div class="pagina" id="%s"%s>\n%s\n</div>'
                         % (n, "" if n == "inicio" else ' hidden', cuerpo_de(n)))

    nav = B.nav("")
    footer = B.FOOTER

    doc = "\n".join(['<div class="dm">', nav, "\n".join(secciones), footer, "</div>"])

    # rutas internas -> anclas del router
    for n in ORDEN:
        doc = doc.replace('href="/%s/"' % n, 'href="#%s"' % n)
    doc = doc.replace('href="/"', 'href="#inicio"')
    doc = doc.replace('href="/servicios/#', 'href="#servicios" data-sub="')
    doc = doc.replace('href="/blog/slug-del-articulo/"', 'href="#blog-articulo"')

    # imágenes -> data URI
    for u, f in REMOTO.items():
        doc = doc.replace(u, data_uri(f))
    for f in sorted(os.listdir(ASSETS)):
        if f.startswith("dm-"):
            doc = doc.replace(B.IMG + f, data_uri(f))

    css = open(os.path.join(AQUI, "estilos-compartidos.css"), encoding="utf-8").read()
    css = re.sub(r"@import url\([^)]*\);", "", css)
    fuentes = open(FUENTES, encoding="utf-8").read()

    extra = """
.pagina[hidden] { display: none; }
.dm .aviso-preview { background: var(--naranja-palido); color: #7a4a10; text-align: center;
  padding: 9px 16px; font-size: 12.5px; font-family: 'Overpass', sans-serif; font-weight: 600;
  letter-spacing: 0.2px; }
"""

    js = """
(function () {
  var paginas = %s;
  function mostrar(id) {
    if (paginas.indexOf(id) === -1) id = 'inicio';
    paginas.forEach(function (p) {
      var el = document.getElementById(p);
      if (el) el.hidden = (p !== id);
    });
    document.querySelectorAll('.dm-nav .nav-links a, .dm-nav .nav-movil a').forEach(function (a) {
      var destino = (a.getAttribute('href') || '').replace('#', '');
      if (destino === id) { a.setAttribute('aria-current', 'page'); }
      else { a.removeAttribute('aria-current'); }
    });
    var chk = document.getElementById('dm-menu');
    if (chk) chk.checked = false;
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', function () {
    mostrar(location.hash.replace('#', ''));
  });
  mostrar(location.hash.replace('#', '') || 'inicio');
})();
""" % (repr(ORDEN).replace("'", '"'))

    salida = ('<title>Design Modeling DG</title>\n'
              '<style>\n%s\n%s\n%s\n</style>\n'
              '<div class="dm"><div class="aviso-preview">Vista previa navegable · '
              'los enlaces del menú cambian de página dentro de esta misma vista</div></div>\n'
              '%s\n<script>%s</script>' % (fuentes, css, extra, doc, js))

    ruta = os.path.join(AQUI, "_artifact-sitio.html")
    open(ruta, "w", encoding="utf-8").write(salida)
    externas = re.findall(r'(?:src=|url\()["\']?https://(?!wa\.me|designmodelingacademy|www\.)', salida)
    print("  _artifact-sitio.html  %.2f MB  ·  externas: %d" % (os.path.getsize(ruta) / 1048576, len(externas)))

if __name__ == "__main__":
    main()
