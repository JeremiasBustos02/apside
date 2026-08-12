# Apside

Sitio web de **Apside**, agencia de desarrollo que se encarga de rediseños, mejoras, automatizaciones, sistemas a medida y landing pages para negocios de todo tipo (PyMEs, profesionales, empresas medianas/grandes y emprendimientos).

Personalidad de marca: **moderna + creativa**, con identidad visual basada en formas orgánicas (blobs, ondas), tipografía marcada, ilustraciones 3D estilo Disney y paleta de colores suave. Sin modo oscuro por ahora.

## Stack

- **[Astro](https://astro.build/)** — framework principal, generación estática.
- **Tailwind CSS** — utilidades de estilo.
- **GSAP + ScrollTrigger** — animaciones e interacciones de scroll (se agrega en una fase posterior, no desde el día 1).
- **TypeScript** — tipado de contenido y componentes.
- **Astro Content Collections** — contenido estructurado y validado (equipo, clientes, servicios, FAQ, proceso, etc.)

## Cómo ejecutar

```bash
npm install
npm run dev
```

El sitio queda disponible en `http://localhost:4321`.

## Cómo compilar

```bash
npm run build
npm run preview   # para previsualizar el build de producción localmente
```

## Estructura general

```
apside/
├── public/
│   ├── fonts/              # Poppins y Dx Figgle Free Font (self-hosted, .woff2)
│   ├── images/
│   │   ├── team/
│   │   ├── clients/
│   │   ├── services/
│   │   └── hero/
│   └── icons/
│
├── src/
│   ├── components/         # Componentes Astro, agrupados por dominio (ver ARCHITECTURE.md)
│   ├── content/
│   │   ├── sections/       # Contenido de secciones únicas (hero, why-apside, contact, footer)
│   │   ├── team/           # Una entrada por miembro del equipo
│   │   ├── clients/        # Una entrada por cliente
│   │   ├── services/       # Una entrada por servicio
│   │   ├── process/        # Una entrada por paso del proceso
│   │   ├── why-us/         # Una entrada por tarjeta de "por qué elegirnos"
│   │   └── faq/            # Una entrada por pregunta
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       ├── global.css
│       ├── theme.css        # Paleta y fuentes en Tailwind v4 (@theme)
│       └── fonts.css        # @font-face de Poppins y Dx Figgle
│
├── src/content.config.ts    # Definición de colecciones (schemas, Content Layer API)
├── README.md
├── ARCHITECTURE.md
├── ROADMAP.md
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

Ver `ARCHITECTURE.md` para el detalle de por qué el contenido está organizado así, y qué va en cada colección vs. qué va en `sections/`.

## Convenciones

- **Nada de contenido hardcodeado en componentes.** Todo texto visible (títulos, descripciones, labels de botones) vive en `src/content/`. Un componente Astro solo recibe props y renderiza; no define copy propio salvo textos puramente técnicos (aria-labels genéricos, etc.)
- **Un archivo por sección única**, un archivo por entrada en las colecciones repetibles. No se vuelve a un `data.js`/`data.ts` monolítico.
- **No se crean componentes duplicados** cuando uno existente se puede extender con una prop. Antes de crear `TeamCard2.astro`, evaluar si `Card.astro` (genérico) puede cubrir el caso.
- **No se modifica la arquitectura del proyecto sin actualizar `ARCHITECTURE.md` primero.**
- **No se introducen dependencias nuevas** a menos que sean necesarias y quede documentado en `ARCHITECTURE.md` (qué resuelve, por qué se eligió esa y no otra).
- **No se cambia el sistema de diseño (paleta, tipografías, spacing, radios de borde)** sin documentar el cambio.
- Nombres de archivos y componentes en PascalCase para `.astro`, kebab-case para assets.

## Fuentes

- **Poppins** → texto de párrafo, navegación, botones, FAQ, contenido general. Pesos: Regular, Medium, SemiBold, Bold.
- **Dx Figgle Free Font** → títulos grandes, headings, números destacados, el nombre "Apside" en hero/footer.

Ambas están self-hosteadas en `public/fonts/` (formato `.woff2`) y declaradas vía `@font-face` en `src/styles/fonts.css`. No se usa Google Fonts ni ningún CDN externo de tipografías, para mantener control total sobre carga y evitar layout shift.

## Assets

- **Equipo:** por ahora sin fotos reales. Se usa un placeholder consistente (mismo estilo/color de fondo) hasta tener las fotos de Jeremías Bustos y Gerónimo Lombardo.
- **Clientes:** logos placeholder por ahora. Cada logo, real o placeholder, debe poder linkear a la página del cliente (o a un placeholder `#` mientras no exista).
- **Persona 3D del hero / "¿Por qué Apside?":** PNG con fondo transparente, provisto por el usuario. Se ubica en `public/images/hero/`.
- **Logo de Apside:** todavía no existe. Mientras tanto, el nombre "Apside" se muestra como texto con la tipografía Dx Figgle (navbar y footer), no como imagen.

## Deployment

_A definir._ Si se despliega en Vercel/Netlify/Cloudflare Pages, agregar acá el comando de build, variables de entorno (si las hay) y el dominio final.