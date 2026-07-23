"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Pantalla de Pedidos (caja) — lee los pedidos pagados de Stripe vía /api/caja.
// Sin Firebase. Se protege con contraseña (CAJA_PASSWORD en Vercel).
type Item = { n: string; q: number; importe: number };
type Order = { id: string; created: number; total: number; cliente: string; telefono: string; tipo: string; direccion: string; notas: string; items: Item[]; atendido?: boolean };

const PRIMARY = "#0e3a39";
const CREAM = "#ffedb8";
const ORANGE = "#ff9f1c";
const money = (n: number) => "$" + n.toLocaleString("es-MX");

export default function Caja() {
  const [key, setKey] = useState("");
  const [entrado, setEntrado] = useState(false);
  const [err, setErr] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [conn, setConn] = useState<"on" | "off">("off");
  const [muted, setMuted] = useState(false);
  const [vista, setVista] = useState<"activos" | "historial">("activos");

  const audioRef = useRef<AudioContext | null>(null);
  const vistos = useRef<Set<string>>(new Set());

  // Cargar contraseña recordada
  useEffect(() => {
    const k = localStorage.getItem("caja_key");
    if (k) { setKey(k); }
  }, []);

  const beep = useCallback(() => {
    const ctx = audioRef.current;
    if (!ctx) return;
    const t = ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square";
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, t + i * 0.25);
      g.gain.exponentialRampToValueAtTime(0.25, t + i * 0.25 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.25 + 0.18);
      o.connect(g); g.connect(ctx.destination);
      o.start(t + i * 0.25); o.stop(t + i * 0.25 + 0.2);
    }
  }, []);

  const cargar = useCallback(async (k: string, v: "activos" | "historial") => {
    try {
      const res = await fetch(`/api/caja?key=${encodeURIComponent(k)}${v === "historial" ? "&hist=1" : ""}`, { cache: "no-store" });
      if (res.status === 401) { setErr("Contraseña incorrecta."); setEntrado(false); setConn("off"); return; }
      const data = await res.json();
      if (!res.ok) { setConn("off"); return; }
      setConn("on");
      const nuevos: Order[] = data.orders || [];
      if (v === "activos") {
        // ¿hay pedidos que no habíamos visto? → alarma
        const hayNuevo = nuevos.some((o) => !vistos.current.has(o.id));
        nuevos.forEach((o) => vistos.current.add(o.id));
        if (hayNuevo && nuevos.length > 0 && !muted) beep();
      }
      setOrders(nuevos);
    } catch { setConn("off"); }
  }, [muted, beep]);

  // Polling cada 6s cuando ya entró (recarga al cambiar de vista)
  useEffect(() => {
    if (!entrado) return;
    setOrders([]);
    cargar(key, vista);
    const t = setInterval(() => cargar(key, vista), 6000);
    return () => clearInterval(t);
  }, [entrado, key, vista, cargar]);

  // Alarma en bucle mientras haya pedidos activos sin atender (cada 3s)
  useEffect(() => {
    if (!entrado || muted || vista !== "activos" || orders.length === 0) return;
    const t = setInterval(() => beep(), 3000);
    return () => clearInterval(t);
  }, [entrado, muted, vista, orders.length, beep]);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    // Desbloquear audio (los navegadores exigen un gesto)
    try { audioRef.current = new AudioContext(); await audioRef.current.resume(); } catch {}
    const res = await fetch(`/api/caja?key=${encodeURIComponent(key)}`, { cache: "no-store" });
    if (res.status === 401) { setErr("Contraseña incorrecta."); return; }
    if (!res.ok) { setErr("No se pudo conectar. Revisa que STRIPE_SECRET_KEY esté configurada."); return; }
    localStorage.setItem("caja_key", key);
    setEntrado(true);
    const data = await res.json();
    (data.orders || []).forEach((o: Order) => vistos.current.add(o.id));
    setOrders(data.orders || []);
  }

  async function atendido(id: string) {
    setOrders((os) => os.filter((o) => o.id !== id)); // optimista
    try { await fetch("/api/caja", { method: "POST", headers: { "content-type": "application/json", "x-caja-key": key }, body: JSON.stringify({ id }) }); } catch {}
  }

  // ---- Pantalla de acceso ----
  if (!entrado) {
    return (
      <div style={{ minHeight: "100vh", background: PRIMARY, color: CREAM, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <form onSubmit={entrar} style={{ width: "min(360px,100%)", textAlign: "center" }}>
          <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: "2rem", letterSpacing: "-.02em" }}>
            <span style={{ color: ORANGE }}>▲</span> Platify
          </div>
          <h2 style={{ margin: "8px 0 4px", fontWeight: 700 }}>Pantalla de Pedidos</h2>
          <p style={{ color: "rgba(255,237,184,.7)", fontSize: ".9rem", marginBottom: "18px" }}>Ingresa la contraseña de la caja para ver los pedidos.</p>
          <input type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Contraseña de caja" autoFocus
            style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", fontSize: "16px", marginBottom: "10px", textAlign: "center" }} />
          <div style={{ color: "#ffb4a1", fontSize: ".85rem", minHeight: "1.2rem", marginBottom: "6px" }}>{err}</div>
          <button type="submit" style={{ width: "100%", background: ORANGE, color: "#fff", border: "none", borderRadius: "12px", padding: "15px", fontWeight: 800, fontSize: "16px", cursor: "pointer" }}>
            ▶ Iniciar turno
          </button>
          <p style={{ color: "rgba(255,237,184,.5)", fontSize: ".75rem", marginTop: "14px" }}>Los pedidos pagados en línea aparecen aquí con alarma.</p>
        </form>
      </div>
    );
  }

  // ---- Pantalla de pedidos ----
  return (
    <div style={{ minHeight: "100vh", background: "#f4efe2" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: PRIMARY, color: CREAM, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: ".7rem 1.1rem", flexWrap: "wrap" }}>
        <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-.02em" }}>
          <span style={{ color: ORANGE }}>▲</span> Platify
          <span style={{ display: "block", fontSize: ".58rem", letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(255,237,184,.7)", fontWeight: 600 }}>Pedidos · Caja</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: ".6rem", flexWrap: "wrap" }}>
          <span style={{ background: "rgba(255,237,184,.12)", border: "1px solid rgba(255,237,184,.25)", borderRadius: "999px", padding: ".3rem .8rem", fontSize: ".85rem", display: "flex", alignItems: "center", gap: ".4rem" }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: conn === "on" ? "#5fd08a" : "#c0563f" }} />
            {conn === "on" ? "En línea" : "Sin conexión"}
          </span>
          <span style={{ background: orders.length ? CREAM : "rgba(255,237,184,.12)", color: orders.length ? PRIMARY : CREAM, fontWeight: 700, borderRadius: "999px", padding: ".3rem .8rem", fontSize: ".85rem" }}>
            {orders.length} {orders.length === 1 ? "pedido" : "pedidos"}
          </span>
          <button onClick={() => setMuted((m) => !m)} title="Silenciar alarma"
            style={{ background: "rgba(255,237,184,.12)", border: "1px solid rgba(255,237,184,.25)", color: CREAM, borderRadius: "10px", padding: ".3rem .6rem", cursor: "pointer", fontSize: "1rem" }}>
            {muted ? "🔕" : "🔔"}
          </button>
        </div>
      </header>

      <div style={{ display: "flex", gap: "8px", padding: "10px 16px 0", maxWidth: "1100px", margin: "0 auto" }}>
        {(["activos", "historial"] as const).map((v) => (
          <button key={v} onClick={() => setVista(v)}
            style={{ border: "none", cursor: "pointer", borderRadius: "999px", padding: "9px 18px", fontWeight: 700, fontSize: "14px", background: vista === v ? PRIMARY : "#e7e2d3", color: vista === v ? "#fff" : "#6f6a5c" }}>
            {v === "activos" ? "🔔 Activos" : "🗂️ Historial"}
          </button>
        ))}
      </div>

      <main style={{ padding: "16px", maxWidth: "1100px", margin: "0 auto" }}>
        {orders.length === 0 ? (
          <div style={{ textAlign: "center", color: "#6f6a5c", padding: "60px 20px" }}>
            <div style={{ fontFamily: "Poppins,sans-serif", fontSize: "1.8rem", fontWeight: 800, color: PRIMARY, marginBottom: ".3rem" }}>{vista === "activos" ? "Todo al día" : "Sin historial"}</div>
            {vista === "activos" ? "No hay pedidos pendientes. Cuando entre uno nuevo, sonará la alarma. 🔔" : "No hay pedidos en los últimos 3 días."}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
            {orders.map((o) => {
              const domicilio = o.tipo === "domicilio";
              return (
                <div key={o.id} style={{ background: "#fff", borderRadius: "16px", padding: "16px", boxShadow: "0 2px 10px rgba(14,58,57,.08)", border: "1px solid rgba(14,58,57,.1)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span style={{ fontSize: ".72rem", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700, padding: ".2rem .6rem", borderRadius: "999px", color: "#fff", background: domicilio ? "#c98a2b" : "#3f8a5c" }}>
                      {domicilio ? "🛵 Domicilio" : "🏪 Recoger"}
                    </span>
                    <span style={{ fontSize: ".78rem", color: "#6f6a5c" }}>{new Date(o.created * 1000).toLocaleString("es-MX", vista === "historial" ? { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" } : { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <div style={{ fontWeight: 700, color: PRIMARY, fontSize: "1.05rem" }}>{o.cliente || "Cliente"}</div>
                  {o.telefono && <div style={{ fontSize: ".85rem", color: PRIMARY }}>📞 {o.telefono}</div>}
                  {domicilio && o.direccion && <div style={{ fontSize: ".82rem", color: "#6f6a5c" }}>📍 {o.direccion}</div>}

                  <div style={{ margin: "10px 0", borderTop: "1px dashed rgba(14,58,57,.15)", paddingTop: "10px" }}>
                    {o.items.map((it, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: ".92rem", marginBottom: "4px" }}>
                        <span style={{ color: "#22201a" }}><b>{it.q}×</b> {it.n}</span>
                        <span style={{ color: "#6f6a5c" }}>{money(it.importe)}</span>
                      </div>
                    ))}
                  </div>

                  {o.notas && <div style={{ background: "#fff6df", border: "1px solid #efd799", borderRadius: "10px", padding: ".5rem .7rem", fontSize: ".85rem", marginBottom: "10px" }}>📝 {o.notas}</div>}

                  <span style={{ display: "inline-flex", alignItems: "center", gap: ".3rem", fontSize: ".72rem", fontWeight: 600, padding: ".15rem .5rem", borderRadius: "999px", background: "rgba(63,138,92,.15)", color: "#3f8a5c" }}>✅ Pagado con tarjeta</span>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "12px" }}>
                    <span style={{ flex: 1, fontSize: "1.35rem", fontWeight: 700, color: PRIMARY }}>{money(o.total)}</span>
                    {vista === "activos" ? (
                      <button onClick={() => atendido(o.id)} style={{ background: PRIMARY, color: "#fff", border: "none", borderRadius: "12px", padding: "12px 18px", fontWeight: 800, cursor: "pointer", fontSize: "15px" }}>✓ Atendido</button>
                    ) : (
                      <span style={{ fontSize: ".82rem", fontWeight: 700, color: o.atendido ? "#3f8a5c" : "#c98a2b" }}>{o.atendido ? "✓ Atendido" : "● Pendiente"}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
