import CTA from "@/components/CTA";

export default function Home() {
  return (
    <main>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="container">
          <h1>Mide el Pulso de tu Negocio</h1>
          <p>Análisis profundo, sin comisiones de plataformas. Aumenta márgenes real.</p>
          <CTA text="Prueba 7 días gratis" />
          <div style={{ marginTop: "32px", color: "white", opacity: 0.9 }}>
            <p>⭐⭐⭐⭐⭐ 4.9/5 (120+ restaurantes)</p>
          </div>
        </div>
      </section>

      {/* PROBLEMA SECTION */}
      <section className="section">
        <div className="container">
          <h2>El Problema Real</h2>
          <div className="grid-3">
            <div className="card">
              <h3>❌ No sabes tu margen real</h3>
              <p>Soft te suma, pero no te dice cuánto GANAS. ¿Qué platillo es tu verdadera mina de oro?</p>
            </div>

            <div className="card">
              <h3>❌ Uber te cobra 30%</h3>
              <p>$100k en delivery = $30k que desaparece. $360k/año en comisiones.</p>
            </div>

            <div className="card">
              <h3>❌ Clientes se van sin avisar</h3>
              <p>No tienes lealtad. No sabes qué los regresa. Pierdes clientes por $0.50.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="section">
        <div className="container">
          <h2>La Solución: PULSIFY</h2>
          <div className="grid-3">
            <div className="card">
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>📊</div>
              <h3>Análisis Profundo</h3>
              <p>Margen por platillo, punto de equilibrio, alertas inteligentes</p>
              <ul style={{ marginTop: "16px", paddingLeft: "20px" }}>
                <li>Margen real en segundos</li>
                <li>Benchmarks vs promedio</li>
                <li>Alertas cuando baja margen</li>
              </ul>
            </div>

            <div className="card">
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>🍕</div>
              <h3>Pedidos Sin Comisión</h3>
              <p>Delivery propio. 0% comisión. Clientes controlan espera.</p>
              <ul style={{ marginTop: "16px", paddingLeft: "20px" }}>
                <li>Catálogo digital automático</li>
                <li>Checkout integrado</li>
                <li>Confirmación por WhatsApp</li>
              </ul>
            </div>

            <div className="card">
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>❤️</div>
              <h3>Lealtad Digital</h3>
              <p>Tarjeta wallet nativa. Puntos automáticos. Retención +15%.</p>
              <ul style={{ marginTop: "16px", paddingLeft: "20px" }}>
                <li>Tarjeta Apple/Google Wallet</li>
                <li>Puntos por compra</li>
                <li>Promociones geolocalización</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="section">
        <div className="container">
          <h2>Planes</h2>
          <div className="grid-3">
            {/* STARTER */}
            <div className="card">
              <h3>Starter</h3>
              <p style={{ fontSize: "32px", fontWeight: "bold", color: "#0E3A39", marginBottom: "8px" }}>$49<span style={{ fontSize: "16px" }}>/mes</span></p>
              <p style={{ marginBottom: "24px" }}>Análisis básico + Pedidos básicos</p>
              <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
                <li>Margen por platillo</li>
                <li>Pedidos básicos</li>
                <li>Email soporte</li>
              </ul>
              <CTA text="Empezar" href="/checkout?plan=starter" />
            </div>

            {/* PRO - DESTACADO */}
            <div className="card" style={{ border: "2px solid #FF9F1C", transform: "scale(1.05)" }}>
              <div style={{ background: "#FF9F1C", color: "white", padding: "8px 12px", borderRadius: "4px", display: "inline-block", marginBottom: "12px", fontSize: "12px", fontWeight: "bold" }}>
                ⭐ RECOMENDADO
              </div>
              <h3>Pro</h3>
              <p style={{ fontSize: "32px", fontWeight: "bold", color: "#0E3A39", marginBottom: "8px" }}>$99<span style={{ fontSize: "16px" }}>/mes</span></p>
              <p style={{ marginBottom: "24px" }}>Todo + Lealtad + Integraciones</p>
              <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
                <li>Análisis profundo</li>
                <li>Pedidos Premium</li>
                <li>Lealtad Wallet</li>
                <li>Prioridad soporte</li>
              </ul>
              <CTA text="Empezar" href="/checkout?plan=pro" />
            </div>

            {/* ENTERPRISE */}
            <div className="card">
              <h3>Enterprise</h3>
              <p style={{ fontSize: "32px", fontWeight: "bold", color: "#0E3A39", marginBottom: "8px" }}>$149<span style={{ fontSize: "16px" }}>/mes</span></p>
              <p style={{ marginBottom: "24px" }}>Multi-local + Consultoría</p>
              <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
                <li>Multi-restaurante</li>
                <li>Integraciones custom</li>
                <li>Consultor dedicado</li>
                <li>API acceso</li>
              </ul>
              <CTA text="Contactar" href="/checkout?plan=enterprise" />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <h2>Lo que dicen nuestros clientes</h2>
          <div className="grid-3">
            <div className="card">
              <p style={{ fontSize: "18px", fontStyle: "italic", marginBottom: "16px" }}>
                "En 3 meses subimos margen 18%. Solo cambiar una sopa nos ahorró $50k/año."
              </p>
              <p style={{ fontWeight: "bold" }}>Mario</p>
              <p style={{ color: "#666", fontSize: "14px" }}>Cremina Café</p>
              <p style={{ color: "#FF9F1C", marginTop: "8px" }}>⭐⭐⭐⭐⭐</p>
            </div>

            <div className="card">
              <p style={{ fontSize: "18px", fontStyle: "italic", marginBottom: "16px" }}>
                "Dejé Uber. Ahorro $500/mes y mis clientes son más leales."
              </p>
              <p style={{ fontWeight: "bold" }}>Ana</p>
              <p style={{ color: "#666", fontSize: "14px" }}>Taco Station</p>
              <p style={{ color: "#FF9F1C", marginTop: "8px" }}>⭐⭐⭐⭐⭐</p>
            </div>

            <div className="card">
              <p style={{ fontSize: "18px", fontStyle: "italic", marginBottom: "16px" }}>
                "Finalmente entiendo mi negocio. Los datos me muestran dónde ganar."
              </p>
              <p style={{ fontWeight: "bold" }}>Luis</p>
              <p style={{ color: "#666", fontSize: "14px" }}>Restaurant Familiar</p>
              <p style={{ color: "#FF9F1C", marginTop: "8px" }}>⭐⭐⭐⭐⭐</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "80px 0", background: "linear-gradient(135deg, #0E3A39 0%, #2EC4B6 100%)", color: "white", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ color: "white" }}>¿Listo para conocer tus números?</h2>
          <p style={{ fontSize: "18px", marginBottom: "32px" }}>7 días gratis. Sin tarjeta requerida.</p>
          <CTA text="Prueba gratis" size="large" />
        </div>
      </section>
    </main>
  );
}