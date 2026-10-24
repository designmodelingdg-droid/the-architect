# autocut — Blueprint

> Generado por The Architect el 2026-08-18
> Arquetipo: internal-tool (CLI de escritorio, no dashboard web)
> Fuente: "Guía Completa: Claude + CapCut — Fórmula 100K by Axel León" (5 páginas)
> Idioma del proyecto: español (código en inglés, mensajes al usuario en español)

---

## 0. Nota para quien construye esto

Este blueprint implementa la guía de Axel León, **corrigiendo tres cosas que en el PDF no funcionan**. Léelas antes de escribir una línea:

1. **El script de la Sección 5 del PDF no genera un proyecto abrible.** Un borrador real de CapCut necesita un array `materials` con IDs, `tracks[].segments[].material_id`, tiempos en **microsegundos** (no milisegundos), y un `draft_meta_info.json` hermano. Además, en macOS el archivo se llama `draft_info.json`, no `draft_content.json`. → Este proyecto usa la librería **`pycapcut`**, que escribe el formato real. **No reimplementes el JSON a mano.**
2. **Claude no transcribe audio.** El PDF asume la transcripción resuelta. Además, timestamps por *frase* (lo que da CapCut al exportar subtítulos) producen cortes desfasados 200–400 ms. Se necesitan timestamps **por palabra**. → **faster-whisper** local con `word_timestamps=True`.
3. **`pycapcut` advierte que la exportación automatizada solo está probada en CapCut Windows.** El equipo usa Windows y macOS. → Todo comando genera **dos salidas**: el borrador de CapCut (camino A) y un **render pre-cortado con FFmpeg + SRT resincronizado** (camino B), que se importa a CapCut en cualquier SO. El camino B nunca falla y es la red de seguridad.
4. **El video que sale del teléfono NO es 1080×1920.** Verificado con material real del equipo (iPhone 17 Pro Max, iOS 26.5): el archivo se almacena como **1920×1080 con una matriz de rotación de −90°**, trae **dos pistas de audio** (AAC estéreo + `apac` de audio espacial) y **cinco pistas de datos `mebx`**, más metadatos de GPS del lugar de grabación. Leer `width`/`height` sin aplicar la matriz produce un lienzo horizontal; mapear streams sin `-map` explícito rompe la concatenación de FFmpeg. → **Paso 5 de normalización obligatorio** antes de cualquier otra cosa.

### Hallazgos medidos sobre material real del equipo (2026-08-18)
Contra un clip de 12 s grabado en un evento de DMA:

| Supuesto del blueprint | Realidad medida | Consecuencia |
|---|---|---|
| Video vertical 1080×1920 | `1920×1080` + Display Matrix `rotation=-90` | Sin normalizar, el lienzo de CapCut sale horizontal |
| Una pista de video, una de audio | 8 streams: 1 video, 2 audio (`aac` + `apac`), 5 datos (`mebx`) | `-map` implícito rompe el concat; `apac` ni siquiera decodifica |
| Re-encode preserva orientación | `libx264` hornea la rotación → `1080×1920` y borra la matriz | El camino B ya queda correcto; el camino A necesita el archivo normalizado |
| `-c copy` sería equivalente | Conserva `1920×1080` + matriz | Confirma la prohibición del `stream copy` |
| El archivo no lleva datos personales | GPS ISO6709, modelo del equipo y fecha exacta embebidos | Publicar a diario filtra la ubicación: hay que borrar metadatos |
| Whisper transcribe o no transcribe | Sobre audio sin voz **alucinó** `"¡Gracias!"` (`no_speech_prob=0.58`) | Sin guarda, Claude planifica cortes sobre palabras inventadas → regla **V11** |
| `vad_filter=True` es un detalle | Con VAD el clip devolvió **0 palabras** (correcto) | El pipeline necesita un camino explícito para "no hay voz", no un crash |

Velocidad medida (CPU, `large-v3` int8, sin GPU): carga del modelo **41 s la primera vez**, transcripción **0.61× tiempo real**. Un video de 10 min ≈ 6 min de transcripción en una máquina sin GPU. Cachear el modelo en memoria entre corridas del mismo proceso.

Las "Reglas de Oro" del PDF (gancho antes de 1.5 s, paleta Dorado/Blanco, cero silencios al inicio) **no son sugerencias al modelo**: están codificadas en el validador determinista. Claude propone; el validador manda.

---

## 1. Visión General

### Visión
`autocut` es una herramienta de línea de comandos que convierte un video vertical crudo en un borrador de CapCut listo para exportar, en un solo comando. Transcribe el audio localmente con timestamps por palabra, le pide a Claude que actúe como director de edición (eliminar muletillas, silencios y repeticiones; marcar palabras clave; sugerir B-Rolls), valida esa propuesta contra reglas duras, y escribe el borrador directamente en la carpeta de proyectos de CapCut.

El usuario abre CapCut, revisa, y exporta. El tiempo de edición pasa de ~3 horas a ~10 minutos por video, que es exactamente la promesa de la Fórmula 100K.

### Objetivos
- Un comando (`autocut cut video.mp4`) produce un borrador de CapCut abrible, con cortes de ritmo y subtítulos dorado/blanco ya aplicados.
- Funciona igual en Windows y macOS, sin que el usuario sepa dónde vive la carpeta de borradores.
- Instalable por gente no técnica del equipo: `pipx install autocut` y `autocut doctor` diagnostica todo lo que falte.
- Ningún corte cae a mitad de palabra, y ningún video sale con silencio en el primer segundo y medio.

### Métricas de Éxito
- Tiempo de edición por video ≤ 10 minutos de trabajo humano.
- ≥ 90 % de los cortes propuestos se aceptan sin ajuste manual.
- 0 borradores corruptos: si `pycapcut` falla, el camino B (FFmpeg) siempre entrega algo usable.
- Costo de API < USD 0.30 por video de 10 minutos.

---

## 2. Stack Técnico

| Capa | Tecnología | Por qué |
|---|---|---|
| Lenguaje | **Python 3.11** | `pycapcut` requiere ≥3.8 y está probado en 3.11; faster-whisper y ffmpeg-python son nativos de este ecosistema. No usar 3.12+ hasta verificar `pycapcut`. |
| CLI | **Typer** + **Rich** | Typer da subcomandos y `--help` autogenerado; Rich da barras de progreso y tablas legibles para gente no técnica. |
| Transcripción | **faster-whisper** (`large-v3`) | Timestamps por palabra, corre offline, sin costo por minuto. `medium` como fallback en máquinas lentas. |
| Cerebro de edición | **Claude API** — `claude-opus-5` vía `client.messages.parse()` | Structured outputs con Pydantic: la respuesta llega ya validada contra el esquema, sin parsear texto libre ni pelear con markdown. |
| Validación | **Pydantic v2** | Modela `EditPlan` y hace de contrato con la API. Toda salida del modelo pasa además por el validador determinista. |
| Borrador CapCut | **pycapcut** `0.0.3` | Única librería que escribe el formato real de borrador de CapCut (mismo autor que `pyJianYingDraft`). |
| Media | **FFmpeg** (binario) + **ffmpeg-python** | Extracción de audio para Whisper y camino B de render pre-cortado. |
| Config | **pydantic-settings** + `.env` | API key fuera del código y fuera del repo. |
| Distribución | **uv** (dev) + **pipx** (equipo) | `uv` para el entorno de desarrollo; `pipx install` para que el equipo tenga el comando aislado. |
| Tests | **pytest** | Golden tests sobre planes de edición fijos; sin llamadas a la API en CI. |
| Formato/lint | **ruff** | Formateo y lint en una sola herramienta. |

### Lo que NO se usa, y por qué
- **Sin base de datos.** El estado vive en archivos junto al video (`.autocut/`). Nada que administrar.
- **Sin interfaz web.** Es una herramienta de escritorio para un equipo de contenido; una UI web obligaría a subir archivos de 2 GB.
- **Sin `temperature`.** `claude-opus-5` **rechaza** `temperature`, `top_p` y `top_k` con error 400. El determinismo se logra con el validador, no con sampling.
- **Sin prompt caching.** El system prompt no llega a los ~1024 tokens mínimos para que el caché se active. Agregarlo sería cargo cult.

---

## 3. Estructura de Directorios

```
autocut/
  pyproject.toml              # metadata, deps, entry point [project.scripts] autocut = "autocut.cli:app"
  README.md                   # instalación para el equipo, en español, con capturas
  CLAUDE.md                   # ver Sección 15 — pegar tal cual
  .env.example                # ANTHROPIC_API_KEY=sk-ant-...
  .gitignore                  # .env, .autocut/, *.mp4, models/, dist/
  src/autocut/
    __init__.py               # __version__
    cli.py                    # Typer app: cut, transcribe, plan, draft, render, doctor
    config.py                 # Settings (pydantic-settings): api key, modelo, idioma, rutas
    models.py                 # Pydantic: Word, EditPlan, Keep, Highlight, BRoll, SubtitleCard
    normalize.py              # rotación horneada, streams limpios, metadatos borrados
    transcribe.py             # faster-whisper -> list[Word] con timestamps por palabra
    prompts.py                # SYSTEM_PROMPT (Prompt Maestro Fórmula 100K) + armado del user turn
    brain.py                  # llamada a Claude: chunking, streaming, merge de planes parciales
    validator.py              # REGLAS DURAS. Corrige o rechaza el plan del modelo. El corazón.
    subtitles.py              # words + highlights -> tarjetas de 1-3 palabras (dorado/blanco) -> SRT
    capcut.py                 # camino A: construye el borrador con pycapcut
    paths.py                  # detección de la carpeta de borradores por SO
    fallback.py               # camino B: FFmpeg corta y concatena + SRT resincronizado
    cache.py                  # .autocut/<hash>.words.json / .plan.json
    console.py                # helpers de Rich: progreso, tablas, mensajes de error en español
    errors.py                 # AutocutError y subclases con mensaje accionable
  tests/
    conftest.py
    fixtures/
      words_sample.json       # 90 s de transcripción real con timestamps por palabra
      plan_valid.json         # plan de Claude bien formado
      plan_broken.json        # plan con gancho tardío, clips de 50 ms y solapes (para el validador)
      clip_10s.mp4            # clip minúsculo para el smoke test de FFmpeg
      iphone_rotado.mov       # 2 s reales de iPhone: 1920x1080 + matriz -90, 8 streams
      words_alucinadas.json   # 1 palabra con no_speech_prob=0.58 (caso V11)
    test_models.py
    test_validator.py         # el archivo de tests más importante del proyecto
    test_subtitles.py
    test_paths.py
    test_fallback.py
```

---

## 4. Modelo de Datos

Todo vive en memoria y se serializa a JSON en `.autocut/`. Tiempos **siempre en milisegundos enteros** dentro del dominio; la conversión a microsegundos ocurre solo en `capcut.py`, en el último momento.

**Word** — unidad atómica que produce la transcripción
| Campo | Tipo | Notas |
|---|---|---|
| `text` | `str` | Palabra sin espacios laterales |
| `start_ms` | `int` | Inicio en el video fuente |
| `end_ms` | `int` | Fin en el video fuente |
| `confidence` | `float` | 0.0–1.0, de Whisper |
| `no_speech_prob` | `float` | Del segmento que la contiene. > 0.5 = probable alucinación (regla V11) |

**Keep** — un fragmento que sobrevive al corte
| Campo | Tipo | Notas |
|---|---|---|
| `start_ms` | `int` | Inicio en el video **fuente** |
| `end_ms` | `int` | Fin en el video fuente. `end_ms > start_ms` siempre |
| `reason` | `str` | Por qué se conserva. Solo para depurar |

**Highlight** — palabra que va en dorado
| Campo | Tipo | Notas |
|---|---|---|
| `word_index` | `int` | Índice dentro de `list[Word]`, no texto suelto |
| `text` | `str` | Copia de la palabra, para validar que el modelo no alucinó |

**BRoll** — sugerencia de apoyo visual
| Campo | Tipo | Notas |
|---|---|---|
| `at_ms` | `int` | Momento en el video fuente |
| `kind` | `Literal["broll","zoom_in","zoom_out"]` | |
| `description` | `str` | Qué mostrar, en una frase |

**EditPlan** — lo que devuelve Claude
| Campo | Tipo | Notas |
|---|---|---|
| `keeps` | `list[Keep]` | Ordenados, sin solapes (lo garantiza el validador) |
| `highlights` | `list[Highlight]` | 3–5 por oración |
| `brolls` | `list[BRoll]` | Mínimo 3 |
| `hook_summary` | `str` | Qué promete el gancho. Sirve para el título del proyecto |

**SubtitleCard** — derivado, no viene del modelo
| Campo | Tipo | Notas |
|---|---|---|
| `text` | `str` | 1–3 palabras |
| `start_ms` / `end_ms` | `int` | En la línea de tiempo **destino** (post-corte) |
| `is_gold` | `bool` | `True` si la tarjeta contiene una palabra resaltada |

### Relaciones
`Word[]` es la fuente de verdad temporal. `Keep` referencia rangos de tiempo del fuente; `Highlight` referencia índices de `Word`. `SubtitleCard` se calcula desde `Word[] + Keep[] + Highlight[]` una vez fijada la línea de tiempo destino. **La línea de tiempo destino se obtiene concatenando los keeps en orden**: el offset destino de cada keep es la suma de las duraciones de los keeps anteriores.

---

## 5. Contrato con la API de Claude

### Llamada
```python
# brain.py
import anthropic
from autocut.models import EditPlan

client = anthropic.Anthropic()  # lee ANTHROPIC_API_KEY del entorno

response = client.messages.parse(
    model="claude-opus-5",
    max_tokens=16000,
    system=SYSTEM_PROMPT,
    messages=[{"role": "user", "content": transcript_block}],
    output_format=EditPlan,          # Pydantic -> respuesta ya validada
    output_config={"effort": "high"},
)
plan: EditPlan = response.parsed_output
```

**Reglas de la llamada, no negociables:**
- `model="claude-opus-5"`. String exacto, **sin sufijo de fecha**.
- **Nunca** pasar `temperature`, `top_p` ni `top_k` → error 400 en este modelo.
- **Nunca** pasar `thinking: {budget_tokens: N}` → error 400. El thinking es adaptativo por defecto; no configurarlo.
- Si un chunk necesita `max_tokens > 32000`, usar `client.messages.stream(...)` + `.get_final_message()` para no chocar con el timeout HTTP.
- Manejar `RateLimitError` (reintento con backoff exponencial: 2 s, 4 s, 8 s, 16 s) y `APIConnectionError` por separado de `BadRequestError`, que **no** se reintenta.

### Chunking de transcripciones largas
El contexto de 1M tokens aguanta una hora de transcripción, pero la **salida** no: un video de 30 min genera cientos de `keeps` y desborda `max_tokens`.

Regla: partir la transcripción en bloques de **5 minutos de video** con **15 s de solape**. Procesar los bloques en secuencia. Al fusionar:
- Descartar los `keeps` del solape que ya aporta el bloque anterior (dedup por `start_ms` con tolerancia de ±50 ms).
- Los índices de `Highlight` que devuelve el modelo son **relativos al bloque**: sumarles el offset del bloque antes de fusionar. Un error aquí desplaza todos los subtítulos; cubrirlo con un test.
- Solo el **primer bloque** recibe la instrucción del gancho.

### Formato del bloque de transcripción que se envía
Una palabra por línea, con índice y tiempos, para que el modelo pueda referenciar índices exactos:
```
[0] 0-320 Hoy
[1] 340-780 te
[2] 800-1450 voy
...
```

### Costo estimado
Video de 10 min ≈ 1.500 palabras ≈ ~15k tokens de entrada y ~6k de salida. A tarifas de `claude-opus-5` (USD 5 / 25 por millón), **≈ USD 0.22 por video**. Ese número se imprime al final de cada corrida leyendo `response.usage`.

---

## 6. Arquitectura del CLI

### Comandos
| Comando | Qué hace |
|---|---|
| `autocut cut VIDEO` | Pipeline completo: transcribe → plan → valida → borrador + render. El comando que usa el equipo. |
| `autocut normalize VIDEO` | Solo normaliza: hornea rotación, deja 1 pista de video + 1 de audio, borra metadatos. |
| `autocut transcribe VIDEO` | Solo transcribe y cachea. Útil para reprocesar sin volver a pagar tiempo de GPU. |
| `autocut plan VIDEO` | Transcribe + Claude. Imprime el plan como tabla y lo guarda. No toca CapCut. |
| `autocut draft VIDEO` | Construye el borrador desde un plan ya cacheado (camino A). |
| `autocut render VIDEO` | Camino B: render pre-cortado con FFmpeg + SRT. |
| `autocut doctor` | Verifica FFmpeg, carpeta de CapCut, API key, modelo de Whisper descargado. **Primer comando que corre un usuario nuevo.** |

### Flags de `cut`
`--model medium|large-v3` (Whisper) · `--lang es` · `--no-draft` · `--no-render` · `--force` (ignora caché) · `--dry-run` (imprime el plan y sale) · `--out DIR`

### Flujo de datos
```
video.mov (crudo del teléfono: 1920x1080 + rotación, 8 streams, GPS)
   │
   ▼
normalize.py ──> work.mp4 (1080x1920 real, 1 video + 1 audio, sin metadatos)
   │            └─ TODO lo de abajo usa work.mp4, nunca el original
   │  ffmpeg -> wav 16 kHz mono (-map 0:a:0)
   ▼
transcribe.py ──> list[Word] ──────────────> .autocut/<hash>.words.json
   │
   ▼
brain.py (chunking + Claude) ──> EditPlan ──> .autocut/<hash>.plan.raw.json
   │
   ▼
validator.py  ← REGLAS DURAS: corrige, fusiona, rechaza
   │
   ├──> EditPlan validado ──────────────────> .autocut/<hash>.plan.json
   │
   ├──> subtitles.py ──> list[SubtitleCard] ──> out/subs.srt
   │
   ├── camino A ──> capcut.py (pycapcut) ────> carpeta de borradores de CapCut
   └── camino B ──> fallback.py (FFmpeg) ────> out/<nombre>_precut.mp4 + subs.srt
```

### Manejo de errores
Cada fallo levanta una subclase de `AutocutError` con un mensaje **accionable en español**. Nada de tracebacks crudos para el equipo:
- `FFmpegNotFound` → "FFmpeg no está instalado. En Mac: `brew install ffmpeg`. En Windows: `winget install ffmpeg`."
- `CapCutFolderNotFound` → "No encontré la carpeta de borradores de CapCut. ¿Está instalado y lo abriste al menos una vez? Ruta esperada: …"
- `PlanRejected` → detalla qué regla se violó y cuántos keeps sobrevivieron.
El camino A que falla **nunca** aborta la corrida: se registra la advertencia y el camino B continúa.

---

## 7. Sistema de Diseño

No hay UI, pero sí dos superficies visuales: los **subtítulos quemados en el video** y la **salida de terminal**.

### Colores (subtítulos — Regla de Oro de Axel)
| Rol | Hex | RGB normalizado (para `pycapcut`) | Uso |
|---|---|---|---|
| Dorado | `#C5A059` | `(0.773, 0.627, 0.349)` | Palabras clave resaltadas (3–5 por oración) |
| Blanco | `#FFFFFF` | `(1.0, 1.0, 1.0)` | Todo el resto del subtítulo |
| Borde/sombra | `#000000` | `(0.0, 0.0, 0.0)` | Contorno para legibilidad sobre cualquier fondo |

**Prohibido el amarillo fosforescente.** El PDF es explícito: resta autoridad. Está en las Reglas No Negociables.

### Colores (terminal, vía Rich)
| Rol | Color Rich |
|---|---|
| Éxito | `green` |
| Advertencia (camino A falló, camino B sigue) | `yellow` |
| Error | `red` |
| Acento / marca | `#C5A059` |

### Tipografía de subtítulos
- Fuente: sans-serif de peso alto (Montserrat Bold o equivalente disponible en CapCut). Configurable en `config.py`; **verificar el nombre exacto contra el enum `FontType` de `pycapcut` instalado**.
- Tamaño: ~8 % de la altura del lienzo (1920 px → ~150 px). `pycapcut` usa unidades relativas: calibrar con un render de prueba, no adivinar.
- Posición: centrado horizontal, al 78 % de la altura (zona segura sobre la UI de TikTok/Reels).

### Decisión de diseño clave: subtítulos de 1–3 palabras
CapCut no permite (vía `pycapcut`) colorear palabras sueltas dentro de un mismo bloque de texto. En lugar de pelear con rich text, se emite **una tarjeta de subtítulo cada 1–3 palabras** — que además es exactamente el estilo viral que pide la guía. Una tarjeta que contiene una palabra resaltada va **entera en dorado**; el resto va en blanco. Se resuelve el color y el ritmo con la misma decisión.

Reglas de agrupación: máximo 3 palabras o 900 ms por tarjeta, lo que ocurra primero; una palabra resaltada siempre abre tarjeta nueva; nunca una tarjeta cruza el límite de un `keep`.

---

## 8. Configuración y Secretos

No hay login ni usuarios: es una herramienta local. Lo único sensible es la API key.

| Variable | Descripción | Dónde se obtiene |
|---|---|---|
| `ANTHROPIC_API_KEY` | Clave de la API de Claude | console.anthropic.com → API Keys |
| `AUTOCUT_MODEL` | Override del modelo (default `claude-opus-5`) | opcional |
| `AUTOCUT_WHISPER_MODEL` | `large-v3` (default) o `medium` | opcional |
| `AUTOCUT_LANG` | Idioma del audio, default `es` | opcional |
| `AUTOCUT_CAPCUT_DIR` | Override manual de la carpeta de borradores | solo si `doctor` no la detecta |

Carga con `pydantic-settings`, leyendo `.env` del directorio actual y luego `~/.autocut/.env` (para que el equipo la configure una vez). `autocut doctor` reporta **de dónde** salió la key, sin imprimirla nunca. `.env` va en `.gitignore` desde el primer commit.

### Rutas de borradores por SO (`paths.py`)
| SO | Ruta |
|---|---|
| Windows | `%LOCALAPPDATA%\CapCut\User Data\Projects\com.lveditor.draft\` |
| macOS | `~/Movies/CapCut/User Data/Projects/com.lveditor.draft/` |

Detectar con `sys.platform`. En macOS el archivo de contenido del proyecto se llama `draft_info.json` en vez de `draft_content.json` — `pycapcut` lo maneja, pero cualquier verificación propia debe contemplar ambos nombres. Si la ruta no existe, respetar `AUTOCUT_CAPCUT_DIR` antes de fallar.

---

## 9. Orden de Construcción

**Construye en este orden. Cada paso deja algo ejecutable y verificable. No saltes pasos ni adelantes trabajo del siguiente.**

### Paso 0 — Verificar la API real de `pycapcut` (30 min, obligatorio)
`pycapcut` está en la versión `0.0.3`: joven y con firmas que pueden cambiar. **Antes de escribir `capcut.py`:**
```bash
uv pip install pycapcut
python -c "import pycapcut as cc; print(cc.__version__); print([n for n in dir(cc) if not n.startswith('_')])"
python -c "import pycapcut as cc, inspect; print(inspect.signature(cc.DraftFolder.create_draft)); print(inspect.signature(cc.VideoSegment.__init__))"
```
Anota las firmas reales en un comentario al inicio de `capcut.py`. **Si difieren de lo que dice este blueprint, gana la librería instalada.** Los nombres esperados son: `DraftFolder`, `ScriptFile`, `VideoMaterial`, `VideoSegment`, `TextSegment`, `TextStyle`, `ClipSettings`, `TrackType`, y los helpers `trange`, `tim`, `SEC`.

### Paso 1 — Esqueleto del proyecto
`uv init`, `pyproject.toml` con el entry point `autocut = "autocut.cli:app"`, ruff configurado, `src/autocut/` con todos los módulos vacíos, `.gitignore`, `.env.example`. Entregable: `autocut --help` imprime la ayuda.

### Paso 2 — `config.py` + `errors.py` + `console.py`
Settings con pydantic-settings, jerarquía de excepciones con mensajes en español, helpers de Rich. Entregable: `autocut doctor` corre y reporta la API key (presente/ausente, nunca su valor).

### Paso 3 — `paths.py` + completar `doctor`
Detección de carpeta de CapCut por SO, verificación de FFmpeg en el PATH, verificación de que el modelo de Whisper esté descargado. Entregable: `autocut doctor` imprime una tabla verde/roja con las 4 verificaciones. **Probar en Windows y en Mac antes de seguir.**

### Paso 4 — `models.py`
Todos los modelos Pydantic de la Sección 4, con validadores de campo (`end_ms > start_ms`, `confidence` en 0–1). Entregable: `test_models.py` en verde.

### Paso 5 — `normalize.py` (obligatorio, descubierto con material real)
Todo lo demás consume la salida de este paso, nunca el archivo original. Con FFmpeg, en una sola pasada:
```bash
ffmpeg -i entrada.mov \
  -map 0:v:0 -map 0:a:0 -dn -sn \          # solo 1 video + 1 audio; fuera mebx y apac
  -map_metadata -1 \                        # fuera GPS, modelo de equipo y fecha
  -c:v libx264 -preset medium -crf 18 \     # re-encode: hornea la rotación
  -c:a aac -b:a 192k -ar 48000 \
  work.mp4
```
Después **verificar** con `ffprobe` que la salida es vertical (`height > width`) y que no queda `side_data` de rotación. Si el original ya era vertical y limpio, igual se normaliza: un solo camino, sin ramas.

Entregable: `autocut normalize IMG_1234.mov` produce `work.mp4` de 1080×1920 con dos streams y cero metadatos, verificado por `ffprobe`. Test: `test_normalize.py` compara dimensiones antes/después.

### Paso 6 — `transcribe.py` + `cache.py`
Extraer audio **de `work.mp4`** (no del original) con `-map 0:a:0` a WAV 16 kHz mono; `faster-whisper` con `word_timestamps=True` y `vad_filter=True`; mapear a `list[Word]`; cachear por hash del archivo (tamaño + mtime + primeros 1 MB). Entregable: `autocut transcribe clip_10s.mp4` escribe `.autocut/<hash>.words.json` con timestamps por palabra.

### Paso 7 — `prompts.py`
El **Prompt Maestro Fórmula 100K** del PDF, adaptado a structured outputs: fuera las instrucciones de formato de salida (el esquema ya las impone), dentro el criterio editorial — muletillas ("eh", "mm", "este"), pausas > 0.8 s, repeticiones, frases débiles, 3–5 palabras clave por oración, mínimo 3 B-Rolls, gancho en los primeros 1.5 s. Entregable: constante `SYSTEM_PROMPT` + `build_user_block(words, offset)`.

### Paso 8 — `brain.py`
Cliente Anthropic, `messages.parse()` con `output_format=EditPlan`, chunking de 5 min con 15 s de solape, corrección de offsets en los índices de `Highlight`, merge de planes, reintentos con backoff, reporte de costo desde `response.usage`. Entregable: `autocut plan video.mp4` imprime una tabla con keeps, duración original vs. final, y costo.

### Paso 9 — `validator.py` ← **el corazón del proyecto**
Aplica en este orden exacto, registrando cada corrección:

| # | Regla | Acción |
|---|---|---|
| V1 | Ningún keep cruza el límite de una palabra | Ajustar (`snap`) al límite de palabra más cercano |
| V2 | Clips de menos de 200 ms | Descartar |
| V3 | Huecos entre keeps de menos de 120 ms | Fusionar los keeps (evita el micro-corte que se ve como glitch) |
| V4 | Keeps ordenados, sin solapes, dentro de `[0, duración]` | Ordenar, fusionar solapes, recortar |
| V5 | **Gancho**: el primer keep debe empezar a ≤ 1.500 ms | Si no, forzar el inicio en la primera palabra hablada |
| V6 | Silencios internos > 800 ms entre keeps consecutivos | Ya cortados por definición; verificar y registrar |
| V7 | Cada `Highlight.text` coincide con `words[word_index].text` | Si no coincide, descartar el highlight (el modelo alucinó) |
| V8 | Cada highlight cae dentro de algún keep | Descartar los que no |
| V9 | Mínimo 3 B-Rolls, separados ≥ 8 s, ninguno antes de 1.5 s | Filtrar y advertir si quedan menos de 3 |
| V10 | Duración final ≥ 30 % de la original | Si no, `PlanRejected`: Claude cortó de más, no publiques eso |
| V11 | **Guarda anti-alucinación** (verificada con material real) | Descartar palabras cuyo segmento tenga `no_speech_prob > 0.5` o `confidence < 0.3`. Si tras filtrar quedan **0 palabras**, levantar `NoSpeechDetected` con el mensaje "Este video no tiene voz detectable; `autocut` edita contenido hablado" — **jamás** llamar a Claude con una transcripción vacía o inventada |

Entregable: `test_validator.py` con un caso por regla, más `plan_broken.json` que viola V2, V4 y V5 a la vez y sale corregido. **Este es el archivo de tests más importante del repo.**

### Paso 10 — `subtitles.py`
Mapear tiempos fuente → tiempos destino (offset acumulado de keeps), agrupar en tarjetas de 1–3 palabras / ≤900 ms, marcar `is_gold`, exportar SRT. Entregable: `subs.srt` cuyo último timestamp coincide con la duración final calculada (test).

### Paso 11 — `fallback.py` (camino B primero, a propósito)
Sobre `work.mp4`, para cada keep, cortar con FFmpeg **re-encodeando** (`-c:v libx264 -c:a aac`) — el `stream copy` se alinea al keyframe más cercano y desfasa los cortes. Concatenar con el demuxer concat — que exige streams uniformes, razón por la que el Paso 5 dejó exactamente un video y un audio. Copiar `subs.srt` al lado. Entregable: `autocut render video.mp4` produce un MP4 pre-cortado que suena continuo, sin clics. **Se construye antes que el camino A porque es la red de seguridad: si `pycapcut` no coopera, la herramienta ya sirve.**

### Paso 12 — `capcut.py` (camino A)
Con las firmas verificadas en el Paso 0, y apuntando el `VideoMaterial` a **`work.mp4`** (si apuntas al `.mov` original, CapCut lo lee 1920×1080 y el lienzo sale horizontal): `DraftFolder(ruta).create_draft(nombre, 1080, 1920)`; pista de video con un `VideoSegment` por keep (`source_timerange` = rango del fuente, `target_timerange` = posición en el destino, ambos en **microsegundos** vía `tim()`); pista de texto con un `TextSegment` por `SubtitleCard`, con `TextStyle` dorado o blanco según `is_gold`; `script.save()`. Envolver todo en try/except: si falla, advertencia amarilla y seguir. Entregable: el proyecto **abre en CapCut** con los cortes y los subtítulos en su lugar.

### Paso 13 — `cli.py` completo
Cablear los 6 comandos, las flags, la barra de progreso y el resumen final (duración original → final, cortes aplicados, highlights, costo, rutas de salida). Entregable: `autocut cut video.mp4` de punta a punta.

### Paso 14 — Tests y CI
`pytest` en verde; GitHub Actions en Windows y macOS corriendo lint + tests. **Sin llamadas a la API en CI**: `brain.py` se prueba con fixtures, no con red.

### Paso 15 — Empaquetado y documentación del equipo
`README.md` en español, con la instalación paso a paso (`pipx install`), qué hacer si `doctor` marca rojo, y el flujo de trabajo de un video. Construir el wheel con `uv build`. Entregable: alguien no técnico del equipo instala y corta un video sin ayuda.

---

## 10. Entorno

### Prerrequisitos
- Python 3.11
- FFmpeg en el PATH (`brew install ffmpeg` / `winget install ffmpeg`)
- CapCut Desktop instalado **y abierto al menos una vez** (crea la carpeta de borradores)
- `uv` para desarrollo; `pipx` para instalar en máquinas del equipo
- ~3 GB de disco para el modelo `large-v3` de Whisper (se descarga solo la primera vez)
- GPU NVIDIA opcional: acelera Whisper ~10×. **Medido sin GPU** (`large-v3` int8): carga del modelo 41 s la primera vez, transcripción 0.61× tiempo real → un video de 10 min tarda ~6 min. Usar `medium` en portátiles.

### Comandos iniciales
```bash
uv init autocut && cd autocut
uv add typer rich anthropic pydantic pydantic-settings faster-whisper ffmpeg-python pycapcut
uv add --dev pytest ruff
cp .env.example .env        # y pegar la ANTHROPIC_API_KEY
uv run autocut doctor
```

---

## 11. Dependencias

### Core
| Paquete | Para qué |
|---|---|
| `typer` | Subcomandos y parsing de argumentos |
| `rich` | Progreso, tablas y color en terminal |
| `anthropic` | SDK oficial de Claude |
| `pydantic` | Modelos de dominio y structured outputs |
| `pydantic-settings` | Configuración desde `.env` |
| `faster-whisper` | Transcripción con timestamps por palabra |
| `ffmpeg-python` | Wrapper de FFmpeg para extracción y corte |
| `pycapcut` | Generación del borrador de CapCut |

### Dev
| Paquete | Para qué |
|---|---|
| `pytest` | Tests |
| `ruff` | Lint + formato |

---

## 12. Distribución

No hay hosting: es software local.

- **Equipo:** `pipx install autocut` desde un wheel publicado en Releases de GitHub (repo privado). Entorno aislado, comando global.
- **Actualizaciones:** `pipx upgrade autocut`. La versión se imprime en `autocut doctor`.
- **CI:** GitHub Actions con matriz `windows-latest` + `macos-latest`, corriendo ruff + pytest en cada push, y construyendo el wheel en cada tag `v*`.
- **Entornos:** solo uno. No hay staging para una CLI; el `--dry-run` cumple ese rol.

---

## 13. Estrategia de Pruebas

### Unitarias (el grueso)
- `test_validator.py` — un test por regla V1–V10, más el caso combinado. **Cobertura obligatoria del 100 % en `validator.py`.**
- `test_subtitles.py` — mapeo de tiempos fuente→destino y agrupación en tarjetas. El bug clásico es el offset acumulado; cubrirlo con un caso de 3 keeps no contiguos.
- `test_models.py` — validadores de Pydantic.
- `test_paths.py` — detección de SO con `sys.platform` monkeypatcheado a `win32` y `darwin`.
- `test_normalize.py` — con el fixture `iphone_rotado.mov` (1920×1080 + matriz −90°): la salida es 1080×1920, tiene exactamente 2 streams y no conserva metadatos.
- `test_validator_v11.py` — un transcript de una sola palabra alucinada con `no_speech_prob=0.58` levanta `NoSpeechDetected` en vez de llamar a la API.

### Integración
- `test_brain_merge.py` — fusión de dos planes parciales con solape, verificando la corrección de offsets de los highlights. Con fixtures, **sin red**.
- `test_fallback.py` — smoke test con `clip_10s.mp4`: dos keeps, verificar que el MP4 de salida existe y su duración está dentro de ±100 ms de lo esperado (`ffprobe`).

### Manual (no automatizable)
El camino A solo se verifica abriendo CapCut. Checklist en el README: el proyecto abre, los cortes están donde deben, los subtítulos son legibles y el dorado se ve dorado.

---

## 14. Skills a Usar Durante la Construcción

| Skill | En qué paso | Para qué |
|---|---|---|
| `/claude-api` | Paso 8 | Firmas exactas de `messages.parse()`, structured outputs, manejo de errores y reintentos del SDK. **Léelo antes de escribir `brain.py`**, no confíes en la memoria: `temperature` y `budget_tokens` dan 400 en `claude-opus-5`. |
| `/deep-research` | Paso 0 | Si `pycapcut` cambió de API o el formato de borrador de CapCut se rompió con una actualización de la app. |
| `/build` | Pasos 4–13 | Construir cada módulo contra este blueprint sin agregar funciones no pedidas. |
| `/review` | Después del Paso 13 | Verificar la construcción requisito por requisito contra este documento. |

No se usan `/frontend-design`, `/shadcn-ui` ni `/ui-ux-pro-max`: no hay interfaz gráfica.

---

## 15. CLAUDE.md para el Proyecto Destino

````markdown
# autocut

CLI en Python que convierte un video vertical crudo en un borrador de CapCut listo para exportar: transcribe con timestamps por palabra, Claude decide los cortes, un validador determinista impone las reglas, y se escribe el borrador en la carpeta de CapCut.

## Comandos

- `uv run autocut doctor` — Verifica FFmpeg, carpeta de CapCut, API key y modelo de Whisper
- `uv run autocut cut VIDEO` — Pipeline completo (el comando principal)
- `uv run autocut plan VIDEO --dry-run` — Solo el plan de edición, sin tocar CapCut
- `uv run pytest` — Tests
- `uv run ruff check --fix . && uv run ruff format .` — Lint y formato
- `uv build` — Construir el wheel

## Stack

Python 3.11 + Typer + Rich + Anthropic SDK (`claude-opus-5`) + Pydantic v2 + faster-whisper + FFmpeg + pycapcut

## Arquitectura

### Estructura
- `src/autocut/cli.py` — Comandos Typer. Solo orquesta; nada de lógica de negocio aquí.
- `src/autocut/normalize.py` — **Primer paso siempre.** Hornea la rotación, deja 1 video + 1 audio, borra metadatos
- `src/autocut/transcribe.py` — Audio → `list[Word]` con timestamps por palabra
- `src/autocut/brain.py` — Llamada a Claude con structured outputs, chunking y merge
- `src/autocut/validator.py` — **Reglas duras V1–V10. El corazón del proyecto.**
- `src/autocut/subtitles.py` — Tarjetas de 1–3 palabras, dorado/blanco, exporta SRT
- `src/autocut/capcut.py` — Camino A: borrador vía `pycapcut`
- `src/autocut/fallback.py` — Camino B: render pre-cortado con FFmpeg
- `src/autocut/paths.py` — Carpeta de borradores según SO

### Flujo de datos
`video crudo → normalize → work.mp4 → wav → list[Word] → EditPlan (Claude) → validator → {borrador CapCut, render FFmpeg + SRT}`

La línea de tiempo destino se obtiene concatenando los keeps: el offset destino de cada keep es la suma de las duraciones de los anteriores.

### Patrones clave
- **Milisegundos enteros en todo el dominio.** La conversión a microsegundos ocurre solo en `capcut.py`.
- **Claude propone, el validador dispone.** Ninguna salida del modelo llega a CapCut sin pasar por `validator.py`.
- **El camino A nunca aborta la corrida.** Si `pycapcut` falla: advertencia amarilla y el camino B continúa.
- **Los highlights son índices de palabra, no texto.** Se verifica que `highlight.text == words[i].text`; si no coincide, el modelo alucinó y el highlight se descarta.
- **Nada consume el archivo original.** Todo módulo trabaja sobre `work.mp4`, la salida de `normalize.py`. El video del teléfono llega 1920×1080 con matriz de rotación, 8 streams y GPS embebido.
- **Whisper alucina sobre audio sin voz.** `vad_filter=True` siempre, y regla V11: 0 palabras válidas → `NoSpeechDetected`, nunca una llamada a la API con transcripción vacía.

## Reglas de Código

1. **Una responsabilidad por módulo.** Máximo 300 líneas por archivo.
2. **Type hints en todas las funciones públicas.** `ruff` en modo estricto.
3. **Nada de tiempos en float.** Solo `int` de milisegundos en el dominio.
4. **Ningún `print()`.** Toda salida al usuario pasa por `console.py`.
5. **Errores en español y accionables.** Nunca un traceback crudo: subclase de `AutocutError` con qué hacer.

## Llamadas a la API de Claude

- Modelo: `claude-opus-5` exacto, sin sufijo de fecha.
- **Prohibido** `temperature`, `top_p`, `top_k` → error 400 en este modelo.
- **Prohibido** `thinking: {budget_tokens: N}` → error 400. No configurar `thinking`.
- Usar `client.messages.parse(output_format=EditPlan)`, no parsear texto libre.
- `max_tokens=16000`; si un chunk necesita más de 32000, usar `.stream()` + `.get_final_message()`.
- Reintentar `RateLimitError` con backoff 2/4/8/16 s. **No** reintentar `BadRequestError`.

## Sistema de Diseño (subtítulos)

- Dorado `#C5A059` → RGB `(0.773, 0.627, 0.349)` — palabras clave
- Blanco `#FFFFFF` → RGB `(1.0, 1.0, 1.0)` — el resto
- Contorno negro `#000000` para legibilidad
- Fuente sans-serif bold, ~8 % de la altura del lienzo, centrada al 78 % de altura
- **Prohibido el amarillo fosforescente.** Resta autoridad.

## Variables de Entorno

| Variable | Descripción |
|---|---|
| `ANTHROPIC_API_KEY` | Clave de la API de Claude (obligatoria) |
| `AUTOCUT_WHISPER_MODEL` | `large-v3` (default) o `medium` |
| `AUTOCUT_LANG` | Idioma del audio, default `es` |
| `AUTOCUT_CAPCUT_DIR` | Override de la carpeta de borradores si `doctor` no la detecta |

## Reglas No Negociables

1. **Verifica las firmas reales de `pycapcut` antes de usarla.** Está en 0.0.3; si difiere del blueprint, gana la librería instalada.
2. **El gancho manda:** el primer corte ocurre antes de 1.500 ms. Sin excepción, aunque Claude proponga otra cosa.
3. **Ningún corte a mitad de palabra.** Todo límite de keep se ajusta al límite de palabra más cercano.
4. **Nunca `stream copy` para cortar ni para normalizar.** Se re-encodea, o los cortes se desfasan al keyframe y la rotación no se hornea.
5. **Siempre `-map 0:v:0 -map 0:a:0 -dn -sn -map_metadata -1`.** Los videos de iPhone traen pistas extra que rompen el concat, y GPS que no debe publicarse.
6. **`.env` jamás se commitea.**
````

---

## 16. Reglas No Negociables (para quien construye)

1. **Paso 0 antes que nada.** Verifica la API real de `pycapcut` instalada. Si contradice este blueprint, la librería gana y anotas la diferencia en `capcut.py`.
2. **Construye el camino B (FFmpeg) antes que el camino A (CapCut).** Es la red de seguridad; si el camino A no coopera, la herramienta ya sirve.
3. **`validator.py` con 100 % de cobertura de tests.** Es lo único que separa un video publicable de uno con cortes a mitad de palabra.
4. **Nada de `temperature` ni `budget_tokens` en las llamadas a `claude-opus-5`.** Devuelven 400. El determinismo se logra en el validador.
5. **Milisegundos `int` en todo el dominio.** Microsegundos solo dentro de `capcut.py`.
5.b **Ningún módulo toca el archivo original.** Todo parte de `work.mp4`, la salida de la normalización.
6. **Los highlights se verifican contra la transcripción.** Índice que no coincide con su texto, highlight que se descarta.
7. **Cero silencio en el primer segundo y medio.** Regla del Gancho, codificada en V5, no delegada al modelo.
8. **Dorado `#C5A059` y blanco. Nunca amarillo fosforescente.**
9. **Todo error que ve el usuario dice qué hacer a continuación**, en español.
9.b **Un video sin voz se rechaza con un mensaje, no con un plan inventado.**
10. **No agregues funciones que no estén en este blueprint.** Ni edición de audio, ni música, ni publicación automática. Si algo falta, se decide antes de construirlo.

---

## 17. Riesgos Conocidos

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| `pycapcut` 0.0.3 cambia de API o no soporta la versión instalada de CapCut | Alta | Paso 0 de verificación + camino B siempre disponible + try/except que degrada sin abortar |
| Una actualización de CapCut rompe el formato de borrador | Media | El camino B no depende del formato interno; sobrevive a cualquier actualización |
| `pycapcut` documenta que la exportación automatizada solo está probada en CapCut Windows | Confirmada | Los Mac del equipo usan el camino B por defecto; el camino A se ofrece igual y se valida abriendo el proyecto |
| Whisper transcribe mal jerga técnica o nombres propios | Media | `initial_prompt` de faster-whisper con un glosario de términos del equipo, configurable |
| Claude propone cortes demasiado agresivos | Media | Regla V10: si la duración final baja del 30 % de la original, se rechaza el plan en vez de entregar un video mutilado |
| Videos largos (>30 min) inflan costo y tiempo | Baja | Chunking de 5 min; el costo se reporta al final de cada corrida |
| Whisper alucina frases sobre audio sin voz | **Confirmada en material real** | Regla V11 + `vad_filter=True`; con 0 palabras se aborta con mensaje claro, no se llama a Claude |
| Se publica un video con GPS del lugar de grabación embebido | **Confirmada en material real** | `-map_metadata -1` en la normalización (Paso 5) |
| Formatos de cámara distintos (Android, ProRes, 4K60) | Media | La normalización es el único punto que toca el contenedor: adaptar ahí, no en 3 módulos |
