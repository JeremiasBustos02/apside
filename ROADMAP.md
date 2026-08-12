# Roadmap — Apside

Cada fase se completa (y se revisa) antes de pasar a la siguiente. GSAP no se toca hasta la Fase 13.

## PHASE 0 — Setup
- [x] Inicializar proyecto Astro + Tailwind
- [x] Configurar TypeScript
- [x] Descargar y agregar Poppins y Dx Figgle Free Font a `public/fonts/`
- [x] Declarar `@font-face` en `src/styles/fonts.css`
- [x] Definir variables de color de la paleta en `tailwind.config.mjs`
- [x] Crear estructura de carpetas según `ARCHITECTURE.md`
- [x] Configurar `src/content.config.ts` con los schemas de las colecciones

## PHASE 1 — Design system
- [x] Definir escala tipográfica (tamaños de `h1` a `p`, ambas fuentes)
- [x] Definir escala de spacing y radios de borde
- [x] Construir `Button.astro` (variantes primario/secundario)
- [x] Construir `SectionTitle.astro`
- [x] Construir `Blob.astro`, `Wave.astro`, `DecorativeCircle.astro` (versiones base, sin animación)

## PHASE 2 — Layout
- [x] `Layout.astro` con meta tags base
- [x] `Navbar.astro` (con nombre "Apside" en Dx Figgle, sin logo por ahora)
- [x] `Footer.astro` (estructura fat footer, sin contenido final todavía)
- [x] Armar `index.astro` con las secciones vacías en orden

## PHASE 3 — Hero
- [x] Contenido en `src/content/sections/hero.ts` ("Apside" / "Tus ideas, nuestra misión.")
- [x] Maquetar Hero.astro con texto + espacio para el PNG 3D
- [x] Integrar imagen 3D (placeholder hasta que el usuario la elija)
- [x] Ondas de transición hacia la siguiente sección

## PHASE 4 — Why Apside
- [x] Contenido en `src/content/sections/why-apside.ts`
- [x] Layout texto + ilustración 3D flotando
- [x] Blobs decorativos detrás de la ilustración

## PHASE 5 — Team
- [x] Entradas de colección `team/` (Jeremías Bustos, Gerónimo Lombardo)
- [x] `TeamCard.astro` (foto placeholder, nombre, puesto)
- [x] `TeamModal.astro` (bio, año de ingreso, características)
- [x] Apertura/cierre del modal (sin animación GSAP todavía, solo funcional)

## PHASE 6 — Clients
- [x] Entradas de colección `clients/` (placeholders)
- [x] `ClientBadge.astro` con bordes redondeados
- [x] Link a la página del cliente (placeholder `#` mientras no exista)
- [x] Estado hover (nombre + "Visitar sitio →")

## PHASE 7 — Process
- [x] Entradas de colección `process/` (Contacto, Análisis y diseño, Implementación, Monitoreo y soporte)
- [x] `Timeline.astro` (versión estática, sin progreso animado todavía)
- [x] `ProcessCard.astro` (step, título, descripción)
- [x] Layout responsive (dos columnas desktop → stack mobile)

## PHASE 8 — Why choose us
- [x] Entradas de colección `why-us/` (Compromiso y confianza, Seguridad, Creatividad)
- [x] `FlipCard.astro` (estado frontal + estado con descripción)
- [x] Blobs/formas decorativas propias por card

## PHASE 9 — Services
- [x] Entradas de colección `services/` (Landing Page, Web completa, Sistema a medida)
- [x] `ServiceCard.astro` respondiendo: qué es / para quién / qué problema resuelve / qué incluye / qué mejora
- [x] Copy revisado con foco en venta, no solo descripción técnica

## PHASE 10 — FAQ
- [x] Entradas de colección `faq/` (5–7 preguntas)
- [x] `FaqItem.astro` como acordeón accesible

## PHASE 11 — Contact
- [x] Contenido en `src/content/sections/contact.ts`
- [x] Formulario (nombre, email, qué necesitás, mensaje)
- [x] Enlaces directos (WhatsApp, email, Instagram, LinkedIn)
- [x] Formulario configurado para enviar a Formspree (`action="https://formspree.io/f/YOUR_FORM_ID"`)

## PHASE 12 — Footer
- [x] Contenido en `src/content/sections/footer.ts`
- [x] Columnas: Servicios / Apside / Contacto
- [x] "APSIDE" en tamaño grande con Dx Figgle
- [x] Año dinámico en el copyright

## PHASE 13 — Animations (GSAP)
- [x] Instalar GSAP + ScrollTrigger, documentar en `ARCHITECTURE.md`
- [x] Hero: entrada, flotación, parallax
- [x] Why Apside: reveal on scroll
- [x] Team: hover de card, animación de apertura de modal
- [x] Process: progreso de timeline ligado a scroll
- [x] Why Choose Us: flip cards
- [x] Reveal on scroll en el resto de las secciones
- [x] Parallax en elementos decorativos
- [x] Soporte para `prefers-reduced-motion`

## PHASE 14 — Responsive
- [x] Revisión completa mobile / tablet / desktop, sección por sección
- [x] Ajuste especial de Process en mobile (timeline simplificada)
- [x] Ajuste de tamaño/posición del PNG 3D en mobile

## PHASE 15 — SEO
- [ ] Meta tags finales (title, description, OG)
- [ ] Verificar jerarquía de headings
- [ ] `alt` en todas las imágenes
- [ ] Sitemap y `robots.txt`

## PHASE 16 — Performance
- [ ] Auditoría Lighthouse
- [ ] Optimización de imágenes (`astro:assets`, formatos modernos)
- [ ] Revisión de peso de fuentes y GSAP en el bundle final

## PHASE 17 — Final QA
- [ ] Revisión de contraste de colores (accesibilidad)
- [ ] Navegación completa por teclado
- [ ] Revisión de copy final (sin lorem ipsum ni placeholders de texto)
- [ ] Chequeo cross-browser
- [ ] Deploy a producción