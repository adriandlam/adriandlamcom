"use client";

import { Check, CircleDot, ExternalLink, Github, Image } from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";

interface Project {
	name: string;
	slug: string;
	description: string;
	stack: string[];
	imagePath?: string;
	githubUrl?: string;
	liveUrl?: string;
	inProgress?: boolean;
	year: number;
}

export default function ProjectCard({ project }: { project: Project }) {
	// Handle click on external links to prevent navigation to project detail
	const handleExternalLinkClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	return (
		<div
			key={project.name}
			className="border rounded-lg overflow-hidden hover:shadow-md hover:border-cyan-900 transition-all flex flex-col h-full group"
		>
			<Link href={`/projects/${project.slug}`} className="cursor-pointer">
				<div className="w-full h-48 overflow-hidden">
					{project.imagePath ? (
						<img
							src={project.imagePath}
							alt={`${project.name} screenshot`}
							className="w-full h-full object-cover object-top transition-transform hover:scale-105"
						/>
					) : (
						<div className="w-full h-48 bg-muted flex justify-center items-center">
							<Image
								className="w-10 h-10 text-muted-foreground"
								strokeWidth={1.5}
							/>
						</div>
					)}
				</div>
			</Link>
			<div className="p-4 flex flex-col flex-grow">
				<div className="flex items-center justify-between">
					<Link href={`/projects/${project.slug}`}>
						<h3 className="font-medium text-lg tracking-tight hover:text-cyan-600 transition-colors">
							{project.name}
						</h3>
				</Link>
				<div>
					{project.inProgress ? (
						<Badge className="text-xs font-medium border-yellow-800/30 text-yellow-700 backdrop-blur bg-yellow-800/20 animate-pulse">
							<CircleDot className="size-4" /> In Progress
						</Badge>
					) : (
						<Badge className="text-xs font-medium border-green-800/30 text-green-700 backdrop-blur bg-green-800/20">
							<Check className="size-4" /> Completed
						</Badge>
					)}
					</div>
				</div>
				<p className="font-mono mt-2 text-sm flex-grow">
					{project.description}
				</p>
				<div className="flex items-center gap-2 mt-4 mb-2 text-xs flex-wrap">
					{project.stack.map((tech) => (
						<Badge key={tech} variant="secondary">
							{tech}
						</Badge>
					))}
				</div>
				<div className="flex items-center justify-between mt-3">
					<Link
						href={`/projects/${project.slug}`}
						className="text-sm font-medium text-cyan-500 hover:text-cyan-600 transition-colors"
					>
						View Details
					</Link>
					<div className="flex gap-3 items-center">
						{project.githubUrl && (
							<Link
								href={project.githubUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-primary transition-colors"
								onClick={handleExternalLinkClick}
								legacyBehavior={false}
								passHref
							>
								<Github size={18} />
							</Link>
						)}
						{project.liveUrl && (
							<Link
								href={project.liveUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-primary transition-colors"
								onClick={handleExternalLinkClick}
								legacyBehavior={false}
								passHref
							>
								<ExternalLink size={18} />
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
