import Link from "next/link";

export default function Footer() {
	return (
		<footer className="container mx-auto my-12">
			<div className="flex justify-between items-center text-sm">
				<p>
					<span className="opacity-75">Adrian Lam (</span>
					<Link
						href="https://x.com/adriandlam_"
						className="link inline-flex gap-0.5"
					>
						@adriandlam_
						<svg
							className="mt-0.5 size-3"
							viewBox="0 0 12 12"
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>External link</title>
							<path
								d="M3.5 3C3.22386 3 3 3.22386 3 3.5C3 3.77614 3.22386 4 3.5 4V3ZM8.5 3.5H9C9 3.22386 8.77614 3 8.5 3V3.5ZM8 8.5C8 8.77614 8.22386 9 8.5 9C8.77614 9 9 8.77614 9 8.5H8ZM2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L2.64645 8.64645ZM3.5 4H8.5V3H3.5V4ZM8 3.5V8.5H9V3.5H8ZM8.14645 3.14645L2.64645 8.64645L3.35355 9.35355L8.85355 3.85355L8.14645 3.14645Z"
								fill="var(--grey1)"
							></path>
						</svg>
					</Link>
					<span className="opacity-75">)</span>
				</p>
				<Link
					href="https://github.com/adriandlam/adriandlamcom"
					className="link inline-flex gap-0.5"
				>
					Source
					<svg
						className="mt-0.5 size-3"
						viewBox="0 0 12 12"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>External link</title>
						<path
							d="M3.5 3C3.22386 3 3 3.22386 3 3.5C3 3.77614 3.22386 4 3.5 4V3ZM8.5 3.5H9C9 3.22386 8.77614 3 8.5 3V3.5ZM8 8.5C8 8.77614 8.22386 9 8.5 9C8.77614 9 9 8.77614 9 8.5H8ZM2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L2.64645 8.64645ZM3.5 4H8.5V3H3.5V4ZM8 3.5V8.5H9V3.5H8ZM8.14645 3.14645L2.64645 8.64645L3.35355 9.35355L8.85355 3.85355L8.14645 3.14645Z"
							fill="var(--grey1)"
						></path>
					</svg>
				</Link>
			</div>
		</footer>
	);
}
