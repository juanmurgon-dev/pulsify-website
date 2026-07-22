"use client";

import { useMemo, useState } from "react";

// ───────────────────────────────────────────────────────────
//  Platify Pedidos — MVP: menú digital → pedido por WhatsApp.
//  ⬇️ EDITA aquí el número de WhatsApp del restaurante y el menú.
//  El número va con lada de país, sin "+" ni espacios (México: 52 + 10 dígitos).
// ───────────────────────────────────────────────────────────
const RESTAURANTE = {
  nombre: "Cremina Café",
  whatsapp: "526631205109", // ← del menú (663 120 51 09) — VERIFICA que sea el WhatsApp correcto
};

type Item = { nombre: string; precio: number; desc?: string };
// NOTA: falta agregar la categoría "Desayunos" (el usuario la enviará).
const MENU: { categoria: string; items: Item[] }[] = [
  {
    categoria: "Para empezar",
    items: [
      { nombre: "Queso Fundido", precio: 160, desc: "Champiñón, carnes o rajas" },
      { nombre: "Champiñones al Ajillo", precio: 170 },
      { nombre: "Crema de Tomate", precio: 130 },
      { nombre: "Crema de Brócoli", precio: 140 },
    ],
  },
  {
    categoria: "Ensaladas",
    items: [
      { nombre: "Carpaccio de Salmón", precio: 260, desc: "Salmón fresco, spring mix, feta y reducción balsámica" },
      { nombre: "Ensalada Betabel", precio: 225, desc: "Betabel asado, frutos rojos, feta y pistache" },
      { nombre: "Ensalada Caesar", precio: 210, desc: "Romana, croutones y aderezo caesar con parmesano" },
      { nombre: "Ensalada Oriental", precio: 210, desc: "Mix de lechugas, aderezo thai, pollo y crujientes" },
    ],
  },
  {
    categoria: "Pastas",
    items: [
      { nombre: "Alfredo Cordon Blue", precio: 225, desc: "Fetuccini alfredo con pollo cordon bleu" },
      { nombre: "Pasta al Pesto", precio: 180, desc: "Penne en pesto de albahaca con nuez y pistache" },
      { nombre: "Pasta Penne al Chipotle", precio: 190, desc: "Cremosa salsa chipotle y parmesano" },
    ],
  },
  {
    categoria: "Platos fuertes",
    items: [
      { nombre: "Pechuga Cremina", precio: 320, desc: "Pechuga rellena de queso y espinaca sobre risotto pesto" },
      { nombre: "Salmón al Risotto", precio: 360, desc: "Salmón a las finas hierbas sobre risotto cremoso" },
      { nombre: "Arrachera Grill", precio: 370, desc: "Arrachera al término con papa al horno" },
      { nombre: "Corte New York", precio: 380, desc: "New York en chimichurri con papas a la francesa" },
      { nombre: "Arrachera Fries", precio: 250, desc: "Papas con guacamole, crema, quesos y 200g de arrachera" },
      { nombre: "Milanesa Napolitana", precio: 280, desc: "Milanesa de res gratinada con espagueti" },
      { nombre: "Pollo a la Parmesana", precio: 280, desc: "Pechuga empanizada, marinara y parmesano" },
      { nombre: "Hamburguesa de Rib Eye", precio: 325, desc: "Rib eye, tocino, pepper jack y cebolla caramelizada" },
    ],
  },
  {
    categoria: "Sandwiches",
    items: [
      { nombre: "Grilled Cheese Birria", precio: 235, desc: "Birria con mezcla de quesos y consomé" },
      { nombre: "Sandwich de Arrachera", precio: 235, desc: "Arrachera, pimientos, cebolla y queso monterrey" },
      { nombre: "Sandwich de Pollo", precio: 235, desc: "Pollo a la plancha, tocino, aguacate y pesto" },
      { nombre: "Croissant", precio: 145, desc: "Cuernito con huevo, jamón, tocino, queso y aguacate" },
    ],
  },
  {
    categoria: "Pizzetas",
    items: [
      { nombre: "Margarita", precio: 125 },
      { nombre: "Pepperoni", precio: 125 },
      { nombre: "Pesto", precio: 135 },
      { nombre: "4 Quesos", precio: 135 },
    ],
  },
  {
    categoria: "Barra de Café",
    items: [
      { nombre: "Espresso", precio: 35 },
      { nombre: "Americano", precio: 45 },
      { nombre: "Americano Refill", precio: 60 },
      { nombre: "Cortado", precio: 55 },
      { nombre: "Flat White", precio: 65 },
      { nombre: "Capuccino", precio: 75 },
      { nombre: "Latte", precio: 90 },
      { nombre: "Espresso Tonic", precio: 70 },
      { nombre: "Chai", precio: 70, desc: "Especias, plátano o vainilla" },
      { nombre: "Matcha Latte", precio: 90 },
      { nombre: "Latte de la Casa", precio: 90, desc: "Tiramisú, mazapán, cremina o 3 leches" },
    ],
  },
  {
    categoria: "Bebidas",
    items: [
      { nombre: "Cremina Spritz", precio: 75, desc: "Frutos rojos, fresa, jamaica-limón, matcha citrus, lavanda o fruta de la pasión" },
      { nombre: "Coca Cola", precio: 35 },
      { nombre: "Coca Cola Cero", precio: 45 },
      { nombre: "Coca Cola Light", precio: 60 },
      { nombre: "Sprite", precio: 55 },
      { nombre: "Fanta", precio: 65 },
      { nombre: "Fresca", precio: 75 },
      { nombre: "Topo Chico", precio: 90 },
      { nombre: "Agua Embotellada", precio: 30 },
    ],
  },
  {
    categoria: "Postres",
    items: [
      // ⚠️ El menú no traía precio de postres — ajústalos. Puse $95 de placeholder.
      { nombre: "Cheesecake de Guayaba", precio: 95 },
      { nombre: "Flan de Elote", precio: 95 },
      { nombre: "Crème Brûlée", precio: 95 },
      { nombre: "Pastel de Crepas", precio: 95, desc: "Elote, café o dulce de leche" },
    ],
  },
  {
    categoria: "Extras",
    items: [
      { nombre: "Arrachera", precio: 110 },
      { nombre: "Pollo", precio: 65 },
      { nombre: "Aguacate", precio: 55 },
      { nombre: "Tocino Premium", precio: 50 },
      { nombre: "Huevo", precio: 25 },
      { nombre: "Pan de la Casa", precio: 40 },
      { nombre: "Quesadillas de Maíz (3 pz)", precio: 55 },
      { nombre: "Quesadillas de Harina (2 pz)", precio: 80 },
      { nombre: "Chiles Toreados", precio: 35 },
      { nombre: "Papas Fritas", precio: 95 },
    ],
  },
];

const PRIMARY = "#0e3a39";
const ACCENT = "#2ec4b6";
const ORANGE = "#ff9f1c";
const MUTED = "#5a6b6a";
const money = (n: number) => "$" + n.toLocaleString("es-MX");

export default function Pedidos() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [abierto, setAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [entrega, setEntrega] = useState<"recoger" | "domicilio">("recoger");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");

  const precioDe = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of MENU) for (const it of c.items) m[it.nombre] = it.precio;
    return m;
  }, []);

  const add = (n: string) => setCart((c) => ({ ...c, [n]: (c[n] || 0) + 1 }));
  const rem = (n: string) =>
    setCart((c) => {
      const q = (c[n] || 0) - 1;
      const nc = { ...c };
      if (q <= 0) delete nc[n];
      else nc[n] = q;
      return nc;
    });

  const lineas = Object.entries(cart).filter(([, q]) => q > 0);
  const totalItems = lineas.reduce((a, [, q]) => a + q, 0);
  const total = lineas.reduce((a, [n, q]) => a + q * (precioDe[n] || 0), 0);

  function enviarWhatsApp() {
    const l = [`Hola ${RESTAURANTE.nombre}, quiero hacer un pedido:`, ""];
    for (const [n, q] of lineas) l.push(`• ${q}x ${n} — ${money(q * (precioDe[n] || 0))}`);
    l.push("", `Total: ${money(total)}`);
    l.push(`Entrega: ${entrega === "recoger" ? "Paso a recoger" : "A domicilio"}`);
    if (entrega === "domicilio" && direccion.trim()) l.push(`Dirección: ${direccion.trim()}`);
    if (nombre.trim()) l.push(`Nombre: ${nombre.trim()}`);
    if (notas.trim()) l.push(`Notas: ${notas.trim()}`);
    const url = `https://wa.me/${RESTAURANTE.whatsapp}?text=${encodeURIComponent(l.join("\n"))}`;
    window.open(url, "_blank");
  }

  return (
    <main style={{ background: "#f7faf9", minHeight: "100vh", paddingBottom: totalItems ? "96px" : "40px" }}>
      {/* Encabezado del restaurante (div, no <header>: globals.css fuerza header blanco) */}
      <div style={{ background: PRIMARY, color: "#fff", padding: "40px 0 28px", textAlign: "center" }}>
        <div className="container">
          <div style={{ fontSize: "13px", letterSpacing: "0.08em", textTransform: "uppercase", color: ACCENT, fontWeight: 700, marginBottom: "8px" }}>
            🛵 Pedido en línea
          </div>
          <h1 style={{ fontSize: "34px", fontWeight: 800, margin: 0 }}>{RESTAURANTE.nombre}</h1>
          <p style={{ color: "#cfe0de", marginTop: "8px", fontSize: "15px" }}>
            Arma tu pedido y envíalo por WhatsApp. Sin comisiones.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: "720px", paddingTop: "24px" }}>
        {MENU.map((cat) => (
          <section key={cat.categoria} style={{ marginBottom: "28px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: PRIMARY, margin: "8px 0 12px" }}>{cat.categoria}</h2>
            <div style={{ display: "grid", gap: "10px" }}>
              {cat.items.map((it) => {
                const q = cart[it.nombre] || 0;
                return (
                  <div key={it.nombre} className="card" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: PRIMARY }}>{it.nombre}</div>
                      {it.desc && <div style={{ color: MUTED, fontSize: "13px", marginTop: "2px" }}>{it.desc}</div>}
                      <div style={{ color: ACCENT, fontWeight: 700, marginTop: "4px" }}>{money(it.precio)}</div>
                    </div>
                    {q === 0 ? (
                      <button onClick={() => add(it.nombre)} aria-label={`Agregar ${it.nombre}`}
                        style={{ background: ORANGE, color: "#fff", border: "none", borderRadius: "10px", width: "40px", height: "40px", fontSize: "22px", fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
                        +
                      </button>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                        <button onClick={() => rem(it.nombre)} aria-label="Quitar" style={qtyBtn}>−</button>
                        <span style={{ fontWeight: 800, minWidth: "20px", textAlign: "center", color: PRIMARY }}>{q}</span>
                        <button onClick={() => add(it.nombre)} aria-label="Agregar" style={{ ...qtyBtn, background: ORANGE, color: "#fff", borderColor: ORANGE }}>+</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
        <p style={{ textAlign: "center", color: MUTED, fontSize: "12px", margin: "24px 0 8px" }}>
          Hecho con <b style={{ color: PRIMARY }}>Platify</b> · Pedidos sin comisión
        </p>
      </div>

      {/* Barra fija del carrito */}
      {totalItems > 0 && (
        <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "#fff", borderTop: "1px solid #e6efee", padding: "12px 16px", boxShadow: "0 -6px 20px rgba(14,58,57,0.08)", zIndex: 50 }}>
          <div className="container" style={{ maxWidth: "720px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, color: PRIMARY }}>{money(total)}</div>
              <div style={{ color: MUTED, fontSize: "13px" }}>{totalItems} artículo{totalItems > 1 ? "s" : ""}</div>
            </div>
            <button onClick={() => setAbierto(true)} style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: "12px", padding: "14px 22px", fontWeight: 800, fontSize: "15px", cursor: "pointer" }}>
              Ver pedido →
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {abierto && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setAbierto(false); }}
          style={{ position: "fixed", inset: 0, background: "rgba(14,58,57,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", width: "100%", maxWidth: "560px", borderRadius: "20px 20px 0 0", padding: "24px", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ color: PRIMARY, margin: "0 0 12px", fontWeight: 800 }}>Tu pedido</h2>
            <div style={{ display: "grid", gap: "8px", marginBottom: "16px" }}>
              {lineas.map(([n, q]) => (
                <div key={n} style={{ display: "flex", justifyContent: "space-between", gap: "10px", fontSize: "15px", color: PRIMARY }}>
                  <span>{q}× {n}</span>
                  <span style={{ fontWeight: 700 }}>{money(q * (precioDe[n] || 0))}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #eef2f1", paddingTop: "10px", marginTop: "4px", fontSize: "17px", fontWeight: 800, color: PRIMARY }}>
                <span>Total</span><span>{money(total)}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              {(["recoger", "domicilio"] as const).map((op) => (
                <button key={op} onClick={() => setEntrega(op)}
                  style={{ flex: 1, padding: "10px", borderRadius: "10px", border: `2px solid ${entrega === op ? ACCENT : "#e6efee"}`, background: entrega === op ? "rgba(46,196,182,0.1)" : "#fff", color: PRIMARY, fontWeight: 700, cursor: "pointer" }}>
                  {op === "recoger" ? "Paso a recoger" : "A domicilio"}
                </button>
              ))}
            </div>

            <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" style={inp} />
            {entrega === "domicilio" && (
              <input value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección de entrega" style={inp} />
            )}
            <input value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Notas (opcional): sin cebolla, extra salsa…" style={inp} />

            <button onClick={enviarWhatsApp}
              style={{ width: "100%", background: "#25D366", color: "#fff", border: "none", borderRadius: "12px", padding: "16px", fontWeight: 800, fontSize: "16px", cursor: "pointer", marginTop: "8px" }}>
              Enviar pedido por WhatsApp
            </button>
            <button onClick={() => setAbierto(false)} style={{ width: "100%", background: "none", border: "none", color: MUTED, padding: "12px", marginTop: "6px", cursor: "pointer" }}>
              Seguir agregando
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

const qtyBtn: React.CSSProperties = {
  width: "36px", height: "36px", borderRadius: "9px", border: "2px solid #e6efee",
  background: "#fff", color: "#0e3a39", fontSize: "20px", fontWeight: 700, cursor: "pointer",
};
const inp: React.CSSProperties = {
  width: "100%", padding: "13px 14px", borderRadius: "10px", border: "1px solid #dfe7e6",
  marginBottom: "10px", fontSize: "15px", fontFamily: "inherit",
};
