const fs = require('fs');
const path = require('path');

// Crear carpetas
const folders = ['components', 'app/blog', 'app/blog/[slug]', 'app/checkout', 'public/blog'];
folders.forEach(folder => {
  const folderPath = path.join(__dirname, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`✅ Creada carpeta: ${folder}`);
  }
});

// Header.js
fs.writeFileSync(path.join(__dirname, 'components/Header.js'), `"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{ background: "white", borderBottom: "1px solid #eee", padding: "16px 0", position: "sticky", top: 0, zIndex: 100 }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ fontSize: "24px", fontWeight: "bold", color: "#0E3A39", textDecoration: "none" }}>
            PLATIFY
          </Link>

          <nav style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            <Link href="/" style={{ textDecoration: "none", color: "#333" }}>
              Inicio
            </Link>
            <Link href="/blog" style={{ textDecoration: "none", color: "#333" }}>
              Blog
            </Link>
            <Link href="/pricing" style={{ textDecoration: "none", color: "#333" }}>
              Planes
            </Link>
            <Link href="/checkout" className="btn" style={{ margin: 0 }}>
              Prueba gratis
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}`);
console.log(`✅ Creado: components/Header.js`);

// Footer.js
fs.writeFileSync(path.join(__dirname, 'components/Footer.js'), `import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#0E3A39", color: "white", padding: "48px 0", marginTop: "80px" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "32px", marginBottom: "32px" }}>
          <div>
            <h4>PULSIFY</h4>
            <p>Software para restaurantes inteligentes.</p>
          </div>
          <div>
            <h4>Producto</h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li><Link href="/" style={{ color: "#fff", textDecoration: "none" }}>Features</Link></li>
              <li><Link href="/pricing" style={{ color: "#fff", textDecoration: "none" }}>Planes</Link></li>
              <li><Link href="/blog" style={{ color: "#fff", textDecoration: "none" }}>Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4>Social</h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li><a href="https://linkedin.com" style={{ color: "#fff", textDecoration: "none" }}>LinkedIn</a></li>
              <li><a href="https://tiktok.com" style={{ color: "#fff", textDecoration: "none" }}>TikTok</a></li>
              <li><a href="https://instagram.com" style={{ color: "#fff", textDecoration: "none" }}>Instagram</a></li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "32px", textAlign: "center" }}>
          <p>&copy; 2024 PULSIFY. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}`);
console.log(`✅ Creado: components/Footer.js`);

// app/blog/page.tsx
fs.writeFileSync(path.join(__dirname, 'app/blog/page.tsx'), `import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";

async function getBlogPosts() {
  const blogDir = path.join(process.cwd(), "public/blog");
  try {
    const files = await fs.readdir(blogDir);
    return files.filter(f => f.endsWith(".md")).map(f => ({
      slug: f.replace(".md", ""),
      title: f.replace(".md", "").replace(/-/g, " ").toUpperCase(),
    }));
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main>
      <section className="section" style={{ paddingTop: "120px" }}>
        <div className="container">
          <h1 style={{ fontSize: "48px", marginBottom: "48px", color: "#0E3A39" }}>Blog PULSIFY</h1>
          <div className="grid-3">
            {posts.map((post) => (
              <Link key={post.slug} href={\`/blog/\${post.slug}\`} style={{ textDecoration: "none" }}>
                <div className="card" style={{ cursor: "pointer" }}>
                  <h3>{post.title}</h3>
                  <p>Leer artículo →</p>
                </div>
              </Link>
            ))}
          </div>
          {posts.length === 0 && <p>No hay artículos aún.</p>}
        </div>
      </section>
    </main>
  );
}`);
console.log(`✅ Creado: app/blog/page.tsx`);

// app/blog/[slug]/page.tsx
fs.writeFileSync(path.join(__dirname, 'app/blog/[slug]/page.tsx'), `import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";

async function getPost(slug) {
  const filePath = path.join(process.cwd(), "public/blog", \`\${slug}.md\`);
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return { content, found: true };
  } catch {
    return { found: false };
  }
}

export default async function BlogPost({ params }) {
  const { slug } = params;
  const { content, found } = await getPost(slug);

  if (!found) {
    return (
      <main>
        <section className="section">
          <div className="container">
            <h1>Artículo no encontrado</h1>
            <Link href="/blog">Volver al blog</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <article>
        <section className="section" style={{ paddingTop: "120px" }}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <h1 style={{ color: "#0E3A39", marginBottom: "24px" }}>{slug.replace(/-/g, " ").toUpperCase()}</h1>
            <div style={{ lineHeight: "1.8", fontSize: "16px", marginBottom: "48px" }}>
              <pre style={{ fontFamily: "inherit", whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{content}</pre>
            </div>
            <Link href="/blog" style={{ color: "#FF9F1C", textDecoration: "none", fontWeight: "bold" }}>
              ← Volver al blog
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}`);
console.log(`✅ Creado: app/blog/[slug]/page.tsx`);

// app/checkout/page.tsx
fs.writeFileSync(path.join(__dirname, 'app/checkout/page.tsx'), `import Link from "next/link";

export default function CheckoutPage() {
  return (
    <main>
      <section className="section" style={{ paddingTop: "120px" }}>
        <div className="container" style={{ maxWidth: "600px" }}>
          <h1 style={{ color: "#0E3A39", marginBottom: "32px" }}>Comienza tu prueba</h1>
          
          <div className="card">
            <h2>Plan Pro - $99/mes</h2>
            <p style={{ fontSize: "18px", marginBottom: "24px" }}>7 días gratis. Sin tarjeta requerida.</p>
            
            <div style={{ background: "#f0f0f0", padding: "24px", borderRadius: "8px", marginBottom: "24px" }}>
              <p>Formulario de pago integrado con Stripe</p>
              <p style={{ fontSize: "12px", color: "#666", marginTop: "12px" }}>Próximamente: Integración Stripe</p>
            </div>

            <Link href="/" className="btn" style={{ width: "100%", textAlign: "center" }}>
              Volver a inicio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}`);
console.log(`✅ Creado: app/checkout/page.tsx`);

// app/layout.tsx - actualizar
const layoutPath = path.join(__dirname, 'app/layout.tsx');
fs.writeFileSync(layoutPath, `import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "PULSIFY - Análisis de Restaurantes",
  description: "Aumenta tus márgenes sin comisión. Análisis + Pedidos + Lealtad.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}`);
console.log(`✅ Actualizado: app/layout.tsx`);

console.log('\n🎉 ¡TODO CREADO! Estructura lista.\n');
console.log('Próximos pasos:');
console.log('1. Guarda todos los cambios (Cmd+S)');
console.log('2. El navegador se refresca automático');
console.log('3. npm run dev (si no está corriendo)');
console.log('4. Prueba navegando: /blog, /checkout\n');
