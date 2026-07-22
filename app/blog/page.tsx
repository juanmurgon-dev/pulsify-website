import Link from "next/link";
import { getBlogPosts } from "@/lib/markdown";

export default async function Blog() {
  const posts = await getBlogPosts();

  return (
    <main>
      <section className="section" style={{ paddingTop: "120px" }}>
        <div className="container" style={{ maxWidth: "820px" }}>
          <h1 style={{ color: "#0E3A39", marginBottom: "16px" }}>Datos Que Hacen Ganar</h1>
          <p style={{ color: "#666", marginBottom: "48px" }}>
            Análisis, estrategias y datos para restaurantes inteligentes.
          </p>

          {posts.length === 0 ? (
            <p>Todavía no hay artículos publicados.</p>
          ) : (
            <div style={{ display: "grid", gap: "24px" }}>
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="card"
                  style={{ textDecoration: "none", color: "inherit", display: "block" }}
                >
                  <h3 style={{ color: "#0E3A39", marginBottom: "8px" }}>
                    {post.title}
                  </h3>
                  <span style={{ color: "#2EC4B6", fontWeight: "bold" }}>
                    Leer artículo →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
