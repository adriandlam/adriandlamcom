import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ExternalLinkIcon } from "@/components/external-link-icon";
import { KatexStyles } from "@/components/katex-styles";
import { SITE_URL } from "@/lib/constants";
import { mdxComponents, mdxOptions } from "@/lib/mdx";
import { getProject, getProjects } from "@/lib/projects";

const TableOfContents = dynamic(
	() => import("@/components/table-of-contents").then((m) => m.TableOfContents),
	{ ssr: false },
);

import { TransitionLink } from "@/components/transition-link";
import { extractHeadings } from "@/lib/toc";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const project = await getProject(slug);

	if (!project) {
		return { title: "Project Not Found" };
	}

	const { metadata } = project;

	return {
		title: `${metadata.name} | Adrian Lam`,
		description: metadata.description,
		openGraph: {
			title: metadata.name,
			description: metadata.description,
			type: "article",
			url: `${SITE_URL}/projects/${slug}`,
		},
		twitter: {
			card: "summary_large_image",
			title: metadata.name,
			description: metadata.description,
		},
		alternates: {
			canonical: `${SITE_URL}/projects/${slug}`,
		},
	};
}

export default async function ProjectPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const project = await getProject(slug);

	if (!project) {
		notFound();
	}

	const { metadata, content } = project;
	const headings = extractHeadings(content);
	const usesMath = content.includes("$") || content.includes("\\(");

	return (
		<main>
			{usesMath && <KatexStyles />}
			<div className="relative">
				{headings.length >= 2 && <TableOfContents items={headings} />}

				{/* Project header */}
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
					<div>
						<span className="uppercase font-mono text-accent-foreground text-xs tracking-widest">
							Project
						</span>
						<h1 className="text-4xl mt-1.5">{metadata.name}</h1>
						<p className=" text-muted-foreground mt-2">
							{metadata.description}
						</p>
					</div>
					<div className="flex flex-wrap gap-3">
						{metadata.url && (
							<Link
								href={metadata.url}
								target="_blank"
								rel="noopener noreferrer"
								className="link inline-flex gap-0.5"
							>
								View
								<ExternalLinkIcon />
							</Link>
						)}
					</div>
				</div>

				{/* MDX content */}
				<article>
					<MDXRemote
						source={content}
						components={mdxComponents}
						options={{
							// biome-ignore lint/suspicious/noExplicitAny: remark/rehype plugin types don't match next-mdx-remote's expected types
							mdxOptions: mdxOptions as any,
						}}
					/>
				</article>
			</div>

			{/* Back nav */}
			<nav className="mt-16 border-t border-border pt-8">
				<TransitionLink
					href="/projects"
					direction="right"
					className="link text-sm text-muted-foreground font-mono lg:hidden"
				>
					← Back to projects
				</TransitionLink>
			</nav>
		</main>
	);
}

export async function generateStaticParams() {
	const projects = await getProjects();
	return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;
