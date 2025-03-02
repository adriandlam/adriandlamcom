import Link from "next/link";

export default function Footer() {
	return (
		<footer className="border-t mt-8 pt-6 pb-24 text-sm font-mono flex justify-between">
			<p>Adrian Lam</p>
			<Link
				href="https://github.com/adrianlamdev/adrian.lams.cc"
				className="text-cyan-500 hover:text-cyan-400 hover:underline underline-offset-2"
			>
				Source
			</Link>
		</footer>
	);
}
