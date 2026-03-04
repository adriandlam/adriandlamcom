import { getProjects } from "@/lib/projects";
import { TransitionLink } from "@/components/transition-link";
import Link from "next/link";

export default async function ProjectsPage() {
	const projects = await getProjects();

	return (
		<main className="container mx-auto">
			<div>
				<h1 className="text-xl tracking-tight font-medium">Projects</h1>
				<p className="mt-2 text-muted-foreground">
					A collection of projects I've built throughout my journey as a
					developer and hobbyist.
				</p>
			</div>
			<div className="mt-8">
				<ul className="list">
					{projects.map((project) => (
						<li key={project.slug}>
							<TransitionLink
								href={`/projects/${project.slug}`}
								direction="left"
								className="link"
							>
								{project.name}
							</TransitionLink>{" "}
							– {project.shortDescription || project.description}
						</li>
					))}
				</ul>
				<p className="mt-4">
					You can view my smaller projects and experiments{" "}
					<Link href="https://github.com/adriandlam" className="link">
						here
					</Link>
					.
				</p>
			</div>
		</main>
	);
}
