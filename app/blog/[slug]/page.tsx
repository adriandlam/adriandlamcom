import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import * as CalloutComponents from "@/components/callout";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";
import remarkSmartyPants from "remark-smartypants";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeExternalLinks from "rehype-external-links";
import rehypeUnwrapImages from "rehype-unwrap-images";
import Link from "next/link";

const components = {
	...CalloutComponents,
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
	hr: () => <hr className="my-8 border-border" />,
	a: ({ children, href }: { children: React.ReactNode; href: string }) => (
		<Link href={href} className="link inline-flex gap-0.5">
			{children}
			{!(href.startsWith("/") || href.startsWith("#")) && (
				<svg
					className="mt-1 size-3"
					viewBox="0 0 12 12"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>External link</title>
					<path
						d="M3.5 3C3.22386 3 3 3.22386 3 3.5C3 3.77614 3.22386 4 3.5 4V3ZM8.5 3.5H9C9 3.22386 8.77614 3 8.5 3V3.5ZM8 8.5C8 8.77614 8.22386 9 8.5 9C8.77614 9 9 8.77614 9 8.5H8ZM2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L2.64645 8.64645ZM3.5 4H8.5V3H3.5V4ZM8 3.5V8.5H9V3.5H8ZM8.14645 3.14645L2.64645 8.64645L3.35355 9.35355L8.85355 3.85355L8.14645 3.14645Z"
						fill="var(--grey1)"
					></path>
				</svg>
			)}
		</Link>
	),
	ul: ({ children }: { children: React.ReactNode }) => (
		<ul className="list">{children}</ul>
	),
	ol: ({ children }: { children: React.ReactNode }) => (
		<ol className="list">{children}</ol>
	),
	p: ({ children }: { children: React.ReactNode }) => (
		<p className="text-foreground leading-relaxed mb-4">{children}</p>
	),
	blockquote: ({ children }: { children: React.ReactNode }) => (
		<blockquote className="border-l-2 border-accent-foreground pl-4.5 pr-4 py-4 my-4 [&>p]:mb-0 bg-muted dark:bg-muted/20 [&>p]:opacity-75 [&>p]:text-[15px]">
			{children}
		</blockquote>
	),
};

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
	} catch {
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

	return (
		<main>
			<div className="relative">
				{/* Main article with right margin on large screens */}
				<article>
					<header className="mb-8">
						<span className="uppercase font-mono text-accent-foreground text-xs tracking-widest">
							Blog
						</span>
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
						<h1 className="mt-1.5 mb-2">{metadata.title}</h1>
						{metadata.excerpt && (
							<p className="text-xl text-muted-foreground mb-4">
								{metadata.excerpt}
							</p>
						)}
						<div className="flex items-center text-muted-foreground text-sm mt-2">
							<time dateTime={metadata.publishedAt} className="font-mono">
								{formattedDate}
							</time>
						</div>
						{metadata.tags && metadata.tags.length > 0 && (
							<div className="mt-4 flex flex-wrap gap-2">
								{metadata.tags.map((tag: string) => (
									<Badge key={tag}>{tag}</Badge>
								))}
							</div>
						)}
					</header>
					<MDXRemote
						source={content}
						components={components}
						options={{
							mdxOptions: {
								remarkPlugins: [remarkMath, remarkGfm, remarkSmartyPants],
								rehypePlugins: [
									rehypeKatex,
									rehypeSlug,
									[rehypeAutolinkHeadings, { behavior: "wrap" }],
									[
										rehypePrettyCode,
										{
											theme: {
												dark: "github-dark",
												light: "github-light",
											},
											keepBackground: false,
										},
									],
									[
										rehypeExternalLinks,
										{
											target: "_blank",
											rel: ["noopener", "noreferrer"],
										},
									],
									rehypeUnwrapImages,
								],
							},
						}}
					/>
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
