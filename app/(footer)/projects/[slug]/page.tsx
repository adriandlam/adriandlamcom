import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RESUME from "@/data/resume";
import {
	ArrowLeft,
	Check,
	CircleDot,
	ExternalLink,
	Github,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProjectPage({
	params,
}: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const project = RESUME.projects.find((p) => p.slug === slug);

	// Handle case where project doesn't exist or shouldn't be shown
	if (!project) {
		notFound();
	}

	return (
		<main>
			{/* Back button */}
			<Link
				href="/projects"
				className="inline-flex items-center text-sm font-medium text-cyan-500 hover:text-cyan-600 mb-6 transition-colors gap-1 no-underline"
			>
				<ArrowLeft className="h-4 w-4" />
				Back to all projects
			</Link>

			{/* Project header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
				<div>
					<h1 className="text-4xl font-medium tracking-tight">
						{project.name}
					</h1>
					<p className="font-mono text-muted-foreground mt-2">
						{project.description}
					</p>
				</div>
				<div className="flex flex-wrap gap-3">
					{project.githubUrl && (
						<Button variant="outline">
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
						<Button variant="outline">
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
				<div className="mb-10 border rounded-md overflow-hidden shadow-xs">
					<img
						src={project.imagePath}
						alt={`${project.name} screenshot`}
						className="w-full h-auto"
					/>
				</div>
			)}

			{/* Project details */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{/* Main content */}
				<div className="md:col-span-2 space-y-6">
					<section>
						<h2 className="text-2xl font-medium mb-3">Overview</h2>
						<div className="space-y-4">
							<p>{project.longDescription || project.description}</p>
						</div>
					</section>

					{project.keyFeatures && (
						<section>
							<h2 className="text-2xl font-medium mb-3">Key Features</h2>
							<ul className="list-disc list-inside space-y-2 pl-2">
								{project.keyFeatures.map((feature: string) => (
									<li key={feature}>{feature}</li>
								))}
							</ul>
						</section>
					)}

					{project.challenges && (
						<section>
							<h2 className="text-2xl font-medium mb-3">
								Challenges & Solutions
							</h2>
							<div>
								<p>{project.challenges}</p>
							</div>
						</section>
					)}
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					<section className="border rounded p-4">
						<h3 className="text-lg font-medium mb-3">Status</h3>
						{project.inProgress ? (
							<Badge className="text-xs font-medium border-yellow-800/30 text-yellow-700 backdrop-blur bg-yellow-800/20 animate-pulse">
								<CircleDot className="size-4" /> In Progress
							</Badge>
						) : (
							<Badge className="text-xs font-medium border-green-800/30 text-green-700 backdrop-blur bg-green-800/20">
								<Check className="size-4" /> Completed
							</Badge>
						)}
					</section>

					{project.awards && project.awards.length > 0 && (
						<section className="border rounded p-4">
							<h3 className="text-lg font-medium mb-3">Awards</h3>
							<ul className="space-y-2">
								{project.awards.map((award: string) => (
									<li key={award}>{award}</li>
								))}
							</ul>
						</section>
					)}

					<section className="border rounded p-4">
						<h3 className="text-lg font-medium mb-3">Tech Stack</h3>
						<div className="flex flex-wrap gap-2">
							{project.stack.map((tech: string) => (
								<Badge key={tech} variant="outline" className="font-mono">
									{tech}
								</Badge>
							))}
						</div>
					</section>

					{project.year && (
						<section className="border rounded p-4">
							<h3 className="text-lg font-medium mb-2">Year</h3>
							<p className="font-mono">{project.year}</p>
						</section>
					)}

					{project.collaborators && project.collaborators.length > 0 && (
						<section className="border rounded p-4">
							<h3 className="text-lg font-medium mb-3">Collaborators</h3>
							<ul className="space-y-4">
								{project.collaborators.map(
									(collaborator: {
										name: string;
										portfolio?: string;
										twitter?: string;
									}) => (
										<li key={collaborator.name}>
											{collaborator.name}
											<div className="flex gap-2 mt-1">
												{collaborator.portfolio && (
													<Link
														href={collaborator.portfolio}
														target="_blank"
														rel="noopener noreferrer"
														className="text-xs text-cyan-500 hover:underline"
													>
														Portfolio
													</Link>
												)}
												{collaborator.twitter && (
													<Link
														href={collaborator.twitter}
														target="_blank"
														rel="noopener noreferrer"
														className="text-xs text-cyan-500 hover:underline"
													>
														Twitter
													</Link>
												)}
											</div>
										</li>
									),
								)}
							</ul>
						</section>
					)}
				</div>
			</div>

			{/* Related projects section */}
			<section className="mt-16">
				<h2 className="text-2xl font-medium mb-6">Related Projects</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{RESUME.projects
						.filter((p) => p.slug !== project.slug)
						.slice(0, 3)
						.map((relatedProject) => (
							<Link
								key={relatedProject.slug}
								href={`/projects/${relatedProject.slug}`}
								className="border rounded p-4 hover:shadow-md transition-all hover:border-cyan-900"
							>
								<h3 className="font-medium">{relatedProject.name}</h3>
								<p className="font-mono text-sm text-muted-foreground mt-1 line-clamp-2">
									{relatedProject.description}
								</p>
							</Link>
						))}
				</div>
			</section>
		</main>
	);
}
