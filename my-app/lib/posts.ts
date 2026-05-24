import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content", "post");

function extractTitleFromContent(content: string) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : undefined;
}

export function getPostSlugs() {
  return fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}

export function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${slug}`);
  }

  const fileContents = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(fileContents);
  const title = data.title || extractTitleFromContent(content) || slug;

  return {
    slug,
    content,
    frontMatter: {
      title,
      date: data.date || "",
      category: data.category || "",
      description: data.description || "",
    },
  };
}

export function getAllPosts() {
  return getPostSlugs().map((slug) => {
    const post = getPostBySlug(slug);
    return {
      slug,
      ...post.frontMatter,
    };
  });
}
