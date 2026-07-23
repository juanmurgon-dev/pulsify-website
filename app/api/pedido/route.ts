import Stripe from "stripe";

// Cobro en línea de un pedido de Platify Pedidos (Stripe Checkout).
// Stripe guarda el pedido (line_items + metadata) y ES la fuente de la
// Pantalla de Pedidos (/caja lo lee vía /api/caja). No hay base de datos aparte.
const DESCUENTO_PLAZA = 10; // % para empleados de la plaza
const norm = (t: unknown) => String(t || "").replace(/\D/g, "");
const emailFor = (tel: string) => `${tel}@sellos.platify.mx`;

// Cupón reutilizable para el descuento de empleados de la plaza (se crea una vez).
async function couponPlaza(stripe: Stripe): Promise<string> {
  const id = `plaza${DESCUENTO_PLAZA}`;
  try {
    await stripe.coupons.retrieve(id);
  } catch {
    await stripe.coupons.create({ id, percent_off: DESCUENTO_PLAZA, duration: "forever", name: `Empleado plaza (${DESCUENTO_PLAZA}%)` });
  }
  return id;
}

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
          name: String(ln.nombre + (ln.detalle?.length ? " · " + ln.detalle.join(", ") : "")).slice(0, 250),
        },
      },
    }));

    const metadata = {
      fuente: "platify-pedidos",
      cliente: String(body.nombre || "").slice(0, 120),
      telefono: String(body.telefono || "").slice(0, 40),
      tipo: String(body.entrega || "").slice(0, 20),
      direccion: String(body.direccion || "").slice(0, 200),
      notas: String(body.notas || "").slice(0, 300),
    };

    // Descuento de plaza (automático) vs cupones (que el cliente teclea).
    // Stripe no permite combinar `discounts` con `allow_promotion_codes`.
    const tel = norm(body.telefono);
    let descuentos: { coupon: string }[] | undefined;
    if (tel.length >= 7) {
      const r = await stripe.customers.list({ email: emailFor(tel), limit: 1 });
      if (r.data[0]?.metadata?.segmento === "plaza") {
        descuentos = [{ coupon: await couponPlaza(stripe) }];
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/pedidos?pago=ok`,
      cancel_url: `${origin}/pedidos?pago=cancel`,
      metadata,
      payment_intent_data: { metadata: { fuente: "platify-pedidos" } },
      ...(descuentos ? { discounts: descuentos } : { allow_promotion_codes: true }),
    });

    return Response.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return Response.json({ error: message }, { status: 500 });
  }
}
