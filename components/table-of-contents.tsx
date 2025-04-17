import Link from "next/link";

interface TOCItem {
	text: string;
	level: number;
	slug: string;
}

export default function TableOfContents({ headings }: { headings: TOCItem[] }) {
	return (
		<nav
			className="p-4 backdrop-blur rounded-lg border bg-background/80 shadow w-64"
			aria-labelledby="toc-heading"
		>
			<h2
				id="toc-heading"
				className="!text-lg font-medium mb-4 pb-2 border-b !mt-2"
			>
				Table of Contents
			</h2>
			<ul className="list-none p-0 mb-0">
				{headings.map((heading) => (
					<li
						key={heading.slug}
						className={`!my-1 transition-all duration-200 ${
							heading.level > 2 ? "text-sm pl-4" : "pl-0"
						}`}
					>
						<Link
							href={`#${heading.slug}`}
							className={`
                block rounded px-3 py-1 !no-underline
                !text-muted-foreground !hover:text-foreground
                hover:bg-accent/50 transition-colors
                !hover:border-primary !font-normal
              `}
						>
							{heading.text}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
