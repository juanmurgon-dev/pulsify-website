# Kit de Marketing — PLATIFY (@platify.mx)

Contenido para lanzar la **beta del Análisis** ($100 MXN/mes) en Instagram y TikTok, campaña nacional (México). Todo listo para producir/copiar.

## Índice
1. [Configuración de cuentas (IG + TikTok)](01-cuentas.md) — nombres, bios, link in bio, highlights, checklist de creación, post fijado.
2. [Estrategia y calendario 30 días](02-estrategia-calendario.md) — objetivos, KPIs, pilares, cadencia y calendario diario.
3. [12 publicaciones de Instagram](03-instagram-posts.md) — carruseles, reels e imágenes con hook, caption, hashtags y guía visual.
4. [10 guiones de TikTok](04-tiktok-guiones.md) — guion escena por escena, hook, CTA, caption, sonido.
5. [Plan de ads pagados (Meta + TikTok)](05-ads.md) — estructura, públicos, presupuesto, 6 variantes de anuncio, tracking.

---

## Brief de marca (fuente de verdad para todo el contenido)

- **Producto:** PLATIFY — app de análisis financiero para restaurantes, **ya funcionando** (en beta). Muestra margen real por platillo, punto de equilibrio en tiempo real, alertas de margen bajo y el platillo más rentable ("mina de oro").
- **Oferta:** BETA **$100 MXN/mes**, precio de fundador (se congela mientras seas beta, sube al salir de beta). Cancela cuando quieras. Pago con tarjeta (Stripe).
- **Landing:** https://platify-website.vercel.app → botón lleva a `/checkout`.
- **Mercado:** todo México, español mexicano general.
- **Audiencia:** dueños/operadores de restaurantes, cafés, taquerías, fondas, food trucks (chicos y medianos) que no saben su margen real.
- **Handle:** @platify.mx (Instagram y TikTok).
- **Paleta:** verde `#0e3a39` · teal `#2ec4b6` · naranja `#ff9f1c` · amarillo `#ffeeb8` · fondo claro/blanco. Tipografías **Sora** (títulos) + **Inter** (cuerpo).
- **Tono:** directo, útil, enfocado en dinero/margen, genera "aha", mexicano y cercano.

---

## Próximos pasos sugeridos
1. **Crear las cuentas** con [01-cuentas.md](01-cuentas.md) (define `hola@platify.mx` y un WhatsApp Business).
2. **Producir el primer lote**: los 3-4 primeros posts/TikToks del [calendario](02-estrategia-calendario.md) para no arrancar en frío.
3. **Diseño**: los mockups del panel de la landing (`components/DashboardMockup.js`) sirven de base visual para creativos.
4. **Antes de pautar ads**: instalar Meta Pixel + TikTok Pixel en la landing y disparar el evento `Purchase` desde Stripe (ver [05-ads.md](05-ads.md), sección 1). Sin eso, la pauta va a ciegas.

> Nota de honestidad: los testimonios/casos ("+$8k/mes", "+18%") son **ejemplos ilustrativos**. Sustitúyelos por casos reales de beta en cuanto los tengas — convierten mucho mejor y evitan problemas.
