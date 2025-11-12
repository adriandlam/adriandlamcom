import Link from "next/link";

export default function NotFound() {
	return (
		<main>
			<div>
				<p className="text-accent-foreground tracking-widest font-mono text-sm">
					404
				</p>
				<h1 className="mt-1.5 text-4xl">Page not found</h1>
				<p className="mt-2 text-muted-foreground">
					This page doesn&apos;t exist or has been moved.
				</p>
			</div>
			<div className="mt-4">
				<p>
					You can head back{" "}
					<Link href="/" className="link">
						home
					</Link>{" "}
					or check out some of my{" "}
					<Link href="/projects" className="link">
						projects
					</Link>{" "}
					and{" "}
					<Link href="/blog" className="link">
						blog posts
					</Link>
					.
				</p>
			</div>
		</main>
	);
}
