import Link from "next/link";

export default function NotFound() {
	return (
		<div className="fixed top-0 left-0 w-screen h-screen flex flex-col justify-center items-center text-center px-4">
			<span className="text-muted-foreground">404</span>
			<h1 className="text-5xl tracking-tight font-medium mb-2">
				You found a dead link
			</h1>
			<p className="text-muted-foreground mt-2">
				I haven&apos;t built this page yet, but you could always go back{" "}
				<Link
					href="/"
					className="text-cyan-500 hover:text-cyan-600 underline underline-offset-4 transition"
				>
					home
				</Link>
			</p>
		</div>
	);
}
