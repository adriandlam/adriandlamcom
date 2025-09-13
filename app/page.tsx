import ProjectCard from "@/components/project-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import RESUME from "@/data/resume";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Activity } from "@/components/ui/kibo-ui/contribution-graph";
import { unstable_cache } from "next/cache";
import { Contributions } from "@/components/contributions";

const username = 'adriandlam';
const getCachedContributions = unstable_cache(
	async () => {
		const url = new URL(`/v4/${username}`, 'https://github-contributions-api.jogruber.de');
		const response = await fetch(url);
		const data = (await response.json()) as { total: { [year: string]: number }; contributions: Activity[] };
		const total = data.total[new Date().getFullYear()];
		const TOTAL_SQUARES = 417;

		const sortedData = data.contributions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
		return { contributions: sortedData.slice(0, TOTAL_SQUARES), total };
	},
	['github-contributions'],
	{ revalidate: 60 * 60 * 24 },
);

export default async function Home() {
	const { contributions, total } = await getCachedContributions();

	console.log(contributions);

	return (
		<main>
			{/* Intro Section */}
			<div className="flex items-center gap-6 border-y border-dashed p-8">
				<img
					src={RESUME.avatar_path}
					alt="Avatar"
					className="size-20 rounded-full"
				/>
				<div>
					<h1 className="text-3xl tracking-tight">{RESUME.name}</h1>
					<p className="mt-1 text-lg opacity-80">{RESUME.bio.intro}</p>
				</div>
			</div>

			{/* GitHub Recent Activity */}
			<div className="p-8">
				<h2 className="text-lg">Recent GitHub Activity</h2>
				<div className="mt-4">
					<Contributions data={contributions} />
				</div>
				{/* <p className="mt-2.5 text-muted-foreground text-xs">
					Psssst, can you tell when my exams are?
				</p> */}
			</div>

			{/* About Me Section */}
			<div className="p-8 border-t border-dashed">
				<h2 className="text-lg">About Me</h2>
				<div className="mt-2.5 opacity-80 space-y-3.5">
					<p>
						I&apos;m super passionate about building stuff that either solves
						real problems or helps me learn new concepts (super firm believer in
						project-based learning).
					</p>
					<p>
						I also enjoy reflecting deeply about society, one&apos;s place in
						it, and where we&apos;re all heading. I think reflecting is a good
						way to improve oneself since it&apos;s important to have an outlook
						on life that isn&apos;t just about the present, but also considers
						the bigger picture.
					</p>
					<p>
						When I&apos;m not building or reflecting, I love venturing outdoors
						(preferably roadtrips in the mountains with no plans). After doing a
						bunch of these sidequests, I discovered that I really enjoy{" "}
						<Link
							href="/photos"
							className="underline underline-offset-4 hover:opacity-100"
						>
							photography
						</Link>
						, it feels like a way to capture memories and share a glimpse of
						what I felt in the moment with others.
					</p>
				</div>
			</div>

			{/* Experience Section */}
			<div className="p-8 border-t border-dashed">
				<h2 className="text-xl">Experience</h2>
				<div className="mt-2.5 space-y-4">
					{RESUME.experience.map((experience) => (
						<div key={experience.company}>
							<div className="flex justify-between items-start">
								<div className="flex items-center gap-3.5">
									<Link
										href={experience.company_website}
										target="_blank"
										className="size-10 flex items-center justify-center bg-background border rounded-md p-2.5 flex-shrink-0 shadow-sm"
									>
										<div className="size-10 flex items-center justify-center bg-background border rounded-md p-2.5 flex-shrink-0 shadow-sm">
											<div className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain flex items-center justify-center">
												{experience.icon}
											</div>
										</div>
									</Link>
									<div>
										<h3>{experience.company}</h3>
										<p className="text-sm text-muted-foreground mt-0.5">
											{experience.role}
										</p>
									</div>
								</div>
								<div className="text-right text-sm">
									<p>
										{new Date(
											experience.start_date + "T00:00:00",
										).toLocaleDateString("en-US", {
											month: "short",
											year: "numeric",
										})}{" "}
										-{" "}
										{new Date(
											experience.end_date + "T00:00:00",
										).toLocaleDateString("en-US", {
											month: "short",
											year: "numeric",
										})}
									</p>
									<p className="text-muted-foreground mt-0.5">
										{experience.location}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Education Section */}
			<div className="p-8 border-t border-dashed">
				<h2 className="text-xl">Education</h2>
				<div className="mt-2.5">
					<div>
						<div className="flex justify-between items-start">
							<div className="flex items-center gap-3.5">
								<div>
									<h3>{RESUME.education.institution}</h3>
									<p className="text-sm text-muted-foreground mt-0.5">
										{RESUME.education.degree}, {RESUME.education.major}
									</p>
								</div>
							</div>
							<div className="text-right text-sm">
								<p>
									{RESUME.education.start_year} - {RESUME.education.end_year}
								</p>
								<p className="text-muted-foreground mt-0.5">
									{RESUME.education.location}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Projects Section */}
			<div className="px-8 pt-8 border-t border-dashed">
				<h2 className="text-xl">Projects</h2>
				<p className="mt-2.5 mb-6 opacity-80">
					Here are some of my notable projects that showcase my skills and
					interests:
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{RESUME.projects.slice(0, 4).map((project) => (
						<ProjectCard key={project.name} project={project} />
					))}
				</div>
				<div className="mt-6 flex justify-center">
					<Button variant="ghost" size="sm" asChild>
						<Link href="/projects">
							View All Projects <ChevronRight />
						</Link>
					</Button>
				</div>
			</div>

			{/* Extra Section */}
			{/* <div className="mt-10">
				<h2 className="text-2xl font-medium tracking-tight">
					Some extra stuff
				</h2>
				<p className=" mt-2 mb-6">
				</p>
			</div> */}
		</main>
	);
}
