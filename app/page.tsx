import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RESUME from "@/data/resume";
import Link from "next/link";

export default function Home() {
	return (
		<main>
			{/* Intro Section */}
			<div className="flex items-center justify-between gap-6">
				<div>
					<h1 className="text-3xl font-semibold tracking-tight">
						{RESUME.name}
					</h1>
					<p className="font-mono mt-2">{RESUME.bio}</p>
				</div>
				<Avatar className="w-28 h-28">
					<AvatarImage src={RESUME.avatar_path} alt="Avatar" />
					<AvatarFallback>AL</AvatarFallback>
				</Avatar>
			</div>

			{/* GitHub Recent Activity */}
			<div className="mt-10">
				<h2 className="text-2xl font-semibold tracking-tight">
					Recent GitHub Activity
				</h2>
				<img
					src="https://ghchart.rshah.org/409ba5/adriandlam"
					alt="adriandlam's Github chart"
					className="mt-2"
				/>
				<p className="font-mono mt-2 text-muted-foreground text-xs text-center">
					Psssst, can you tell when my exams are? I'm not sure if I can
				</p>
			</div>

			{/* About Me Section */}
			<div className="mt-10">
				<h2 className="text-2xl font-semibold tracking-tight">About Me</h2>
				<p className="font-mono mt-2">
					I'm a Mathematics student at the University of British Columbia, set
					to graduate in 2026. I have a strong background in software
					development, with experience in full-stack development, machine
					learning, and data analysis.
				</p>
			</div>

			{/* Education Section */}
			<div className="mt-10">
				<h2 className="text-2xl font-semibold tracking-tight">Education</h2>
				<div className="mt-2">
					<div className="flex justify-between items-end">
						<h3 className="font-medium tracking-tight">
							University of British Columbia
						</h3>
						<p className="font-mono text-muted-foreground">2022 - 2026</p>
					</div>
					<p className="font-mono text-sm mt-0.5">
						Bachelor of Science, Mathematics
					</p>
				</div>
			</div>

			{/* Projects Section */}
			<div className="mt-10">
				<h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
				<p className="font-mono mt-2">
					I've worked on a bunch of projects, but here are a few that I'm proud
					of:
				</p>
				<ul className="mt-6 space-y-6">
					{RESUME.projects.map((project) => (
						<li
							key={project.name}
							className="border rounded shadow hover:shadow-md hover:border-cyan-900 transition-all"
						>
							<Link
								href={`/projects/${project.slug}`}
								className="block p-4 h-full w-full"
							>
								<h3 className="font-medium text-lg tracking-tight">
									{project.name}
								</h3>
								<p className="font-mono mt-0.5 text-sm">
									{project.description}
								</p>
								<div className="flex items-center gap-2 mt-3 text-xs flex-wrap">
									{project.stack.map((tech) => (
										<Badge key={tech}>{tech}</Badge>
									))}
								</div>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</main>
	);
}
