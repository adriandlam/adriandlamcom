import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { KatexStyles } from "@/components/katex-styles";
import { getBlogPost, getBlogPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";

const TableOfContents = dynamic(
	() => import("@/components/table-of-contents").then((m) => m.TableOfContents),
	{ ssr: false },
);

import { TransitionLink } from "@/components/transition-link";
import { Badge } from "@/components/ui/badge";
import { mdxComponents, mdxOptions } from "@/lib/mdx";
import { extractHeadings } from "@/lib/toc";
import { formatDateLong } from "@/lib/utils";

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
		metadata.coverImage ||
		metadata.images?.[0] ||
		`${SITE_URL}/opengraph-image`;

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
			url: `${SITE_URL}/blog/${slug}`,
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
			canonical: `${SITE_URL}/blog/${slug}`,
		},
	};
}

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	const post = await getBlogPost(slug);

	if (!post) {
		notFound();
	}

	const { metadata, content, readingTime } = post;
	const formattedDate = formatDateLong(metadata.publishedAt);
	const headings = extractHeadings(content);
	const usesMath = content.includes("$") || content.includes("\\(");

	return (
		<main>
			{usesMath && <KatexStyles />}
			<div className="relative">
				{headings.length >= 2 && <TableOfContents items={headings} />}
				{/* Main article with right margin on large screens */}
				<article>
					<header className="mb-12">
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
						<div className="flex items-center text-muted-foreground text-sm mt-2 gap-2">
							<time dateTime={metadata.publishedAt} className="font-mono">
								{formattedDate}
							</time>
							<span className="">&middot;</span>
							<span className="font-mono">{readingTime} min read</span>
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
						components={mdxComponents}
						options={{
							// biome-ignore lint/suspicious/noExplicitAny: remark/rehype plugin types don't match next-mdx-remote's expected types
							mdxOptions: mdxOptions as any,
						}}
					/>
				</article>

				{/* Post navigation */}
				<nav className="mt-16 border-t border-border pt-8 inline-block lg:hidden">
					{/* Back to blog — mobile only */}
					<TransitionLink
						href="/blog"
						direction="right"
						className="link text-sm text-muted-foreground font-mono mb-8"
					>
						<ChevronLeft /> Back to blog
					</TransitionLink>
				</nav>
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
