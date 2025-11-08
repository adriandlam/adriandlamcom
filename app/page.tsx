import RESUME from "@/data/resume";
import Link from "next/link";

export default async function Home() {
	return (
		<main className="container mx-auto">
			{/* Intro Section */}
			<div className="flex items-center gap-6">
				<img src="/me.jpeg" alt="Avatar" className="size-14 rounded-full" />
				<h1 className="text-3xl tracking-tight font-medium">Adrian Lam</h1>
			</div>

			{/* About Me Section */}
			<div className="mt-8">
				<div className="space-y-4">
					<p>
						I love building stuff that either solves real problems or helps me
						learn new concepts.
					</p>
					<p>
						Currently, I&apos;m interning at Vercel as a core maintainer of the
						Workflow DevKit and I'm studying Mathematics at the University of
						British Columbia.
					</p>
					<p>
						Big fan of venturing outdoors into the unknown (I like mountains).
						After doing a bunch of these sidequests, I discovered that I really
						enjoy{" "}
						<Link href="/photos" className="link">
							photography
						</Link>
						.
					</p>
				</div>
			</div>

			{/* Projects Section */}
			<div className="mt-8">
				<h2>Some cool projects I've worked on:</h2>
				<ul className="list-disc list-inside mt-4 ml-4 space-y-0.5">
					{RESUME.projects
						.filter((project) => project.featured)
						.map((project) => (
							<li key={project.name}>
								<Link href={`/projects/${project.slug}`} className="link">
									{project.name}
								</Link>{" "}
								– {project.description}
							</li>
						))}
				</ul>
				<p className="mt-4">
					You can view all my projects{" "}
					<Link href="/projects" className="link">
						here
					</Link>
					.
				</p>
			</div>
		</main>
	);
}
