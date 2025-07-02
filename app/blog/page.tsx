import fs from "fs";
import path from "path";
import { cn } from "@/lib/utils";
import matter from "gray-matter";
import { NotebookPen } from "lucide-react";
import Link from "next/link";

// Format date helper function
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
  });
}

// Type for blog post metadata
type PostMetadata = {
  title: string;
  publishedAt: string;
  summary: string;
  slug: string;
};

// Function to get all blog posts
function getBlogPosts(): PostMetadata[] {
  // Get all files from the blog directory
  const blogDirectory = path.join(process.cwd(), "content/blog");
  const filenames = fs.readdirSync(blogDirectory);

  // Get the frontmatter from each file
  const posts = filenames
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => {
      const filePath = path.join(blogDirectory, filename);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContent);
      if (data.private) return undefined;
      return {
        title: data.title,
        publishedAt: data.publishedAt,
        summary: data.summary,
        slug: filename.replace(/\.mdx$/, ""),
      };
    })
    .filter(Boolean) as PostMetadata[];

  return posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <main className="p-8 border-t border-dashed">
      <div>
        <h1 className="text-4xl font-medium tracking-tight">Blog</h1>
        <p className="text-muted-foreground mt-2">
          A collection of articles and thoughts on software development and who
          I am as a person.
        </p>
      </div>
      <table className="mt-8 w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 px-0 text-sm text-muted-foreground/65 font-normal">
              date
            </th>
            <th className="text-left py-2 px-6 text-sm text-muted-foreground/65 font-normal">
              title
            </th>
            <th className="text-left py-2 px-4 text-sm text-muted-foreground/65 font-normal hidden md:table-cell">
              summary
            </th>
            {/* TODO: add views */}
            {/* <th className="text-left py-2 px-4 text-sm text-muted-foreground/65 font-normal">
              views
            </th> */}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {posts.map((post) => (
            <tr
              key={post.slug}
              className="hover:bg-muted/50 transition-colors relative group"
            >
              <td className="py-3 px-0 text-sm text-muted-foreground whitespace-nowrap font-mono">
                {formatDate(post.publishedAt)}
              </td>
              <td className="py-3 px-6">
                <span className="line-clamp-1">{post.title}</span>
              </td>
              <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">
                <span className="line-clamp-1">{post.summary}</span>
              </td>
              <Link
                href={`/blog/${post.slug}`}
                className="absolute inset-0 z-10"
                aria-label={`Read blog post: ${post.title}`}
              />
              {/* <td className="py-3 px-4 text-sm text-muted-foreground">here</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
