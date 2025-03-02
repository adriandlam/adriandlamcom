import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import remarkGfm from "remark-gfm";

// Format date helper function
function formatDate(dateString: string) {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export default async function Page({
	params,
}: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;

	// Read the file content with gray-matter
	const filePath = path.join(process.cwd(), `content/blog/${slug}.mdx`);
	const fileContent = fs.readFileSync(filePath, "utf8");
	const { data: metadata, content } = matter(fileContent);

	// Format the date
	const formattedDate = formatDate(metadata.publishedAt);

	return (
		<div>
			<article>
				<header className="mb-6">
					<h1 className="text-3xl font-bold">{metadata.title}</h1>
					<span className="text-muted-foreground text-sm">{formattedDate}</span>
				</header>

				<div className="prose max-w-none">
					<MDXRemote
						source={content}
						options={{
							mdxOptions: {
								remarkPlugins: [remarkMath, remarkGfm],
								rehypePlugins: [rehypeKatex],
							},
						}}
					/>
				</div>
			</article>
		</div>
	);
}

export function generateStaticParams() {
	const blogDirectory = path.join(process.cwd(), "content/blog");
	const filenames = fs.readdirSync(blogDirectory);
	const slugs = filenames
		.filter((filename) => filename.endsWith(".mdx"))
		.map((filename) => filename.replace(/\.mdx$/, ""));
	return slugs.map((slug) => ({ params: { slug } }));
}

export const dynamicParams = false;
