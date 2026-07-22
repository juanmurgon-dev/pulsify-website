import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogContent, getBlogPosts } from "@/lib/markdown";
import Markdown from "@/components/Markdown";
import type { Metadata } from "next";

const SITIO = "https://platify-website.vercel.app";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// Saca el título (primer #) y una descripción (primer párrafo) del artículo.
function resumen(content: string) {
  const heading = content.match(/^#\s+(.+)$/m);
  const title = heading ? heading[1].trim() : "Artículo";
  const parrafo = content
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith("#") && !l.startsWith("-"));
  const description = (parrafo || "").slice(0, 160);
  return { title, description };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = await getBlogContent(slug);
  if (!content) return { title: "Artículo no encontrado" };
  const { title, description } = resumen(content);
  const url = `/blog/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getBlogContent(slug);

  if (!content) {
    notFound();
  }

  const { title, description } = resumen(content);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: "es-MX",
    mainEntityOfPage: `${SITIO}/blog/${slug}`,
    publisher: {
      "@type": "Organization",
      name: "Platify",
      logo: { "@type": "ImageObject", url: `${SITIO}/brand/platify-logo.png` },
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <section className="section" style={{ paddingTop: "120px" }}>
          <div className="container" style={{ maxWidth: "760px" }}>
            <Link
              href="/blog"
              className="btn"
              style={{ display: "inline-block", marginBottom: "32px" }}
            >
              ← Volver al blog
            </Link>

            <div
              style={{
                lineHeight: "1.8",
                fontSize: "18px",
                color: "#333",
              }}
            >
              <Markdown source={content} />
            </div>

            <div style={{ marginTop: "48px" }}>
              <Link href="/blog" className="btn">
                ← Volver al blog
              </Link>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
