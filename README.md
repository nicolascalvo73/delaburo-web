# DELABURO.COM — Rediseño 2026

Sitio estático (HTML + CSS + JS, sin frameworks ni build step) listo para GitHub Pages.

## Estructura

```
index.html        Inicio (hero, servicios, beneficios, sectores, CTA)
cotizar.html       Formulario de cotización
terminos.html      Términos y condiciones
privacidad.html    Política de privacidad
assets/css/styles.css
assets/js/main.js       theme claro/oscuro, menú mobile, reveal on scroll, envío del form
assets/js/countries.js  prefijos telefónicos del selector de país
favicon.svg
robots.txt / sitemap.xml
```

## Conectar el formulario de "Cotizar" (Formspree)

El formulario ya está armado y validado, pero necesita un endpoint real para que
las respuestas lleguen a un email (GitHub Pages no procesa formularios por sí solo):

1. Creá una cuenta gratis en https://formspree.io (o https://web3forms.com).
2. Creá un formulario nuevo y copiá el ID/endpoint que te dan
   (algo como `https://formspree.io/f/abcdwxyz`).
3. Abrí `cotizar.html`, buscá esta línea:
   ```html
   <form data-quote-form data-endpoint="https://formspree.io/f/TU_ID_DE_FORMSPREE" novalidate>
   ```
   y reemplazá `TU_ID_DE_FORMSPREE` por tu endpoint real.
4. Volvé a subir el archivo (commit + push). Listo — las respuestas van a llegar
   al email que configuraste en Formspree.

Mientras no se configure, el formulario muestra un aviso pidiendo escribir
directamente a recursoshumanos@delaburo.com, en vez de fallar en silencio.

## Deploy en GitHub Pages

1. Creá un repositorio en GitHub (puede ser público o privado con GitHub Pro/Team).
2. Subí todo el contenido de esta carpeta a la raíz del repositorio.
3. En **Settings → Pages**, elegí la rama (`main`) y carpeta `/ (root)`.
4. GitHub va a publicar el sitio en `https://<usuario>.github.io/<repo>/`.
5. Si vas a usar el dominio propio `www.delaburo.com`, agregá un archivo `CNAME`
   con ese dominio y configurá el DNS (registro CNAME hacia `<usuario>.github.io`).

## Qué se rediseñó y por qué

- **Tema claro/oscuro** con toggle persistente (localStorage) respetando la
  identidad visual original (degradé turquesa → azul → violeta).
- **Performance**: sin frameworks, sin Wix, sin cookies de terceros, iconos en
  SVG inline (no requests extra), fuentes con `preconnect`, animaciones con
  `prefers-reduced-motion`. Esto ataca directamente los hallazgos de PageSpeed:
  LCP alto en mobile, JS duplicado/heredado, exceso de preconnects.
- **Accesibilidad**: un solo `<h1>` por página, jerarquía de encabezados sin
  saltos, contraste de color verificado (AA) en ambos temas, todos los
  links/botones con nombre accesible, foco visible, skip-link.
- **Mobile**: menú hamburguesa real (el sitio original no tenía uno y
  desbordaba horizontalmente en pantallas chicas), tipografía y áreas de touch
  más grandes.
- **SEO**: metadatos completos, Open Graph, `sitemap.xml`, `robots.txt`,
  JSON-LD de Organization.

## Nota sobre el contenido legal

En `privacidad.html` la página original (`/política-de-privacidad`) en realidad
mostraba un texto de "Términos de uso" que menciona una vez a "ManpowerGroup" —
claramente un resto de una plantilla, ya que el resto del texto habla de
"DELABURO SRL". Corregí esa mención puntual para que sea consistente con el
resto del documento, pero vale la pena que un asesor legal revise el contenido
completo de `terminos.html` y `privacidad.html`, ya que probablemente haga
falta una política de privacidad real (qué datos personales se recolectan en
el formulario de "Cotizar", con qué fin, etc.), algo que el sitio actual no
tiene.

## Prefijos telefónicos y logos de clientes

- El selector de país del formulario incluye ~50 prefijos (América, Europa,
  y los principales mercados de Asia/Oceanía) en vez de la lista completa de
  ~250 países del sitio original, para no sobrecargar el `<select_>`. Se puede
  ampliar editando `assets/js/countries.js`.
- La sección "Confían en nosotros" reemplaza la grilla de logos de clientes del
  sitio original por chips de sectores (Energía, Real Estate, Automotriz, etc.),
  porque no tuve acceso a los archivos de logos reales. Si nos pasás los logos,
  los agrego en una grilla similar a la original.
