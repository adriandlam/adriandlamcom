import { ExternalLinkIcon } from "./external-link-icon";
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
						<ExternalLinkIcon className="mt-0.5 size-3" />
					</Link>
					<span className="opacity-75">)</span>
				</p>
				<Link
					href="https://github.com/adriandlam/adriandlamcom"
					className="link inline-flex gap-0.5"
				>
					Source
					<ExternalLinkIcon className="mt-0.5 size-3" />
				</Link>
			</div>
		</footer>
	);
}
