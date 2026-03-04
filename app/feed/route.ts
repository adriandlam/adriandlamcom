import { getBlogPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";

export async function GET() {
	const posts = await getBlogPosts();

	const items = posts
		.map(
			(post) => `
		<item>
			<title>${escapeXml(post.title)}</title>
			<link>${SITE_URL}/blog/${post.slug}</link>
			<guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
			<description>${escapeXml(post.summary)}</description>
			<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
		</item>`,
		)
		.join("");

	const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Adrian Lam's Blog</title>
		<link>${SITE_URL}</link>
		<description>Articles and thoughts on software development.</description>
		<language>en-us</language>
		<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
		<atom:link href="${SITE_URL}/feed" rel="self" type="application/rss+xml" />${items}
	</channel>
</rss>`;

	return new Response(feed.trim(), {
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
			"Cache-Control": "s-maxage=3600, stale-while-revalidate",
		},
	});
}

function escapeXml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}
