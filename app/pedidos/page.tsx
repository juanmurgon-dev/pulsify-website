"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// ───────────────────────────────────────────────────────────
//  Platify Pedidos — app móvil: menú digital → pedido por WhatsApp.
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
const LINEA = "#eef2f1";
const money = (n: number) => "$" + n.toLocaleString("es-MX");

export default function Pedidos() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [abierto, setAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [entrega, setEntrega] = useState<"recoger" | "domicilio">("recoger");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");
  const [activa, setActiva] = useState(0);

  const secRefs = useRef<(HTMLElement | null)[]>([]);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const precioDe = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of MENU) for (const it of c.items) m[it.nombre] = it.precio;
    return m;
  }, []);

  // Marca la categoría visible mientras el usuario hace scroll.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiva(Number((e.target as HTMLElement).dataset.idx));
        }
      },
      { rootMargin: "-120px 0px -70% 0px", threshold: 0 }
    );
    secRefs.current.forEach((s) => s && obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // Centra el chip activo en su barra.
  useEffect(() => {
    chipRefs.current[activa]?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [activa]);

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
    window.open(`https://wa.me/${RESTAURANTE.whatsapp}?text=${encodeURIComponent(l.join("\n"))}`, "_blank");
  }

  return (
    <div style={{ background: "#dfe7e6", minHeight: "100vh" }}>
      {/* Marco tipo celular */}
      <div style={{ maxWidth: "460px", margin: "0 auto", background: "#f7faf9", minHeight: "100vh", position: "relative", boxShadow: "0 0 40px rgba(14,58,57,0.15)" }}>
        {/* Barra superior fija (app bar) */}
        <div style={{ position: "sticky", top: 0, zIndex: 30, background: PRIMARY, color: "#fff", height: "54px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 800, fontSize: "17px" }}>
          <span>{RESTAURANTE.nombre}</span>
        </div>

        {/* Hero compacto */}
        <div style={{ background: PRIMARY, color: "#fff", padding: "4px 20px 22px", textAlign: "center" }}>
          <div style={{ fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: ACCENT, fontWeight: 700 }}>
            🛵 Pedido en línea · sin comisión
          </div>
          <p style={{ color: "#cfe0de", marginTop: "6px", fontSize: "13px" }}>Arma tu pedido y envíalo por WhatsApp</p>
        </div>

        {/* Pestañas de categorías (scroll horizontal, sticky) */}
        <div style={{ position: "sticky", top: "54px", zIndex: 25, background: "#fff", borderBottom: `1px solid ${LINEA}`, display: "flex", gap: "8px", overflowX: "auto", padding: "10px 14px", WebkitOverflowScrolling: "touch" }}>
          {MENU.map((c, i) => {
            const act = i === activa;
            return (
              <button
                key={c.categoria}
                ref={(el) => { chipRefs.current[i] = el; }}
                onClick={() => secRefs.current[i]?.scrollIntoView({ behavior: "smooth" })}
                style={{ flexShrink: 0, border: "none", cursor: "pointer", borderRadius: "20px", padding: "8px 14px", fontSize: "13px", fontWeight: 700, background: act ? PRIMARY : "#eef2f1", color: act ? "#fff" : MUTED, transition: "all .2s" }}>
                {c.categoria}
              </button>
            );
          })}
        </div>

        {/* Secciones del menú */}
        <div style={{ padding: "8px 14px", paddingBottom: totalItems ? "104px" : "40px" }}>
          {MENU.map((cat, i) => (
            <section
              key={cat.categoria}
              data-idx={i}
              ref={(el) => { secRefs.current[i] = el; }}
              style={{ scrollMarginTop: "112px", marginBottom: "18px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: PRIMARY, margin: "12px 2px 10px" }}>{cat.categoria}</h2>
              <div style={{ display: "grid", gap: "8px" }}>
                {cat.items.map((it) => {
                  const q = cart[it.nombre] || 0;
                  return (
                    <div key={it.nombre} style={{ background: "#fff", borderRadius: "14px", padding: "14px", display: "flex", alignItems: "center", gap: "12px", border: `1px solid ${LINEA}` }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: PRIMARY, fontSize: "15px" }}>{it.nombre}</div>
                        {it.desc && <div style={{ color: MUTED, fontSize: "12.5px", marginTop: "2px", lineHeight: 1.4 }}>{it.desc}</div>}
                        <div style={{ color: ACCENT, fontWeight: 800, marginTop: "5px", fontSize: "15px" }}>{money(it.precio)}</div>
                      </div>
                      {q === 0 ? (
                        <button onClick={() => add(it.nombre)} aria-label={`Agregar ${it.nombre}`}
                          style={{ background: ORANGE, color: "#fff", border: "none", borderRadius: "12px", width: "42px", height: "42px", fontSize: "24px", fontWeight: 700, cursor: "pointer", flexShrink: 0, lineHeight: 1 }}>
                          +
                        </button>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
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
          <p style={{ textAlign: "center", color: MUTED, fontSize: "12px", margin: "20px 0 8px" }}>
            Hecho con <b style={{ color: PRIMARY }}>Platify</b> · Pedidos sin comisión
          </p>
        </div>

        {/* Barra fija del carrito (dentro del marco) */}
        {totalItems > 0 && (
          <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "min(460px, 100%)", background: "#fff", borderTop: `1px solid ${LINEA}`, padding: "12px 16px", boxShadow: "0 -6px 20px rgba(14,58,57,0.1)", zIndex: 40 }}>
            <button onClick={() => setAbierto(true)}
              style={{ width: "100%", background: ACCENT, color: "#fff", border: "none", borderRadius: "14px", padding: "15px 18px", fontWeight: 800, fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
              <span style={{ background: "rgba(255,255,255,0.25)", borderRadius: "8px", padding: "2px 9px", fontSize: "14px" }}>{totalItems}</span>
              <span>Ver pedido</span>
              <span>{money(total)}</span>
            </button>
          </div>
        )}

        {/* Hoja inferior: pedido + datos */}
        {abierto && (
          <div onClick={(e) => { if (e.target === e.currentTarget) setAbierto(false); }}
            style={{ position: "fixed", inset: 0, background: "rgba(14,58,57,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}>
            <div style={{ background: "#fff", width: "min(460px, 100%)", borderRadius: "22px 22px 0 0", padding: "22px", maxHeight: "92vh", overflowY: "auto" }}>
              <div style={{ width: "44px", height: "5px", background: "#dfe7e6", borderRadius: "3px", margin: "0 auto 16px" }} />
              <h2 style={{ color: PRIMARY, margin: "0 0 12px", fontWeight: 800, fontSize: "20px" }}>Tu pedido</h2>
              <div style={{ display: "grid", gap: "8px", marginBottom: "16px" }}>
                {lineas.map(([n, q]) => (
                  <div key={n} style={{ display: "flex", justifyContent: "space-between", gap: "10px", fontSize: "15px", color: PRIMARY }}>
                    <span>{q}× {n}</span>
                    <span style={{ fontWeight: 700 }}>{money(q * (precioDe[n] || 0))}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${LINEA}`, paddingTop: "10px", marginTop: "4px", fontSize: "17px", fontWeight: 800, color: PRIMARY }}>
                  <span>Total</span><span>{money(total)}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                {(["recoger", "domicilio"] as const).map((op) => (
                  <button key={op} onClick={() => setEntrega(op)}
                    style={{ flex: 1, padding: "12px", borderRadius: "12px", border: `2px solid ${entrega === op ? ACCENT : LINEA}`, background: entrega === op ? "rgba(46,196,182,0.1)" : "#fff", color: PRIMARY, fontWeight: 700, cursor: "pointer" }}>
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
                style={{ width: "100%", background: "#25D366", color: "#fff", border: "none", borderRadius: "14px", padding: "16px", fontWeight: 800, fontSize: "16px", cursor: "pointer", marginTop: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                Enviar pedido por WhatsApp
              </button>
              <button onClick={() => setAbierto(false)} style={{ width: "100%", background: "none", border: "none", color: MUTED, padding: "12px", marginTop: "4px", cursor: "pointer" }}>
                Seguir agregando
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const qtyBtn: React.CSSProperties = {
  width: "38px", height: "38px", borderRadius: "10px", border: "2px solid #e6efee",
  background: "#fff", color: "#0e3a39", fontSize: "20px", fontWeight: 700, cursor: "pointer", lineHeight: 1,
};
const inp: React.CSSProperties = {
  width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #dfe7e6",
  marginBottom: "10px", fontSize: "15px", fontFamily: "inherit",
};
