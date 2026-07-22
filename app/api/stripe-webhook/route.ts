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
      // const s = event.data.object as Stripe.Checkout.Session;
      // TODO: marcar la suscripción del usuario como activa en Supabase
      //       (mapear s.customer / s.customer_email → tu usuario).
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
