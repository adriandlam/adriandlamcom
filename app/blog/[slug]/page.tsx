import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import "highlight.js/styles/vs2015.css";
import {
  Callout,
  CalloutDescription,
  CalloutTitle,
} from "@/components/callout";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import remarkSmartyPants from "remark-smartypants";

const components = {
  Callout,
  CalloutTitle,
  CalloutDescription,
  // Add this custom img component
  img: ({ src, alt, ...props }: any) => {
    // Handle both absolute and relative image paths
    const imageSrc = src?.startsWith("/") ? src : `/${src}`;

    return (
      <div className="my-6">
        <Image
          src={imageSrc}
          alt={alt || ""}
          width={800}
          height={500}
          className="rounded-lg mx-auto"
          sizes="(max-width: 768px) 100vw, 800px"
          priority={true}
          quality={85}
          {...props}
        />
        {alt && (
          <p className="text-sm text-center text-muted-foreground mt-2">
            {alt}
          </p>
        )}
      </div>
    );
  },
};

function extractHeadings(content: string) {
  const headingRegex = /^#{1,6}\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1];
    const level = match[0].split("#").length - 1;

    // Match the exact ID format that the browser is creating
    // Replace non-alphanumeric characters with hyphens and preserve trailing hyphens
    const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    // Importantly, do NOT trim trailing hyphens as they're preserved in the browser IDs
    //.replace(/(^-|-$)/g, '');

    headings.push({ text, level, slug });
  }

  return headings;
}

// Format date helper function
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Get blog post by slug
async function getBlogPost(slug: string) {
  const filePath = path.join(process.cwd(), `content/blog/${slug}.mdx`);

  // Check if file exists
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data: metadata, content } = matter(fileContent);
    // Filter out unpublished posts and private posts (for backward compatibility)
    if (metadata.private || metadata.published === false) return null;
    return { metadata, content };
  } catch (error) {
    return null;
  }
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const { metadata } = post;

  const ogImage =
    metadata.coverImage || metadata.images?.[0] || "/default-og-image.jpg";

  return {
    title: `${metadata.title} | Adrian Lam's Blog`,
    description:
      metadata.excerpt || `Read ${metadata.title} on Adrian Lam's Blog`,
    keywords: metadata.tags || [],
    authors: [{ name: metadata.author || "Adrian Lam" }],
    openGraph: {
      title: metadata.title,
      description:
        metadata.excerpt || `Read ${metadata.title} on Adrian Lam's Blog`,
      type: "article",
      publishedTime: metadata.publishedAt,
      url: `https://adriandlam.com/blog/${slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description:
        metadata.excerpt || `Read ${metadata.title} on Adrian Lam's Blog`,
      images: [ogImage],
    },
    alternates: {
      canonical: `https://adriandlam.com/blog/${slug}`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Read the file content with gray-matter
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const { metadata, content } = post;
  const formattedDate = formatDate(metadata.publishedAt);
  const headings = extractHeadings(content);

  return (
    <main className="px-8 pt-4">
      <div className="relative">
        {/* Main article with right margin on large screens */}
        <article>
          <header className="mb-8">
            {metadata.coverImage && (
              <div className="mb-6">
                <Image
                  src={metadata.coverImage}
                  alt={`Cover image for ${metadata.title}`}
                  width={1200}
                  height={630}
                  className="rounded-lg"
                  priority
                />
              </div>
            )}
            <h1 className="text-3xl font-bold mb-2">{metadata.title}</h1>
            {metadata.excerpt && (
              <p className="text-xl text-muted-foreground mb-4">
                {metadata.excerpt}
              </p>
            )}
            <div className="flex items-center text-muted-foreground text-sm">
              {metadata.author && (
                <span className="mr-4">By {metadata.author}</span>
              )}
              <time dateTime={metadata.publishedAt}>{formattedDate}</time>
              {metadata.readingTime && (
                <span className="ml-4">{metadata.readingTime} min read</span>
              )}
            </div>
            {metadata.tags && metadata.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {metadata.tags.map((tag: string) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            )}
          </header>
          <div className="prose max-w-none">
            <MDXRemote
              source={content}
              components={{
                ...components,
                h1: ({ children }) => (
                  <h1
                    id={children
                      ?.toString()
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")}
                  >
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2
                    id={children
                      ?.toString()
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")}
                  >
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3
                    id={children
                      ?.toString()
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")}
                  >
                    {children}
                  </h3>
                ),
              }}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkMath, remarkGfm, remarkSmartyPants],
                  rehypePlugins: [
                    rehypeKatex,
                    [rehypeHighlight, { detect: true }],
                  ],
                },
              }}
            />
          </div>
        </article>
      </div>
    </main>
  );
}

// This generates the static paths at build time
export async function generateStaticParams() {
  const blogDirectory = path.join(process.cwd(), "content/blog");
  const filenames = fs.readdirSync(blogDirectory);
  const slugs = filenames
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => {
      const filePath = path.join(blogDirectory, filename);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContent);
      // Only generate static paths for published posts
      if (data.private || data.published === false) return null;
      return filename.replace(/\.mdx$/, "");
    })
    .filter(Boolean) as string[];

  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;
