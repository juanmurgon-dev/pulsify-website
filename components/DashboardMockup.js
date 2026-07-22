// Mockup del panel de PULSIFY (sin dependencias, con la paleta de marca).
// Representa lo que hace el app: margen por platillo, KPIs y alertas.
const PRIMARY = "#0e3a39";
const ACCENT = "#2ec4b6";
const ORANGE = "#ff9f1c";
const MUTED = "#5a6b6a";

const DISHES = [
  { name: "Pizza margarita", margin: 71, alert: false },
  { name: "Hamburguesa", margin: 64, alert: false },
  { name: "Tacos al pastor", margin: 58, alert: false },
  { name: "Sopa del día", margin: 38, alert: true },
];

export default function DashboardMockup() {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "18px",
        border: "1px solid rgba(46, 196, 182, 0.25)",
        boxShadow: "0 24px 60px rgba(14, 58, 57, 0.14)",
        padding: "20px",
        width: "100%",
        maxWidth: "460px",
      }}
    >
      {/* Barra superior tipo ventana */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
          <span style={{ marginLeft: "8px", fontSize: "12px", fontWeight: 700, color: PRIMARY }}>Panel · PULSIFY</span>
        </div>
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: ACCENT,
            background: "rgba(46, 196, 182, 0.12)",
            padding: "3px 8px",
            borderRadius: "20px",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: ACCENT, display: "inline-block" }} />
          En vivo
        </span>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
        <div style={{ background: "rgba(46, 196, 182, 0.08)", borderRadius: "12px", padding: "14px" }}>
          <div style={{ fontSize: "11px", color: MUTED, marginBottom: "4px" }}>Margen total</div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: PRIMARY, lineHeight: 1 }}>62%</div>
          <div style={{ fontSize: "11px", color: ACCENT, fontWeight: 700, marginTop: "4px" }}>▲ 4.2% vs. mes pasado</div>
        </div>
        <div style={{ background: "rgba(255, 159, 28, 0.1)", borderRadius: "12px", padding: "14px" }}>
          <div style={{ fontSize: "11px", color: MUTED, marginBottom: "4px" }}>Punto de equilibrio</div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: PRIMARY, lineHeight: 1 }}>$48k</div>
          <div style={{ fontSize: "11px", color: ORANGE, fontWeight: 700, marginTop: "4px" }}>78% alcanzado</div>
        </div>
      </div>

      {/* Gráfica de margen por platillo */}
      <div style={{ fontSize: "12px", fontWeight: 700, color: PRIMARY, marginBottom: "12px" }}>
        Margen por platillo
      </div>
      <div style={{ display: "grid", gap: "12px", marginBottom: "18px" }}>
        {DISHES.map((dish) => (
          <div key={dish.name}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
              <span style={{ color: PRIMARY, fontWeight: 600 }}>
                {dish.name} {dish.alert && <span title="Bajo objetivo">⚠</span>}
              </span>
              <span style={{ color: dish.alert ? ORANGE : ACCENT, fontWeight: 700 }}>{dish.margin}%</span>
            </div>
            <div style={{ background: "rgba(14, 58, 57, 0.08)", borderRadius: "6px", height: "8px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${dish.margin}%`,
                  height: "100%",
                  borderRadius: "6px",
                  background: dish.alert
                    ? "linear-gradient(90deg, #ffb454, #ff9f1c)"
                    : "linear-gradient(90deg, #2ec4b6, #0e3a39)",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Alerta */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(255, 159, 28, 0.12)",
          border: "1px solid rgba(255, 159, 28, 0.3)",
          borderRadius: "10px",
          padding: "10px 12px",
          fontSize: "11px",
          color: PRIMARY,
          fontWeight: 600,
        }}
      >
        <span style={{ fontSize: "14px" }}>⚠</span>
        Sopa del día por debajo del objetivo de 40% — revisa costo de insumos.
      </div>
    </div>
  );
}
