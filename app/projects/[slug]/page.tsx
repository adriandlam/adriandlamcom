import RESUME from "@/data/resume";
import { notFound } from "next/navigation";

export default async function Project({
	params,
}: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;

	const project = RESUME.projects.find((project) => project.slug === slug);
	if (!project) {
		return notFound();
	}

	return (
		<main>
			<div>
				<h1 className="text-3xl font-semibold tracking-tight">
					{project.name}
				</h1>
				<p className="font-mono mt-2">{project.description}</p>
			</div>
			{project?.name}
		</main>
	);
}
