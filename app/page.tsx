import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
	return (
		<main>
			{/*  */}
			<div className="flex items-center justify-between gap-6">
				<div>
					<h1 className="text-3xl font-semibold tracking-tight">Adrian Lam</h1>
					<p className="font-mono mt-2">
						Math student at UBC. Passionate about building things and helping
						people.
					</p>
				</div>
				<Avatar className="w-28 h-28">
					<AvatarImage src="/me.jpg" alt="Avatar" />
					<AvatarFallback>AL</AvatarFallback>
				</Avatar>
			</div>

			{/* GitHub Recent Activity */}
			<div className="mt-10">
				<h2 className="text-2xl font-semibold tracking-tight">
					Recent GitHub Activity
				</h2>
				<img
					src="https://ghchart.rshah.org/409ba5/adrianlamdev"
					alt="adrianlamdev's Github chart"
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
						<p className="font-mono">2022 - 2026</p>
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
					<li className="border p-4 rounded shadow hover:shadow-lg transition-all list-none">
						<h3 className="font-medium text-lg tracking-tight">Heida</h3>
						<p className="font-mono mt-0.5 text-sm">
							A complete end-2-end web application for AI-powered productivity
						</p>
						<div className="mt-3 space-y-2 text-sm">
							<p>
								End-to-end AI command center built with Next.js, Supabase,
								FastAPI, Docker, Redis, and vector embeddings. Features include:
							</p>
							<div className="flex items-center gap-2 mt-3 text-xs flex-wrap">
								<Badge>Next.js</Badge>
								<Badge>Supabase</Badge>
								<Badge>FastAPI</Badge>
								<Badge>Docker</Badge>
								<Badge>Redis</Badge>
								<Badge>Vector Embeddings</Badge>
							</div>
						</div>
					</li>
					<li className="border p-4 rounded shadow hover:shadow-lg transition-all">
						<h3 className="font-medium text-lg tracking-tight">
							MNIST Digit Classifier
						</h3>
						<p className="font-mono mt-0.5 text-sm">
							Neural network implementation from scratch with 98.32% accuracy
						</p>
						<div className="mt-3 space-y-2 text-sm">
							<p>
								Hand-written digit classification neural network built from
								first principles, surpassing baseline models by 3.28%.
							</p>
							<div className="flex items-center gap-2 mt-3 text-xs flex-wrap">
								<Badge>Python</Badge>
								<Badge>NumPy</Badge>
								<Badge>PyTorch</Badge>
								<Badge>Neural Networks</Badge>
							</div>
						</div>
					</li>
					<li className="border p-4 rounded shadow hover:shadow-lg transition-all flex flex-col justify-between">
						<div>
							<h3 className="font-medium text-lg tracking-tight">
								UBC Grade Analyzer
							</h3>
							<p className="font-mono mt-0.5 text-sm">
								Course difficulty prediction system with 4.84% error rate
							</p>
							<div className="mt-3 space-y-2 text-sm">
								<p>
									Data-driven grade prediction platform analyzing 10+ years of
									UBC course data to forecast course difficulty and expected
									outcomes.
								</p>
								<div className="flex items-center gap-2 mt-3 text-xs flex-wrap">
									<Badge>Python</Badge>
									<Badge>Pandas</Badge>
									<Badge>Scikit-learn</Badge>
									<Badge>Seaborn</Badge>
									<Badge>NumPy</Badge>
								</div>
							</div>
						</div>
						<div>
							<Button
								variant="link"
								className="text-cyan-500 hover:text-cyan-400"
							>
								<Link
									href="/projects/ubc-grade-analyzer"
									className="flex items-center gap-2"
								>
									<svg
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
										className="w-6 h-6"
										fill="currentColor"
									>
										<title>GitHub</title>
										<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
									</svg>
									GitHub
								</Link>
							</Button>
						</div>
					</li>
				</ul>
			</div>

			{/* Contact Section */}
			<div className="mt-10">
				<h2 className="text-2xl font-semibold tracking-tight">Contact</h2>
				<p className="font-mono mt-2">
					Want to chat? Just shoot me an email{" "}
					<Link
						href="mailto:adrian@lams.cc"
						className="text-cyan-500 hover:text-cyan-400"
					>
						here
					</Link>{" "}
					and I'll respond whenever I can.
				</p>
			</div>
		</main>
	);
}
