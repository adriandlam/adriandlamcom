import Link from "next/link";

export default function Footer() {
	return (
		<footer className="container mx-auto my-12">
			<div className="flex justify-between items-center text-sm">
				<p>
					<span className="opacity-75">Adrian Lam (</span>
					<Link
						href="https://x.com/adriandlam_"
						className="link"
					>
						@adriandlam_
					</Link>
					<span className="opacity-75">)</span>
				</p>
				<Link
					href="https://github.com/adriandlam/adriandlamcom"
					className="link"
				>
					Source
				</Link>
			</div>
		</footer>
	);
}
