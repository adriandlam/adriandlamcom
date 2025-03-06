import ProjectCard from "@/components/project-card";
import RESUME from "@/data/resume";

export default function ProjectsPage() {
	return (
		<main>
			<h1 className="text-4xl font-medium tracking-tight">Projects</h1>
			<p className="font-mono text-muted-foreground mt-2">
				A collection of projects I've built throughout my journey as a developer
				and hobbyist.
			</p>

			{/* Projects Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
				{RESUME.projects.map((project, index) => (
					<ProjectCard key={project.slug} project={project} />
				))}
			</div>

			{/* Empty state */}
			{RESUME.projects.length === 0 && (
				<div className="text-center py-16">
					<h3 className="text-xl font-medium">No projects found</h3>
					<p className="font-mono mt-2 text-muted-foreground">
						Try selecting a different technology filter
					</p>
				</div>
			)}

			{/* Other projects section */}
			<div className="mt-16">
				<h2 className="text-2xl font-semibold tracking-tight mb-4">
					More Projects
				</h2>
				<p className="font-mono text-muted-foreground mb-6">
					Additional smaller projects and experiments can be found on my
					<a
						href="https://github.com/adriandlam"
						className="text-cyan-700 hover:text-cyan-500 ml-1 underline"
					>
						GitHub profile
					</a>
					.
				</p>
			</div>
		</main>
	);
}
