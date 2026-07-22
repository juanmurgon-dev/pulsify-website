import { promises as fs } from "fs";
import path from "path";

export type PostMeta = {
  slug: string;
  title: string;
  resumen: string;
  cover: string | null;
  producto: string | null;
  fecha: string | null;
};

// Parser de frontmatter YAML sencillo (--- key: value --- al inicio del archivo).
function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!m) return { data: {}, body: raw };
  const data: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    if (key) data[key] = val;
  }
  return { data, body: raw.slice(m[0].length) };
}

// ¿Existe el archivo de portada en public/? Si no, devolvemos null para que el
// blog muestre una portada de marca (placeholder) hasta que la subas.
async function coverSiExiste(cover: string | null): Promise<string | null> {
  if (!cover) return null;
  const p = path.join(process.cwd(), "public", cover.replace(/^\//, ""));
  try {
    await fs.access(p);
    return cover;
  } catch {
    return null;
  }
}

function metaFrom(slug: string, raw: string): PostMeta {
  const { data, body } = parseFrontmatter(raw);
  const heading = body.match(/^#\s+(.+)$/m);
  const firstPara = body
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith("#") && !l.startsWith("-") && !l.startsWith("!["));
  return {
    slug,
    title: data.title || (heading ? heading[1].trim() : slug.replace(/-/g, " ")),
    resumen: data.resumen || (firstPara || "").slice(0, 160),
    cover: data.cover || null,
    producto: data.producto || null,
    fecha: data.fecha || null,
  };
}

export async function getBlogPosts(): Promise<PostMeta[]> {
  const blogDir = path.join(process.cwd(), "public/blog");
  try {
    const files = await fs.readdir(blogDir);
    const mdFiles = files.filter((f) => f.endsWith(".md") && !f.startsWith("_"));
    const posts = await Promise.all(
      mdFiles.map(async (file) => {
        const slug = file.replace(".md", "");
        const raw = await fs.readFile(path.join(blogDir, file), "utf-8");
        const meta = metaFrom(slug, raw);
        meta.cover = await coverSiExiste(meta.cover);
        return meta;
      })
    );
    // Más reciente primero (por fecha del frontmatter; los sin fecha, al final).
    posts.sort((a, b) => (b.fecha || "").localeCompare(a.fecha || ""));
    return posts;
  } catch {
    return [];
  }
}

// Devuelve el artículo con su frontmatter ya separado del cuerpo.
export async function getBlogPost(
  slug: string
): Promise<{ meta: PostMeta; body: string } | null> {
  const filePath = path.join(process.cwd(), "public/blog", `${slug}.md`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const { body } = parseFrontmatter(raw);
    const meta = metaFrom(slug, raw);
    meta.cover = await coverSiExiste(meta.cover);
    return { meta, body };
  } catch {
    return null;
  }
}

// Compatibilidad: solo el cuerpo (sin frontmatter).
export async function getBlogContent(slug: string): Promise<string | null> {
  const post = await getBlogPost(slug);
  return post ? post.body : null;
}
