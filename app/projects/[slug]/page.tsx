import { Button } from "@/components/ui/button";
import RESUME from "@/data/resume";
import { ExternalLink, Github } from "lucide-react";
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
					<h1 className="text-4xl">{project.name}</h1>
					<p className=" text-muted-foreground mt-2">{project.description}</p>
				</div>
				<div className="flex flex-wrap gap-3">
					{project.githubUrl && (
						<Button variant="outline" size="sm">
							<Link
								href={project.githubUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2"
							>
								<Github size={18} />
								<span>GitHub</span>
							</Link>
						</Button>
					)}
					{project.liveUrl && (
						<Button variant="outline" size="sm">
							<Link
								href={project.liveUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2"
							>
								<ExternalLink size={18} />
								<span>Live Demo</span>
							</Link>
						</Button>
					)}
				</div>
			</div>

			{/* Project image */}
			{project.imagePath && (
				<div className="mb-10 border overflow-hidden shadow-xs rounded-xl">
					<img
						src={project.imagePath}
						alt={`${project.name} screenshot`}
						className="w-full h-auto rounded-xl object-cover"
					/>
				</div>
			)}

			{/* Project details */}
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

				{project.challenges && (
					<section>
						<h2 className="text-2xl mb-3">Challenges & Solutions</h2>
						<div>
							<p>{project.challenges}</p>
						</div>
					</section>
				)}
			</div>
		</main>
	);
}
