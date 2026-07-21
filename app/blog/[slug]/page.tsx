import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogContent, getBlogPosts } from "@/lib/markdown";
import Markdown from "@/components/Markdown";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
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

  return (
    <main>
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
