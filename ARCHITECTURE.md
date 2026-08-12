# Architecture — Apside

Este documento define cómo está construido el sitio y las reglas que hay que seguir para mantenerlo ordenado. Cualquier cambio estructural (nuevas carpetas, nuevas dependencias, cambio de paleta/tipografías) se documenta acá **antes** de implementarse.

## 1. Arquitectura de Astro

Sitio 100% estático, una sola página (`src/pages/index.astro`) compuesta por secciones. Cada sección es un componente Astro independiente, importado en orden desde `index.astro`:

```
Navbar
Hero
WhyApside
Team
Clients
Process
WhyChooseUs
Services
Faq
Contact
Footer
```

`index.astro` no contiene lógica ni copy: solo importa componentes de sección y les pasa el contenido leído desde `src/content/`.

## 2. Componentes

```
src/components/
├── layout/
│   ├── Navbar.astro
│   └── Footer.astro
│
├── ui/                      # Genéricos, reutilizables en cualquier sección
│   ├── Button.astro
│   ├── SectionTitle.astro
│   ├── Blob.astro           # forma orgánica SVG, recibe color/posición/tamaño por props
│   ├── Wave.astro           # transición ondulada entre secciones
│   └── DecorativeCircle.astro
│
├── sections/                # Un componente "contenedor" por sección de la página
│   ├── Hero.astro
│   ├── WhyApside.astro
│   ├── Team.astro
│   ├── Clients.astro
│   ├── Process.astro
│   ├── WhyChooseUs.astro
│   ├── Services.astro
│   ├── Faq.astro
│   └── Contact.astro
│
├── team/
│   ├── TeamCard.astro
│   └── TeamModal.astro
│
├── clients/
│   └── ClientBadge.astro
│
├── process/
│   ├── Timeline.astro
│   └── ProcessCard.astro
│
├── why-us/
│   └── FlipCard.astro
│
├── services/
│   └── ServiceCard.astro
│
└── faq/
    └── FaqItem.astro
```

**Regla de componentes:** antes de crear un componente nuevo, revisar si uno de `ui/` puede cubrir el caso con una prop adicional. Por ejemplo, `FlipCard.astro` y `ServiceCard.astro` no deberían converger en un solo componente forzado si su interacción es genuinamente distinta (flip vs. estático), pero sí deberían compartir `Button.astro` y `SectionTitle.astro` en vez de reimplementar botones/títulos propios.

## 3. Separación de datos / UI

Ningún componente de `src/components/` contiene texto de copy hardcodeado (salvo textos técnicos como `aria-label`s genéricos o placeholders de formularios). Todo el contenido vive en `src/content/`.

### 3.1 Secciones únicas (`src/content/sections/`)

Un archivo `.ts` por sección que no se repite (no es una lista de ítems), tipado con una interfaz simple. Ejemplo:

```ts
// src/content/sections/hero.ts
export const hero = {
  title: "Apside",
  subtitle: "Tus ideas, nuestra misión.",
  ctaPrimary: { label: "Conocé Apside", href: "#why-apside" },
  ctaSecondary: { label: "Hablemos", href: "#contact" },
};
```

Secciones que van acá: `hero.ts`, `why-apside.ts`, `why-choose-us-intro.ts`, `process-intro.ts`, `services-intro.ts`, `contact.ts`, `footer.ts`.

### 3.2 Colecciones repetibles (Astro Content Collections)

Para todo lo que es una lista de ítems del mismo tipo, se usan **Content Collections** con schema validado en `src/content.config.ts` (Zod). Cada ítem es un archivo individual, no un array dentro de un solo archivo.

> **Nota (Astro v7):** el proyecto usa el **Content Layer API** de Astro (v6+), con colecciones definidas en `src/content.config.ts` y cargadas con el loader `glob()` desde `astro/loaders`. Es el reemplazo del patrón legacy (`src/content/config.ts` + `type: "content"`) que Astro dejó de soportar. La estructura de archivos por colección es idéntica; solo cambia el archivo de configuración y el loader.

```
src/content/
├── team/
│   ├── jeremias-bustos.md
│   └── geronimo-lombardo.md
├── clients/
│   └── (placeholders por ahora, ej. cliente-01.md, cliente-02.md...)
├── services/
│   ├── landing-page.md
│   ├── web-completa.md
│   └── sistema-a-medida.md
├── process/
│   ├── 01-contacto.md
│   ├── 02-analisis-y-diseno.md
│   ├── 03-implementacion.md
│   └── 04-monitoreo-y-soporte.md
├── why-us/
│   ├── compromiso-y-confianza.md
│   ├── seguridad.md
│   └── creatividad.md
└── faq/
    ├── 01.md
    ├── 02.md
    └── ...
```

Schema de ejemplo para equipo:

```ts
// src/content.config.ts
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const team = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/team" }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    photo: z.string().optional(),      // ausente hasta tener fotos reales
    joinedYear: z.number(),
    traits: z.array(z.string()),
    order: z.number(),
  }),
});

export const collections = { team /*, clients, services, process, whyUs, faq */ };
```

**Por qué así y no un solo `data.ts`:** cada ítem queda auto-contenido, es fácil de editar sin tocar un array gigante, y Astro valida el shape en build time — si falta un campo obligatorio (por ejemplo `role`), el build falla en vez de romperse en producción.

**Equipo actual** (sin fotos todavía, se usa placeholder visual):
- Jeremías Bustos — Desarrollador
- Gerónimo Lombardo — Diseñador Gráfico

**Clientes:** por ahora placeholders. Cada entrada tiene un campo `url` que, cuando exista el cliente real, apunta a la página que se le hizo (`ClientBadge.astro` linkea ahí; mientras no exista, apunta a `#` o queda deshabilitado visualmente).

## 4. Estrategia responsive

- Mobile-first con breakpoints estándar de Tailwind (`sm`, `md`, `lg`, `xl`).
- La sección **Process** (timeline + cards) es el caso más delicado: en desktop es dos columnas (timeline izquierda, cards derecha); en mobile colapsa a una sola columna, timeline arriba en versión simplificada (puntos horizontales o verticales compactos) y cards debajo en stack.
- Las formas orgánicas (`Blob`, `Wave`) se simplifican o reducen en mobile para no afectar performance ni saturar visualmente pantallas chicas.
- El PNG 3D del hero/"¿Por qué Apside?" reduce tamaño y puede reposicionarse (de "flotando al costado" a "detrás del texto, más sutil") en mobile si compite por espacio.

## 5. Animaciones (GSAP)

**Orden de trabajo, sin excepción:** HTML → CSS → responsive → interacciones básicas (CSS) → recién ahí GSAP. No se integra GSAP hasta que la web funcione y se vea completa sin animaciones.

Alcance de GSAP por sección:

- **Hero:** entrada suave del texto y de la persona 3D; flotación vertical continua sutil; parallax leve al hacer scroll.
- **Why Apside:** reveal on scroll del texto y la ilustración.
- **Team:** hover/tap en cards; apertura de modal (backdrop fade, scale 0.95→1, foto y texto con leve delay entre sí).
- **Process:** progreso de la línea de tiempo ligado al scroll (ScrollTrigger).
- **Why Choose Us:** flip cards (hover en desktop, tap en mobile).
- **Secciones en general:** reveal on scroll (fade + translateY sutil), no uniforme para todas — variar levemente para que no se sienta mecánico.
- **Elementos decorativos** (blobs, círculos): parallax a distinta velocidad entre capas.

**Accesibilidad de movimiento:** todo lo anterior debe respetar `prefers-reduced-motion: reduce` — en ese caso se elimina el parallax y la flotación continua, y los reveals pasan a ser instantáneos o con fade muy corto sin desplazamiento.

**Implementación actual (Fase 13):** los scripts viven en `src/scripts/` (maestro `animations.ts` importado en `index.astro`) y se organizan por responsabilidad:

- `gsap-init.ts` — registra `ScrollTrigger` y re-exporta `gsap`.
- `hero.ts` — timeline de entrada (título, subtítulo, CTAs desde eje y, visual desde x) con `gsap.matchMedia()`; flotación vertical continua del visual (`yoyo repeat -1`).
- `reveal.ts` — `[data-reveal]` (elemento suelto) y `[data-reveal-group]` (stagger de hijos) con ScrollTrigger `start: "top 85%"`.
- `decorations.ts` — parallax por scroll en `[data-parallax]`, velocidad leída de `data-parallax` (0.2–0.6), `scrub: true`.
- `process.ts` — línea de timeline crece con `scaleY` + `scrub`, nodos con `back.out`, cards con reveal.
- `team.ts` — reemplaza el JS vanilla de Team.astro: apertura/cierre del modal con fade de backdrop + `scale 0.95→1`, focus management, cierre con Esc, hover de cards (`data-team-card`).
- `flipcard.ts` — flip 3D con GSAP (click/tap) en `.flip-inner`; bajo `prefers-reduced-motion: reduce` la vuelta se aplica por CSS (`[data-flipped="true"]`).

Convenciones: cada módulo usa `gsap.matchMedia()` (`mm.add("(prefers-reduced-motion: no-preference)")`) para desactivar parallax/flotación/reveals desplazados bajo `reduce`. Selectores basados en atributos `data-*` añadidos en los componentes (nunca en clases utilitarias).

## 6. SEO

- Meta tags base (title, description, OG image) centralizados en `Layout.astro`, recibidos como props desde `index.astro`.
- Un único `<h1>` en toda la página (probablemente en el Hero).
- Jerarquía de headings coherente sección por sección (`h2` para título de sección, `h3` para sub-ítems como nombre de servicio o nombre de miembro del equipo).
- `alt` descriptivo en toda imagen con contenido informativo (fotos de equipo, logos de clientes); `alt=""` en decorativas (blobs, ondas).
- Sitemap y `robots.txt` generados vía integración de Astro cuando el dominio esté definido.

## 7. Accesibilidad

- Contraste de texto verificado contra la paleta, especialmente `#FEDA3D` (amarillo) sobre fondos claros — usarlo como acento de fondo pequeño o para texto oscuro encima, nunca como fondo grande con texto blanco.
- Modal de equipo: trap de foco, cierre con `Esc`, `aria-modal="true"`, foco vuelve al trigger al cerrar.
- FlipCards y ClientBadges deben ser operables por teclado (`tabindex`, `:focus-visible` visible), no solo hover.
- FAQ como acordeón nativo accesible (elementos `<details>/<summary>` o patrón ARIA `aria-expanded` si se hace custom).

## 8. Performance

- Imágenes en formato moderno (`.webp`/`.avif`) vía `astro:assets` donde sea posible; el PNG 3D del hero se optimiza pero se mantiene PNG si necesita transparencia con detalle fino.
- Fuentes con `font-display: swap` y solo los pesos realmente usados.
- GSAP y ScrollTrigger cargados de forma que no bloqueen el render inicial (script con `client:load` o carga diferida según necesidad real de cada sección).
- Blobs/ondas como SVG inline optimizado (sin paths innecesariamente complejos), no como imágenes rasterizadas.

## 9. Manejo de imágenes / dónde van los assets

```
public/images/
├── hero/          # PNG 3D transparente, provisto por el usuario
├── team/          # Fotos de equipo (placeholder hasta tener las reales)
├── clients/       # Logos de clientes (placeholder por ahora)
└── services/      # Si algún servicio necesita ilustración propia
```

Los SVG decorativos (blobs, ondas, círculos) **no** van en `public/`, sino inline dentro de los componentes `ui/Blob.astro`, `ui/Wave.astro`, `ui/DecorativeCircle.astro`, para poder controlar su color vía props/CSS variables (paleta de marca) sin duplicar archivos SVG por cada color.

## 10. Paleta y sistema de diseño

```
#091821  → texto principal / fondos oscuros puntuales
#4E82A2  → color primario
#ACCC8E  → secundario / decoración
#FEDA3D  → acento / CTA (uso limitado, no como color dominante)
#E8EEF1  → fondos suaves
```

Distribución aproximada: ~60% blanco/`#E8EEF1`, ~20% `#091821`, ~10% `#4E82A2`, ~5% `#ACCC8E`, ~5% `#FEDA3D`.

**Sin modo oscuro** en esta versión del sitio — la paleta está pensada para fondo claro.

**Regla de transiciones entre secciones:** ninguna sección termina con un borde/línea recta horizontal. Toda transición usa `Wave.astro` (ondas estáticas) o superposición de `Blob.astro`/`DecorativeCircle.astro`. Esto es una regla de diseño no negociable del proyecto, no un detalle estético opcional.

### 10.1 Design tokens (Tailwind v4, `src/styles/theme.css`)

Los tokens viven en `@theme static` (emisión forzada en `:root`) y generan utilities de Tailwind v4.

**Escala tipográfica** — `font-display` (Dx Figgle) para headings, `font-sans` (Poppins) para cuerpo:

| Token | Tamaño | Uso |
|---|---|---|
| `text-display` | `clamp(3.25rem, 9vw, 5.5rem)` | Hero principal |
| `text-h1` | `clamp(2.5rem, 6vw, 3.75rem)` | Título página / sección destacada |
| `text-h2` | `clamp(2rem, 4.5vw, 2.75rem)` | Título de sección |
| `text-h3` | `clamp(1.5rem, 3vw, 1.875rem)` | Sub-ítems (servicios, equipo) |
| `text-h4` | `1.25rem` | Títulos menores |
| `text-body` | `1.0625rem / 1.7` | Texto de párrafo |
| `text-small` | `0.875rem` | Texto secundario |
| `text-caption` | `0.75rem` | Labels / meta |

**Spacing semántico** — usa el namespace `--spacing-*` (genera `p-section`, `gap-gutter`, etc.):

`section` 7rem (padding vertical de secciones), `block` 4rem (separación entre bloques), `card` 2rem (padding de cards), `gutter` 1.5rem (gap estándar), `tight` 1rem, `nudge` 0.375rem.

**Radios de borde** — `--radius-*` (genera `rounded-*`):

`sm` 0.5rem, `md` 0.75rem, `lg` 1rem, `xl` 1.5rem, `card` 2rem (cards/blobs), `pill` 999px (botones, pills).

**Contenedor:** `max-w-content` = `80rem` (~1280px) para el ancho de página.

Los estilos base (`global.css` → `@layer base`) aplican la escala a elementos semánticos: `h1`→`h4` usan `font-display`, `body/p` usan `font-sans` + `text-ink`. Para marcas concretas de texto dentro de componentes, usar las utilities por token.

### 10.2 Componentes `ui/` (base, sin animación)

| Componente | Props | Notas |
|---|---|---|
| `Button` | `variant?: primary \| secondary`, `href?`, `type?`, `disabled?`, slot para contenido | Render como `<a>` si `href`, si no `<button>`. Pill, focus-visible con outline accent. |
| `SectionTitle` | `eyebrow?`, `title`, `subtitle?`, `align?: left \| center` | `h2` + opcional eyebrow (uppercase) y subtítulo. |
| `Blob` | `color?: primary\|secondary\|accent\|soft\|ink`, `size?` (px), `position?` (clases de posicionamiento), `class?` | SVG inline con `fill: currentColor`, `aria-hidden`; sin animación. |
| `Wave` | `color?`, `flip?` (rota 180º), `class?` | SVG `preserveAspectRatio="none"`, ancho 100%, altura 120; para transiciones entre secciones. |
| `DecorativeCircle` | `color?`, `size?` (px), `ring?` (borde en vez de relleno), `position?`, `class?` | `div` circular, `aria-hidden`. |

## 11. Dependencias

Cualquier dependencia nueva (más allá de Astro, Tailwind, GSAP y lo estrictamente necesario para Content Collections/Zod) debe agregarse acá con: nombre, qué problema resuelve, por qué se eligió sobre alternativas.

| Dependencia | Resuelve | Notas |
|---|---|---|
| astro | Framework base | — |
| tailwindcss | Estilos utilitarios | — |
| gsap | Animaciones + ScrollTrigger | Se integra recién en la fase de animaciones (ver Roadmap) |
| zod | Validación de schemas de contenido | Viene integrado con Astro Content Collections |