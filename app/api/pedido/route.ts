import Stripe from "stripe";

// Cobro en línea de un pedido de Platify Pedidos (Stripe Checkout).
// Requiere STRIPE_SECRET_KEY en el entorno (Vercel).
export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return Response.json(
      { error: "El pago en línea no está configurado (falta STRIPE_SECRET_KEY)." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(key);
  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  try {
    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length) return Response.json({ error: "Carrito vacío." }, { status: 400 });

    const line_items = items.map((ln: { nombre: string; precioUnit: number; qty: number; detalle?: string[] }) => ({
      quantity: Math.max(1, Number(ln.qty) || 1),
      price_data: {
        currency: "mxn",
        unit_amount: Math.round(Number(ln.precioUnit) * 100),
        product_data: {
          name: String(ln.nombre + (ln.detalle?.length ? " (" + ln.detalle.join(", ") + ")" : "")).slice(0, 250),
        },
      },
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/pedidos?pago=ok`,
      cancel_url: `${origin}/pedidos?pago=cancel`,
      metadata: {
        restaurante: String(body.restaurante || "").slice(0, 200),
        entrega: String(body.entrega || "").slice(0, 50),
        cliente: String(body.nombre || "").slice(0, 200),
        notas: String(body.notas || "").slice(0, 480),
      },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return Response.json({ error: message }, { status: 500 });
  }
}
