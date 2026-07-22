import CTA from "@/components/CTA";
import DashboardMockup from "@/components/DashboardMockup";

const MUTED = "#5a6b6a";
const PRIMARY = "#0e3a39";
const ACCENT = "#2ec4b6";
const WATERMARK = "rgba(46, 196, 182, 0.14)";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "inline-block",
      background: "rgba(255, 159, 28, 0.15)",
      color: "#c9760a",
      padding: "8px 16px",
      borderRadius: "20px",
      fontSize: "13px",
      fontWeight: 700,
      marginBottom: "24px",
    }}>
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <main>
      {/* HERO SECTION */}
      <section className="section hero-section" style={{ paddingTop: "140px", paddingBottom: "80px", background: "linear-gradient(135deg, rgba(46, 196, 182, 0.12) 0%, rgba(255, 238, 184, 0.35) 100%)" }}>
        <div className="container">
          <div className="hero-grid">
            <div style={{ maxWidth: "560px" }}>
              <Badge>🚀 Versión Beta · Precio de lanzamiento</Badge>
              <h1 style={{
                fontSize: "58px",
                fontWeight: "800",
                lineHeight: "1.1",
                marginBottom: "24px",
                background: "linear-gradient(135deg, #0e3a39 0%, #2ec4b6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                Conoce el Margen Real de Cada Platillo
              </h1>
              <p style={{ fontSize: "19px", color: MUTED, marginBottom: "32px", lineHeight: "1.6" }}>
                PULSIFY analiza tus ventas y te dice cuánto ganas de verdad —
                por platillo, por día, en tiempo real. Sin hojas de cálculo.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
                <CTA text="Empieza por $100/mes" size="large" href="/checkout" />
                <span style={{ color: MUTED, fontSize: "14px" }}>
                  Precio de fundador · Cancela cuando quieras
                </span>
              </div>
              <p style={{ marginTop: "32px", color: MUTED, fontSize: "14px" }}>
                ⭐⭐⭐⭐⭐ 4.9/5 (120+ restaurantes en la beta)
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
            <div>
              <div style={{ fontSize: "120px", fontWeight: "900", color: WATERMARK, lineHeight: "1", marginBottom: "32px" }}>
                01
              </div>
              <h2 style={{ fontSize: "48px", fontWeight: "900", marginBottom: "24px", color: PRIMARY, lineHeight: "1.2" }}>
                El Problema Real
              </h2>
              <p style={{ fontSize: "16px", color: MUTED, marginBottom: "32px", lineHeight: "1.7" }}>
                La mayoría de los restaurantes no saben su margen real. Tu punto de
                venta te suma las ventas, pero no te dice cuánto GANAS por platillo.
              </p>
            </div>

            <div style={{ display: "grid", gap: "20px" }}>
              {[
                { emoji: "❌", title: "No sabes tu margen", desc: "¿Qué platillo pierde dinero cada venta?" },
                { emoji: "🧾", title: "Precios al tanteo", desc: "Sin datos que respalden lo que cobras" },
                { emoji: "⏰", title: "Te enteras tarde", desc: "Descubres las pérdidas cuando ya pasó el mes" }
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
            <div style={{ display: "flex", justifyContent: "center" }}>
              <DashboardMockup />
            </div>

            <div>
              <div style={{ fontSize: "120px", fontWeight: "900", color: WATERMARK, lineHeight: "1", marginBottom: "32px" }}>
                02
              </div>
              <h2 style={{ fontSize: "48px", fontWeight: "900", marginBottom: "24px", color: PRIMARY, lineHeight: "1.2" }}>
                La Solución: Análisis PULSIFY
              </h2>
              <p style={{ fontSize: "16px", color: MUTED, marginBottom: "32px", lineHeight: "1.7" }}>
                Todo tu negocio en números claros. Cargas tus ventas y en segundos
                ves dónde ganas y dónde pierdes.
              </p>
              <div style={{ display: "grid", gap: "16px" }}>
                {[
                  "📊 Margen real por platillo",
                  "📈 Punto de equilibrio en tiempo real",
                  "🔔 Alertas cuando un platillo baja de objetivo",
                  "🏆 Descubre tu platillo mina de oro"
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

      {/* PRICING / BETA SECTION */}
      <section className="section" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div style={{ fontSize: "120px", fontWeight: "900", color: WATERMARK, lineHeight: "1", marginBottom: "32px" }}>
              03
            </div>
            <h2 style={{ fontSize: "48px", fontWeight: "900", marginBottom: "24px", color: PRIMARY }}>
              Lanzamiento Beta
            </h2>
            <p style={{ fontSize: "18px", color: MUTED, maxWidth: "560px", margin: "0 auto" }}>
              Entra ahora al precio de fundador. $100 al mes por todo el análisis,
              congelado mientras seas beta. El precio sube cuando salgamos de beta.
            </p>
          </div>

          <div style={{ maxWidth: "460px", margin: "0 auto" }}>
            <div className="card" style={{
              padding: "48px 40px",
              textAlign: "center",
              background: "linear-gradient(135deg, rgba(255, 159, 28, 0.12) 0%, rgba(255, 238, 184, 0.35) 100%)",
              border: "3px solid #ff9f1c",
            }}>
              <div style={{ display: "inline-block", background: "#ff9f1c", color: "#fff", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", marginBottom: "20px" }}>
                🚀 Precio de fundador
              </div>
              <h3 style={{ fontSize: "24px", fontWeight: "900", color: PRIMARY, marginBottom: "8px" }}>
                Análisis PULSIFY — Beta
              </h3>
              <p style={{ fontSize: "56px", fontWeight: "900", color: ACCENT, marginBottom: "4px", lineHeight: 1 }}>
                $100 <span style={{ fontSize: "18px", color: MUTED }}>MXN/mes</span>
              </p>
              <p style={{ color: MUTED, fontSize: "14px", marginBottom: "28px" }}>Precio de fundador · Cancela cuando quieras</p>

              <ul style={{ listStyle: "none", marginBottom: "32px", textAlign: "left", maxWidth: "280px", marginInline: "auto" }}>
                {[
                  "Margen real por platillo",
                  "Punto de equilibrio en tiempo real",
                  "Alertas de margen bajo",
                  "Tu platillo más rentable",
                  "Soporte directo en la beta"
                ].map((feature, fidx) => (
                  <li key={fidx} style={{ color: PRIMARY, marginBottom: "12px", fontSize: "15px", display: "flex", gap: "8px" }}>
                    <span style={{ color: ACCENT, fontWeight: "700" }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <CTA text="Suscribirme — $100/mes" size="large" href="/checkout" />
              <p style={{ color: MUTED, fontSize: "12px", marginTop: "16px" }}>
                Pago seguro con Stripe
              </p>
            </div>
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
              Lo Que Dicen en la Beta
            </h2>
          </div>

          <div className="grid-3">
            {[
              { name: "Mario", business: "Cremina Café", quote: "En 3 meses subimos el margen 18%. Solo ajustar una sopa nos ahorró $50k al año." },
              { name: "Ana", business: "Taco Station", quote: "Descubrí que mi platillo estrella casi no dejaba. Lo reajusté y subí $8k al mes." },
              { name: "Luis", business: "Restaurante Familiar", quote: "Por fin entiendo mi negocio. Los datos me muestran dónde ganar." }
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

      {/* FAQ */}
      <section className="section" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          <h2 style={{ fontSize: "40px", fontWeight: "900", marginBottom: "48px", color: PRIMARY, textAlign: "center" }}>
            Preguntas Frecuentes
          </h2>
          <div style={{ display: "grid", gap: "16px" }}>
            {[
              { q: "¿Qué incluye la beta?", a: "Todo el módulo de análisis: margen por platillo, punto de equilibrio, alertas y tu platillo más rentable. Es el producto que ya está funcionando hoy." },
              { q: "¿Cómo cargo mis ventas?", a: "Subes tus ventas del punto de venta (o las capturas) y PULSIFY calcula tus márgenes al instante. Te ayudamos en el arranque." },
              { q: "¿El precio de $100/mes sube después?", a: "No mientras seas beta: tu precio de fundador queda congelado. Al salir de beta el precio sube para nuevos usuarios; tú te quedas con el de hoy." },
              { q: "¿Cómo pago y puedo cancelar?", a: "Es una suscripción mensual con tarjeta, de forma segura vía Stripe. Cancelas cuando quieras, sin ataduras." }
            ].map((item, idx) => (
              <div key={idx} className="card" style={{ padding: "24px 28px" }}>
                <h3 style={{ color: PRIMARY, fontSize: "17px", fontWeight: "700", marginBottom: "8px" }}>
                  {item.q}
                </h3>
                <p style={{ color: MUTED, fontSize: "15px" }}>{item.a}</p>
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
            Empieza a Ganar Más Hoy
          </h2>
          <p style={{ fontSize: "18px", color: "rgba(255, 255, 255, 0.9)", marginBottom: "40px", maxWidth: "600px", margin: "0 auto 40px" }}>
            Entra a la beta por $100 al mes. Conoce tu margen real y deja de perder
            dinero sin darte cuenta.
          </p>
          <CTA text="Empieza por $100/mes" size="large" href="/checkout" />
        </div>
      </section>
    </main>
  );
}
