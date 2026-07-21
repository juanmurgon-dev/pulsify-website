import { promises as fs } from "fs";
import path from "path";

export async function getBlogPosts() {
  const blogDir = path.join(process.cwd(), "public/blog");
  try {
    const files = await fs.readdir(blogDir);
    const mdFiles = files.filter((f) => f.endsWith(".md"));

    return Promise.all(
      mdFiles.map(async (file) => {
        const slug = file.replace(".md", "");
        const content = await fs.readFile(path.join(blogDir, file), "utf-8");
        const heading = content.match(/^#\s+(.+)$/m);
        return {
          slug,
          title: heading
            ? heading[1].trim()
            : slug.replace(/-/g, " ").toUpperCase(),
        };
      })
    );
  } catch {
    return [];
  }
}

export async function getBlogContent(slug: string) {
  const filePath = path.join(process.cwd(), "public/blog", `${slug}.md`);
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch {
    return null;
  }
}