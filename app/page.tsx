import CTA from "@/components/CTA";
import Link from "next/link";
import DashboardMockup from "@/components/DashboardMockup";

const MUTED = "#5a6b6a";
const PRIMARY = "#0e3a39";
const ACCENT = "#2ec4b6";
const WATERMARK = "rgba(46, 196, 182, 0.14)";

export default function Home() {
  return (
    <main>
      {/* HERO SECTION */}
      <section className="section hero-section" style={{ paddingTop: "140px", paddingBottom: "80px", background: "linear-gradient(135deg, rgba(46, 196, 182, 0.12) 0%, rgba(255, 238, 184, 0.35) 100%)" }}>
        <div className="container">
          <div className="hero-grid">
            <div style={{ maxWidth: "560px" }}>
              <h1 style={{
                fontSize: "60px",
                fontWeight: "800",
                lineHeight: "1.1",
                marginBottom: "24px",
                background: "linear-gradient(135deg, #0e3a39 0%, #2ec4b6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                Mide El Pulso De Tu Negocio
              </h1>
              <p style={{ fontSize: "18px", color: MUTED, marginBottom: "32px", lineHeight: "1.6" }}>
                Análisis profundo, sin comisiones de plataformas. Aumenta márgenes real.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <CTA text="Prueba Gratis" size="large" />
                <Link href="/blog" className="btn" style={{ background: "rgba(46, 196, 182, 0.12)", border: "2px solid rgba(46, 196, 182, 0.5)", color: PRIMARY, boxShadow: "none" }}>
                  Leer Blog
                </Link>
              </div>
              <p style={{ marginTop: "32px", color: MUTED, fontSize: "14px" }}>
                ⭐⭐⭐⭐⭐ 4.9/5 (120+ restaurantes)
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA SECTION */}
      <section className="section" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
        <div className="container">
          <div className="split-grid">
            {/* NÚMERO Y TITULO */}
            <div>
              <div style={{ fontSize: "120px", fontWeight: "900", color: WATERMARK, lineHeight: "1", marginBottom: "32px" }}>
                01
              </div>
              <h2 style={{ fontSize: "48px", fontWeight: "900", marginBottom: "24px", color: PRIMARY, lineHeight: "1.2" }}>
                El Problema Real
              </h2>
              <p style={{ fontSize: "16px", color: MUTED, marginBottom: "32px", lineHeight: "1.7" }}>
                La mayoría de restaurantes no saben su margen real. Soft te suma, pero no te dice cuánto GANAS.
              </p>
            </div>

            {/* CARDS */}
            <div style={{ display: "grid", gap: "20px" }}>
              {[
                { emoji: "❌", title: "No sabes tu margen", desc: "¿Qué platillo pierde dinero?" },
                { emoji: "💸", title: "Uber cobra 30%", desc: "$360k/año en comisiones" },
                { emoji: "👥", title: "Clientes se van", desc: "Sin lealtad, sin datos" }
              ].map((item, idx) => (
                <div key={idx} className="card" style={{ padding: "24px", borderLeft: "4px solid #ff9f1c" }}>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>{item.emoji}</div>
                  <h3 style={{ color: PRIMARY, fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>
                    {item.title}
                  </h3>
                  <p style={{ color: MUTED, fontSize: "14px" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOLUCION SECTION */}
      <section className="section" style={{ paddingTop: "100px", paddingBottom: "100px", background: "var(--gray)" }}>
        <div className="container">
          <div className="split-grid">
            {/* VISUAL */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <DashboardMockup />
            </div>

            {/* CONTENIDO */}
            <div>
              <div style={{ fontSize: "120px", fontWeight: "900", color: WATERMARK, lineHeight: "1", marginBottom: "32px" }}>
                02
              </div>
              <h2 style={{ fontSize: "48px", fontWeight: "900", marginBottom: "24px", color: PRIMARY, lineHeight: "1.2" }}>
                La Solución: PULSIFY
              </h2>
              <p style={{ fontSize: "16px", color: MUTED, marginBottom: "32px", lineHeight: "1.7" }}>
                Análisis profundo, pedidos sin comisión, lealtad integrada. Todo en UN dashboard.
              </p>
              <div style={{ display: "grid", gap: "16px" }}>
                {[
                  "📊 Margen real por platillo",
                  "🍕 Pedidos sin 30% comisión",
                  "❤️ Lealtad wallet automática"
                ].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "center", color: PRIMARY }}>
                    <div style={{ width: "20px", height: "20px", background: ACCENT, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <div style={{ width: "8px", height: "8px", background: "#fff", borderRadius: "50%" }}></div>
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="section" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <div style={{ fontSize: "120px", fontWeight: "900", color: WATERMARK, lineHeight: "1", marginBottom: "32px" }}>
              03
            </div>
            <h2 style={{ fontSize: "48px", fontWeight: "900", marginBottom: "24px", color: PRIMARY }}>
              Descubre Planes Personalizados
            </h2>
            <p style={{ fontSize: "18px", color: MUTED, maxWidth: "600px", margin: "0 auto" }}>
              Para cada tamaño de restaurante. Comienza gratis, sin tarjeta.
            </p>
          </div>

          <div className="grid-3">
            {[
              { name: "Starter", price: "$49", features: ["Margen por platillo", "Pedidos básicos", "Email soporte"], highlight: false },
              { name: "Pro", price: "$99", features: ["Análisis profundo", "Pedidos Premium", "Lealtad Wallet", "Prioridad soporte"], highlight: true },
              { name: "Enterprise", price: "$149", features: ["Multi-restaurante", "Integraciones custom", "Consultor dedicado", "API acceso"], highlight: false }
            ].map((plan, idx) => (
              <div key={idx} className="card" style={{
                padding: "40px",
                background: plan.highlight ? "linear-gradient(135deg, rgba(255, 159, 28, 0.12) 0%, rgba(255, 238, 184, 0.35) 100%)" : "#ffffff",
                border: plan.highlight ? "3px solid #ff9f1c" : "1px solid rgba(46, 196, 182, 0.25)",
                transform: plan.highlight ? "scale(1.05)" : "scale(1)"
              }}>
                {plan.highlight && (
                  <div style={{ background: "#ff9f1c", color: "#fff", padding: "6px 12px", borderRadius: "20px", display: "inline-block", fontSize: "12px", fontWeight: "700", marginBottom: "16px", textTransform: "uppercase" }}>
                    ⭐ Recomendado
                  </div>
                )}
                <h3 style={{ fontSize: "24px", fontWeight: "900", color: PRIMARY, marginBottom: "8px" }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: "36px", fontWeight: "900", color: ACCENT, marginBottom: "24px" }}>
                  {plan.price}<span style={{ fontSize: "16px", color: MUTED }}>/mes</span>
                </p>
                <ul style={{ listStyle: "none", marginBottom: "32px" }}>
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} style={{ color: PRIMARY, marginBottom: "12px", fontSize: "14px", display: "flex", gap: "8px" }}>
                      <span style={{ color: ACCENT, fontWeight: "700" }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <CTA text="Empezar Ahora" size="large" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="section" style={{ paddingTop: "100px", paddingBottom: "100px", background: "var(--gray)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <div style={{ fontSize: "120px", fontWeight: "900", color: WATERMARK, lineHeight: "1", marginBottom: "32px" }}>
              04
            </div>
            <h2 style={{ fontSize: "48px", fontWeight: "900", marginBottom: "24px", color: PRIMARY }}>
              Lo Que Dicen Nuestros Clientes
            </h2>
          </div>

          <div className="grid-3">
            {[
              { name: "Mario", business: "Cremina Café", quote: "En 3 meses subimos margen 18%. $50k/año ahorrados." },
              { name: "Ana", business: "Taco Station", quote: "Dejé Uber. Ahorro $500/mes y clientes más leales." },
              { name: "Luis", business: "Restaurant Familiar", quote: "Finalmente entiendo mi negocio. Los datos me guían." }
            ].map((testimonial, idx) => (
              <div key={idx} className="card" style={{ padding: "32px" }}>
                <p style={{ fontSize: "18px", fontStyle: "italic", color: PRIMARY, marginBottom: "24px", lineHeight: "1.6" }}>
                  "{testimonial.quote}"
                </p>
                <div style={{ borderTop: "1px solid rgba(46, 196, 182, 0.2)", paddingTop: "16px" }}>
                  <p style={{ color: ACCENT, fontWeight: "700", fontSize: "14px", marginBottom: "4px" }}>
                    {testimonial.name}
                  </p>
                  <p style={{ color: MUTED, fontSize: "12px" }}>
                    {testimonial.business}
                  </p>
                  <p style={{ color: "#ff9f1c", marginTop: "8px", fontSize: "14px" }}>
                    ⭐⭐⭐⭐⭐
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "120px 0", background: "linear-gradient(135deg, #2ec4b6 0%, #23a89b 100%)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "120px", fontWeight: "900", color: "rgba(255, 255, 255, 0.18)", lineHeight: "1", marginBottom: "32px" }}>
            05
          </div>
          <h2 style={{ fontSize: "56px", fontWeight: "900", marginBottom: "24px", color: "#fff" }}>
            ¿Listo Para Crecer?
          </h2>
          <p style={{ fontSize: "18px", color: "rgba(255, 255, 255, 0.9)", marginBottom: "40px", maxWidth: "600px", margin: "0 auto 40px" }}>
            7 días gratis. Sin tarjeta requerida. Cancela en cualquier momento.
          </p>
          <CTA text="Comienza Tu Prueba Gratis" size="large" />
        </div>
      </section>
    </main>
  );
}
