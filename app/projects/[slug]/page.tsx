import RESUME from "@/data/resume";
import Link from "next/link";
import { notFound } from "next/navigation";

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
							className="link"
						>
							<span>View</span>
						</Link>
					)}
				</div>
			</div>

			{/* Main content */}
			<div className="md:col-span-2 space-y-6">
				<section>
					<h2 className="text-2xl mb-3">Overview</h2>
					<div className="space-y-4">
						<p>{project.longDescription || project.description}</p>
					</div>
				</section>

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
