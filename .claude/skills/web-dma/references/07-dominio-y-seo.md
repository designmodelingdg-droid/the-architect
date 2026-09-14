# Dominio, despliegue e indexación

El orden importa: **primero las redirecciones, después el DNS.** Si se apunta el
dominio antes de cubrir las URLs del sitio anterior, cada visita desde Google
cae en un 404 mientras se arregla.

## 1. Redirecciones antes de mover nada

Se saca el sitemap del sitio anterior y se cubre **cada** URL. En
`next.config.ts`, tres grupos:

```ts
async redirects() {
  return [
    // Las del WordPress anterior, según su sitemap
    { source: "/politicas-de-privacidad",  destination: "/privacidad", permanent: true },
    { source: "/politicas-de-cookies",     destination: "/privacidad", permanent: true },
    { source: "/terminos-y-condiciones",   destination: "/terminos",   permanent: true },
    { source: "/blog-no-usar",             destination: "/blog",       permanent: true },

    // Convención en inglés, para agentes y enlaces de fuera
    { source: "/privacy",        destination: "/privacidad",  permanent: true },
    { source: "/privacy-policy", destination: "/privacidad",  permanent: true },
    { source: "/terms",          destination: "/terminos",    permanent: true },
    { source: "/about",          destination: "/nosotros",    permanent: true },
    { source: "/contact",        destination: "/contactos",   permanent: true },
    { source: "/services",       destination: "/consultoria", permanent: true },
  ];
}
```

En el sitio de consultoría quedaron 14 en total. Las de inglés además hacen
pasar la comprobación de páginas de confianza del escáner de agentes.

## 2. Vercel

Los dos dominios en el proyecto: el apex y el `www`, con **`www` → apex en
301**. Mientras el DNS no apunte, Vercel los muestra como «Invalid
Configuration»; eso es normal y no es un error que haya que arreglar en Vercel.

Valores que pide:

| Registro | Nombre | Valor |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

Cuidado: puede haber **dos proyectos de Vercel apuntando al mismo repo**. En
este caso `dgdesignmodeling-web` es el de producción y `sitio-next` es otro que
también despliega previsualizaciones del mismo directorio. Al verificar un
despliegue hay que mirar el correcto; el comentario de Vercel en el PR lista
los dos.

## 3. DNS en Hostinger

La trampa que costó una vuelta: **el registro `@` no era un A, era un ALIAS**
apuntando a `<dominio>.cdn.hstgr.net`. Un ALIAS no se puede editar a A: hay que
**borrarlo y crear el A**.

Lo que NO se toca:

- los MX (`mx1.hostinger.com`, `mx2.hostinger.com`) — si se tocan, se cae el
  correo,
- los CNAME de otros servicios (en este caso `funnel` → `sites.ludicrous.cloud`),
- los servidores de nombres,
- el TXT de verificación de Google que ya estuviera.

El `www` sí se cambia a `cname.vercel-dns.com`.

## 4. Verificar el corte

```bash
for u in "" /consultoria /nosotros /contactos; do
  printf "%-16s " "${u:-/}"
  curl -s -o /dev/null -w "%{http_code}\n" -m 25 "https://<dominio>$u"
done

# www redirige al apex
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" https://www.<dominio>/

# y cada redirección del sitio anterior
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" https://<dominio>/politicas-de-privacidad
```

## 5. Search Console

- Propiedad **de dominio**, verificada con un TXT nuevo. **Sin borrar** el
  `google-site-verification` que ya hubiera: conviven.
- Enviar el sitemap nuevo (`/sitemap.xml`). Si existía uno del sitio anterior en
  esa propiedad, se retira; si la propiedad es nueva, no hay nada que retirar.
- Pedir indexación de las páginas principales a mano. El resto lo encuentra por
  el sitemap.
- Volver a mirar **«Páginas»** una semana después, no al día siguiente.

## `robots.ts` y `sitemap.ts`

Route handlers de Next, no archivos estáticos. `assets/robots.ts` es el del
sitio de consultoría: abierto a todos los rastreadores, con el sitemap
declarado.

El sitemap sale de la lista de rutas y lleva `lastmod`. Un escáner lo midió:
«100 % of 9 sampled sitemap entries carry lastmod».

Y mientras el sitio vive en `*.vercel.app`, el middleware manda
`X-Robots-Tag: noindex, nofollow` para que el staging no compita con el dominio
definitivo. Detalle en `04-legible-por-agentes.md`.

## Metadatos por página

En el layout raíz: `metadataBase`, `title` con plantilla (`"%s · <empresa>"`),
`description`, `alternates`, Open Graph con `locale` y una imagen de 1200×630, y
Twitter card.

Cada página exporta su propio `metadata` con `title`, `description` y su
`alternates: alternos("/<ruta>.md")`.
