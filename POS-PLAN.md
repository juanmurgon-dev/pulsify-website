# Platify POS — Plan de acción

Objetivo: **reemplazar Parrot** en Cremina, por fases, con un POS que además
**alimenta el Análisis de márgenes en vivo** y se conecta con Pedidos y Lealtad
(lo que ningún POS del mercado hace para ti).

## Decisiones (del cuestionario, 23 jul 2026)
| Tema | Decisión | Implicación |
|---|---|---|
| Alcance | Paridad total con Parrot | Proyecto grande → **por fases**, cada fase usable |
| Internet | Rara vez se cae | **POS web** (Next.js/Vercel). Offline = fase futura si hace falta |
| Tarjetas | Sigo con mi terminal | El POS **registra** el método; no procesa tarjeta (sin comisión nueva) |
| CFDI | No por ahora | Sin timbrado al inicio → arranque simple. Fase aparte cuando se pida |
| Impresora | De red (IP) | Impresión de tickets/comandas por ESC/POS. **Confirmar modelo** |
| Servicio | Mesa + mostrador | Necesita **plano de mesas** y **modo barra** rápido |
| Dolor actual | Lento + no conecta datos | Diferenciador: **rápido** + **datos integrados** con Análisis |

## ⭐ Módulo PRIORITARIO: Recetas + Costeo + Inventario (el "cerebro")
Lo que el usuario nunca ha logrado (por complicado en Parrot/Soft): **recetas y costeo
que se crucen con compras e inventario.** Es el mayor diferenciador y va PRIMERO.

- **Vive en Análisis** (PWA `cifra-dev`), no en el sitio Next.js — ahí están `costos_platillo`,
  `productos_venta`, márgenes, y las views de insumos/compras/proveedores que **ya existen**.
- **Buena noticia:** la app ya saca el **precio de cada insumo de tus tickets de compra**
  (última compra). Falta solo el eslabón: **RECETAS** (platillo → insumos + cantidad).
- Con recetas: costo por platillo **automático** (Σ cantidad × precio insumo) → alimenta el margen;
  inventario = compras − (ventas × receta); merma = teórico − conteo físico.
- Decisiones del usuario: recetas **desde cero** (precargo la lista de platillos), **algunas
  preparaciones base** (sub-recetas), **todo junto con inventario**, **costeo por última compra**.
- Esquema nuevo: `supabase/recetas-inventario.sql` (tablas `recetas`, `inventario_conteos`,
  `inventario_ajustes`). `costos_platillo` pasa de manual a **calculado** por la app.
- Vistas a construir en `cifra-dev` (staging primero): **Recetas** (nueva, el eslabón),
  y enriquecer **Inventario** (stock teórico + conteo/merma) y **Margen** (costo desde receta).

## Arquitectura
- **Front:** POS web en `/pos` (Next.js, misma app Platify), instalable como app en la tablet.
- **Datos:** **Supabase** (Postgres). A diferencia de Pedidos/Lealtad (que viven en Stripe),
  el POS necesita estado transaccional mutable y multi-dispositivo (mesas abiertas, comandas,
  cortes) → base de datos de verdad. Ya usas Supabase en Cremina/Platify, así que es el lugar natural.
- **Integración (el diferenciador):** cada venta escribe en las MISMAS tablas que lee tu
  **Análisis** (ventas/productos/variantes/modificadores/costos) → tus márgenes se actualizan solos.
  Cobro puede sumar **sello de Lealtad** y aplicar **descuento de plaza**. Los **Pedidos** en línea
  entran al POS como una comanda más.
- **Impresión:** impresora de red por IP.
  - Si es **Epson** (ePOS-Print), el POS imprime **directo desde el navegador** por la red local. Ideal.
  - Si es otra marca, se pone un **mini-puente de impresión** (una PC/Raspberry en la red) que recibe
    el ticket y lo manda a la impresora. Se decide al confirmar el modelo.
- **Pagos:** el POS registra forma de pago (efectivo con cálculo de cambio, tarjeta = tu terminal,
  transferencia). El **corte de caja** cuadra el efectivo. (Opción futura: cobro Stripe.)

## Fases

### Fase 0 — Fundamentos
- Esquema Supabase: `pos_productos`, `pos_categorias`, `pos_mesas`, `pos_ordenes`,
  `pos_orden_items`, `pos_pagos`, `pos_turnos`, `pos_usuarios` (PIN + rol).
- Cascarón `/pos` con login por **PIN** de empleado y branding Platify.
- Cargar el **menú real de Cremina** en `pos_productos` (reusando lo que ya tenemos).

### Fase 1 — Barra: vender, cobrar, ticket y corte  *(MVP operable)*
- Pantalla de venta rápida (tocar productos → cuenta, con modificadores/variantes).
- Cobro: efectivo (calcula cambio), tarjeta (registra), transferencia.
- **Imprime ticket** en la impresora de red.
- **Corte de caja**: apertura de turno, ventas del turno, cierre (efectivo esperado vs contado).
- → Con esto ya pueden operar el mostrador.

### Fase 2 — Mesas y comandas
- Plano de mesas (abrir/cerrar, ver ocupación).
- Comanda a **cocina** (imprime en impresora de cocina o pantalla KDS — reusar `/caja`).
- Dividir cuenta, propina, transferir/juntar mesas.

### Fase 3 — Datos integrados (el porqué de Platify)
- Cada venta → tablas de **Análisis** = márgenes en vivo por platillo.
- Cobro suma **sello de Lealtad** y aplica **descuento de plaza** automáticamente.
- **Pedidos** en línea (Stripe) entran al POS como comanda.

### Fase 4 — Paridad avanzada
- Inventario/insumos (descuento de stock por venta).
- Reportes: por producto, mesero, hora, forma de pago, cortesías/descuentos.
- Roles y permisos (mesero / cajero / admin), cancelaciones con motivo, multi-caja.

### Fase 5 — Extras (cuando se pidan)
- **CFDI** vía PAC (Facturama/Facturapi).
- **Offline** (PWA con datos locales + sincronización) si el internet lo exige.
- Cobro con **Stripe Terminal** si conviene.

## Lo que necesito de ti para arrancar la Fase 0/1
1. **Supabase:** acceso para crear las tablas (te paso el SQL y lo corres, como con `costos_platillo`,
   o me das un token temporal). ¿Mismo proyecto de Cremina o uno nuevo para el POS?
2. **Modelo de la impresora** de red (marca/modelo, ej. "Epson TM-m30") → define cómo imprimimos.
3. **Empleados + PIN** que usarán el POS (nombre y rol: cajero/mesero/admin).
4. Confirmar que el **menú** parte del que ya tenemos (desayunos, comida, café, etc.).

## Estimación (orden de magnitud)
- Fase 0: base y menú.
- Fase 1: MVP de barra usable — la más valiosa para empezar a probar en Cremina.
- Fases 2–4: el grueso de la paridad, iterando con tu uso real.
Cada fase se entrega y se prueba en Cremina antes de seguir.
