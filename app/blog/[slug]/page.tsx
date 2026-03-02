import type { Metadata } from "next";
import { getBlogPost, getBlogPosts } from "@/lib/blog";
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
import remarkDirective from "remark-directive";
import remarkGemoji from "remark-gemoji";
import remarkRemoveComments from "remark-remove-comments";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeExternalLinks from "rehype-external-links";
import rehypeUnwrapImages from "rehype-unwrap-images";
import { ExternalLinkIcon } from "@/components/external-link-icon";
import Link from "next/link";

const components = {
	...CalloutComponents,
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
					// priority={true}
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
			{!(href.startsWith("/") || href.startsWith("#")) && <ExternalLinkIcon />}
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
		<blockquote className="border-l-2 border-accent-foreground pl-4.5 pr-4 py-4 my-4 [&>p]:mb-0 bg-muted/20 [&>p]:opacity-75 [&>p]:text-[15px]">
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

// Re-export for backward compatibility
export { getBlogPost };

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
									sizes="(max-width: 768px) 100vw, 768px"
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
								remarkPlugins: [
									remarkMath,
									remarkGfm,
									remarkSmartyPants,
									remarkDirective,
									remarkGemoji,
									remarkRemoveComments,
								],
								rehypePlugins: [
									rehypeKatex,
									rehypeSlug,
									[rehypeAutolinkHeadings, { behavior: "wrap" }],
									[
										rehypePrettyCode,
										{
											theme: "vesper",
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
	const posts = await getBlogPosts();
	return posts.map((post: { slug: string }) => ({ slug: post.slug }));
}

export const dynamicParams = false;
