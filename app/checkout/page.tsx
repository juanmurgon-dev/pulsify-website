"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const PRIMARY = "#0e3a39";
const ACCENT = "#2ec4b6";
const MUTED = "#5a6b6a";

function CheckoutInner() {
  const params = useSearchParams();
  const status = params.get("status");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "No se pudo iniciar el pago.");
        setLoading(false);
      }
    } catch {
      setError("No se pudo conectar con el servidor de pagos.");
      setLoading(false);
    }
  }

  if (status === "success") {
    return (
      <div className="card" style={{ textAlign: "center", padding: "48px" }}>
        <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎉</div>
        <h1 style={{ color: PRIMARY, marginBottom: "12px" }}>¡Bienvenido a la beta!</h1>
        <p style={{ color: MUTED, marginBottom: "24px" }}>
          Tu suscripción se activó correctamente. Te contactaremos por correo para
          darte acceso a tu panel de análisis.
        </p>
        <Link href="/" className="btn">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: "40px" }}>
      <div
        style={{
          display: "inline-block",
          background: "#ff9f1c",
          color: "#fff",
          padding: "6px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 700,
          textTransform: "uppercase",
          marginBottom: "20px",
        }}
      >
        🚀 Precio de fundador
      </div>

      <h1 style={{ color: PRIMARY, marginBottom: "8px" }}>Tu Análisis Inteligente Te Espera</h1>
      <p style={{ color: MUTED, marginBottom: "24px" }}>
        Suscripción mensual con acceso completo al análisis financiero de tu
        restaurante. Cancela cuando quieras.
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(46, 196, 182, 0.2)",
          borderBottom: "1px solid rgba(46, 196, 182, 0.2)",
          padding: "16px 0",
          marginBottom: "24px",
        }}
      >
        <span style={{ color: PRIMARY, fontWeight: 600 }}>Suscripción Beta</span>
        <span style={{ fontSize: "32px", fontWeight: 800, color: ACCENT }}>
          $100 <span style={{ fontSize: "14px", color: MUTED }}>MXN/mes</span>
        </span>
      </div>

      <ul style={{ listStyle: "none", marginBottom: "28px" }}>
        {[
          "Margen real por platillo",
          "Punto de equilibrio en tiempo real",
          "Alertas cuando baja el margen",
          "Soporte directo durante la beta",
        ].map((item) => (
          <li key={item} style={{ display: "flex", gap: "8px", color: PRIMARY, marginBottom: "10px", fontSize: "14px" }}>
            <span style={{ color: ACCENT, fontWeight: 700 }}>✓</span>
            {item}
          </li>
        ))}
      </ul>

      {status === "cancel" && (
        <p style={{ color: "#c0392b", fontSize: "14px", marginBottom: "16px" }}>
          El pago se canceló. Puedes intentarlo de nuevo cuando quieras.
        </p>
      )}
      {error && (
        <p style={{ color: "#c0392b", fontSize: "14px", marginBottom: "16px" }}>{error}</p>
      )}

      <button
        onClick={handlePay}
        disabled={loading}
        className="btn large"
        style={{ width: "100%", border: "none", cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "Redirigiendo…" : "Suscribirme — $100/mes"}
      </button>

      <p style={{ color: MUTED, fontSize: "12px", textAlign: "center", marginTop: "16px" }}>
        Pago seguro con Stripe · Tarjeta de crédito o débito
      </p>

      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <Link href="/" style={{ color: ACCENT, textDecoration: "none", fontSize: "14px" }}>
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main>
      <section className="section" style={{ paddingTop: "120px", paddingBottom: "80px" }}>
        <div className="container" style={{ maxWidth: "520px" }}>
          <Suspense fallback={<p style={{ color: MUTED }}>Cargando…</p>}>
            <CheckoutInner />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
