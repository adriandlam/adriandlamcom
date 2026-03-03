import Image from "next/image";
import Link from "next/link";
import { ExternalLinkIcon } from "@/components/external-link-icon";
import * as CalloutComponents from "@/components/callout";

import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkSmartyPants from "remark-smartypants";
import remarkDirective from "remark-directive";
import remarkGemoji from "remark-gemoji";
import remarkRemoveComments from "remark-remove-comments";

import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeExternalLinks from "rehype-external-links";
import rehypeUnwrapImages from "rehype-unwrap-images";

export const mdxComponents = {
	...CalloutComponents,
	img: ({ src, alt, ...props }: any) => {
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
		<blockquote className="border-l-2 border-accent-foreground pl-4.5 pr-4 py-4 my-4 [&>p]:mb-0 [&>p]:text-muted-foreground [&>p]:text-[15px]">
			{children}
		</blockquote>
	),
};

export const mdxOptions = {
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
};
