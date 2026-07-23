import Stripe from "stripe";

// Webhook de Stripe: fuente de verdad para dar/quitar acceso.
// El success_url NO es confiable (el usuario puede cerrar la pestaña) —
// la activación real debe ocurrir aquí.
//
// Setup: en el Dashboard (Developers → Webhooks) apunta un endpoint a
// https://platify-website.vercel.app/api/stripe-webhook y copia el
// "Signing secret" (whsec_...) a STRIPE_WEBHOOK_SECRET en Vercel.
export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key || !whSecret) return new Response("Stripe no configurado", { status: 500 });

  const stripe = new Stripe(key);
  const sig = request.headers.get("stripe-signature");
  const body = await request.text(); // cuerpo crudo para verificar la firma

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig ?? "", whSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "firma inválida";
    return new Response(`Webhook error: ${msg}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      // Platify Lealtad: cada pedido pagado suma 1 sello automáticamente (por teléfono).
      const tel = (s.metadata?.telefono || "").replace(/\D/g, "");
      if (s.metadata?.fuente === "platify-pedidos" && tel.length >= 7) {
        try {
          const email = `${tel}@sellos.platify.mx`;
          const r = await stripe.customers.list({ email, limit: 1 });
          let c = r.data[0];
          if (!c) c = await stripe.customers.create({ email, phone: tel, name: s.metadata?.cliente || undefined, metadata: { fuente: "platify-lealtad", sellos: "0" } });
          const sellos = parseInt(c.metadata?.sellos || "0", 10) + 1;
          await stripe.customers.update(c.id, { metadata: { fuente: "platify-lealtad", sellos: String(sellos) } });
        } catch (e) { console.warn("Lealtad auto-sello falló:", e); }
      }
      // TODO (suscripción beta): marcar acceso activo si aplica.
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      // TODO: sincronizar estado (activa / cancelada / vencida).
      break;
    }
    case "invoice.paid": {
      // TODO: registrar el pago / disparar facturación CFDI (PAC).
      break;
    }
    case "invoice.payment_failed": {
      // TODO: avisar al cliente / iniciar dunning (Stripe reintenta solo).
      break;
    }
  }

  return Response.json({ received: true });
}
