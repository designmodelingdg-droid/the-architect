#!/usr/bin/env python3
"""
Carga el catálogo real desde la auditoría del 29/09/2026 a content/ (YAML de Keystatic).

    python3 scripts/cargar-auditoria.py /ruta/a/auditoria

Decisiones aplicadas (29/09/2026):
- Temario del Máster: el oficial de 12 módulos en 4 bloques. Sin precio visible.
- Diplomados: precios de Sharp CRM (Estructural 499,99 · Arquitectura 399,99).
- Bloques del Máster: programas propios con precio (750 · 750 · 600 · 900, 2 cuotas).
- Cursos de la colección IA: 199,99 (Sharp). Naves PRO: 27 (Sharp).
- Testimonios: ninguno se carga sin verificar cargo y país. Eventos: no hay futuros.
"""
import json, re, sys, os, unicodedata
from pathlib import Path

AUD = Path(sys.argv[1]) if len(sys.argv) > 1 else None
if not AUD or not AUD.exists():
    sys.exit("uso: cargar-auditoria.py <carpeta de la auditoría>")
RAIZ = Path(__file__).resolve().parent.parent
CONT = RAIZ / "content"

# ---------- YAML mínimo (cadenas entre comillas dobles, siempre válido) ----------
def y(v, ind=0):
    p = "  " * ind
    if isinstance(v, dict):
        out = []
        for k, val in v.items():
            if val is None or val == "" or val == []:
                continue
            if isinstance(val, (dict, list)):
                out.append(f"{p}{k}:")
                out.append(y(val, ind + 1))
            else:
                out.append(f"{p}{k}: {esc(val)}")
        return "\n".join(out)
    if isinstance(v, list):
        out = []
        for it in v:
            if isinstance(it, dict):
                inner = y(it, ind + 1).split("\n")
                first = inner[0].strip()
                out.append(f"{p}- {first}")
                out.extend(inner[1:])
            elif isinstance(it, list):
                out.append(f"{p}-")
                out.append(y(it, ind + 1))
            else:
                out.append(f"{p}- {esc(it)}")
        return "\n".join(out)
    return p + esc(v)

def esc(v):
    if isinstance(v, bool): return "true" if v else "false"
    if isinstance(v, (int, float)): return repr(v) if isinstance(v, float) else str(v)
    return json.dumps(str(v), ensure_ascii=False)

def escribe(col, slug, data):
    d = CONT / col; d.mkdir(parents=True, exist_ok=True)
    (d / f"{slug}.yaml").write_text(y(data) + "\n", encoding="utf-8")

def slugify(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s

def cap(t):
    """Primera letra en mayúscula; el texto de la auditoría venía telegráfico."""
    t = t.strip()
    return t[:1].upper() + t[1:] if t else t

def partes(s):
    """Divide una línea de la auditoría en ítems por ; o · y deja fuera lo que no es un ítem
    (un WhatsApp o un brochure colados al final de la línea)."""
    if not s: return []
    items = re.split(r"\s*[;·]\s*", s)
    out = []
    for i in items:
        i = i.strip().rstrip(".")
        if not i or re.match(r"^(WhatsApp|Brochure|Descripción)\b", i): continue
        out.append(cap(i))
    return out

# ---------- fuentes ----------
cat = json.load(open(AUD / "catalogo_cursos.json", encoding="utf-8"))
raw02 = (AUD / "raw/02_cursos_detalle.md").read_text(encoding="utf-8")

# docentes: cadena de la auditoría -> slug
DOCENTES = {
    "Ing. Gabriel Pantoja": ("gabriel-pantoja", "Ingeniero Civil (Universidad Católica Andrés Bello)", "Director de Design Modeling DG, la consultoría estructural y BIM del grupo. Su criterio entrena a DG BIM Intelligence.", "/docente/ing-gabriel-pantoja-781955"),
    "Arq. Cristina Holguín": ("cristina-holguin", "Arquitecta", "", "/docente/arq-cristina-holguin-1003491"),
    "Arq. Ester Celeste Álvarez": ("ester-celeste-alvarez", "Arquitecta", "", "/docente/arq-ester-celeste-alvarez-781954"),
    "Ing. Andrés Linares": ("andres-linares", "Ingeniero", "", "/docente/ing-andres-linares-1027857"),
    "Ing. Christopher Méndez": ("christopher-mendez", "Ingeniero", "", "/docente/ing-christopher-mendez-1027858"),
    "Ing. Edgar Ceballos": ("edgar-ceballos", "Ingeniero", "", "/docente/ing-edgar-ceballos-788733"),
    "Ing. Manuel Luces": ("manuel-luces", "Ingeniero", "", "/docente/ing-manuel-luces-786018"),
    "Ing. Mijail Mayorga": ("mijail-mayorga", "Ingeniero", "", "/docente/ing-mijail-mayorga-786017"),
    "Ing. Pablo Sandoya": ("pablo-sandoya", "Ingeniero", "", "/docente/ing-pablo-sandoya-792322"),
    "Patricio Ignacio Hernández Marín": ("patricio-hernandez-marin", "", "", "/docente/patricio-ignacio-hernandez-marin-1027913"),
}
def doc_slugs(s):
    out = []
    for nombre, (slug, *_r) in DOCENTES.items():
        if nombre in (s or ""): out.append(slug)
    # apellidos sueltos (raw/03 usa "Pantoja, Luces")
    for ap, slug in [("Pantoja","gabriel-pantoja"),("Luces","manuel-luces"),("Mayorga","mijail-mayorga"),("Sandoya","pablo-sandoya"),("Holguín","cristina-holguin")]:
        if ap in (s or "") and slug not in out: out.append(slug)
    return out

AREAS = ["Acero Estructural","Cálculo Estructural","Cimentaciones","Conexiones y Detalles","Diseño de Piezas","Edificios Residenciales","Elaboración de Planos","Hormigón Armado","Madera Estructural","Metodología BIM","Naves Industriales","Presupuesto","Tanques Elevados","Marketing y Gestión"]
SOFTWARE = {"Advance Steel":"Autodesk","AutoCAD":"Autodesk","CYPECAD":"CYPE","Dynamo":"Autodesk","ETABS":"CSI","Excel":"Microsoft","Inventor":"Autodesk","Project":"Microsoft","Revit":"Autodesk","Robot Structural Analysis":"Autodesk","SAFE":"CSI","SAP2000":"CSI","Solidworks":"Dassault","Navisworks":"Autodesk","Unreal Engine":"Epic Games","Power BI":"Microsoft","Python":""}
def sw_slugs(s):
    return [slugify(k) for k in SOFTWARE if k.lower() in (s or "").lower()]
def area_slug(s):
    for a in AREAS:
        if a.lower() in (s or "").lower(): return slugify(a)
    return None

CRED = {  # cadena en la auditoría -> slug de credencial
    "Autodesk": "autodesk-certificate-of-completion",
    "ACU": "autodesk-certified-user",
    "Modeling-DG": "certificado-design-modeling",
    "Design Modeling": "certificado-design-modeling",
    "DQ": "doctrinas-qualitas-dq",
    "Sabal": "sabal-university",
    "Naciones": "universidad-de-las-naciones",
    "ISTE": "iste-senescyt",
    "CYPE": "cype",
    "SETEC": "setec",
    "Inflect": "inflect-consultoria",
    "NFT": "microcredencial-nft-dq",
}
def cred_slugs(s):
    out = []
    for k, slug in CRED.items():
        if k in (s or "") and slug not in out: out.append(slug)
    return out

# ---------- parseo de raw/02 ----------
bloques = {}
for m in re.finditer(r"^## #(\d+) — (.+?)$(.*?)(?=^## #|\Z)", raw02, re.M | re.S):
    cid, titulo, cuerpo = m.group(1), m.group(2).strip(), m.group(3)
    b = {"titulo": titulo, "lineas": {}, "modulos": [], "sesiones": []}
    lineas = cuerpo.split("\n")
    i = 0
    while i < len(lineas):
        ln = lineas[i]
        mm = re.match(r"^- ([^:]{2,40}?):\s*(.*)$", ln)
        if mm:
            k, v = mm.group(1).strip(), mm.group(2).strip()
            if k in ("Módulos", "Módulos (cursos internos)") and not v:
                j = i + 1
                while j < len(lineas) and re.match(r"^\s+\d+\.\s", lineas[j]):
                    b["modulos"].append(re.sub(r"^\s+\d+\.\s*", "", lineas[j]).strip()); j += 1
                i = j; continue
            b["lineas"][k] = v
        i += 1
    # módulos en línea, fases o sesiones
    L = b["lineas"]
    for k in ("Módulos", "Fases", "Sesiones", "Estructura", "Clases"):
        if k in L and not b["modulos"]:
            if k == "Módulos":
                b["modulos"] = [re.sub(r"^M?\d+\s+", "", x) for x in partes(L[k])]
            else:
                b["sesiones"] = partes(L[k])
    # la primera línea de cabecera compacta "- Slug: /curso/x · Público · Categoría ..."
    cab = " · ".join(v for k, v in L.items() if k in ("Slug",)) + " " + " ".join(L.values())
    b["cab"] = cab
    bloques[cid] = b

def campo(b, *ks):
    for k in ks:
        if k in b["lineas"] and b["lineas"][k]: return b["lineas"][k]
    return ""

def precio_de(txt):
    m = re.search(r"USD\s*([\d,]+\.\d\d)", txt or "")
    return float(m.group(1).replace(",", "")) if m else None
def tachado_de(txt):
    m = re.search(r"tachado\s*(?:USD)?\s*([\d,]+\.\d\d)", txt or "")
    return float(m.group(1).replace(",", "")) if m else None
def horas_de(txt):
    m = re.search(r"Certificado[^0-9]{0,15}(\d+)\s*h", txt or "")
    return int(m.group(1)) if m else None
def nivel_de(txt):
    t = (txt or "").lower()
    if "avanzado" in t and "intro" in t: return "todos"
    if "avanzado" in t: return "avanzado"
    if "intermedio" in t: return "intermedio"
    if "introductorio" in t or "básico" in t: return "basico"
    return "todos"

# ---------- precios decididos (Sharp CRM) ----------
SHARP = {
    "diplomado-bim": [("unico", 499.99, None, None), ("cuotas", 250, None, 2), ("cuotas", 200, None, 3)],
    "diplomado-arquitectura": [("unico", 399.99, None, None), ("cuotas", 200, None, 2), ("cuotas", 160, None, 3)],
    "diplomado-estructuras-marketing": [("unico", 1499.99, None, None)],
    "diplomado-marketing-sharp-crm": [("unico", 599.99, None, None)],
    "diplomado-modelador-bim-estructurales-sanitarios": [("unico", 499.99, None, None)],
    "diplomado-bim-calculo-estructural-documentacion": [("unico", 499.99, None, None)],
    "autodesk-inteligencia-artificial": [("unico", 299.99, 2399.99, None)],
    "ai-assistants-para-autodesk": [("unico", 199.99, None, None)],
    "automatizacion-en-revit": [("unico", 199.99, None, None)],
    "sap-naves": [("unico", 27, 154.99, None)],
}
def precios(lista):
    return [{"opcion": o, "monto": m, "moneda": "USD", "pais": "", "tachado": t, "cuotas": c} for (o, m, t, c) in lista]

# ---------- programas desde el JSON + raw/02 ----------
TIPO = {"Máster": "master", "Diplomado": "diplomado", "Curso": "curso", "Paquete": "paquete"}
por_id = {str(c["id"]): c for c in cat}
n = 0
for c in cat:
    if c.get("estado") != "Público": continue
    cid = str(c["id"]); slug = c["slug"]; b = bloques.get(cid, {"lineas": {}, "modulos": [], "sesiones": [], "cab": ""})
    tipo = TIPO.get(c["tipo"], "curso")
    if slug == "maestria-bim-proyectos-estructurales": continue  # el Máster se escribe aparte, con el temario oficial
    if slug in ("diplomado-arquitectura-nov",): continue        # cohorte duplicada del diplomado de arquitectura
    L = b["lineas"]; cab = b.get("cab", "")
    precio_txt = campo(b, "Precio", "Precios (opciones configuradas; [x]=activa)", "Precio (recurrente)")
    if slug in SHARP: pr = precios(SHARP[slug])
    else:
        p = precio_de(precio_txt) or (c.get("precio_usd") if c.get("precio_usd") else None)
        pr = [{"opcion": "unico", "monto": p, "moneda": "USD", "pais": "", "tachado": tachado_de(precio_txt), "cuotas": None}] if p else []
    modulos = [{"titulo": t, "descripcion": "", "sesiones": []} for t in b["modulos"]]
    if not modulos and b["sesiones"]:
        modulos = [{"titulo": "Sesiones", "descripcion": "", "sesiones": [{"titulo": s, "duracion": ""} for s in b["sesiones"]]}]
    data = {
        "titulo": c["nombre"], "tipo": tipo, "estado": "publico", "destacado": False,
        "resumen": cap(campo(b, "Detalle corto", "Detalle corto / completo")) or c["nombre"],
        "descripcion": cap(campo(b, "Detalle completo", "Detalle")),
        "paraQuien": partes(campo(b, "Dirigido a")),
        "aprenderas": partes(campo(b, "¿Qué voy a aprender?")),
        "beneficios": partes(campo(b, "Beneficios")),
        "modulos": modulos,
        "horas": horas_de(cab) or c.get("horas_cert"),
        "meses": None,
        "modalidad": "vivo" if "en vivo" in cab.lower() and "pregrab" not in cab.lower() else ("pregrabado" if "pregrab" in cab.lower() or "asincr" in cab.lower() else "mixto"),
        "nivel": nivel_de(cab),
        "proximoInicio": (lambda s: f"{s[6:10]}-{s[3:5]}-{s[0:2]}" if s and len(s) == 10 else None)(c.get("inicio", "")),
        "mostrarPrecio": True,
        "precios": pr,
        "excluidoDeSuscripcion": "excluido de suscripción" in cab.lower() or tipo in ("diplomado", "paquete"),
        "credenciales": cred_slugs(campo(b, "Certificados", "Certificado", "Lista") or cab),
        "docentes": doc_slugs(c.get("docente") or campo(b, "Docente", "Docentes")),
        "software": sw_slugs(cab),
        "area": area_slug(cab),
        "incluye": [],
        "whatsapp": campo(b, "WhatsApp") or (re.search(r"https://wa\.link/\w+", cab) or [None])[0] if False else (campo(b, "WhatsApp").split(" ")[0] if campo(b, "WhatsApp") else None),
        "brochure": campo(b, "Brochure").split(" ")[0] if campo(b, "Brochure") else None,
        "faq": [],
        "slugAnterior": f"/curso/{slug}",
        "alumnos": c.get("vendidos"),
    }
    escribe("programas", slug, data); n += 1
print(f"programas desde el LMS: {n}")

# ---------- el Máster con el temario oficial ----------
OFICIAL = [
    ("Fundamentos Estratégicos BIM", 1), ("Modelado Arquitectónico", 1), ("Modelado Estructural y Emplazamiento", 1), ("Modelado MEP", 1),
    ("Federación y trabajo en la nube", 2), ("Gestión BIM y CDE", 2), ("Coordinación y Clash Detection con Navisworks", 2),
    ("BIM 4D: planificación", 3), ("BIM 5D: costos", 3),
    ("Dynamo y Python para BIM", 4), ("Inteligencia Artificial y DMA Engineering Suite", 4), ("Proyecto Final", 4),
]
BLOQUES = {1: ("bloque-1-bim-professional", "Bloque 1: BIM Professional", 750), 2: ("bloque-2-bim-coordination", "Bloque 2: BIM Coordination & Digital Construction", 750), 3: ("bloque-3-bim-management", "Bloque 3: BIM Management", 600), 4: ("bloque-4-bim-ai", "Bloque 4: BIM + AI", 900)}
mb = bloques["46485"]
master = {
    "titulo": "Máster Internacional en BIM Management e Inteligencia Artificial para la Construcción",
    "tipo": "master", "estado": "publico", "destacado": True,
    "resumen": "Doce meses, cuatro bloques y un proyecto final para dirigir proyectos BIM de punta a punta con inteligencia artificial, con título universitario internacional.",
    "descripcion": campo(mb, "Detalle completo"),
    "paraQuien": partes(campo(mb, "Dirigido a")),
    "aprenderas": [
        "Liderar y gestionar procesos BIM en proyectos complejos y multidisciplinarios",
        "Dominar el ecosistema Autodesk: Revit, Navisworks, Civil 3D y Construction Cloud",
        "Coordinar modelos federados y resolver interferencias con criterio",
        "Aplicar 4D y 5D integrados al modelo",
        "Automatizar con Dynamo y Python",
        "Integrar inteligencia artificial en la toma de decisiones con la DMA Engineering Suite",
        "Aplicar la ISO 19650 y los protocolos BIM internacionales",
        "Defender un proyecto final integrador ante comité académico",
    ],
    "beneficios": partes(campo(mb, "Beneficios")),
    "modulos": [{"titulo": f"Módulo {i+1:02d}: {t}", "descripcion": f"Bloque {bl}", "sesiones": []} for i, (t, bl) in enumerate(OFICIAL)],
    "horas": 1440, "meses": 12, "modalidad": "mixto", "nivel": "avanzado", "proximoInicio": "2026-10-05",
    "mostrarPrecio": False,
    "precios": [{"opcion": "unico", "monto": 2699.99, "moneda": "USD", "pais": "", "tachado": None, "cuotas": None}],
    "excluidoDeSuscripcion": True,
    "credenciales": ["iste-senescyt", "sabal-university", "universidad-de-las-naciones", "doctrinas-qualitas-dq", "autodesk-certificate-of-completion", "certificado-design-modeling", "microcredencial-nft-dq"],
    "docentes": doc_slugs(campo(mb, "Docentes")),
    "software": ["revit", "navisworks", "dynamo", "python", "robot-structural-analysis"],
    "area": "metodologia-bim",
    "incluye": [v[0] for v in BLOQUES.values()] + ["diplomado-bim", "ebook-bim-estructuras", "personal-project-ai-pro"],
    "whatsapp": "https://wa.link/2f7ag0",
    "urlCita": "",
    "faq": [],
    "slugAnterior": "/curso/maestria-bim-proyectos-estructurales",
    "alumnos": 51,
}
escribe("programas", "master-bim-management-ia", master)
for bl, (slug, titulo, precio) in BLOQUES.items():
    mods = [{"titulo": f"Módulo {i+1:02d}: {t}", "descripcion": "", "sesiones": []} for i, (t, b2) in enumerate(OFICIAL) if b2 == bl]
    escribe("programas", slug, {
        "titulo": titulo, "tipo": "bloque", "estado": "publico", "destacado": False,
        "resumen": f"Un trimestre del Máster BIM + IA, cursable por separado y apilable hacia el máster completo. {len(mods)} módulos, con microcredencial al terminar.",
        "descripcion": "Cada bloque cierra con un proyecto entregable y una microcredencial. Lo cursado suma hacia el Máster completo, sin expiración y con reingreso sin costo.",
        "paraQuien": partes(campo(mb, "Dirigido a")), "aprenderas": [], "beneficios": [],
        "modulos": mods, "horas": 360, "meses": 3, "modalidad": "mixto", "nivel": "avanzado", "proximoInicio": "2026-10-05",
        "mostrarPrecio": True,
        "precios": [{"opcion": "unico", "monto": precio, "moneda": "USD", "pais": "", "tachado": None, "cuotas": None}, {"opcion": "cuotas", "monto": precio / 2, "moneda": "USD", "pais": "", "tachado": None, "cuotas": 2}],
        "excluidoDeSuscripcion": True,
        "credenciales": ["microcredencial-nft-dq", "certificado-design-modeling"],
        "docentes": master["docentes"], "software": master["software"], "area": "metodologia-bim", "incluye": [],
        "whatsapp": "https://wa.link/2f7ag0", "faq": [], "slugAnterior": "", "alumnos": 23,
    })
print("máster + 4 bloques")

# ---------- especializaciones y rutas (raw/03) ----------
raw03 = (AUD / "raw/03_programas_especializaciones.md").read_text(encoding="utf-8")
BENEF_ESP = ["Acceso inmediato e ilimitado a las formaciones del paquete", "Contenido 100 % original y material descargable", "Videoclases cortas, prácticas y teóricas, con apuntes en PDF", "Certificación internacional con aval Design Modeling Academy y QR de verificación", "Acceso a la comunidad Design Premium", "Preparación para acceder al Diplomado Universitario BIM", "Certificación Universitaria Internacional DQ", "Cuatro sesiones 1 a 1 de 45 minutos durante el primer mes"]
FAQ_ESP = [("¿Las clases son en vivo o pregrabadas?", "Hay de las dos. La página de cada curso indica la modalidad, y todo se puede ver cuando quieras, donde quieras y cuantas veces quieras."), ("¿Dónde ingreso después de comprar?", "Llega un correo con la invitación al grupo de WhatsApp de la formación y el enlace de acceso al campus."), ("¿Puedo descargar el material?", "Todo el material se descarga; los videos se ven desde el campus."), ("¿Hay requisitos?", "Ninguno. Desde cero hasta especialistas."), ("¿El acceso es ilimitado?", "Sí, en modalidad pregrabada el acceso es ilimitado."), ("¿Hay soporte personalizado?", "Sí: cuatro sesiones 1 a 1 de 45 minutos durante el primer mes.")]
DETALLE_ESP = {}
for m in re.finditer(r"^- \*\*(.+?)\*\*: (.+)$", raw03, re.M):
    DETALLE_ESP[m.group(1)] = m.group(2)
def detalle_esp(titulo):
    for k, v in DETALLE_ESP.items():
        if k.lower() in titulo.lower() or (k == "Costos" and "Costos" in titulo) or (k == "Planos BIM" and "Planos" in titulo) or (k == "Acero BIM" and "Acero" in titulo) or (k == "Hormigón BIM" and "Hormigón" in titulo) or (k == "Arquitectura y MEP" and "MEP" in titulo) or (k == "Cimentaciones" and "Cimentaciones" in titulo) or (k == "Tanques" and "Tanques" in titulo):
            return v
    return ""
def aprend_de(det):
    m = re.search(r"Aprenderás: (.+?)(?:\. Dirigido a: (.+))?$", det)
    return (partes(m.group(1)) if m else [], partes(m.group(2)) if m and m.group(2) else [])
RUTAS_H = {"ETABS":"63h12","SAP2000":"69h32","Cimentaciones":"99h13","Planos":"78h47","Costos":"77h47","Tanques":"42h10","MEP":"80h44","Acero":"135h05","Hormigón":"99h05"}
RUTA_IDS = {"ETABS":47185,"SAP2000":47184,"Cimentaciones":47183,"Planos":47182,"Costos":47181,"Tanques":47180,"MEP":47179,"Acero":47178,"Hormigón":46481}
ne = 0
for m in re.finditer(r"^\| (\d{5}) \| (.+?) \| ([a-z0-9-]+) \| (\d+) \| (.+?) \| (\d+) .*?\| (\d+) meses \| (.+?) \| (wa\.link/\w+) \|", raw03, re.M):
    eid, titulo, slug, vend, cursos, horas, meses, docs, wa = m.groups()
    ids = re.findall(r"#(\d+)", cursos)
    incluye = [por_id[i]["slug"] for i in ids if i in por_id]
    det = detalle_esp(titulo); apr, dir_ = aprend_de(det)
    resumen = det.split(". Aprenderás")[0] if det else titulo
    base = {
        "titulo": f"Especialización en {titulo}" if not titulo.lower().startswith(("diseño","planos","gerencia","modelado")) else titulo,
        "tipo": "especializacion", "estado": "publico", "destacado": slug == "diseno-estructural-bim-acero",
        "resumen": resumen, "descripcion": "Programa 100 % online: clases en video, recursos descargables, ejercicios y consultorías 1 a 1.",
        "paraQuien": dir_, "aprenderas": apr, "beneficios": BENEF_ESP,
        "modulos": [{"titulo": por_id[i]["nombre"], "descripcion": "", "sesiones": []} for i in ids if i in por_id],
        "horas": int(horas), "meses": int(meses), "modalidad": "pregrabado", "nivel": "todos", "proximoInicio": None,
        "mostrarPrecio": True,
        "precios": [{"opcion": "unico", "monto": 199.99, "moneda": "USD", "pais": "", "tachado": 499.99, "cuotas": None}, {"opcion": "cuotas", "monto": 100, "moneda": "USD", "pais": "", "tachado": None, "cuotas": 2}],
        "excluidoDeSuscripcion": False,
        "credenciales": ["certificado-design-modeling", "doctrinas-qualitas-dq"] + (["autodesk-certificate-of-completion"] if "Autodesk" in m.group(0) else []),
        "docentes": doc_slugs(docs), "software": sw_slugs(titulo + " " + det), "area": area_slug(titulo) or "metodologia-bim",
        "incluye": incluye, "whatsapp": f"https://{wa}",
        "faq": [{"pregunta": p, "respuesta": r} for p, r in FAQ_ESP],
        "slugAnterior": f"/especializacion/{slug}", "alumnos": int(vend),
    }
    escribe("programas", slug, base); ne += 1
    # la ruta espejo
    clave = next((k for k in RUTA_IDS if k.lower() in titulo.lower()), None)
    if clave:
        ruta = dict(base); ruta.update({"titulo": f"Ruta de aprendizaje: {titulo}", "tipo": "ruta", "destacado": False, "precios": [], "mostrarPrecio": False, "faq": [], "slugAnterior": f"/ruta-aprendizaje/{slug}-{RUTA_IDS[clave]}", "alumnos": None, "resumen": f"Los cursos de la especialización en {titulo}, en el orden en que conviene tomarlos. {RUTAS_H[clave].replace('h', ' h ')} min de clase en {meses} meses."})
        escribe("programas", f"ruta-{slug}", ruta)
print(f"especializaciones: {ne} (+ sus rutas)")

# ---------- suscripción, mentorías, guías ----------
escribe("programas", "design-premium-mensual", {"titulo": "Suscripción Design Premium mensual", "tipo": "suscripcion", "estado": "publico", "resumen": "Un curso o formación especializada al mes, del catálogo de cursos. Mínimo seis meses de permanencia.", "descripcion": "Incluye horas certificadas, certificado internacional Design Modeling, comunidad Design Premium, material descargable, bolsa de trabajo y app móvil. No incluye certificado Autodesk ni CYPE. Reactivación por falta de pago: USD 14,99.", "beneficios": ["Un curso o formación especializada al mes", "Certificado internacional Design Modeling", "Comunidad y foro Design Premium", "Material descargable (PDF, DWG)", "Bolsa de trabajo y app móvil"], "faq": [{"pregunta": "¿Qué no incluye?", "respuesta": "Los diplomados, el Máster y el paquete BIM + IA quedan fuera de la suscripción. El plan mensual tampoco incluye los certificados Autodesk ni CYPE."}], "mostrarPrecio": True, "precios": [{"opcion": "mensual", "monto": 29.99, "moneda": "USD", "pais": "", "tachado": 154.99, "cuotas": None}], "modalidad": "pregrabado", "nivel": "todos", "slugAnterior": "/matriculas", "credenciales": ["certificado-design-modeling"]})
escribe("programas", "design-premium-anual", {"titulo": "Suscripción Design Premium anual", "tipo": "suscripcion", "estado": "publico", "resumen": "Todos los cursos y formaciones especializadas del catálogo durante un año, con certificados Autodesk y CYPE incluidos. Dos meses gratis frente al plan mensual.", "descripcion": "Incluye certificado de completación con aval Autodesk y/o CYPE, certificado Design Modeling, comunidad, material descargable, soporte remoto de instalación, bolsa de trabajo y app móvil.", "beneficios": ["Todos los cursos y formaciones especializadas", "Certificados Autodesk y CYPE incluidos", "Soporte remoto de instalación", "Comunidad y foro Design Premium", "Dos meses gratis"], "faq": [{"pregunta": "¿Qué no incluye?", "respuesta": "Los diplomados, el Máster y el paquete BIM + IA quedan fuera de la suscripción."}], "mostrarPrecio": True, "precios": [{"opcion": "anual", "monto": 299.99, "moneda": "USD", "pais": "", "tachado": 1859.99, "cuotas": None}], "modalidad": "pregrabado", "nivel": "todos", "slugAnterior": "/matriculas", "credenciales": ["certificado-design-modeling", "autodesk-certificate-of-completion", "cype"]})
for slug, titulo, precio, res in [
    ("cita-informativa-master", "Cita informativa del Máster BIM + IA", 0, "Treinta minutos con un asesor académico para saber si el Máster es para ti y cómo empezar."),
    ("cita-informativa-diplomados", "Cita informativa de los Diplomados BIM", 0, "Treinta minutos para elegir el diplomado que te conviene según lo que ya sabes."),
    ("mentoria-proyectos-estructurales", "Sesión de mentoría para proyectos estructurales", 99.99, "Una hora con un ingeniero de la academia sobre tu proyecto real: criterio, revisión y siguiente paso."),
    ("asesoria-por-horas", "Asesoría especializada por horas", None, "Horas de asesoría técnica sobre tu proyecto, con el docente que corresponda."),
    ("sesiones-de-refuerzo", "Sesiones de refuerzo para especializaciones", None, "Sesiones en vivo de refuerzo para quien cursa una especialización."),
]:
    escribe("programas", slug, {"titulo": titulo, "tipo": "mentoria", "estado": "publico", "resumen": res, "modalidad": "vivo", "nivel": "todos", "mostrarPrecio": precio is not None, "precios": ([{"opcion": "unico", "monto": precio, "moneda": "USD", "pais": "", "tachado": None, "cuotas": None}] if precio else []), "docentes": ["gabriel-pantoja"], "slugAnterior": "/es/meetings"})
for slug, titulo, precio, tach, res in [
    ("personal-project-ai-pro", "Personal Project AI Pro: asesor inteligente", 9.99, 26.99, "Guía para implementar BIM con IA: Dynamo, asistentes GPT, scripts, prompts, video tutorial de un proyecto completo y estrategias para vender servicios BIM."),
    ("ebook-bim-estructuras", "E-book: Dominando BIM en modelado de estructuras", 9.99, 26.99, "De los fundamentos BIM al modelado avanzado, con estrategias para ofertar servicios BIM."),
    ("guia-muros-de-contencion", "Guía de muros de contención", 14.99, 49.99, "Guía práctica de diseño de muros de contención."),
    ("bim-construccion", "Metodología BIM aplicada a proyectos estructurales", 0, None, "Guía gratuita de introducción a la metodología BIM en proyectos estructurales."),
    ("diseno-de-losas-macizas-a-flexion", "Diseño de losas macizas a flexión", 0, None, "Guía gratuita de diseño de losas macizas."),
    ("diseno-de-vigas-a-flexo-y-corte", "Diseño de vigas a flexión y corte", 0, None, "Guía gratuita de diseño de vigas."),
    ("guia-fundamentos-de-ingenieria-de-cimentaciones", "Metrado de cargas verticales", 0, None, "Guía gratuita de metrado de cargas."),
    ("diseno-de-muros-a-flexo-compresion-y-corte", "Diseño de muros a flexo-compresión y corte", 0, None, "Guía gratuita de diseño de muros."),
    ("curso-revit", "Curso introductorio de Revit", 0, None, "Introducción gratuita a Revit."),
]:
    escribe("programas", slug, {"titulo": titulo, "tipo": "guia", "estado": "publico", "resumen": res, "modalidad": "pregrabado", "nivel": "todos", "mostrarPrecio": True, "precios": ([{"opcion": "unico", "monto": precio, "moneda": "USD", "pais": "", "tachado": tach, "cuotas": None}] if precio else []), "slugAnterior": f"/producto/{slug}"})
print("suscripción, 5 mentorías, 9 guías")

# ---------- docentes, credenciales, avales, áreas, software ----------
for nombre, (slug, tit, rol, ant) in DOCENTES.items():
    escribe("docentes", slug, {"nombre": nombre, "titulacion": tit, "rolFuera": rol, "bio": "", "linkedin": "", "slugAnterior": ant})
CREDS = [
    ("autodesk-certificate-of-completion", "Autodesk Certificate of Completion", "Autodesk", "Certifica la finalización de la formación en software Autodesk, emitido por un Authorized Training Center.", "", "https://www.autodesk.com", 1),
    ("autodesk-certified-user", "Autodesk Certified User (ACU)", "Autodesk / Certiport", "Certificación oficial de usuario de Autodesk, examen en centro autorizado Certiport.", "", "https://certiport.pearsonvue.com", 2),
    ("iste-senescyt", "Título propio de ISTE con registro SENESCYT", "Instituto Superior Tecnológico de España", "Título propio internacional con validez en España y registro en la SENESCYT de Ecuador, vía convenio con Doctrinas Qualitas.", "SENESCYT (Ecuador)", "", 3),
    ("sabal-university", "Diploma de Sabal University", "Sabal University, Florida, EE. UU.", "Título propio con reconocimiento en Estados Unidos, emitido por Sabal University, autorizada por el Florida Department of Education.", "Licencia No. 11494, Florida Department of Education", "https://doctrinaqualitas.ec/dq-en-eeuu-con-sabal-university/", 4),
    ("universidad-de-las-naciones", "Diploma de la Universidad de las Naciones", "Universidad de las Naciones, México", "Diploma universitario internacional con movilidad hacia España.", "", "", 5),
    ("doctrinas-qualitas-dq", "Certificado universitario internacional DQ", "Doctrinas Qualitas", "Certificación universitaria internacional con aval en el Espacio Europeo de Educación Superior y Latinoamérica vía UAIII.", "", "https://doctrinaqualitas.com", 6),
    ("cype", "Certificación oficial CYPE", "CYPE Ingenieros, España", "Certificación oficial de CYPE, emitida como Authorized Partner y Professional Certification Center.", "", "https://www.cype.com", 7),
    ("setec", "Certificado SETEC", "Secretaría Técnica del Sistema Nacional de Cualificaciones, Ministerio de Trabajo de Ecuador", "Certificación de competencias laborales reconocida por el Ministerio de Trabajo de Ecuador.", "SETEC (Ecuador)", "", 8),
    ("certificado-design-modeling", "Certificado internacional Design Modeling", "MODELING-DG S.A.S.", "Certificado de horas académicas con código QR de verificación.", "", "", 9),
    ("microcredencial-nft-dq", "Microcredencial NFT", "Doctrinas Qualitas", "Logro académico como activo digital verificable en blockchain, por bloque del Máster.", "", "https://doctrinaqualitas.com/alianzas/", 10),
    ("inflect-consultoria", "Certificado de finalización Inflect Consultoría", "Inflect Consultoría", "Certificado con perfil digital para LinkedIn en el diplomado de marketing y automatización.", "", "", 11),
]
for slug, nombre, emisor, que, reg, url, orden in CREDS:
    escribe("credenciales", slug, {"nombre": nombre, "emisor": emisor, "queCertifica": que, "registroOficial": reg, "url": url, "orden": orden})
for slug, nombre, tipo, desde, url in [
    ("autodesk-authorized-training-center", "Autodesk Authorized Training Center", "Centro de formación autorizado", "2022", "https://www.autodesk.com/training/partners"),
    ("autodesk-learning-partner", "Autodesk Learning Partner", "Learning Partner", "2022", "https://www.autodesk.com/training/partners"),
    ("certiport", "Certiport", "Centro de examen autorizado", "", "https://certiport.pearsonvue.com"),
    ("cype-authorized-partner", "CYPE Authorized Partner", "Primer Authorized Partner en Latinoamérica y Professional Certification Center", "noviembre de 2023", "https://www.cype.com"),
    ("uaiii", "UAIII", "Aval académico para Latinoamérica vía Doctrinas Qualitas", "", ""),
    ("sello-eqs", "Sello EQS / IQS", "Sello de calidad educativa", "", ""),
]:
    escribe("avales", slug, {"nombre": nombre, "tipo": tipo, "desde": desde, "url": url})
for a in AREAS: escribe("areas", slugify(a), {"nombre": a, "descripcion": ""})
for s, fab in SOFTWARE.items(): escribe("software", slugify(s), {"nombre": s, "fabricante": fab})
# singletons
(CONT / "inicio.yaml").write_text(y({"anuncio": "Máster BIM + IA: inscripciones abiertas, inicio 5 de octubre", "anuncioUrl": "/programas/master-bim-management-ia", "destacados": ["master-bim-management-ia", "diplomado-bim", "diseno-estructural-bim-acero", "autodesk-inteligencia-artificial"]}) + "\n", encoding="utf-8")
(CONT / "nosotros.yaml").write_text(y({"historia": "", "cifras": [{"valor": "5.000+", "etiqueta": "alumnos y profesionales formados", "fuente": "Matrículas del LMS y del portal (confirmado por dirección el 29/09/2026)"}, {"valor": "30", "etiqueta": "países", "fuente": "Matrículas del LMS y del portal"}, {"valor": "57", "etiqueta": "cursos y programas activos", "fuente": "Catálogo del LMS, 29/09/2026"}, {"valor": "10", "etiqueta": "docentes en activo", "fuente": "Planta docente publicada"}]}) + "\n", encoding="utf-8")
(CONT / "empresas.yaml").write_text(y({"intro": "Capacitación BIM para equipos, con profesores certificados por Autodesk, temarios a medida y evaluación antes, durante y después. Online en vivo por Zoom o presencial en las oficinas del cliente.", "modalidades": [{"nombre": "Estándar", "descripcion": "Los programas del catálogo, dictados en vivo para tu equipo, con certificación."}, {"nombre": "Personalizada", "descripcion": "Temario adaptado a los proyectos y el software que usa tu empresa."}, {"nombre": "Orientada a la mejora", "descripcion": "Consultoría de procesos más capacitación: se diagnostica cómo trabaja el equipo y se forma sobre eso."}]}) + "\n", encoding="utf-8")
print("docentes:", len(DOCENTES), "· credenciales:", len(CREDS), "· avales: 6 · áreas:", len(AREAS), "· software:", len(SOFTWARE), "· singletons: 3")
print("programas totales:", len(list((CONT / "programas").glob("*.yaml"))))
