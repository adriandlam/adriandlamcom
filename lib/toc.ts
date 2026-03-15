import GithubSlugger from "github-slugger";

export type TocItem = {
	id: string;
	text: string;
	level: 2 | 3;
};

/**
 * Extract h2 and h3 headings from raw MDX content.
 * Uses github-slugger to generate IDs that match rehype-slug output exactly.
 */
export function extractHeadings(content: string): TocItem[] {
	const slugger = new GithubSlugger();
	const headings: TocItem[] = [];
	const lines = content.split("\n");
	let inCodeBlock = false;

	for (const line of lines) {
		// Track fenced code blocks to skip headings inside them
		if (line.trimStart().startsWith("```")) {
			inCodeBlock = !inCodeBlock;
			continue;
		}
		if (inCodeBlock) continue;

		const match = line.match(/^(#{2,3})\s+(.+)$/);
		if (!match) continue;

		const level = match[1].length as 2 | 3;
		// Strip markdown formatting: bold, italic, code, links
		const text = match[2]
			.replace(/\*\*(.+?)\*\*/g, "$1") // bold
			.replace(/\*(.+?)\*/g, "$1") // italic
			.replace(/`(.+?)`/g, "$1") // inline code
			.replace(/\[(.+?)\]\(.+?\)/g, "$1") // links
			.trim();

		headings.push({
			id: slugger.slug(text),
			text,
			level,
		});
	}

	return headings;
}
