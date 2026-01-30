import RESUME from "@/data/resume";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<main>
			{/* Intro Section */}
			<div className="flex items-center gap-6">
				<Image
					src="/me.jpeg"
					alt="Avatar"
					width={64}
					height={64}
					className="size-16 rounded-full"
					priority
				/>
				<div>
					<h1>Adrian Lam</h1>
					<p className="text-muted-foreground font-mono text-sm">
						vancouver, bc
					</p>
				</div>
			</div>

			{/* About Me Section */}
			<div className="mt-8">
				<div className="space-y-4">
					<p>
						I love building stuff that either solves real problems or helps me
						learn new concepts.
					</p>
					<p>
						Currently, I'm studying Mathematics at the University of British
						Columbia. Previously, I was an intern at Vercel as a core maintainer
						of the{" "}
						<Link
							href="https://useworkflow.dev"
							target="_blank"
							className="link"
						>
							Workflow DevKit
						</Link>{" "}
						.
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
				<p>Some cool projects I've worked on:</p>
				<ul className="list">
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
				<p>
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
