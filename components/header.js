"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header style={{ background: "white", borderBottom: "1px solid #eee", padding: "16px 0", position: "sticky", top: 0, zIndex: 100 }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ fontSize: "24px", fontWeight: "bold", color: "#0E3A39", textDecoration: "none" }}>
            PLATIFY
          </Link>

          <nav style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            <Link href="/" style={{ textDecoration: "none", color: "#333" }}>Inicio</Link>
            <Link href="/blog" style={{ textDecoration: "none", color: "#333" }}>Blog</Link>
            <Link href="/checkout" className="btn" style={{ margin: 0 }}>Prueba gratis</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}