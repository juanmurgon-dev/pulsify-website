"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// ───────────────────────────────────────────────────────────
//  Platify Pedidos — app móvil: menú digital → pedido por WhatsApp.
//  ⬇️ EDITA el WhatsApp y el MENÚ. Cada platillo puede tener "grupos"
//     de opciones:  tipo:"unica" (elige 1)  |  tipo:"multi" (varios).
//     Una opción con "precio" suma ese extra. Para "quitar" ingredientes,
//     usa un grupo multi con opciones sin precio (ej. "Sin cebolla").
// ───────────────────────────────────────────────────────────
const RESTAURANTE = {
  nombre: "Cremina Café",
  whatsapp: "526631205109", // ← del menú (663 120 51 09) — VERIFICA que sea el correcto
};

type Opcion = { nombre: string; precio?: number };
type Grupo = { nombre: string; tipo: "unica" | "multi"; obligatorio?: boolean; opciones: Opcion[] };
type Item = { nombre: string; precio: number; desc?: string; grupos?: Grupo[] };

// Grupos reutilizables (ejemplos):
const gLeche: Grupo = { nombre: "Leche", tipo: "unica", opciones: [{ nombre: "Entera" }, { nombre: "Deslactosada" }, { nombre: "De avena", precio: 10 }] };
const gTemp: Grupo = { nombre: "Temperatura", tipo: "unica", opciones: [{ nombre: "Caliente" }, { nombre: "Frío" }] };

const MENU: { categoria: string; items: Item[] }[] = [
  {
    categoria: "Desayunos",
    items: [
      { nombre: "Chilaquiles", precio: 175, desc: "Con papas campesinas y frijoles refritos", grupos: [
        { nombre: "Tipo", tipo: "unica", obligatorio: true, opciones: [
          { nombre: "Rojos" }, { nombre: "Verdes" },
          { nombre: "Chipotle", precio: 15 }, { nombre: "Poblanos", precio: 15 },
          { nombre: "Birria", precio: 50 },
        ] },
      ] },
      { nombre: "Omelette", precio: 180, desc: "Con frijoles y papas campesinas", grupos: [
        { nombre: "Tipo", tipo: "unica", obligatorio: true, opciones: [
          { nombre: "Rajas (jamón y queso)" }, { nombre: "Carnes (chorizo, jamón, tocino)", precio: 10 },
        ] },
      ] },
      { nombre: "Hot Cakes", precio: 155, desc: "Suaves y esponjosos", grupos: [
        { nombre: "Tipo", tipo: "unica", obligatorio: true, opciones: [
          { nombre: "Tradicionales" }, { nombre: "Cremina (elote y nuez)", precio: 30 },
        ] },
      ] },
      { nombre: "French Toast", precio: 195, desc: "Pan estilo francés, suave y esponjoso", grupos: [
        { nombre: "Tipo", tipo: "unica", obligatorio: true, opciones: [
          { nombre: "Frutos rojos" }, { nombre: "Plátano caramelizado", precio: 15 },
        ] },
      ] },
    ],
  },
  {
    categoria: "Para empezar",
    items: [
      { nombre: "Queso Fundido", precio: 160, desc: "A elegir", grupos: [
        { nombre: "Guiso", tipo: "unica", obligatorio: true, opciones: [{ nombre: "Champiñón" }, { nombre: "Carnes" }, { nombre: "Rajas" }] },
      ] },
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
      { nombre: "Ensalada Caesar", precio: 210, desc: "Romana, croutones y aderezo caesar con parmesano",
        grupos: [{ nombre: "Extras", tipo: "multi", opciones: [{ nombre: "Pollo a la plancha", precio: 65 }, { nombre: "Aguacate", precio: 55 }] }] },
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
      { nombre: "Arrachera Grill", precio: 370, desc: "Arrachera al término con papa al horno",
        grupos: [{ nombre: "Término", tipo: "unica", obligatorio: true, opciones: [{ nombre: "Término medio" }, { nombre: "Tres cuartos" }, { nombre: "Bien cocida" }] }] },
      { nombre: "Corte New York", precio: 380, desc: "New York en chimichurri con papas a la francesa",
        grupos: [{ nombre: "Término", tipo: "unica", obligatorio: true, opciones: [{ nombre: "Término medio" }, { nombre: "Tres cuartos" }, { nombre: "Bien cocida" }] }] },
      { nombre: "Arrachera Fries", precio: 250, desc: "Papas con guacamole, crema, quesos y 200g de arrachera",
        grupos: [
          { nombre: "Extras", tipo: "multi", opciones: [{ nombre: "Extra arrachera", precio: 110 }, { nombre: "Extra queso", precio: 30 }] },
          { nombre: "Quitar", tipo: "multi", opciones: [{ nombre: "Sin crema" }, { nombre: "Sin guacamole" }] },
        ] },
      { nombre: "Milanesa Napolitana", precio: 280, desc: "Milanesa de res gratinada con espagueti" },
      { nombre: "Pollo a la Parmesana", precio: 280, desc: "Pechuga empanizada, marinara y parmesano" },
      { nombre: "Hamburguesa de Rib Eye", precio: 325, desc: "Rib eye, tocino, pepper jack y cebolla caramelizada",
        grupos: [{ nombre: "Quitar", tipo: "multi", opciones: [{ nombre: "Sin cebolla" }, { nombre: "Sin tomate" }, { nombre: "Sin tocino" }] }] },
    ],
  },
  {
    categoria: "Sandwiches",
    items: [
      { nombre: "Grilled Cheese Birria", precio: 235, desc: "Birria con mezcla de quesos y consomé" },
      { nombre: "Sandwich de Arrachera", precio: 235, desc: "Arrachera, pimientos, cebolla y queso monterrey" },
      { nombre: "Sandwich de Pollo", precio: 235, desc: "Pollo a la plancha, tocino, aguacate y pesto",
        grupos: [{ nombre: "Quitar", tipo: "multi", opciones: [{ nombre: "Sin aguacate" }, { nombre: "Sin tocino" }, { nombre: "Sin pesto" }] }] },
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
      { nombre: "Flat White", precio: 65, grupos: [gLeche, gTemp] },
      { nombre: "Capuccino", precio: 75, grupos: [gLeche, gTemp] },
      { nombre: "Latte", precio: 90, grupos: [gLeche, gTemp, { nombre: "Extras", tipo: "multi", opciones: [{ nombre: "Shot de espresso", precio: 20 }] }] },
      { nombre: "Espresso Tonic", precio: 70 },
      { nombre: "Chai", precio: 70, grupos: [
        { nombre: "Sabor", tipo: "unica", obligatorio: true, opciones: [{ nombre: "Especias" }, { nombre: "Plátano" }, { nombre: "Vainilla" }] },
        gLeche, gTemp,
      ] },
      { nombre: "Matcha Latte", precio: 90, grupos: [gLeche, gTemp] },
      { nombre: "Latte de la Casa", precio: 90, grupos: [
        { nombre: "Sabor", tipo: "unica", obligatorio: true, opciones: [{ nombre: "Tiramisú" }, { nombre: "Mazapán" }, { nombre: "Cremina" }, { nombre: "3 leches", precio: 15 }] },
        gLeche, gTemp,
      ] },
    ],
  },
  {
    categoria: "Bebidas",
    items: [
      { nombre: "Cremina Spritz", precio: 75, grupos: [
        { nombre: "Sabor", tipo: "unica", obligatorio: true, opciones: [{ nombre: "Frutos rojos" }, { nombre: "Fresa" }, { nombre: "Jamaica-limón" }, { nombre: "Matcha citrus" }, { nombre: "Lavanda" }, { nombre: "Fruta de la pasión" }] },
      ] },
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
      { nombre: "Pastel de Crepas", precio: 95, grupos: [{ nombre: "Sabor", tipo: "unica", obligatorio: true, opciones: [{ nombre: "Elote" }, { nombre: "Café" }, { nombre: "Dulce de leche" }] }] },
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

type Linea = { id: string; nombre: string; precioUnit: number; qty: number; detalle: string[] };
type Pedido = { cart: Linea[]; total: number; entrega: "recoger" | "domicilio"; direccion: string; nombre: string; notas: string; telefono?: string };

export default function Pedidos() {
  const [cart, setCart] = useState<Linea[]>([]);
  const [custom, setCustom] = useState<Item | null>(null);
  const [abierto, setAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [entrega, setEntrega] = useState<"recoger" | "domicilio">("recoger");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");
  const [activa, setActiva] = useState(0);
  const [pagando, setPagando] = useState(false);
  const [errPago, setErrPago] = useState<string | null>(null);
  const [pagoOk, setPagoOk] = useState(false);
  const [telefono, setTelefono] = useState("");

  const secRefs = useRef<(HTMLElement | null)[]>([]);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => { for (const e of entries) if (e.isIntersecting) setActiva(Number((e.target as HTMLElement).dataset.idx)); },
      { rootMargin: "-120px 0px -70% 0px", threshold: 0 }
    );
    secRefs.current.forEach((s) => s && obs.observe(s));
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    chipRefs.current[activa]?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [activa]);
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("pago");
    if (p === "ok") {
      setPagoOk(true); setCart([]);
    } else if (p === "cancel") {
      try {
        const s = sessionStorage.getItem("platify_pedido");
        if (s) { const d = JSON.parse(s); setCart(d.cart || []); setEntrega(d.entrega || "recoger"); setDireccion(d.direccion || ""); setNombre(d.nombre || ""); setNotas(d.notas || ""); }
      } catch {}
      setErrPago("El pago se canceló. Tu pedido sigue aquí, intenta de nuevo.");
      setAbierto(true);
    }
    if (p) window.history.replaceState({}, "", "/pedidos");
  }, []);

  function addLinea(l: Omit<Linea, "id">) {
    const id = l.nombre + "|" + l.detalle.join("·");
    setCart((c) => {
      const i = c.findIndex((x) => x.id === id);
      if (i >= 0) { const nc = [...c]; nc[i] = { ...nc[i], qty: nc[i].qty + l.qty }; return nc; }
      return [...c, { id, ...l }];
    });
  }
  const incId = (id: string) => setCart((c) => c.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)));
  const decId = (id: string) => setCart((c) => c.flatMap((l) => (l.id === id ? (l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : []) : [l])));
  const qtySimple = (n: string) => cart.find((x) => x.id === n + "|")?.qty || 0;
  const enCarrito = (n: string) => cart.filter((x) => x.nombre === n).reduce((a, l) => a + l.qty, 0);

  const totalItems = cart.reduce((a, l) => a + l.qty, 0);
  const total = cart.reduce((a, l) => a + l.qty * l.precioUnit, 0);

  function tocar(it: Item) {
    if (it.grupos && it.grupos.length) setCustom(it);
    else addLinea({ nombre: it.nombre, precioUnit: it.precio, qty: 1, detalle: [] });
  }

  function msgPagado(p: Pedido) {
    const l = [`Hola ${RESTAURANTE.nombre}, PEDIDO PAGADO ✅ (tarjeta):`, ""];
    for (const ln of p.cart) {
      l.push(`• ${ln.qty}x ${ln.nombre} — ${money(ln.qty * ln.precioUnit)}`);
      for (const d of ln.detalle) l.push(`   - ${d}`);
    }
    l.push("", `Total: ${money(p.total)} (pagado)`);
    l.push(`Entrega: ${p.entrega === "recoger" ? "Paso a recoger" : "A domicilio"}`);
    if (p.entrega === "domicilio" && p.direccion?.trim()) l.push(`Dirección: ${p.direccion.trim()}`);
    if (p.nombre?.trim()) l.push(`Nombre: ${p.nombre.trim()}`);
    if (p.telefono?.trim()) l.push(`Teléfono: ${p.telefono.trim()}`);
    if (p.notas?.trim()) l.push(`Notas: ${p.notas.trim()}`);
    return `https://wa.me/${RESTAURANTE.whatsapp}?text=${encodeURIComponent(l.join("\n"))}`;
  }

  async function pagar() {
    if (!cart.length || pagando) return;
    if (entrega === "domicilio" && !direccion.trim()) { setErrPago("Escribe tu dirección de entrega."); return; }
    setPagando(true); setErrPago(null);
    const pedido: Pedido = { cart, total, entrega, direccion, nombre, notas, telefono };
    try { sessionStorage.setItem("platify_pedido", JSON.stringify(pedido)); } catch {}
    try {
      const res = await fetch("/api/pedido", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: cart, total, entrega, nombre, telefono, direccion, notas, restaurante: RESTAURANTE.nombre,
        }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; return; }
      setErrPago(data.error || "No se pudo iniciar el pago.");
    } catch {
      setErrPago("No se pudo conectar con el pago. Revisa tu internet.");
    }
    setPagando(false);
  }

  function avisarPagado() {
    let pedido: Pedido = { cart, total, entrega, direccion, nombre, notas, telefono };
    try { const s = sessionStorage.getItem("platify_pedido"); if (s) pedido = JSON.parse(s); } catch {}
    window.open(msgPagado(pedido), "_blank");
  }

  return (
    <div style={{ background: "#dfe7e6", minHeight: "100vh" }}>
      <div style={{ maxWidth: "460px", margin: "0 auto", background: "#f7faf9", minHeight: "100vh", position: "relative", boxShadow: "0 0 40px rgba(14,58,57,0.15)" }}>
        {/* App bar */}
        <div style={{ position: "sticky", top: 0, zIndex: 30, background: PRIMARY, color: "#fff", height: "54px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "17px" }}>
          {RESTAURANTE.nombre}
        </div>
        <div style={{ background: PRIMARY, color: "#fff", padding: "4px 20px 22px", textAlign: "center" }}>
          <div style={{ fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: ACCENT, fontWeight: 700 }}>🛵 Pedido en línea · pago con tarjeta</div>
          <p style={{ color: "#cfe0de", marginTop: "6px", fontSize: "13px" }}>Arma tu pedido, paga en línea y lo preparamos</p>
        </div>

        {/* Pestañas de categorías */}
        <div style={{ position: "sticky", top: "54px", zIndex: 25, background: "#fff", borderBottom: `1px solid ${LINEA}`, display: "flex", gap: "8px", overflowX: "auto", padding: "10px 14px", WebkitOverflowScrolling: "touch" }}>
          {MENU.map((c, i) => {
            const act = i === activa;
            return (
              <button key={c.categoria} ref={(el) => { chipRefs.current[i] = el; }}
                onClick={() => secRefs.current[i]?.scrollIntoView({ behavior: "smooth" })}
                style={{ flexShrink: 0, border: "none", cursor: "pointer", borderRadius: "20px", padding: "8px 14px", fontSize: "13px", fontWeight: 700, background: act ? PRIMARY : "#eef2f1", color: act ? "#fff" : MUTED, transition: "all .2s" }}>
                {c.categoria}
              </button>
            );
          })}
        </div>

        {/* Menú */}
        <div style={{ padding: "8px 14px", paddingBottom: totalItems ? "104px" : "40px" }}>
          {MENU.map((cat, i) => (
            <section key={cat.categoria} data-idx={i} ref={(el) => { secRefs.current[i] = el; }} style={{ scrollMarginTop: "112px", marginBottom: "18px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: PRIMARY, margin: "12px 2px 10px" }}>{cat.categoria}</h2>
              <div style={{ display: "grid", gap: "8px" }}>
                {cat.items.map((it) => {
                  const tieneGrupos = !!(it.grupos && it.grupos.length);
                  const q = tieneGrupos ? enCarrito(it.nombre) : qtySimple(it.nombre);
                  return (
                    <div key={it.nombre} onClick={() => setCustom(it)}
                      style={{ background: "#fff", borderRadius: "14px", padding: "14px", display: "flex", alignItems: "center", gap: "12px", border: `1px solid ${LINEA}`, cursor: "pointer" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: PRIMARY, fontSize: "15px" }}>
                          {it.nombre}{tieneGrupos && <span style={{ color: ACCENT, fontSize: "12px", fontWeight: 700 }}> · personaliza</span>}
                        </div>
                        {it.desc && <div style={{ color: MUTED, fontSize: "12.5px", marginTop: "2px", lineHeight: 1.4 }}>{it.desc}</div>}
                        <div style={{ color: ACCENT, fontWeight: 800, marginTop: "5px", fontSize: "15px" }}>{money(it.precio)}</div>
                      </div>
                      {tieneGrupos ? (
                        <button onClick={(e) => { e.stopPropagation(); tocar(it); }} aria-label={`Personalizar ${it.nombre}`}
                          style={{ position: "relative", background: ORANGE, color: "#fff", border: "none", borderRadius: "12px", width: "42px", height: "42px", fontSize: "24px", fontWeight: 700, cursor: "pointer", flexShrink: 0, lineHeight: 1 }}>
                          +{q > 0 && <span style={{ position: "absolute", top: "-6px", right: "-6px", background: PRIMARY, color: "#fff", borderRadius: "10px", fontSize: "11px", padding: "1px 6px", fontWeight: 800 }}>{q}</span>}
                        </button>
                      ) : q === 0 ? (
                        <button onClick={(e) => { e.stopPropagation(); addLinea({ nombre: it.nombre, precioUnit: it.precio, qty: 1, detalle: [] }); }} aria-label={`Agregar ${it.nombre}`}
                          style={{ background: ORANGE, color: "#fff", border: "none", borderRadius: "12px", width: "42px", height: "42px", fontSize: "24px", fontWeight: 700, cursor: "pointer", flexShrink: 0, lineHeight: 1 }}>+</button>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                          <button onClick={(e) => { e.stopPropagation(); decId(it.nombre + "|"); }} aria-label="Quitar" style={qtyBtn}>−</button>
                          <span style={{ fontWeight: 800, minWidth: "20px", textAlign: "center", color: PRIMARY }}>{q}</span>
                          <button onClick={(e) => { e.stopPropagation(); incId(it.nombre + "|"); }} aria-label="Agregar" style={{ ...qtyBtn, background: ORANGE, color: "#fff", borderColor: ORANGE }}>+</button>
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

        {/* Barra del carrito */}
        {totalItems > 0 && (
          <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "min(460px, 100%)", background: "#fff", borderTop: `1px solid ${LINEA}`, padding: "12px 16px", boxShadow: "0 -6px 20px rgba(14,58,57,0.1)", zIndex: 40 }}>
            <button onClick={() => setAbierto(true)} style={{ width: "100%", background: ACCENT, color: "#fff", border: "none", borderRadius: "14px", padding: "15px 18px", fontWeight: 800, fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ background: "rgba(255,255,255,0.25)", borderRadius: "8px", padding: "2px 9px", fontSize: "14px" }}>{totalItems}</span>
              <span>Ver pedido</span>
              <span>{money(total)}</span>
            </button>
          </div>
        )}

        {/* Hoja: personalizar platillo */}
        {custom && <Personalizar item={custom} onClose={() => setCustom(null)} onAdd={(l) => { addLinea(l); setCustom(null); }} />}

        {/* Hoja: pedido + datos */}
        {abierto && (
          <div onClick={(e) => { if (e.target === e.currentTarget) setAbierto(false); }} style={sheetBg}>
            <div style={sheet}>
              <div style={grip} />
              <h2 style={{ color: PRIMARY, margin: "0 0 12px", fontWeight: 800, fontSize: "20px" }}>Tu pedido</h2>
              <div style={{ display: "grid", gap: "12px", marginBottom: "16px" }}>
                {cart.map((ln) => (
                  <div key={ln.id} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: PRIMARY, fontSize: "15px" }}>{ln.nombre}</div>
                      {ln.detalle.map((d, k) => <div key={k} style={{ color: MUTED, fontSize: "12.5px" }}>{d}</div>)}
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
                        <button onClick={() => decId(ln.id)} style={qtyBtnSm}>−</button>
                        <span style={{ fontWeight: 800, minWidth: "18px", textAlign: "center", color: PRIMARY }}>{ln.qty}</span>
                        <button onClick={() => incId(ln.id)} style={{ ...qtyBtnSm, background: ORANGE, color: "#fff", borderColor: ORANGE }}>+</button>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: PRIMARY }}>{money(ln.qty * ln.precioUnit)}</div>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${LINEA}`, paddingTop: "10px", fontSize: "17px", fontWeight: 800, color: PRIMARY }}>
                  <span>Total</span><span>{money(total)}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                {(["recoger", "domicilio"] as const).map((op) => (
                  <button key={op} onClick={() => setEntrega(op)} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: `2px solid ${entrega === op ? ACCENT : LINEA}`, background: entrega === op ? "rgba(46,196,182,0.1)" : "#fff", color: PRIMARY, fontWeight: 700, cursor: "pointer" }}>
                    {op === "recoger" ? "Paso a recoger" : "A domicilio"}
                  </button>
                ))}
              </div>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" style={inp} />
              <input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono (para avisarte)" inputMode="tel" style={inp} />
              {entrega === "domicilio" && <input value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección de entrega" style={inp} />}
              <input value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Notas del pedido (opcional)" style={inp} />
              {errPago && <div style={{ color: "#c0392b", fontSize: "13px", margin: "2px 2px 8px", fontWeight: 600 }}>{errPago}</div>}
              <button onClick={pagar} disabled={pagando} style={{ width: "100%", background: PRIMARY, color: "#fff", border: "none", borderRadius: "14px", padding: "16px", fontWeight: 800, fontSize: "16px", cursor: pagando ? "wait" : "pointer", marginTop: "8px", opacity: pagando ? 0.7 : 1 }}>
                {pagando ? "Redirigiendo al pago…" : `Pagar ${money(total)}`}
              </button>
              <p style={{ textAlign: "center", color: MUTED, fontSize: "12px", marginTop: "8px" }}>🔒 Pago seguro con tarjeta · procesado por Stripe</p>
              <button onClick={() => setAbierto(false)} style={{ width: "100%", background: "none", border: "none", color: MUTED, padding: "12px", marginTop: "2px", cursor: "pointer" }}>Seguir agregando</button>
            </div>
          </div>
        )}

        {/* Pantalla de éxito tras pagar */}
        {pagoOk && (
          <div style={sheetBg}>
            <div style={{ ...sheet, textAlign: "center" }}>
              <div style={{ fontSize: "52px" }}>✅</div>
              <h2 style={{ color: PRIMARY, fontWeight: 800, margin: "6px 0 8px", fontSize: "22px" }}>¡Pago recibido!</h2>
              <p style={{ color: MUTED, fontSize: "14px", marginBottom: "18px", lineHeight: 1.5 }}>
                Tu pedido ya entró a la cocina. ¡Lo estamos preparando! 🧑‍🍳
              </p>
              <button onClick={avisarPagado} style={{ width: "100%", background: "#25D366", color: "#fff", border: "none", borderRadius: "14px", padding: "16px", fontWeight: 800, fontSize: "16px", cursor: "pointer" }}>
                Enviar copia por WhatsApp (opcional)
              </button>
              <button onClick={() => setPagoOk(false)} style={{ width: "100%", background: "none", border: "none", color: MUTED, padding: "12px", marginTop: "4px", cursor: "pointer" }}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Hoja para personalizar un platillo ──
function Personalizar({ item, onAdd, onClose }: { item: Item; onAdd: (l: Omit<Linea, "id">) => void; onClose: () => void }) {
  const [sel, setSel] = useState<Record<string, string[]>>({});
  const [qty, setQty] = useState(1);
  const [comentario, setComentario] = useState("");
  const grupos = item.grupos || [];

  const toggle = (g: Grupo, op: Opcion) =>
    setSel((s) => {
      const cur = s[g.nombre] || [];
      if (g.tipo === "unica") return { ...s, [g.nombre]: [op.nombre] };
      return { ...s, [g.nombre]: cur.includes(op.nombre) ? cur.filter((x) => x !== op.nombre) : [...cur, op.nombre] };
    });

  const extras = grupos.flatMap((g) => (sel[g.nombre] || []).map((on) => g.opciones.find((o) => o.nombre === on)?.precio || 0)).reduce((a, b) => a + b, 0);
  const unit = item.precio + extras;
  const faltan = grupos.filter((g) => g.obligatorio && !(sel[g.nombre]?.length));

  function agregar() {
    if (faltan.length) return;
    const detalle: string[] = [];
    for (const g of grupos) for (const on of sel[g.nombre] || []) {
      const o = g.opciones.find((x) => x.nombre === on);
      detalle.push(o?.precio ? `${on} (+${money(o.precio)})` : `${g.nombre === "Quitar" ? "Sin " : ""}${on}`.replace("Sin Sin ", "Sin "));
    }
    if (comentario.trim()) detalle.push("📝 " + comentario.trim());
    onAdd({ nombre: item.nombre, precioUnit: unit, qty, detalle });
  }

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={sheetBg}>
      <div style={sheet}>
        <div style={grip} />
        <h2 style={{ color: PRIMARY, margin: "0 0 2px", fontWeight: 800, fontSize: "20px" }}>{item.nombre}</h2>
        {item.desc && <p style={{ color: MUTED, fontSize: "13px", margin: "0 0 14px" }}>{item.desc}</p>}

        {grupos.map((g) => (
          <div key={g.nombre} style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontWeight: 800, color: PRIMARY, fontSize: "15px" }}>{g.nombre}</span>
              <span style={{ color: MUTED, fontSize: "12px" }}>{g.obligatorio ? "Obligatorio" : g.tipo === "multi" ? "Varios" : "Elige 1"}</span>
            </div>
            <div style={{ display: "grid", gap: "8px" }}>
              {g.opciones.map((op) => {
                const on = (sel[g.nombre] || []).includes(op.nombre);
                return (
                  <button key={op.nombre} onClick={() => toggle(g, op)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: "12px", border: `2px solid ${on ? ACCENT : LINEA}`, background: on ? "rgba(46,196,182,0.08)" : "#fff", cursor: "pointer", textAlign: "left" }}>
                    <span style={{ color: PRIMARY, fontWeight: 600 }}>{op.nombre}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {op.precio ? <span style={{ color: ORANGE, fontWeight: 700, fontSize: "14px" }}>+{money(op.precio)}</span> : null}
                      <span style={{ width: "22px", height: "22px", borderRadius: g.tipo === "unica" ? "50%" : "6px", border: `2px solid ${on ? ACCENT : "#cdd8d6"}`, background: on ? ACCENT : "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "13px", fontWeight: 800 }}>{on ? "✓" : ""}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{ marginBottom: "6px" }}>
          <div style={{ fontWeight: 800, color: PRIMARY, fontSize: "15px", marginBottom: "8px" }}>Comentarios</div>
          <textarea value={comentario} onChange={(e) => setComentario(e.target.value)} rows={2}
            placeholder="Ej. sin crema ni verduras, bien dorado, salsa aparte…"
            style={{ ...inp, resize: "vertical", lineHeight: 1.4 }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px", margin: "8px 0 14px", justifyContent: "center" }}>
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={qtyBtn}>−</button>
          <span style={{ fontWeight: 800, fontSize: "18px", color: PRIMARY, minWidth: "24px", textAlign: "center" }}>{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} style={{ ...qtyBtn, background: ORANGE, color: "#fff", borderColor: ORANGE }}>+</button>
        </div>

        <button onClick={agregar} disabled={faltan.length > 0}
          style={{ width: "100%", background: faltan.length ? "#cdd8d6" : ACCENT, color: "#fff", border: "none", borderRadius: "14px", padding: "16px", fontWeight: 800, fontSize: "16px", cursor: faltan.length ? "not-allowed" : "pointer" }}>
          {faltan.length ? `Elige: ${faltan.map((g) => g.nombre).join(", ")}` : `Agregar — ${money(unit * qty)}`}
        </button>
        <button onClick={onClose} style={{ width: "100%", background: "none", border: "none", color: MUTED, padding: "12px", marginTop: "4px", cursor: "pointer" }}>Cancelar</button>
      </div>
    </div>
  );
}

const qtyBtn: React.CSSProperties = { width: "38px", height: "38px", borderRadius: "10px", border: "2px solid #e6efee", background: "#fff", color: "#0e3a39", fontSize: "20px", fontWeight: 700, cursor: "pointer", lineHeight: 1 };
const qtyBtnSm: React.CSSProperties = { ...qtyBtn, width: "30px", height: "30px", fontSize: "17px", borderRadius: "8px" };
const inp: React.CSSProperties = { width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #dfe7e6", marginBottom: "10px", fontSize: "15px", fontFamily: "inherit" };
const sheetBg: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(14,58,57,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 };
const sheet: React.CSSProperties = { background: "#fff", width: "min(460px, 100%)", borderRadius: "22px 22px 0 0", padding: "22px", maxHeight: "92vh", overflowY: "auto" };
const grip: React.CSSProperties = { width: "44px", height: "5px", background: "#dfe7e6", borderRadius: "3px", margin: "0 auto 16px" };
