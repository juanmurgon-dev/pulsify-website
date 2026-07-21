import Link from "next/link";
import { getBlogContent, getBlogPosts } from "@/lib/markdown";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const content = await getBlogContent(slug);

  if (!content) {
    return (
      <main>
        <section className="section" style={{ paddingTop: "120px" }}>
          <div className="container">
            <h1>Artículo no encontrado</h1>
            <Link href="/blog" className="btn">
              Volver al blog
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <article>
        <section className="section" style={{ paddingTop: "120px" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <h1 style={{ color: "#2ec4b6", marginBottom: "32px" }}>
              {slug.replace(/-/g, " ").toUpperCase()}
            </h1>

            <div style={{ 
              lineHeight: "1.8", 
              fontSize: "16px", 
              marginBottom: "48px",
              color: "#d0d0d0"
            }}>
              <pre style={{ 
                fontFamily: "inherit", 
                whiteSpace: "pre-wrap", 
                wordWrap: "break-word",
                background: "rgba(46, 196, 182, 0.1)",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid rgba(46, 196, 182, 0.3)"
              }}>
                {content}
              </pre>
            </div>

            <Link href="/blog" className="btn">
              ← Volver al blog
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}