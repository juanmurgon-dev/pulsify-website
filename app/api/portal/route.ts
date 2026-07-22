import Stripe from "stripe";

// Customer Portal: página autogestionada de Stripe donde el cliente
// actualiza tarjeta, ve facturas, cambia o cancela su suscripción.
// Requiere configurar el portal una vez en el Dashboard
// (Settings → Billing → Customer portal).
export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return Response.json({ error: "Falta STRIPE_SECRET_KEY." }, { status: 500 });

  const stripe = new Stripe(key);
  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  try {
    const { customerId } = await request.json();
    if (!customerId) return Response.json({ error: "Falta customerId." }, { status: 400 });

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/checkout`,
    });
    return Response.json({ url: portal.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return Response.json({ error: message }, { status: 500 });
  }
}
