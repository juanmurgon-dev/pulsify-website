import Stripe from "stripe";

// Platify Lealtad — tarjeta de sellos digital.
// Backend = Stripe Customers (metadata.sellos). Sin base de datos aparte.
// Modelo: junta META sellos → premio (café/postre gratis). Balance, no acumulado histórico.
const META = 10; // sellos para un premio
const norm = (t: unknown) => String(t || "").replace(/\D/g, "");

// Acciones de caja usan la misma contraseña que la Pantalla de Pedidos.
function autorizado(req: Request): boolean {
  const pass = process.env.CAJA_PASSWORD || "cremina-caja";
  const url = new URL(req.url);
  const given = url.searchParams.get("key") || req.headers.get("x-caja-key") || "";
  return given === pass;
}

// Clave determinista por teléfono. Usamos email (no phone) porque
// customers.list({email}) es consistente AL INSTANTE; customers.search tarda en indexar.
const emailFor = (tel: string) => `${tel}@sellos.platify.mx`;

async function buscar(stripe: Stripe, tel: string): Promise<Stripe.Customer | null> {
  const r = await stripe.customers.list({ email: emailFor(tel), limit: 1 });
  return r.data[0] ?? null;
}

// GET ?tel=...  → saldo del cliente (público, solo lectura).
export async function GET(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return Response.json({ error: "Falta STRIPE_SECRET_KEY." }, { status: 500 });
  const stripe = new Stripe(key);
  const tel = norm(new URL(request.url).searchParams.get("tel"));
  if (tel.length < 7) return Response.json({ error: "Escribe un teléfono válido." }, { status: 400 });
  try {
    const c = await buscar(stripe, tel);
    const sellos = c ? parseInt(c.metadata?.sellos || "0", 10) : 0;
    return Response.json({
      encontrado: !!c,
      nombre: c?.name || "",
      sellos,
      meta: META,
      faltan: Math.max(0, META - sellos),
      puedeCanjear: sellos >= META,
    });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Error" }, { status: 500 });
  }
}

// POST (contraseña de caja) → { tel, nombre?, accion: 'sello'|'canjea'|'crea', cantidad? }
export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return Response.json({ error: "Falta STRIPE_SECRET_KEY." }, { status: 500 });
  if (!autorizado(request)) return Response.json({ error: "Contraseña incorrecta." }, { status: 401 });
  const stripe = new Stripe(key);
  try {
    const body = await request.json();
    if (body.accion === "auth") return Response.json({ ok: true }); // solo valida contraseña
    const tel = norm(body.tel);
    if (tel.length < 7) return Response.json({ error: "Teléfono inválido." }, { status: 400 });
    const accion: string = body.accion || "crea";

    let c = await buscar(stripe, tel);
    if (!c) {
      c = await stripe.customers.create({
        email: emailFor(tel),
        phone: tel,
        name: String(body.nombre || "").slice(0, 80) || undefined,
        metadata: { fuente: "platify-lealtad", sellos: "0" },
      });
    } else if (body.nombre && !c.name) {
      c = await stripe.customers.update(c.id, { name: String(body.nombre).slice(0, 80) });
    }

    let sellos = parseInt(c.metadata?.sellos || "0", 10);
    if (accion === "sello") {
      sellos += Math.max(1, Number(body.cantidad) || 1);
    } else if (accion === "canjea") {
      if (sellos < META) return Response.json({ error: `Le faltan sellos (${sellos}/${META}).` }, { status: 400 });
      sellos -= META;
    }

    if (accion === "sello" || accion === "canjea") {
      c = await stripe.customers.update(c.id, { metadata: { fuente: "platify-lealtad", sellos: String(sellos) } });
    }

    return Response.json({ ok: true, nombre: c.name || "", sellos, meta: META, puedeCanjear: sellos >= META });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Error" }, { status: 500 });
  }
}
