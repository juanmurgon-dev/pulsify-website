import Link from "next/link";
import { getBlogPosts, type PostMeta } from "@/lib/markdown";

export const metadata = {
  title: "Blog: márgenes y decisiones para tu restaurante",
  description:
    "Guías prácticas de food cost, margen por platillo, punto de equilibrio, precios y control de costos para dueños de restaurantes en México.",
  alternates: { canonical: "/blog" },
};

// Portada de marca cuando el artículo aún no tiene su foto.
function Placeholder({ post }: { post: PostMeta }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, #0E3A39 0%, #17605a 55%, #2EC4B6 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <span style={{ color: "#8fe3da", fontSize: "26px", fontWeight: 800, letterSpacing: "-.02em" }}>
        P▲
      </span>
      <span style={{ color: "rgba(255,255,255,.9)", fontSize: "13px", fontWeight: 600, marginTop: "6px" }}>
        {post.producto || "Platify"}
      </span>
    </div>
  );
}

export default async function Blog() {
  const posts = await getBlogPosts();

  return (
    <main>
      <section className="section" style={{ paddingTop: "120px" }}>
        <div className="container" style={{ maxWidth: "1080px" }}>
          <h1 style={{ color: "#0E3A39", marginBottom: "16px" }}>Datos Que Hacen Ganar</h1>
          <p style={{ color: "#666", marginBottom: "48px" }}>
            Análisis, estrategias y datos para restaurantes inteligentes.
          </p>

          {posts.length === 0 ? (
            <p>Todavía no hay artículos publicados.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "28px",
              }}
            >
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    background: "#fff",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid #eef2f1",
                    boxShadow: "0 6px 20px rgba(14,58,57,.06)",
                  }}
                >
                  {/* Portada 16:9 */}
                  <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", background: "#0E3A39" }}>
                    {post.cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.cover}
                        alt={post.title}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <Placeholder post={post} />
                    )}
                  </div>

                  {/* Cuerpo de la tarjeta */}
                  <div style={{ padding: "18px 18px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                    {post.producto && (
                      <span
                        style={{
                          alignSelf: "flex-start",
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#0E3A39",
                          background: "#e4f6f3",
                          borderRadius: "999px",
                          padding: "3px 10px",
                          marginBottom: "10px",
                        }}
                      >
                        {post.producto}
                      </span>
                    )}
                    <h3 style={{ color: "#0E3A39", margin: "0 0 8px", fontSize: "18px", lineHeight: 1.3 }}>
                      {post.title}
                    </h3>
                    {post.resumen && (
                      <p style={{ color: "#666", fontSize: "14px", lineHeight: 1.5, margin: "0 0 14px" }}>
                        {post.resumen}
                      </p>
                    )}
                    <span style={{ color: "#2EC4B6", fontWeight: "bold", marginTop: "auto" }}>
                      Leer artículo →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
