import ProjectCard from "@/components/project-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import RESUME from "@/data/resume";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
	return (
		<main>
			{/* Intro Section */}
			<div className="flex items-center justify-between gap-6">
				<div>
					<h1 className="text-4xl font-medium tracking-tight">{RESUME.name}</h1>
					<p className="font-mono mt-2">{RESUME.bio}</p>
				</div>
				<Avatar className="w-28 h-28">
					<AvatarImage src={RESUME.avatar_path} alt="Avatar" />
					<AvatarFallback>AL</AvatarFallback>
				</Avatar>
			</div>

			{/* GitHub Recent Activity */}
			<div className="mt-10">
				<h2 className="text-2xl font-medium tracking-tight">
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
				<h2 className="text-2xl font-medium tracking-tight">About Me</h2>
				<p className="font-mono mt-2">
					I'm a Mathematics student at the University of British Columbia, set
					to graduate in 2026. I have a strong background in software
					development, with experience in full-stack development, machine
					learning, and data analysis.
				</p>
			</div>

			{/* Education Section */}
			<div className="mt-10">
				<h2 className="text-2xl font-medium tracking-tight">Education</h2>
				<div className="mt-2">
					<div className="flex justify-between items-end">
						<h3 className="font-medium tracking-tight">
							University of British Columbia
						</h3>
						<p>2022 - 2026</p>
					</div>
					<p className="font-mono text-sm mt-0.5 text-muted-foreground">
						Bachelor of Science, Mathematics
					</p>
				</div>
			</div>

			{/* Projects Section */}
			<div className="mt-10">
				<h2 className="text-2xl font-medium tracking-tight">Projects</h2>
				<p className="font-mono mt-2 mb-6">
					Here are some of my notable projects that showcase my skills and
					interests:
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{RESUME.projects.slice(0, 4).map((project) => (
						<ProjectCard key={project.name} project={project} />
					))}
				</div>
				<div className="mt-4 flex justify-center">
					<Button
						variant="link"
						effect={"hoverUnderline"}
						asChild
						className="after:w-full px-0"
					>
						<Link href="/projects">
							View All Projects <ArrowRight />
						</Link>
					</Button>
				</div>
			</div>

			{/* Extra Section */}
			{/* <div className="mt-10">
				<h2 className="text-2xl font-medium tracking-tight">
					Some extra stuff
				</h2>
				<p className="font-mono mt-2 mb-6">
				</p>
			</div> */}
		</main>
	);
}
