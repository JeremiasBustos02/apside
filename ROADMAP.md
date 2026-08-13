# Roadmap — Apside

Cada fase se completa (y se revisa) antes de pasar a la siguiente. GSAP no se toca hasta la Fase 13.

## PHASE 0 — Setup
- [ ] Inicializar proyecto Astro + Tailwind
- [ ] Configurar TypeScript
- [ ] Descargar y agregar Poppins y Dx Figgle Free Font a `public/fonts/`
- [ ] Declarar `@font-face` en `src/styles/fonts.css`
- [ ] Definir variables de color de la paleta en `tailwind.config.mjs`
- [ ] Crear estructura de carpetas según `ARCHITECTURE.md`
- [ ] Configurar `src/content/config.ts` con los schemas de las colecciones

## PHASE 1 — Design system
- [ ] Definir escala tipográfica (tamaños de `h1` a `p`, ambas fuentes)
- [ ] Definir escala de spacing y radios de borde
- [ ] Construir `Button.astro` (variantes primario/secundario)
- [ ] Construir `SectionTitle.astro`
- [ ] Construir `Blob.astro`, `Wave.astro`, `DecorativeCircle.astro` (versiones base, sin animación)

## PHASE 2 — Layout
- [ ] `Layout.astro` con meta tags base
- [ ] `Navbar.astro` (con nombre "Apside" en Dx Figgle, sin logo por ahora)
- [ ] `Footer.astro` (estructura fat footer, sin contenido final todavía)
- [ ] Armar `index.astro` con las secciones vacías en orden

## PHASE 3 — Hero
- [ ] Contenido en `src/content/sections/hero.ts` ("Apside" / "Tus ideas, nuestra misión.")
- [ ] Maquetar Hero.astro con texto + espacio para el PNG 3D
- [ ] Integrar imagen 3D (placeholder hasta que el usuario la elija)
- [ ] Ondas de transición hacia la siguiente sección

## PHASE 4 — Why Apside
- [ ] Contenido en `src/content/sections/why-apside.ts`
- [ ] Layout texto + ilustración 3D flotando
- [ ] Blobs decorativos detrás de la ilustración

## PHASE 5 — Team
- [ ] Entradas de colección `team/` (Jeremías Bustos, Gerónimo Lombardo)
- [ ] `TeamCard.astro` (foto placeholder, nombre, puesto)
- [ ] `TeamModal.astro` (bio, año de ingreso, características)
- [ ] Apertura/cierre del modal (sin animación GSAP todavía, solo funcional)

## PHASE 6 — Clients
- [ ] Entradas de colección `clients/` (placeholders)
- [ ] `ClientBadge.astro` con bordes redondeados
- [ ] Link a la página del cliente (placeholder `#` mientras no exista)
- [ ] Estado hover (nombre + "Visitar sitio →")

## PHASE 7 — Process
- [ ] Entradas de colección `process/` (Contacto, Análisis y diseño, Implementación, Monitoreo y soporte)
- [ ] `Timeline.astro` (versión estática, sin progreso animado todavía)
- [ ] Layout responsive (dos columnas desktop → stack mobile)

## PHASE 8 — Why choose us
- [ ] Entradas de colección `why-us/` (Compromiso y confianza, Seguridad, Creatividad)
- [ ] `FlipCard.astro` (estado frontal + estado con descripción)
- [ ] Blobs/formas decorativas propias por card

## PHASE 9 — Services
- [ ] Entradas de colección `services/` (Landing Page, Web completa, Sistema a medida)
- [ ] `ServiceCard.astro` respondiendo: qué es / para quién / qué problema resuelve / qué incluye / qué mejora
- [ ] Copy revisado con foco en venta, no solo descripción técnica

## PHASE 10 — FAQ
- [ ] Entradas de colección `faq/` (5–7 preguntas)
- [ ] `FaqItem.astro` como acordeón accesible

## PHASE 11 — Contact
- [ ] Contenido en `src/content/sections/contact.ts`
- [ ] Formulario (nombre, email, qué necesitás, mensaje)
- [ ] Enlaces directos (WhatsApp, email, Instagram, LinkedIn)
- [ ] Definir a dónde envía el formulario (servicio de forms / backend / mailto)

## PHASE 12 — Footer
- [ ] Contenido en `src/content/sections/footer.ts`
- [ ] Columnas: Servicios / Apside / Contacto
- [ ] "APSIDE" en tamaño grande con Dx Figgle
- [ ] Año dinámico en el copyright

## PHASE 13 — Animations (GSAP)
- [ ] Instalar GSAP + ScrollTrigger, documentar en `ARCHITECTURE.md`
- [ ] Hero: entrada, flotación, parallax
- [ ] Why Apside: reveal on scroll
- [ ] Team: hover de card, animación de apertura de modal
- [ ] Process: progreso de timeline ligado a scroll
- [ ] Why Choose Us: flip cards
- [ ] Reveal on scroll en el resto de las secciones
- [ ] Parallax en elementos decorativos
- [ ] Soporte para `prefers-reduced-motion`

## PHASE 14 — Responsive
- [ ] Revisión completa mobile / tablet / desktop, sección por sección
- [ ] Ajuste especial de Process en mobile (timeline simplificada)
- [ ] Ajuste de tamaño/posición del PNG 3D en mobile

## PHASE 15 — Revisión y refinamiento visual (Ronda 1)

### General
- [ ] Agregar contenedor con `max-width` y padding lateral consistente en toda la página (ver ARCHITECTURE.md, "Contenedor y ancho máximo")
- [ ] Redefinir el ritmo de fondos según el mapa de bloques de ARCHITECTURE.md (cambia cada 2 secciones, incluye el oscuro `#091821`)

### Navbar
- [ ] Centrar los labels de navegación
- [ ] Aplicar el mismo padding/margin lateral general (dentro del contenido del navbar)
- [ ] Agregar botón "Contactanos" con flecha al final
- [ ] Mismo color/fondo (oscuro + blur) en ambos estados, ya no hay transición de color
- [ ] Estado scroll=0: header ancho completo, pegado al borde superior, sin margin, esquinas sin redondear (o radio mínimo)
- [ ] Estado con scroll: flotante (margin, despegado de bordes, esquinas redondeadas) — ya funcionaba bien, mantener igual
- [ ] Animar la transición de layout (margin/border-radius) ligada al scroll entre ambos estados
- [ ] Eliminar el scrim del Hero (ya no es necesario, el navbar es opaco desde el inicio)

### Hero
- [ ] Quitar los dos botones (CTA primario/secundario)
- [ ] Quitar el placeholder de imagen 3D actual (queda a la espera de la imagen final)
- [ ] Centrar título y descripción
- [ ] Agregar blobs pequeños flotantes como capa decorativa adicional

### Hero → Why Apside
- [ ] Reemplazar el pin+crossfade por fade-out con scrub sin pin (ver ARCHITECTURE.md): Hero se desvanece/achica al salir de pantalla; Why Apside usa el reveal-on-scroll estándar, sin animación especial atada al Hero
- [ ] Confirmar que ambas secciones comparten exactamente el mismo color de fondo (bloque 1 del mapa de fondos)

### Why Apside
- [ ] Quitar el texto "Creamos lo que imaginás"
- [ ] "¿Por qué Apside?" pasa a ser el título de la sección (mismo color actual)
- [ ] Agregar animación de flotación al placeholder de la ilustración 3D
- [ ] Quitar botón "Conocé nuestro proceso"

### Team
- [ ] Fondo oscuro (bloque 2 del mapa de fondos)
- [ ] Reducir tamaño de las cards
- [ ] Quitar las características/aptitudes de cada miembro (evaluar si se elimina el campo `traits` del schema o se deja sin mostrar)

### Clients
- [ ] Agregar campo `description` al schema de la colección (ver ARCHITECTURE.md)
- [ ] Mostrar la descripción corta debajo de cada logo (ej. "Landing page para metalúrgica")

### Process — Rediseño 4: Timeline horizontal
_(Reemplaza al rediseño 3 "Storytelling con pin" — ver ARCHITECTURE.md para el detalle completo.)_
- [ ] Desktop: timeline horizontal — 4 pasos en fila unidos por una línea horizontal, sin pin, en flujo normal
- [ ] Número fantasma por paso en Dx Figgle (semi-transparente, tipográfico, ancla visual del paso)
- [ ] Color por paso rotando entre `--color-primary` / `--color-secondary` / `--color-ink` (sin accent)
- [ ] Título + descripción directos sobre el fondo, sin card ni contenedor propio (ProcessCard.astro eliminado, ya no aplica el concepto de card)
- [ ] Línea de progreso horizontal con ScrollTrigger en modo `scrub` (sin pin): relleno de la línea + resaltado del número del paso actual al completarse su tramo
- [ ] Mobile: versión vertical compacta — línea vertical corta estática, pasos apilados con spacing reducido (sección notablemente más corta)
- [ ] Reduced motion: estático, números legibles, línea base sin relleno animado

### Why Choose Us
- [ ] Cambiar proporción de las cards: más altas que anchas

### Services
- [ ] Rediseñar `ServiceCard.astro`: menos información visible, diseño más simple y atractivo
- [ ] Definir 2-3 referencias visuales con el usuario antes de reimplementar

### FAQ
- [ ] Separar visualmente cada `FaqItem` (actualmente se perciben como un bloque único)

## PHASE 16 — SEO
- [ ] Meta tags finales (title, description, OG)
- [ ] Verificar jerarquía de headings
- [ ] `alt` en todas las imágenes
- [ ] Sitemap y `robots.txt`

## PHASE 17 — Performance
- [ ] Auditoría Lighthouse
- [ ] Optimización de imágenes (`astro:assets`, formatos modernos)
- [ ] Revisión de peso de fuentes y GSAP en el bundle final

## PHASE 18 — Final QA
- [ ] Revisión de contraste de colores (accesibilidad)
- [ ] Navegación completa por teclado
- [ ] Revisión de copy final (sin lorem ipsum ni placeholders de texto)
- [ ] Chequeo cross-browser
- [ ] Deploy a producción