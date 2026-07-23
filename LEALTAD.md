# Platify Lealtad — tarjeta de sellos digital

**Estado: BETA, funcionando en vivo** (modo prueba de Stripe). Construido 22 jul 2026.

Programa de lealtad para restaurantes/cafés. Modelo **tarjeta de sellos**:
*"Junta 10 sellos y el premio (café/postre) va por la casa."* Identificación por **teléfono**.

## Decisión de arquitectura
Igual que Pedidos y Caja: **sin base de datos nueva**. El backend es **Stripe Customers** —
cada cliente de lealtad es un Stripe Customer con `metadata.sellos`. Funciona hoy con la
`STRIPE_SECRET_KEY` que ya está en Vercel.

- **Clave por cliente:** email determinista `<telefono>@sellos.platify.mx`.
  Se busca con `customers.list({email})` (consistente al instante). ⚠️ NO se usa
  `customers.search` porque tarda en indexar (creaba clientes duplicados).
- **Saldo:** `metadata.sellos` (balance actual, no histórico). Etiqueta `metadata.fuente = 'platify-lealtad'`.
- **Meta:** `META = 10` sellos → premio (constante en `app/api/lealtad/route.ts`, editable).

## Piezas
| Ruta | Qué es |
|---|---|
| `/lealtad` | **Cliente**: escribe su teléfono y ve sus sellos + cuánto le falta. |
| `/lealtad/caja` | **Mostrador**: da sellos y canjea premios. Protegido con `CAJA_PASSWORD` (la misma de Pedidos). |
| `/api/lealtad` | GET `?tel=` (saldo, público) · POST (contraseña) acciones `sello` / `canjea` / `auth`. |
| webhook | En `checkout.session.completed` de un pedido pagado (`fuente=platify-pedidos`), **suma 1 sello automático** por teléfono. |

## Flujo probado (en vivo) ✅
- Dar sellos → se acumulan correctamente.
- GET encuentra al cliente al instante.
- A los 10 → `puedeCanjear:true`.
- Canjear → resta 10 (queda en 0).
- Canjear sin sellos → error controlado.

## Pendientes / decisiones para revisar
1. **Auto-sello por pedido pagado:** el código está listo en el webhook, pero **requiere
   `STRIPE_WEBHOOK_SECRET`** (configurar el webhook en el Dashboard de Stripe → apuntar a
   `/api/stripe-webhook`). Sin eso, los sellos se dan **a mano** en `/lealtad/caja` (que ya sirve).
2. **1 sello = 1 visita/pedido** por ahora. ¿Prefieres sellos por monto gastado (ej. 1 por cada $100)? Fácil de cambiar.
3. **Nombre del negocio** hardcodeado (`NEGOCIO = "Cremina Café"` en `/lealtad`). Para multi-restaurante
   habría que parametrizarlo (`/lealtad/[negocio]`), igual que Pedidos.
4. **Historial de canjes:** no se guarda log detallado (solo el balance). Si lo quieres, se agrega.
5. **Premio:** hoy es genérico ("café/postre gratis"). Se puede definir el premio exacto por negocio.

## Cómo probarlo
1. Caja: `platify-website.vercel.app/lealtad/caja` → contraseña `123456` → teléfono → **＋ Sello**.
2. Cliente: `platify-website.vercel.app/lealtad` → mismo teléfono → ve sus sellos.
3. A los 10 sellos, en caja aparece **🎁 Canjear**.
