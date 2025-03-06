import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import "highlight.js/styles/vs2015.css";
import {
	Callout,
	CalloutDescription,
	CalloutTitle,
} from "@/components/callout";
import { notFound } from "next/navigation";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

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
}: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;

	// Read the file content with gray-matter
	const post = await getBlogPost(slug);

	if (!post) {
		notFound();
	}

	const { metadata, content } = post;

	// Format the date
	const formattedDate = formatDate(metadata.publishedAt);

	return (
		<div>
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
						<p className="text-xl text-gray-600 mb-4">{metadata.excerpt}</p>
					)}
					<div className="flex items-center text-gray-500 text-sm">
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
								<span
									key={tag}
									className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full"
								>
									{tag}
								</span>
							))}
						</div>
					)}
				</header>
				<div className="prose max-w-none">
					<MDXRemote
						source={content}
						components={components}
						options={{
							mdxOptions: {
								remarkPlugins: [remarkMath, remarkGfm],
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
	);
}

// This generates the static paths at build time
export async function generateStaticParams() {
	const blogDirectory = path.join(process.cwd(), "content/blog");
	const filenames = fs.readdirSync(blogDirectory);
	const slugs = filenames
		.filter((filename) => filename.endsWith(".mdx"))
		.map((filename) => filename.replace(/\.mdx$/, ""));

	return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;
