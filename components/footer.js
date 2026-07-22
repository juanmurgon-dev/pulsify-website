import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#0E3A39", color: "white", padding: "48px 0", marginTop: "80px" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "32px", marginBottom: "32px" }}>
          <div><h4>PLATIFY</h4><p>Software para restaurantes.</p></div>
          <div><h4>Producto</h4><ul style={{ listStyle: "none" }}><li><Link href="/" style={{ color: "#fff", textDecoration: "none" }}>Features</Link></li></ul></div>
          <div><h4>Social</h4><ul style={{ listStyle: "none" }}><li><a href="https://linkedin.com" style={{ color: "#fff" }}>LinkedIn</a></li></ul></div>
        </div>
        <p style={{ textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "32px" }}>&copy; 2024 PLATIFY</p>
      </div>
    </footer>
  );
}