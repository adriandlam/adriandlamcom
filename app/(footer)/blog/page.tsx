import fs from "fs";
import path from "path";
import { cn } from "@/lib/utils";
import matter from "gray-matter";
import { NotebookPen } from "lucide-react";
import Link from "next/link";

// Format date helper function
function formatDate(dateString: string) {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

// Type for blog post metadata
type PostMetadata = {
	title: string;
	publishedAt: string;
	summary: string;
	slug: string;
};

// Function to get all blog posts
function getBlogPosts(): PostMetadata[] {
	// Get all files from the blog directory
	const blogDirectory = path.join(process.cwd(), "content/blog");
	const filenames = fs.readdirSync(blogDirectory);

	// Get the frontmatter from each file
	const posts = filenames
		.filter((filename) => filename.endsWith(".mdx"))
		.map((filename) => {
			const filePath = path.join(blogDirectory, filename);
			const fileContent = fs.readFileSync(filePath, "utf8");
			const { data } = matter(fileContent);
			if (data.private) return undefined;
			return {
				title: data.title,
				publishedAt: data.publishedAt,
				summary: data.summary,
				slug: filename.replace(/\.mdx$/, ""),
			};
		})
		.filter(Boolean) as PostMetadata[];

	return posts.sort(
		(a, b) =>
			new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
	);
}

export default function BlogPage() {
	const posts = getBlogPosts();

	return (
		<div>
			<div className="relative">
				<NotebookPen
					strokeWidth={1.75}
					className="text-muted w-14 h-14 absolute -z-10 -top-8 -left-10"
				/>
				<h1 className="text-4xl font-medium tracking-tight">Blog</h1>
				<p className="font-mono text-muted-foreground mt-2">
					A collection of articles and thoughts on software development and who
					I am as a person.
				</p>
			</div>
			<div className="space-y-10 mt-2">
				{posts.map((post, i) => (
					<article
						key={post.slug}
						className={cn("border-b pb-4", {
							"border-0 pb-0": i === posts.length - 1,
							"mt-10": i === 0,
						})}
					>
						<Link
							href={`/blog/${post.slug}`}
							className="block group transition-all hover:opacity-75"
						>
							<h2 className="text-2xl group-hover:text-cyan-600 transition-colors my-0">
								{post.title}
							</h2>
							<time className="text-sm text-muted-foreground block mt-2">
								{formatDate(post.publishedAt)}
							</time>

							<p className="mt-4 text-sm line-clamp-3 text-muted-foreground">
								{post.summary}
							</p>
						</Link>
					</article>
				))}
			</div>
		</div>
	);
}
