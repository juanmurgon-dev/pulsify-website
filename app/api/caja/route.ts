import Stripe from "stripe";

// Pantalla de Pedidos (caja) — lee los pedidos PAGADOS directo de Stripe.
// Sin Firebase, sin base de datos aparte. Protegida por contraseña (CAJA_PASSWORD).
const PASS = () => process.env.CAJA_PASSWORD || "cremina-caja";

function autorizado(req: Request): boolean {
  const url = new URL(req.url);
  const given = url.searchParams.get("key") || req.headers.get("x-caja-key") || "";
  return given === PASS();
}

type PI = { id: string; metadata?: Record<string, string> } | string | null;

export async function GET(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return Response.json({ error: "Falta STRIPE_SECRET_KEY." }, { status: 500 });
  if (!autorizado(request)) return Response.json({ error: "Contraseña incorrecta." }, { status: 401 });

  const stripe = new Stripe(key);
  try {
    const desde = Math.floor(Date.now() / 1000) - 8 * 3600; // últimas 8 horas
    const list = await stripe.checkout.sessions.list({ limit: 100, created: { gte: desde }, expand: ["data.payment_intent"] });

    const activos = list.data.filter((s) => {
      const pi = s.payment_intent as PI;
      const atendido = pi && typeof pi === "object" && pi.metadata?.atendido === "si";
      return s.payment_status === "paid" && s.metadata?.fuente === "platify-pedidos" && !atendido;
    });

    const orders = await Promise.all(
      activos.map(async (s) => {
        const li = await stripe.checkout.sessions.listLineItems(s.id, { limit: 50 });
        return {
          id: s.id,
          created: s.created,
          total: (s.amount_total ?? 0) / 100,
          cliente: s.metadata?.cliente || "",
          telefono: s.metadata?.telefono || "",
          tipo: s.metadata?.tipo || "",
          direccion: s.metadata?.direccion || "",
          notas: s.metadata?.notas || "",
          items: li.data.map((x) => ({ n: x.description || "", q: x.quantity || 1, importe: (x.amount_total ?? 0) / 100 })),
        };
      })
    );

    orders.sort((a, b) => a.created - b.created);
    return Response.json({ orders });
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : "Error" }, { status: 500 });
  }
}

// Marca un pedido como "Atendido" (flag sobre el PaymentIntent).
export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return Response.json({ error: "Falta STRIPE_SECRET_KEY." }, { status: 500 });
  if (!autorizado(request)) return Response.json({ error: "Contraseña incorrecta." }, { status: 401 });

  const stripe = new Stripe(key);
  try {
    const { id } = await request.json();
    if (!id) return Response.json({ error: "Falta id." }, { status: 400 });
    const s = await stripe.checkout.sessions.retrieve(id);
    const piId = typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id;
    if (!piId) return Response.json({ error: "Sin pago asociado." }, { status: 400 });
    await stripe.paymentIntents.update(piId, { metadata: { atendido: "si" } });
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : "Error" }, { status: 500 });
  }
}
