import { ExternalLinkIcon } from "./external-link-icon";
import Link from "next/link";
import RESUME from "@/data/resume";

export default function Footer() {
	return (
		<footer className="container mx-auto my-12">
			<div className="flex justify-between items-center text-sm">
				<p>
					<span className="opacity-75">Adrian Lam (</span>
					<Link
						href={`https://x.com/${RESUME.socials.twitter}`}
						className="link inline-flex gap-0.5"
					>
						@{RESUME.socials.twitter}
						<ExternalLinkIcon className="mt-0.5 size-3" />
					</Link>
					<span className="opacity-75">)</span>
				</p>
				<div className="flex items-center gap-2">
					<Link href="/feed" className="link font-mono">
						RSS
					</Link>
					<Link
						href={`https://github.com/${RESUME.socials.github}/adriandlamcom`}
						className="link inline-flex gap-0.5"
					>
						Source
						<ExternalLinkIcon className="mt-0.5 size-3" />
					</Link>
				</div>
			</div>
		</footer>
	);
}
