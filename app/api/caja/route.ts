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
  const hist = new URL(request.url).searchParams.get("hist") === "1";
  try {
    // Activos: últimas 8h, solo sin atender.  Historial: últimos 3 días, todos.
    const desde = Math.floor(Date.now() / 1000) - (hist ? 3 * 24 * 3600 : 8 * 3600);
    const list = await stripe.checkout.sessions.list({ limit: 100, created: { gte: desde }, expand: ["data.payment_intent"] });

    const pagados = list.data.filter((s) => s.payment_status === "paid" && s.metadata?.fuente === "platify-pedidos");
    const seleccion = hist
      ? pagados
      : pagados.filter((s) => {
          const pi = s.payment_intent as PI;
          return !(pi && typeof pi === "object" && pi.metadata?.atendido === "si");
        });

    const orders = await Promise.all(
      seleccion.map(async (s) => {
        const li = await stripe.checkout.sessions.listLineItems(s.id, { limit: 50 });
        const pi = s.payment_intent as PI;
        return {
          id: s.id,
          created: s.created,
          total: (s.amount_total ?? 0) / 100,
          cliente: s.metadata?.cliente || "",
          telefono: s.metadata?.telefono || "",
          tipo: s.metadata?.tipo || "",
          direccion: s.metadata?.direccion || "",
          notas: s.metadata?.notas || "",
          atendido: !!(pi && typeof pi === "object" && pi.metadata?.atendido === "si"),
          items: li.data.map((x) => ({ n: x.description || "", q: x.quantity || 1, importe: (x.amount_total ?? 0) / 100 })),
        };
      })
    );

    orders.sort((a, b) => (hist ? b.created - a.created : a.created - b.created));
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
