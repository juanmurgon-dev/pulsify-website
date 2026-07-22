import Stripe from "stripe";

// Precio de lanzamiento de la beta: $100 MXN/mes (en centavos).
const BETA_AMOUNT = 10000;
// Prende Stripe Tax (IVA) solo cuando ya haya un registro fiscal activo en el
// Dashboard. Sin registro, automatic_tax NO cobra impuesto (y NO da error).
const AUTO_TAX = process.env.STRIPE_AUTOMATIC_TAX === "true";

export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return Response.json(
      { error: "Stripe no está configurado. Falta STRIPE_SECRET_KEY." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(key);
  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      // No pasamos payment_method_types: Stripe elige los métodos elegibles
      // dinámicamente desde el Dashboard (mejor conversión).
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "mxn",
            unit_amount: BETA_AMOUNT,
            recurring: { interval: "month" },
            tax_behavior: "inclusive", // precios MX con IVA incluido
            product_data: {
              name: "PLATIFY Análisis — Suscripción Beta",
              description:
                "Acceso de fundador al análisis financiero de PLATIFY (versión beta), $100 MXN al mes.",
            },
          },
        },
      ],
      allow_promotion_codes: true, // cupones de fundador / referidos
      tax_id_collection: { enabled: true }, // captura RFC (para facturación CFDI)
      ...(AUTO_TAX ? { automatic_tax: { enabled: true } } : {}),
      success_url: `${origin}/checkout?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?status=cancel`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return Response.json({ error: message }, { status: 500 });
  }
}
