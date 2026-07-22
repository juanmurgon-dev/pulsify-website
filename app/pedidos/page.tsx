"use client";

import { useMemo, useState } from "react";

// ───────────────────────────────────────────────────────────
//  Platify Pedidos — MVP: menú digital → pedido por WhatsApp.
//  ⬇️ EDITA aquí el número de WhatsApp del restaurante y el menú.
//  El número va con lada de país, sin "+" ni espacios (México: 52 + 10 dígitos).
// ───────────────────────────────────────────────────────────
const RESTAURANTE = {
  nombre: "Cremina Café",
  whatsapp: "5216641234567", // ← reemplázalo por el WhatsApp real
};

type Item = { nombre: string; precio: number; desc?: string };
const MENU: { categoria: string; items: Item[] }[] = [
  {
    categoria: "Desayunos",
    items: [
      { nombre: "Chilaquiles", precio: 120, desc: "Verdes o rojos, con pollo o huevo" },
      { nombre: "Omelette", precio: 110, desc: "3 huevos, relleno a elegir" },
      { nombre: "Hot Cakes", precio: 95, desc: "Con miel de maple y mantequilla" },
      { nombre: "Sandwich de desayuno", precio: 105, desc: "Huevo, tocino y queso" },
    ],
  },
  {
    categoria: "Comida",
    items: [
      { nombre: "Alfredo Cordon Blue", precio: 225, desc: "Pasta cremosa con pollo empanizado" },
      { nombre: "Arrachera Grill", precio: 260, desc: "Con guarnición y salsas" },
      { nombre: "Ensalada de la casa", precio: 145, desc: "Mixta, aderezo a elegir" },
      { nombre: "Pizzeta", precio: 130, desc: "Margarita, pepperoni o 4 quesos" },
    ],
  },
  {
    categoria: "Barra de Café",
    items: [
      { nombre: "Latte", precio: 65, desc: "Caliente o frío" },
      { nombre: "Capuccino", precio: 70 },
      { nombre: "Chai", precio: 80 },
      { nombre: "Matcha", precio: 90 },
    ],
  },
  {
    categoria: "Postres",
    items: [
      { nombre: "Cheesecake de guayaba", precio: 95 },
      { nombre: "Flan de elote", precio: 85 },
      { nombre: "Pastel de crepas", precio: 135, desc: "Dulce de leche / café / elote" },
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
