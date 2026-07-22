import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts } from "@/lib/markdown";
import Markdown from "@/components/Markdown";
import type { Metadata } from "next";

const SITIO = "https://platify-website.vercel.app";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Artículo no encontrado" };
  const { title, resumen, cover } = post.meta;
  const url = `/blog/${slug}`;
  return {
    title,
    description: resumen,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description: resumen,
      images: cover ? [{ url: cover }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description: resumen },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const { title, resumen, cover } = post.meta;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: resumen,
    image: cover ? `${SITIO}${cover}` : undefined,
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

            {cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover}
                alt={title}
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "16 / 9",
                  objectFit: "cover",
                  borderRadius: "18px",
                  marginBottom: "32px",
                }}
              />
            )}

            <div
              style={{
                lineHeight: "1.8",
                fontSize: "18px",
                color: "#333",
              }}
            >
              <Markdown source={post.body} />
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
