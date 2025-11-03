import ProjectCard from "@/components/project-card";
import RESUME from "@/data/resume";
import Link from "next/link";

export default function ProjectsPage() {
	return (
		<main className="container mx-auto">
			<div>
				<h1 className="text-xl tracking-tight font-medium">Projects</h1>
				<p className="mt-2">
					A collection of projects I've built throughout my journey as a
					developer and hobbyist.
				</p>
			</div>

			{/* Projects Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
				{RESUME.projects.map((project, index) => (
					<ProjectCard key={project.slug} project={project} />
				))}
			</div>

			{/* Empty state */}
			{RESUME.projects.length === 0 && (
				<div className="text-center py-16">
					<h3 className="text-xl font-medium">No projects found</h3>
					<p className=" mt-2 text-muted-foreground">
						Try selecting a different technology filter
					</p>
				</div>
			)}

			{/* Other projects section */}
			<div className="mt-16">
				<h2 className="text-2xl font-medium tracking-tight mb-4">
					More Projects
				</h2>
				<p className="opacity-80 mb-6">
					Additional smaller projects and experiments can be found on my{" "}
					<Link
						href="https://github.com/adriandlam"
						className="text-muted-foreground hover:text-foreground underline underline-offset-4 transition"
					>
						GitHub profile
					</Link>
					.
				</p>
			</div>
		</main>
	);
}
