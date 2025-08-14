import Link from "next/link";

export default function NotFound() {
	return (
		<div className="bg-background fixed top-0 left-0 w-screen h-screen flex flex-col justify-center items-center text-center px-4">
			<span className="text-3xl">404</span>
			<h1 className="text-5xl tracking-tight mb-2">You found a dead link</h1>
			<p className="text-muted-foreground">
				I haven&apos;t built this page yet, but you could always go back{" "}
				<Link href="/" className="underline underline-offset-4">
					home
				</Link>
			</p>
		</div>
	);
}
