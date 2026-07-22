# Programar publicaciones con Meta Business Suite — Platify

Guía para dejar las publicaciones de Instagram **programadas** siguiendo el calendario, sin código. (TikTok se programa aparte desde su propia app; las Historias, a veces solo desde el celular.)

---

## 0. Requisito previo (una sola vez)
1. Tu **Instagram** debe ser cuenta **Business** o **Creator**: en IG → Configuración → **Cuenta** → *Cambiar a cuenta profesional*.
2. Conéctala a una **Página de Facebook** de Platify (si no tienes, créala; es gratis). En IG → Configuración → *Compartir en otras apps* / *Cuentas vinculadas* → **Facebook** → elige la Página.
3. Entra a **https://business.facebook.com** (o la app **Meta Business Suite**) con esa cuenta. Ahí ya verás IG + FB juntos.

---

## 1. Cómo programar cada post (pasos)
1. En Meta Business Suite → menú izquierdo → **Planificador** (Planner) → **Crear publicación**.
2. Arriba, marca dónde publicar: **Instagram** (y Facebook si quieres).
3. **Sube el diseño**: arrastra el PNG desde `public/posts/` (o el que corresponda).
4. **Pega el texto**: caption + hashtags (están en [`public/posts/README.md`](../public/posts/README.md)).
5. Abajo, junto al botón azul, abre la flechita ▾ y elige **Programar**.
6. Pon **fecha y hora** (usa el calendario de abajo).
7. **Programar**. Listo — aparece en el Planner. Repite por cada post.
- **Reels**: en "Crear publicación" elige tipo *Reel*, sube el video, se puede programar igual.
- **Historias**: si no te deja programarlas, súbelas ese día desde el celular (2 min).

> Tip: haz una tanda de 30 min y deja programada toda la semana de una vez.

---

## 2. Mejores horarios (México, hora centro)
- **8:00–10:00 am** (antes de abrir) y **3:00–5:00 pm** (entre comida y cena) → cuando el dueño ve el cel.
- **9:00–11:00 pm** → cuando ya cerró y "hace cuentas". Ideal para contenido de margen/dolor.
- Evita 2–3 pm y 8–9 pm (horas pico de servicio).

---

## 3. Calendario de arranque (con los 5 diseños que ya existen)
Cadencia sostenible para empezar. Los "Día N" los anclas al día que quieras lanzar.

| Día | Hora | Tipo | Diseño | Caption |
|---|---|---|---|---|
| **1** | 9:00 am | Feed + **FIJAR** | `posts/Platify Redes-selection2.png` (Producto/mockup) | README → *selection2* |
| **2** | 4:00 pm | Historia | `posts/Platify Redes-selection4.png` (punto equilibrio) | README → *selection4* |
| **3** | 9:00 am | Feed | `posts/Platify Redes-selection.png` (Frase "vender mucho") | README → *selection.png* |
| **5** | 10:00 am | Feed | `posts/Platify Redes-selection3.png` (Excel) | README → *selection3* |
| **7** | 4:00 pm | Feed | `posts/Platify Redes-selection1.png` (Ad $100) | README → *selection1* |
| **8** | 8:00 pm | Historia | Encuesta "¿Sabes cuánto ganas por tu platillo más vendido?" | `07-mas-contenido.md` → Historia 1 |

> **Post fijado (pinned):** el del Día 1 (Producto) — explica qué es Platify en 5 seg.

---

## 4. Para llenar el resto del mes
Ya tienes **+25 piezas con copy** listas para diseñar y programar:
- Posts nuevos: [`07-mas-contenido.md`](07-mas-contenido.md) (POST 13–27).
- Guiones TikTok e ideas de Historias: mismo archivo.
- Calendario completo de 30 días (temas por día): [`02-estrategia-calendario.md`](02-estrategia-calendario.md).

**Flujo recomendado:** cada semana, produce 3–4 diseños nuevos con Claude Design (usando [`06-brief-diseno.md`](06-brief-diseno.md) + el copy) → súbelos a `public/posts/` → prográmalos en Business Suite. Así el calendario se llena solo, semana a semana.

---

## 5. ¿Y TikTok?
- TikTok **no** se programa desde Meta. Usa el **Planificador nativo de TikTok** (en tiktok.com desde compu: al subir un video, opción *Programar*). Pero primero hay que **grabar los videos** de los guiones (`04-tiktok-guiones.md` y `07-mas-contenido.md`).
- Mientras no haya videos, TikTok queda en pausa; el foco de arranque es Instagram.
