# Plan de integración Stripe — Platify

**Negocio:** soluciones digitales para restaurantes/cafeterías medianas en México.
**Productos Stripe:** Billing (suscripciones), Invoicing (facturas), Tax (IVA).
**Estado actual (verificado con tu `sk_test`):** cuenta `acct_1Tw8c5…`, país **US**, `charges_enabled=false`, Stripe Tax **pending / 0 registros**.

---

## 0. Antes que nada — 2 decisiones de fondo

1. **País de la cuenta = US, pero cobras en MXN a clientes mexicanos.**
   En modo prueba funciona, pero para producción conviene una **cuenta de Stripe en México**:
   payouts en MXN, métodos locales (OXXO, SPEI, Meses sin Intereses) y cumplimiento.
   El país de la cuenta **no se puede cambiar** después: si necesitas MX, se crea una cuenta nueva.
   → **Confírmalo antes de activar (`sk_live`).**

2. **Facturación en México = CFDI (SAT), y Stripe NO emite CFDI.**
   Stripe Invoicing genera *facturas/recibos Stripe*, útiles como comprobante, **pero no son el CFDI 4.0**
   que pide el SAT. Para timbrar CFDI necesitas un **PAC** (Facturama, Facturapi, SW sapien…).
   Patrón recomendado: Stripe cobra + webhook `invoice.paid` → llamas a tu PAC para timbrar el CFDI
   con el RFC que capturaste en el checkout (`tax_id_collection`). Stripe Tax calcula el **IVA**;
   el PAC **timbra** el comprobante. Son capas distintas y complementarias.

---

## 1. Billing (suscripciones) — el core

Modelo: **suscripción mensual** ($100 MXN/mes beta de Análisis). Ya implementado y mejorado.

- ✅ `app/api/checkout/route.ts` → Checkout Session `mode: subscription`.
- ✅ **No** se fija `payment_method_types` (Stripe elige métodos dinámicamente = más conversión).
- ✅ `allow_promotion_codes: true` (cupones de fundador/referidos).
- ✅ `tax_id_collection: { enabled: true }` (captura **RFC** para facturar).
- ✅ `tax_behavior: "inclusive"` (precios MX con IVA incluido).
- ⏳ `automatic_tax` gateado por `STRIPE_AUTOMATIC_TAX=true` (prender **después** de registrar IVA).
- ➕ **Webhook** `app/api/stripe-webhook/route.ts` → activar acceso de verdad (no depender del success_url).
- ➕ **Customer Portal** `app/api/portal/route.ts` → que el cliente cambie tarjeta / cancele solo.

**Catálogo de producto (cuando salgas de beta):** un **Product por plan** (Análisis, POS, Pedidos, Lealtad
o Starter/Pro), con **Prices** solo para variantes del mismo plan (mensual/anual). No metas planes
distintos en un mismo Product (el line item mostraría el mismo nombre y el cliente no los distingue).

**Trampas evitadas:** nada de renovaciones manuales con PaymentIntents; nada del objeto `plan`
deprecado (usar Prices); no hardcodear `payment_method_types`.

## 2. Tax (IVA) — dos pasos, y ojo con el orden

Stripe Tax **no cobra nada** hasta que tengas un **registro activo** en la jurisdicción, aunque
`automatic_tax` esté en `true` (no da error — simplemente cobra $0). Por eso hoy está **apagado**.

1. **Registra México** en Dashboard → *Tax → Registrations* (o Tax Registrations API). Requiere domicilio fiscal.
2. Elige un **código de impuesto (PTC)** para tu servicio SaaS — de la lista canónica de Stripe,
   **no inventado**. Te muestro candidatos y tú confirmas con tu contador.
3. Prende `STRIPE_AUTOMATIC_TAX=true` en Vercel → el checkout empieza a calcular IVA.
4. Verifica: una sesión de prueba debe mostrar el IVA desglosado (`taxability_reason`).

> **Guía, no asesoría fiscal.** No te digo dónde estás obligado a registrarte; eso lo confirma tu contador.

## 3. Invoicing (facturas) + CFDI

- Stripe genera automáticamente una **factura Stripe** por cada cobro de suscripción (`invoice.paid`).
- Para el **CFDI del SAT**: en el webhook `invoice.paid`, con el **RFC** capturado, llamas a tu **PAC**
  para timbrar. (Fuera del alcance de Stripe puro — decisión de proveedor PAC pendiente.)
- Alternativa rápida sin código: activar **facturas por email** de Stripe como comprobante interino,
  y timbrar CFDI aparte.

## 4. Pedidos (pago único) — `app/api/pedido/route.ts`

Cobro `mode: payment` del carrito del comensal. Consideración fiscal aparte: el **IVA de alimentos
preparados** en México es un tema propio (y Tijuana es zona fronteriza con tasas especiales).
**No** prendí `automatic_tax` aquí hasta que lo definas con tu contador. Si luego facturas pedidos,
aplica el mismo patrón webhook → PAC.

---

## Checklist de arranque

- [ ] Decidir país de la cuenta (US vs crear cuenta **MX**) antes de `sk_live`.
- [ ] `STRIPE_SECRET_KEY` en Vercel (production) — hoy solo en `.env.local`.
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` en Vercel (si el front la necesita).
- [ ] Configurar **webhook** en Dashboard → `STRIPE_WEBHOOK_SECRET` en Vercel.
- [ ] Configurar **Customer Portal** en Dashboard (Settings → Billing).
- [ ] Registrar **IVA México** en Tax → luego `STRIPE_AUTOMATIC_TAX=true`.
- [ ] Elegir **PAC** para CFDI y conectarlo en el webhook `invoice.paid`.
- [ ] Probar todo con `sk_test` + tarjeta `4242 4242 4242 4242` antes de `sk_live`.
- [ ] **Rotar la `sk_test`** que compartiste en el chat (Dashboard → API keys → Roll).
