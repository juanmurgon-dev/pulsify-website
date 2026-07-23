"use client";

import { useState } from "react";

// Platify Lealtad — tarjeta de sellos del cliente. Consulta su saldo por teléfono.
const PRIMARY = "#0e3a39";
const ACCENT = "#2ec4b6";
const ORANGE = "#ff9f1c";
const CREAM = "#ffeeb8";
const MUTED = "#5a6b6a";
const NEGOCIO = "Cremina Café"; // ← editable

type Saldo = { encontrado: boolean; nombre: string; sellos: number; meta: number; faltan: number; puedeCanjear: boolean };

export default function Lealtad() {
  const [tel, setTel] = useState("");
  const [saldo, setSaldo] = useState<Saldo | null>(null);
  const [cargando, setCargando] = useState(false);
  const [err, setErr] = useState("");

  async function consultar(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setCargando(true); setSaldo(null);
    try {
      const res = await fetch(`/api/lealtad?tel=${encodeURIComponent(tel)}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || "No se pudo consultar."); }
      else setSaldo(data);
    } catch { setErr("No se pudo conectar."); }
    setCargando(false);
  }

  const meta = saldo?.meta ?? 10;

  return (
    <div style={{ minHeight: "100vh", background: PRIMARY, color: "#fff", padding: "0" }}>
      <div style={{ maxWidth: 460, margin: "0 auto", padding: "28px 20px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "1.6rem" }}>
            <span style={{ color: ORANGE }}>▲</span> Platify <span style={{ fontWeight: 400, opacity: .7 }}>Lealtad</span>
          </div>
          <p style={{ color: "rgba(255,255,255,.7)", marginTop: "6px", fontSize: ".95rem" }}>Tu tarjeta de sellos de {NEGOCIO}</p>
        </div>

        {/* Tarjeta */}
        <div style={{ background: "linear-gradient(150deg, #124746, #0e3a39)", border: `1px solid rgba(255,255,255,.12)`, borderRadius: "22px", padding: "22px", boxShadow: "0 12px 40px rgba(0,0,0,.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: ".78rem", letterSpacing: ".14em", textTransform: "uppercase", color: ACCENT, fontWeight: 700 }}>🎟️ Tarjeta de sellos</span>
            <span style={{ fontSize: ".78rem", color: "rgba(255,255,255,.55)" }}>Junta {meta} · premio 🎁</span>
          </div>

          {/* Sellos */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", marginBottom: "8px" }}>
            {Array.from({ length: meta }).map((_, i) => {
              const lleno = (saldo?.sellos ?? 0) > i;
              return (
                <div key={i} style={{ aspectRatio: "1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: lleno ? ORANGE : "rgba(255,255,255,.06)", border: `2px solid ${lleno ? ORANGE : "rgba(255,255,255,.18)"}`,
                  color: lleno ? "#fff" : "rgba(255,255,255,.3)", fontSize: "1.1rem", fontWeight: 800, transition: "all .2s" }}>
                  {lleno ? "★" : i + 1}
                </div>
              );
            })}
          </div>

          {saldo && (
            <div style={{ marginTop: "16px", textAlign: "center" }}>
              {saldo.puedeCanjear ? (
                <div style={{ background: "rgba(46,196,182,.15)", border: `1px solid ${ACCENT}`, borderRadius: "12px", padding: "12px" }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: CREAM }}>🎁 ¡Tienes un premio!</div>
                  <div style={{ fontSize: ".85rem", color: "rgba(255,255,255,.8)" }}>Muestra esta pantalla en caja para canjearlo.</div>
                </div>
              ) : (
                <div style={{ fontSize: "1rem", color: "rgba(255,255,255,.85)" }}>
                  {saldo.encontrado ? <>Tienes <b style={{ color: CREAM }}>{saldo.sellos}</b> {saldo.sellos === 1 ? "sello" : "sellos"} · te faltan <b style={{ color: ORANGE }}>{saldo.faltan}</b> para tu premio</>
                    : <>Aún no tienes sellos. ¡Pide en caja que te den de alta! 🎟️</>}
                </div>
              )}
              {saldo.nombre && <div style={{ marginTop: "8px", fontSize: ".82rem", color: "rgba(255,255,255,.5)" }}>{saldo.nombre}</div>}
            </div>
          )}
        </div>

        {/* Consulta */}
        <form onSubmit={consultar} style={{ marginTop: "22px" }}>
          <label style={{ fontSize: ".9rem", color: "rgba(255,255,255,.8)" }}>Consulta tus sellos con tu teléfono</label>
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <input value={tel} onChange={(e) => setTel(e.target.value)} inputMode="tel" placeholder="Tu teléfono"
              style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "none", fontSize: "16px" }} />
            <button type="submit" disabled={cargando} style={{ background: ORANGE, color: "#fff", border: "none", borderRadius: "12px", padding: "0 20px", fontWeight: 800, cursor: "pointer" }}>
              {cargando ? "…" : "Ver"}
            </button>
          </div>
          {err && <div style={{ color: "#ffb4a1", fontSize: ".85rem", marginTop: "8px" }}>{err}</div>}
        </form>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,.4)", fontSize: ".78rem", marginTop: "28px" }}>
          Cada visita suma un sello. Junta {meta} y el premio va por la casa. 🎁
        </p>
      </div>
    </div>
  );
}
