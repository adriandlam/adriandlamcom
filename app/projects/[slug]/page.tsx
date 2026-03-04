import type { Metadata } from "next";
import { getProject, getProjects } from "@/lib/projects";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents, mdxOptions } from "@/lib/mdx";
import "katex/dist/katex.min.css";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLinkIcon } from "@/components/external-link-icon";
import { extractHeadings } from "@/lib/toc";
import { TableOfContents } from "@/components/table-of-contents";
import { TransitionLink } from "@/components/transition-link";

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
			url: `https://adriandlam.com/projects/${slug}`,
		},
		twitter: {
			card: "summary_large_image",
			title: metadata.name,
			description: metadata.description,
		},
		alternates: {
			canonical: `https://adriandlam.com/projects/${slug}`,
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

	return (
		<main className="container mx-auto">
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
