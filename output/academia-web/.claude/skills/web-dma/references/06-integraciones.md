# Integraciones: Sharp CRM, chat y video

Sharp CRM es la marca blanca de GoHighLevel / LeadConnector que usa DMA. Por
debajo son los mismos endpoints.

## El formulario

Se embebe el formulario del CRM, no se construye uno propio. Así los datos
nacen ya en el CRM, sin una capa intermedia que mantener.

```tsx
const FORM_ID = "OfA7Ehcb8QSo9VXIDe6X";
const FORM_URL = `https://api.leadconnectorhq.com/widget/form/${FORM_ID}`;

<div id="formulario" className="scroll-mt-28">
  <iframe
    src={FORM_URL}
    id={`inline-${FORM_ID}`}
    title="Formulario de contacto — <empresa>"
    loading="lazy"
    data-layout="{'id':'INLINE'}"
    data-height="560"
    data-form-id={FORM_ID}
    className="block w-full border-0"
    style={{ height: 560 }}
  />
</div>
<Script src="https://api.leadconnectorhq.com/js/form_embed.js" strategy="lazyOnload" />
```

Completo en `assets/contacto-bloque.tsx`.

Tres cosas que se aprendieron a base de golpes:

1. **Sin tarjeta envolvente.** El primer intento metía el iframe en un panel con
   padding y altura mínima fija. Resultado: un hueco muerto bajo el botón
   Enviar y una tarjeta duplicada (la del sitio y la del formulario). El iframe
   va directo, con el encabezado como texto encima.
2. **`form_embed.js` ajusta la altura al contenido.** Los 560 px son el valor
   inicial, no el final. No hace falta pelearse con la altura.
3. **`el ID del formulario se verifica pidiéndolo.** Si el formulario no abre,
   compara el tamaño de la respuesta: un ID equivocado devuelve una página de
   unos 62 KB sin datos de formulario; el bueno devuelve unos 102 KB. Fue así
   como se encontró que el ID estaba mal.

```bash
curl -s -o /dev/null -w "%{http_code} %{size_download}\n" \
  https://api.leadconnectorhq.com/widget/form/<FORM_ID>
```

## El widget de chat, que es el botón flotante

**No hay un botón flotante propio.** El widget del CRM *es* el botón. Si se
pone además un botón de WhatsApp propio, quedan dos burbujas peleándose la
esquina. En el sitio de consultoría se borró `wa-float.tsx` por eso.

El componente está en `assets/chat-widget.tsx`:

```tsx
const WIDGET_ID = "6a99fc15ba70a028e7c03484";

<Script
  src="https://widgets.leadconnectorhq.com/loader.js"
  data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
  data-widget-id={WIDGET_ID}
  strategy="lazyOnload"
/>
```

### Si sale como bloque en línea en vez de burbuja

Es configuración del CRM, no del código. Se comprueba pidiendo la
configuración pública del widget:

```bash
curl -s https://services.leadconnectorhq.com/chat-widget/public/config/<WIDGET_ID> \
  -H "widget-id: <WIDGET_ID>" -H "source: custom-code"
```

En `widget-placement` puede venir `inline`, `embedded` o `sticky`. Para que sea
la burbuja flotante tiene que ser **`sticky`**, y eso se arregla en Sharp CRM →
**Colocación de widgets → Elemento fijo**.

El componente trae un `MutationObserver` que fuerza la colocación desde el
cliente como red de seguridad, pero **el arreglo de verdad está en el CRM**. Si
solo se pone el parche del cliente, el siguiente widget vuelve a salir mal.

## Video

Política: **solo Vimeo**. Nunca CloudFront, S3 ni un archivo suelto en
`public/`.

IDs del sitio de consultoría, por si sirven de referencia de formato: máster
16:9 `1223019533`, escenas `1223019550`, `1223019560`, `1223019570`. La
demostración del producto es un Loom, `316e3efa9f364719a632a59244a4ff65`, con
aspecto `1108/720`.

Silencio, bucle, y póster por debajo para movimiento reducido.

## Verificar embebidos

**El navegador del sandbox no carga recursos externos.** Los iframes de Vimeo,
de Loom y del CRM salen en gris en cualquier captura. Eso no es un fallo del
sitio y no hay que ir a arreglarlo.

Se verifica contra producción con `curl`:

```bash
curl -s https://<dominio>/contactos | grep -o 'api.leadconnectorhq.com/widget/form/[A-Za-z0-9]*'
curl -s -o /dev/null -w "%{http_code}\n" https://api.leadconnectorhq.com/widget/form/<FORM_ID>
```

## El pipeline del CRM

Lo que pasa después de que alguien envía el formulario o escribe en el chat no
es trabajo del sitio, pero sí hay que dejarlo montado o los leads se quedan
quietos. Se entregó como artefacto con el paso a paso para que lo monte el
equipo del CRM.

Al levantar un sitio nuevo: preguntar si el pipeline ya existe para ese
producto, y si no, dejarlo como entregable aparte y por escrito. La fuente del
lead se marca desde el formulario con un campo oculto (en el de consultoría,
`web-dgdesignmodeling`), que es lo que después permite atribuir.
