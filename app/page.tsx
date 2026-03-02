import RESUME from "@/data/resume";
import Image from "next/image";
import Link from "next/link";
import { ExternalLinkIcon } from "@/components/external-link-icon";

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
						software engineer, vancouver, bc
					</p>
				</div>
			</div>

			{/* About Me Section */}
			<div className="mt-8">
				<div className="space-y-4">
					<p>
						Previously, I worked as an intern at Vercel as one of the core
						maintainers of the{" "}
						<Link
							href="https://useworkflow.dev"
							target="_blank"
							className="link inline-flex gap-0.5"
						>
							Workflow DevKit
							<ExternalLinkIcon />
						</Link>
						. This May, I'm joining{" "}
						<Link
							href="https://cloudflare.com"
							target="_blank"
							className="link inline-flex gap-0.5"
						>
							Cloudflare
							<ExternalLinkIcon />
						</Link>{" "}
						as a software intern in Austin, TX.
					</p>
					<p>
						I'm studying Math at the University of British Columbia. Big fan of
						venturing outdoors into the unknown (I like mountains). After doing
						a bunch of these sidequests, I discovered that I really enjoy{" "}
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
								– {project.shortDescription || project.description}
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
