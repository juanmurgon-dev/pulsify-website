"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  // Pantallas tipo app (comensal / caja): sin chrome de marketing
  if (pathname && (pathname.startsWith("/pedidos") || pathname.startsWith("/caja") || pathname.startsWith("/lealtad"))) return null;
  return (
    <header style={{ background: "white", borderBottom: "1px solid #eee", padding: "16px 0", position: "sticky", top: 0, zIndex: 100 }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src="/brand/platify-wordmark.png" alt="Platify" style={{ height: "28px", width: "auto", display: "block" }} />
          </Link>

          <nav style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            <Link href="/" style={{ textDecoration: "none", color: "#333" }}>Inicio</Link>
            <Link href="/blog" style={{ textDecoration: "none", color: "#333" }}>Blog</Link>
            <Link href="/checkout" className="btn" style={{ margin: 0 }}>Empieza · $100/mes</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}