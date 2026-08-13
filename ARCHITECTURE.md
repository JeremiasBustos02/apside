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

Para todo lo que es una lista de ítems del mismo tipo, se usan **Content Collections** con schema validado en `src/content/config.ts` (Zod). Cada ítem es un archivo individual, no un array dentro de un solo archivo.

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
// src/content/config.ts
import { defineCollection, z } from "astro:content";

const team = defineCollection({
  type: "content",
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

**Clientes:** por ahora placeholders. Cada entrada tiene un campo `url` que, cuando exista el cliente real, apunta a la página que se le hizo (`ClientBadge.astro` linkea ahí; mientras no exista, apunta a `#` o queda deshabilitado visualmente). Además, cada entrada tiene un campo `description` con una frase corta sobre el trabajo hecho para ese cliente (ej. "Landing page para metalúrgica"), que se muestra debajo del logo.

```ts
const clients = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    logo: z.string(),
    description: z.string(),   // ej: "Landing page para metalúrgica"
    url: z.string().optional(),
    order: z.number(),
  }),
});
```

## 4. Estrategia responsive

- Mobile-first con breakpoints estándar de Tailwind (`sm`, `md`, `lg`, `xl`).
- **Process (rediseño completo — storytelling con pin):** se descartaron los dos diseños anteriores (timeline vertical con cards alternadas; timeline horizontal con paso "activo" por escala) por sentirse genéricos/tipo documento. Diseño actual:
  - **Desktop:** la sección se fija en pantalla (`ScrollTrigger` con `pin: true`) durante la distancia de scroll de los 4 pasos (wrapper alto, contenedor interno fijo). Cada paso tiene su momento de pantalla completa: número grande en Dx Figgle que escala y se asienta, ícono de línea simple (SVG inline) que se dibuja con animación de trazo (`stroke-dashoffset`), título y descripción con fade + slide, y un glow radial sutil del color asignado al paso detrás del ícono/número. El paso saliente hace la animación inversa mientras entra el siguiente. Todo controlado por un único progreso de scroll (0 a 1), no timelines independientes por paso. Puntos de progreso (4) visibles y clickeables para saltar a un paso puntual.
  - **El fondo general de la sección NO cambia de color por paso** — se mantiene el tono claro que le corresponde según el mapa de bloques de fondo (sección 10). El color por paso vive únicamente en ícono/número/glow, nunca en el fondo de la sección completa. Esto es intencional para no repetir el problema de contraste que tuvimos con el scrim del Navbar/Hero.
  - **Mobile: sin pin.** El scroll-jacking en táctil es riesgoso en UX y en bugs; en su lugar, los 4 pasos se apilan verticalmente en orden normal, cada uno disparando la misma animación de entrada (número, ícono trazado, texto) vía reveal-on-scroll estándar al entrar en viewport, sin fijar la sección.
  - **Reduced motion:** se elimina el pin por completo — los 4 pasos se muestran apilados, estáticos y legibles, sin ninguna animación (ni siquiera el reveal de mobile).
  - Precaución de implementación (aprendida de bugs anteriores): al usar pin, prestar especial atención a `ScrollTrigger.refresh()` después de que carguen fuentes/imágenes (evita cálculos de altura incorrectos), y a la limpieza correcta del contexto GSAP en `matchMedia()` al cambiar entre breakpoints, para que el pin no quede "pegado" o duplicado.
- Las formas orgánicas (`Blob`, `Wave`) se simplifican o reducen en mobile para no afectar performance ni saturar visualmente pantallas chicas.
- El PNG 3D del hero/"¿Por qué Apside?" reduce tamaño y puede reposicionarse (de "flotando al costado" a "detrás del texto, más sutil") en mobile si compite por espacio.

## 5. Animaciones (GSAP)

**Orden de trabajo, sin excepción:** HTML → CSS → responsive → interacciones básicas (CSS) → recién ahí GSAP. No se integra GSAP hasta que la web funcione y se vea completa sin animaciones.

Alcance de GSAP por sección:

- **Navbar:** dos estados, mismo color/fondo en ambos (`#091821` con `backdrop-filter: blur(...)`) — lo que cambia entre uno y otro es el **layout**, no el color, así que no hace falta ningún scrim ni crossfade de color:
  - **Estado inicial (`scroll = 0`):** header "normal" — ancho completo, pegado al borde superior (sin margin), esquinas sin redondear (o con el radio mínimo del sistema de diseño, a definir), mismo contenido y misma posición interna de los elementos (logo, labels, botón "Contactanos") que en el estado flotante.
  - **Estado con scroll:** flotante — se despega de los bordes superior y laterales (margin), esquinas redondeadas.
  - La transición entre ambos es una animación de layout (margin, border-radius, eventualmente `max-width`) ligada al scroll, no de color — al ser el mismo fondo oscuro+blur desde el principio, no hay problema de contraste de texto en ningún punto del recorrido.
  - No hace falta scrim en el Hero: el navbar es opaco/con blur desde `scroll = 0`, así que siempre tiene su propio contraste garantizado, sin depender del fondo de la sección que tenga detrás.
- **Hero → Why Apside (fade-out con scrub, sin pin):** el Hero se desvanece y se achica levemente (`opacity: 1 → 0`, `scale: 1 → 0.95`) a medida que sale de pantalla por scroll, usando `ScrollTrigger` en modo `scrub` (sigue el scroll 1 a 1) pero **sin pin** — el Hero se mueve con el scroll normal, no queda fijo. Why Apside no tiene nada especial atado al Hero: entra con el mismo reveal-on-scroll estándar que el resto de las secciones (ver abajo). Se descartó el patrón de pin + crossfade sincronizado por ser frágil (freezes de layout, huecos/elementos superpuestos durante la transición).
- **Hero:** entrada suave del texto y de la persona 3D; flotación vertical continua sutil; parallax leve al hacer scroll; blobs pequeños flotantes como capa decorativa adicional (parallax propio, distinto al de la ilustración principal).
- **Why Apside:** reveal on scroll del texto; flotación continua sutil de la ilustración/placeholder 3D (misma lógica de flotación que en el Hero, pero independiente).
- **TopoWaves (fondo animado, Hero + WhyApside):** motor propio en canvas (`src/scripts/topo.ts`), sin dependencias externas. Un único `<canvas>` cubre el alto combinado de ambas secciones (no uno por sección), para que se perciba como un fondo continuo. Líneas topográficas con variación orgánica por línea (frecuencia, fase y velocidad continuas por línea vía hash determinístico, más una perturbación de value-noise 1D inline) para evitar el efecto "de reloj" de un patrón uniforme. Profundidad simulada variando grosor/opacidad por línea. Alpha reducido y con degradé horizontal (más tenue detrás de la columna de contenido, más presente en los márgenes), implementado como gradiente lineal horizontal en el `strokeStyle` (ver nota de mecanismo en el highlight abajo). Un solo loop `requestAnimationFrame` compartido, activo solo mientras alguna instancia está en viewport (`IntersectionObserver`), estático si `prefers-reduced-motion: reduce`.
  **Paleta: un único tono** (`--color-primary` / `#4E82A2`) a alpha moderado — un tono claro pero con color propio, distinguible del fondo claro de la sección sin ser oscuro. No una combinación de varios colores de la paleta rotando por línea. Se había pasado transitoriamente a una paleta `mixed` multicolor (soft/primary/secondary/accent) como fix rápido para un bug de contraste, y luego a un tono `ink` oscuro tipo "tinta"; ambos se descartaron a favor de este tono único más claro.
  **Highlight del cursor:** segundo pase de dibujo de las líneas en `--color-ink` (`#091821`) con alpha alto (gradiente radial con stop central en alpha 0.9) y compositing normal (`source-over`), centrado en el cursor con **falloff radial suave** implementado como un gradiente radial en el `strokeStyle` (stops: 0 → alpha 0.9, 1 → transparente; radio `R` ≈ `width * 0.1`): el canvas interpola el gradiente por posición real al rasterizar, así que el decaimiento espacial se aplica punto a punto dentro de cada línea y forma un círculo verdadero alrededor del cursor. Solo se repintan las líneas cuyo centro (`yCenter`) cae dentro del radio (`|yCenter - cursorY| <= R * 1.2`), y su `lineWidth` se amplifica (~1.5×) para dar más presencia. Se descartó el enfoque anterior con `globalCompositeOperation: 'source-atop'`: ese modo de composición limita el alpha resultante al alpha del destino (`Ao = As × Ab`), y como las líneas base son muy tenues (`BASE_ALPHA` bajo), el highlight quedaba limitado a ese techo de opacidad y resultaba imperceptible. El segundo pase no tiene ese techo — pinta las mismas líneas (misma geometría, mismo trazado compartido en `traceLine`) con alpha propio alto, sin depender del alpha base. Borde suave por construcción (falloff radial, no clip duro), coherente con el resto del proyecto que evita bordes duros (blobs, ondas, transiciones). El loop de líneas se extrajo a una función compartida `traceLine(ctx, tc, i, time, lineCount, step)` para que el pase base y el del highlight no se desincronicen.
  **Mecanismo de variación espacial dentro de una línea:** el vigente para todo lo que varía dentro de una misma línea — el degradé horizontal del pase base y el falloff radial del highlight — son **gradientes como `strokeStyle`**. `globalAlpha` en canvas se aplica al rasterizar el trazado completo en el `stroke()` final, no por segmento: setearlo distinto por muestra dentro del loop no produce degradé alguno, y toda la línea se pinta con el último alpha seteado. Ese bug hacía que el highlight solo reaccionara en el borde derecho de la pantalla (el alpha que ganaba era el del sample en `x = width`) y que coloreara la fila completa de una línea en vez de un círculo; también dejaba inerte el degradé horizontal del pase base. Con gradiente como `strokeStyle` el canvas evalúa el color/alpha por posición real al rasterizar. `globalAlpha` se setea una vez por línea (`lineAlpha(depth)`), multiplicando el alpha del gradiente.
  **Interacción con el cursor:** el cursor no deforma la geometría de las líneas (se descartó el enfoque de displacement/bump por resultar visualmente "tosco" incluso con curvas suavizadas). En su lugar, genera un **highlight/glow** como segundo pase de dibujo (ver nota de color arriba): alrededor del cursor se vuelven a trazar las mismas líneas topográficas en ink con alpha alto y falloff radial suave, sin mover geometría. El lerp de seguimiento del cursor se mantiene (0.12). Preferible al displacement porque es suave por definición (no depende de densidad de muestreo ni interpolación de curvas) y mantiene las líneas siempre legibles.
- **Team:** hover/tap en cards; apertura de modal (backdrop fade, scale 0.95→1, foto y texto con leve delay entre sí).
- **Process:** ver detalle completo de diseño arriba (storytelling con pin en desktop, reveal apilado en mobile, sin pin en ningún caso con `prefers-reduced-motion: reduce`). El progreso de scroll dentro del pin es la única fuente de verdad que controla escala del número, trazo del ícono, entrada/salida de texto y puntos de progreso — no hay animaciones independientes por paso.
- **Why Choose Us:** flip cards (hover en desktop, tap en mobile).
- **Secciones en general:** reveal on scroll (fade + translateY sutil), no uniforme para todas — variar levemente para que no se sienta mecánico.
- **Elementos decorativos** (blobs, círculos): parallax a distinta velocidad entre capas.

**Accesibilidad de movimiento:** todo lo anterior debe respetar `prefers-reduced-motion: reduce` — en ese caso se elimina el parallax y la flotación continua, y los reveals pasan a ser instantáneos o con fade muy corto sin desplazamiento.

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

**Sin modo oscuro** en esta versión del sitio — la paleta está pensada para fondo claro, con el oscuro usado puntualmente como fondo de sección (ver "Ritmo de fondos" abajo).

**Regla de transiciones entre secciones:** ninguna sección termina con un borde/línea recta horizontal. Toda transición usa `Wave.astro` (ondas estáticas) o superposición de `Blob.astro`/`DecorativeCircle.astro`. Esto es una regla de diseño no negociable del proyecto, no un detalle estético opcional.

**Contenedor y ancho máximo:** todo el contenido de la página vive dentro de un contenedor con `max-width` (no full-bleed) y padding lateral consistente, definido una sola vez (ej. una clase utilitaria `.container-apside` o el `container` de Tailwind con los breakpoints configurados). El mismo padding lateral se aplica al Navbar. Esto evita que la página se sienta demasiado ancha/expandida en pantallas grandes.

**Ritmo de fondos:** el fondo no alterna en cada sección — cambia cada dos secciones, agrupadas en bloques, para evitar el efecto "cebra" y darle más variedad de tono (incluyendo el color oscuro de la paleta, no solo claros):

| Bloque | Secciones | Fondo |
|---|---|---|
| 1 | Hero, Why Apside | Claro (`#E8EEF1` / blanco) |
| 2 | Team, Clients | Oscuro (`#091821`) |
| 3 | Process, Why Choose Us | Claro (`#E8EEF1` / blanco) |
| 4 | Services, FAQ | Tinte suave de `#4E82A2` o blanco, a definir en la revisión visual |
| 5 | Contact, Footer | Oscuro (`#091821`) |

Este mapa de bloques es la base de partida; se puede ajustar en la fase de revisión visual, pero cualquier cambio se actualiza acá.

## 11. Dependencias

Cualquier dependencia nueva (más allá de Astro, Tailwind, GSAP y lo estrictamente necesario para Content Collections/Zod) debe agregarse acá con: nombre, qué problema resuelve, por qué se eligió sobre alternativas.

| Dependencia | Resuelve | Notas |
|---|---|---|
| astro | Framework base | — |
| tailwindcss | Estilos utilitarios | — |
| gsap | Animaciones + ScrollTrigger | Se integra recién en la fase de animaciones (ver Roadmap) |
| zod | Validación de schemas de contenido | Viene integrado con Astro Content Collections |