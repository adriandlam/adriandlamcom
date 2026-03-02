import RESUME from "@/data/resume";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLinkIcon } from "@/components/external-link-icon";

export async function generateStaticParams() {
	return RESUME.projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export default async function ProjectPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const project = RESUME.projects.find((p) => p.slug === slug);

	// Handle case where project doesn't exist or shouldn't be shown
	if (!project) {
		notFound();
	}

	return (
		<main className="container mx-auto">
			{/* Project header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
				<div>
					<span className="uppercase font-mono text-accent-foreground text-xs tracking-widest">
						Project
					</span>
					<h1 className="text-4xl mt-1.5">{project.name}</h1>
					<p className=" text-muted-foreground mt-2">{project.description}</p>
				</div>
				<div className="flex flex-wrap gap-3">
					{project.url && (
						<Link
							href={project.url}
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

			{/* Main content */}
			<div className="md:col-span-2 space-y-6">
				{project.keyFeatures && (
					<section>
						<h2 className="text-2xl mb-3">Key Features</h2>
						<ul className="list">
							{project.keyFeatures.map((feature: string) => (
								<li key={feature}>{feature}</li>
							))}
						</ul>
					</section>
				)}
			</div>
		</main>
	);
}
