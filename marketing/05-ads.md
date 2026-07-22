# Plan de anuncios pagados — Meta + TikTok Ads

**PULSIFY** — app de análisis financiero para restaurantes · Oferta beta $100 MXN/mes (precio de fundador) · Landing: https://pulsify-website-six.vercel.app · @pulsify.mx

---

## 1. Estructura de campañas

### Requisito técnico ANTES de gastar un peso

> **No optimices a "compra" sin tracking.** Necesitas instalado:
> - **Meta Pixel** en la landing + API de Conversiones (CAPI) si puedes.
> - **TikTok Pixel + eventos** (Events API) en la landing.
> - **Evento de compra desde Stripe**: cada suscripción exitosa en `/checkout` debe disparar un evento `Purchase` (con valor $100 MXN) hacia Meta y TikTok. Sin este evento, el algoritmo no aprende a quién venderle y estarás pagando clics tontos.
>
> Mientras el Pixel no tenga ~30-50 compras/semana, **NO** podrás optimizar bien a conversión. Por eso arrancamos calentando.

### Fases

| Fase | Duración | Objetivo Meta | Objetivo TikTok | Qué buscas |
|---|---|---|---|---|
| **F0 — Aprendizaje del Pixel** | Semana 1-2 | Tráfico / Interacción | Tráfico / Alcance | Meter visitantes a la landing, poblar el Pixel, ver qué creativo engancha (CTR, ThruPlay, costo por clic) |
| **F1 — Conversión inicial** | Semana 2-4 | Ventas (optimizado a `Purchase`; si hay pocas, usa `InitiateCheckout` / `AddToCart`) | Conversiones web (`CompletePayment`; fallback `InitiateCheckout`) | Primeras suscripciones, encontrar el CPA (costo por adquisición) real |
| **F2 — Retargeting siempre activo** | Desde semana 2 | Ventas (público de retargeting) | Conversiones (retargeting) | Cerrar a los que visitaron y no compraron |
| **F3 — Escalar** | Mes 2+ | Ventas + Lookalikes | Conversiones + Lookalikes | Duplicar ganadores, abrir Lookalike de compradores |

### Cómo escalar (regla práctica)

- **Escalado vertical:** sube el presupuesto del adset ganador **+20-30% cada 3-4 días**. Subir de golpe reinicia el aprendizaje.
- **Escalado horizontal:** duplica el adset ganador hacia un público nuevo (otro interés, un Lookalike) en vez de exprimir uno solo.
- **CBO (presupuesto a nivel campaña):** úsalo hasta el Mes 2, cuando ya tengas 3+ públicos validados. Al inicio deja el presupuesto a nivel adset (ABO) para controlar cada público.

---

## 2. Públicos / targeting (México)

**Geo:** todo México. **Idioma:** español. **Edad base:** 25-55 (dueño/operador típico). **Colocaciones:** Advantage+ / automáticas al inicio; luego separa Feed vs Reels/Stories si el creativo vertical rinde mejor.

### Conjunto A — Frío por intereses (el caballo de batalla)

Combina intereses de negocio + hostelería. En Meta arma capas (interés de restaurante **Y** perfil de dueño):

- **Perfil de dueño/negocio:** Propietarios de pequeñas empresas, Emprendimiento, Pequeña y mediana empresa (PYME), Administración de empresas, Franquicias.
- **Restaurantes/hostelería:** Restaurantes, Industria restaurantera, Food truck, Cafetería, Gastronomía, Chef, Cocina.
- **Software/operación:** Software de punto de venta (POS), Toast/Square/Clip (según disponibilidad), Contabilidad, QuickBooks, Software empresarial, Inventario.
- **Comportamiento:** Administradores de páginas de Facebook (dueños de negocio), Pequeños empresarios.
- Edad: 28-55.

### Conjunto B — Lookalike (a futuro, cuando tengas datos)

- **LAL 1% de compradores** (Purchase del Pixel) — el más potente; actívalo al llegar a ~100 compras.
- **LAL 1-3% de visitantes de landing** o de video-viewers (75%) — úsalo antes, mientras juntas compradores.
- **LAL de tu lista de clientes/beta** (sube CSV a Meta) si ya tienes emails.
- Edad: deja que el sistema decida (25-55).

### Conjunto C — Retargeting (siempre encendido)

- Visitantes de la landing últimos **30 días** que **NO** compraron (excluye `Purchase`).
- `InitiateCheckout` sin `Purchase` (carrito abandonado) — el público más caliente, mensaje directo al precio $100.
- Engagers de Instagram/Facebook 365 días (vieron perfil, guardaron, comentaron).
- Video-viewers 50-75% de tus ads.
- En TikTok: engagers del perfil + visitantes web + video-viewers.

---

## 3. Presupuesto de arranque (MXN)

| Concepto | Sugerido |
|---|---|
| **Diario Meta (frío F0/F1)** | $150–$200/día |
| **Diario Meta (retargeting)** | $60–$80/día |
| **Diario TikTok** | $130 (mínimo recomendado por adset para salir de aprendizaje) |
| **Total diario arranque** | ~$350–$400/día |
| **Prueba total mínima** | **$7,000–$8,000 MXN en 14 días** (para tener datos con qué decidir) |

**Reparto sugerido:** 60% Meta frío · 20% Meta retargeting · 20% TikTok (Meta suele convertir más barato en B2B/dueños; TikTok gana en volumen y video barato).

### Regla simple apagar / escalar

- **APAGAR un anuncio si:** gastó **~2-3x tu precio objetivo por compra sin una sola conversión** (ej. si tu CPA meta es $150, corta al llegar a ~$400-$450 gastados en ese ad sin venta), **o** CTR (link) < 0.8% después de 1,000-1,500 impresiones. Creativo muerto.
- **DEJAR CORRER:** aunque no te guste, no toques un adset en **aprendizaje** (primeras 48-72h / <50 eventos). Matar antes de tiempo es el error #1.
- **ESCALAR:** si un ad trae compras a CPA rentable (idealmente **CPA ≤ 2-3 meses de suscripción**, o sea ≤ $200-$300 con LTV en mente) y estable 3+ días, súbele +20-30% y duplícalo a un público nuevo.

> Ojo con el LTV: $100/mes suena poco, pero si el cliente se queda 8-12 meses, puedes pagar bien por adquirirlo. Piensa en CPA vs LTV, no en la primera mensualidad.

---

## 4. Anuncios — 6 variantes (Meta + adaptación TikTok)

> Los 6 aplican a Instagram/Facebook. Cada uno trae su versión TikTok (más cruda, hablada a cámara, sin apariencia de "anuncio"). Formato vertical 9:16 para Reels/Stories/TikTok; cuadrado 1:1 o 4:5 para Feed.

---

### Variante 1 — Dolor de margen ("no sabes cuánto ganas")

- **Ángulo:** dolor de margen / ceguera financiera.
- **Primary text:**
  > Vendes todos los días… ¿pero sabes cuánto GANAS de verdad por platillo?
  > La mayoría de los dueños no. PULSIFY te lo muestra en segundos: margen real, punto de equilibrio y cuál platillo te está dejando dinero (o quitándotelo).
  > Beta a $100/mes. Cancela cuando quieras.
- **Headline:** ¿Cuánto ganas de verdad?
- **Descripción:** Margen real por platillo. Pruébalo.
- **CTA:** Más información
- **Concepto (video 9:16):** Pantalla del panel de PULSIFY con la gráfica de margen por platillo llenándose. **Texto en pantalla:** "Tu ticket dice $180… tu margen dice otra cosa."
  - **Primeros 3s:** mano cerrando una caja registradora / ticket saliendo, corte al KPI grande **"MARGEN 62%"** apareciendo. Voz: "Vender no es ganar."

---

### Variante 2 — Excel vs PULSIFY

- **Ángulo:** Excel/cuaderno vs herramienta real.
- **Primary text:**
  > ¿Sigues sacando tus números en Excel a las 11 de la noche?
  > PULSIFY calcula margen por platillo, punto de equilibrio y alertas solo. Cargas tus ventas y ves cuánto ganas DE VERDAD. Sin fórmulas rotas.
  > $100/mes en beta. Precio de fundador congelado.
- **Headline:** Adiós al Excel del restaurante
- **Descripción:** Tus números, claros y al instante.
- **CTA:** Más información
- **Concepto (imagen o video split-screen):** Izquierda: Excel caótico, celdas en rojo, #REF!. Derecha: panel limpio de PULSIFY con KPI 62%. **Texto en pantalla:** "Excel / PULSIFY".
  - **Primeros 3s (video):** zoom a una hoja de Excel un desmadre → swipe → dashboard ordenado. Voz: "Deja de adivinar tus números."

---

### Variante 3 — El platillo que pierde dinero (alerta "sopa 38%")

- **Ángulo:** platillo que pierde dinero / la alerta.
- **Primary text:**
  > Tienes un platillo que se vende mucho… y te deja casi nada.
  > PULSIFY te avisa cuando un platillo baja de margen. Ejemplo real: "Sopa — margen 38% ⚠️". Lo detectas hoy, no cuando ya perdiste el mes.
  > Beta $100/mes. Cancela cuando quieras.
- **Headline:** Este platillo te cuesta dinero
- **Descripción:** Alertas cuando baja el margen.
- **CTA:** Más información
- **Concepto (video 9:16):** Panel con lista de platillos; de repente entra la notificación roja **"⚠️ Sopa — margen 38%"** con vibración/sonido. **Texto en pantalla:** "¿Cuál de tus platillos te está robando?"
  - **Primeros 3s:** plato humeante bonito → PUM, sello rojo encima "PIERDE DINERO". Voz: "Se ve rico. Pero mira el margen."

---

### Variante 4 — Urgencia / precio fundador $100

- **Ángulo:** urgencia + precio de fundador.
- **Primary text:**
  > $100 al mes. Ese es el precio de fundador de PULSIFY… mientras dure la beta.
  > Entras hoy y tu precio se CONGELA aunque el plan suba después. Margen por platillo, punto de equilibrio y tu "mina de oro" identificada.
  > Cancela cuando quieras. Pago seguro con tarjeta.
- **Headline:** $100 congelados de por vida
- **Descripción:** Precio de fundador solo en beta.
- **CTA:** Comprar
- **Concepto (imagen o video):** Precio grande **"$100/mes"** con un candado cerrándose encima y sello "PRECIO FUNDADOR — CONGELADO". Debajo, mini vista del dashboard.
  - **Primeros 3s (video):** contador/precio subiendo $100 → $199 → $299 y de golpe un candado lo detiene en $100. Voz: "Congela tu precio antes de que suba."

---

### Variante 5 — Testimonial / caso ("mina de oro")

- **Ángulo:** testimonial / caso de descubrimiento.
- **Primary text:**
  > "Pensaba que mi platillo estrella eran las costillas. PULSIFY me mostró que mi verdadera mina de oro eran los tacos: 71% de margen."
  > Descubre cuál platillo te hace ganar más y empújalo. Ya funciona, en beta a $100/mes.
  > Cancela cuando quieras.
- **Headline:** Encuentra tu mina de oro
- **Descripción:** El platillo que más te deja.
- **CTA:** Más información
- **Concepto (video testimonial 9:16):** Dueño/a de restaurante hablando a cámara en su local, se intercala el panel señalando el platillo top con etiqueta **"MINA DE ORO — 71%"**. **Texto en pantalla:** "Su platillo más rentable no era el que creía."
  - **Primeros 3s:** persona real: "Llevaba 3 años empujando el platillo equivocado…" (corte a dashboard).

---

### Variante 6 — "Vendes lleno pero no te queda"

- **Ángulo:** lleno pero sin utilidad / punto de equilibrio.
- **Primary text:**
  > El restaurante lleno… y a fin de mes no te queda nada. ¿Te suena?
  > PULSIFY te dice tu punto de equilibrio en tiempo real y qué platillos te están bajando la utilidad. Llenar mesas no es ganar dinero.
  > Beta $100/mes. Empieza hoy.
- **Headline:** Lleno pero no te queda
- **Descripción:** Punto de equilibrio en tiempo real.
- **CTA:** Más información
- **Concepto (video 9:16):** Timelapse de restaurante a reventar → corte a la mano contando poco efectivo. Luego el panel con **"PUNTO DE EQUILIBRIO"** y una barra que apenas lo cruza. **Texto en pantalla:** "Lleno ≠ Rentable."
  - **Primeros 3s:** mesero cargando platos entre mesas full. Voz: "Estás lleno todos los días… ¿y por qué no te queda?"

---

### Adaptación TikTok (aplica a las 6)

- **Formato:** 9:16 nativo, grabado con celular, sin "cara de anuncio". Nada de música corporativa: usa audios/trends del momento.
- **Estructura ganadora:** hook hablado en los primeros 2s → problema → mostrar la app grabando la pantalla del cel → precio $100 → "link en el perfil / da clic". Total 15-30s.
- **Estilo:** POV del dueño ("POV: descubres qué platillo te está robando"), talking-head crudo, o screen-recording narrado. Subtítulos SIEMPRE (mayoría ve sin sonido).
- **CTA TikTok:** "Más información" o "Comprar" en el botón; refuerza en pantalla y en voz.
- **Los que mejor migran a TikTok:** Variante 3 (alerta sopa 38%), Variante 5 (testimonial) y Variante 6 (lleno pero no te queda).

---

## 5. Naming y tracking

### Convención de nombres

**Campaña:**
`[Plataforma]_[Objetivo]_[Fase]_[Fecha]`
→ `MET_Ventas_F1_2026-07`

**Adset / Grupo de anuncios:**
`[Publico]_[Detalle]_[Edad]_[Colocacion]`
→ `Frio_InteresRest_28-55_Reels` · `RTG_VisitLP30d_Todas` · `LAL1_Compradores_Auto`

**Anuncio:**
`[Angulo]_[Formato]_[Variante]_[Version]`
→ `Margen_Video_V1_a` · `Excel_Imagen_V2_b` · `Sopa38_Video_V3_a`

> Mantén las variantes A/B con el MISMO nombre base para leer rápido qué ángulo gana.

### UTMs para la landing

Base: `https://pulsify-website-six.vercel.app/?`

| Parámetro | Meta | TikTok |
|---|---|---|
| `utm_source` | `facebook` / `instagram` | `tiktok` |
| `utm_medium` | `paid_social` | `paid_social` |
| `utm_campaign` | `{{campaign.name}}` | usa nombre de campaña |
| `utm_content` | `{{ad.name}}` | usa nombre de anuncio |
| `utm_term` | `{{adset.name}}` | usa nombre de adset |

**Ejemplo Meta (usa macros dinámicos):**
```
https://pulsify-website-six.vercel.app/?utm_source=instagram&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
```
**Ejemplo TikTok:**
```
https://pulsify-website-six.vercel.app/?utm_source=tiktok&utm_medium=paid_social&utm_campaign=TIK_Conv_F1_2026-07&utm_content=Sopa38_Video_V3_a
```

---

## 6. Tres tips anti-errores de novato

1. **No mates ads antes de tiempo.** El algoritmo necesita 48-72h y ~50 eventos para salir de "aprendizaje". Si apagas al día 1 porque "no vendió", nunca vas a saber qué funciona. Deja correr, respeta la regla de gasto de la sección 3.

2. **El creativo es el 80% del resultado, no el targeting.** No pases horas afinando intereses con un video aburrido. Un mal hook en los primeros 3s tira toda la campaña. Prueba 3-4 ángulos distintos (dolor, precio, testimonial) antes de tocar públicos. Renueva creativos cada 2-3 semanas para evitar fatiga (frecuencia > 2.5 = ya cansaste al público).

3. **No optimices a "compra" sin datos ni sin el Pixel bien puesto.** Si arrancas en "Ventas" con el Pixel en cero, Meta/TikTok gastan a ciegas. Calienta primero con tráfico/interacción, confirma que el evento `Purchase` de Stripe llega bien (pruébalo con una compra real de $100 y revísalo en el Administrador de eventos), y hasta entonces pasa a conversión. **Un peso gastado sin tracking es un peso que no puedes leer.**
