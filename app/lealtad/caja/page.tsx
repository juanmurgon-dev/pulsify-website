"use client";

import { useState } from "react";

// Platify Lealtad — pantalla de caja: dar sellos y canjear premios.
// Usa la misma contraseña que la Pantalla de Pedidos (CAJA_PASSWORD).
const PRIMARY = "#0e3a39";
const ACCENT = "#2ec4b6";
const ORANGE = "#ff9f1c";
const MUTED = "#5a6b6a";

type Cliente = { encontrado?: boolean; nombre: string; sellos: number; meta: number; puedeCanjear: boolean };

export default function LealtadCaja() {
  const [key, setKey] = useState("");
  const [entrado, setEntrado] = useState(false);
  const [errLogin, setErrLogin] = useState("");
  const [tel, setTel] = useState("");
  const [nombre, setNombre] = useState("");
  const [cli, setCli] = useState<Cliente | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErrLogin("");
    const t = await fetch(`/api/lealtad`, { method: "POST", headers: { "content-type": "application/json", "x-caja-key": key }, body: JSON.stringify({ accion: "auth" }) });
    if (t.status === 401) { setErrLogin("Contraseña incorrecta."); return; }
    if (!t.ok) { setErrLogin("No se pudo conectar."); return; }
    localStorage.setItem("caja_key", key);
    setEntrado(true);
  }

  async function consultar() {
    setMsg(""); setCli(null); if (!tel.trim()) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/lealtad?tel=${encodeURIComponent(tel)}`, { cache: "no-store" });
      const d = await res.json();
      if (res.ok) { setCli(d); if (d.nombre) setNombre(d.nombre); }
      else setMsg(d.error || "Error");
    } catch { setMsg("Error de conexión"); }
    setBusy(false);
  }

  async function accion(a: "sello" | "canjea") {
    setBusy(true); setMsg("");
    try {
      const res = await fetch(`/api/lealtad`, { method: "POST", headers: { "content-type": "application/json", "x-caja-key": key }, body: JSON.stringify({ tel, nombre, accion: a }) });
      const d = await res.json();
      if (!res.ok) { setMsg(d.error || "Error"); }
      else {
        setCli({ nombre: d.nombre, sellos: d.sellos, meta: d.meta, puedeCanjear: d.puedeCanjear, encontrado: true });
        setMsg(a === "sello" ? "✅ Sello agregado" : "🎁 Premio canjeado");
      }
    } catch { setMsg("Error de conexión"); }
    setBusy(false);
  }

  if (!entrado) {
    return (
      <div style={{ minHeight: "100vh", background: PRIMARY, color: "#ffeeb8", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <form onSubmit={entrar} style={{ width: "min(360px,100%)", textAlign: "center" }}>
          <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: "1.8rem" }}><span style={{ color: ORANGE }}>▲</span> Platify</div>
          <h2 style={{ margin: "8px 0 4px" }}>Lealtad · Caja</h2>
          <p style={{ color: "rgba(255,237,184,.7)", fontSize: ".9rem", marginBottom: "18px" }}>Contraseña de la caja para dar/canjear sellos.</p>
          <input type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Contraseña" autoFocus
            style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", fontSize: "16px", textAlign: "center", marginBottom: "8px" }} />
          <div style={{ color: "#ffb4a1", fontSize: ".85rem", minHeight: "1.1rem", marginBottom: "6px" }}>{errLogin}</div>
          <button type="submit" style={{ width: "100%", background: ORANGE, color: "#fff", border: "none", borderRadius: "12px", padding: "15px", fontWeight: 800, fontSize: "16px", cursor: "pointer" }}>Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f4efe2" }}>
      <header style={{ background: PRIMARY, color: "#ffeeb8", padding: ".8rem 1.1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: "1.3rem" }}><span style={{ color: ORANGE }}>▲</span> Platify · Lealtad</div>
        <a href="/caja" style={{ color: "rgba(255,237,184,.8)", fontSize: ".85rem", textDecoration: "none" }}>Ir a Pedidos →</a>
      </header>

      <main style={{ maxWidth: 480, margin: "0 auto", padding: "20px" }}>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "18px", border: "1px solid rgba(14,58,57,.1)" }}>
          <label style={{ fontSize: ".9rem", color: MUTED, fontWeight: 600 }}>Teléfono del cliente</label>
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <input value={tel} onChange={(e) => setTel(e.target.value)} inputMode="tel" placeholder="Teléfono" style={inp} />
            <button onClick={consultar} disabled={busy} style={{ background: PRIMARY, color: "#fff", border: "none", borderRadius: "12px", padding: "0 18px", fontWeight: 700, cursor: "pointer" }}>Buscar</button>
          </div>

          {cli && (
            <div style={{ marginTop: "16px" }}>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del cliente (opcional)" style={{ ...inp, marginBottom: "12px" }} />
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <div style={{ fontSize: "2.6rem", fontWeight: 800, color: PRIMARY, lineHeight: 1 }}>{cli.sellos}<span style={{ fontSize: "1.1rem", color: MUTED, fontWeight: 600 }}> / {cli.meta}</span></div>
                <div style={{ fontSize: ".9rem", color: MUTED }}>{cli.encontrado === false ? "Cliente nuevo (se crea al dar el primer sello)" : cli.puedeCanjear ? "🎁 ¡Tiene premio disponible!" : "sellos"}</div>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button onClick={() => accion("sello")} disabled={busy} style={{ flex: 1, background: ORANGE, color: "#fff", border: "none", borderRadius: "12px", padding: "16px", fontWeight: 800, fontSize: "16px", cursor: "pointer" }}>＋ Sello</button>
                <button onClick={() => accion("canjea")} disabled={busy || !cli.puedeCanjear} style={{ flex: 1, background: cli.puedeCanjear ? ACCENT : "#cdd8d6", color: "#fff", border: "none", borderRadius: "12px", padding: "16px", fontWeight: 800, fontSize: "16px", cursor: cli.puedeCanjear ? "pointer" : "not-allowed" }}>🎁 Canjear</button>
              </div>
            </div>
          )}
          {msg && <div style={{ marginTop: "12px", textAlign: "center", fontWeight: 700, color: PRIMARY }}>{msg}</div>}
        </div>
        <p style={{ textAlign: "center", color: MUTED, fontSize: ".8rem", marginTop: "16px" }}>Junta {cli?.meta ?? 10} sellos → premio. Cada visita, un sello.</p>
      </main>
    </div>
  );
}

const inp: React.CSSProperties = { flex: 1, width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #dfe7e6", fontSize: "16px", fontFamily: "inherit" };
