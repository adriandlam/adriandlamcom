import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unstable_cache } from "next/cache";

export type BlogPost = {
	title: string;
	publishedAt: string;
	summary: string;
	slug: string;
};

// Cache blog posts for 1 hour in development, forever in production until revalidated
const getBlogPostsUncached = async (): Promise<BlogPost[]> => {
	const blogDirectory = path.join(process.cwd(), "content/blog");
	const filenames = fs.readdirSync(blogDirectory);

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
		.filter(Boolean) as BlogPost[];

	return posts.sort(
		(a, b) =>
			new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
	);
};

// Cached version for production - also export the type for convenience
export const getBlogPosts = unstable_cache(
	getBlogPostsUncached,
	["blog-posts"],
	{
		revalidate: 3600, // 1 hour
		tags: ["blog"],
	},
);

// Get a single blog post with metadata and content
export type BlogPostWithContent = {
	metadata: {
		title: string;
		publishedAt: string;
		summary?: string;
		excerpt?: string;
		tags?: string[];
		author?: string;
		coverImage?: string;
		images?: string[];
		private?: boolean;
	};
	content: string;
};

export const getBlogPost = unstable_cache(
	async (slug: string): Promise<BlogPostWithContent | null> => {
		const filePath = path.join(process.cwd(), `content/blog/${slug}.mdx`);

		try {
			const fileContent = fs.readFileSync(filePath, "utf8");
			const { data: metadata, content } = matter(fileContent);
			if (metadata.private) return null;
			return { metadata, content } as BlogPostWithContent;
		} catch {
			return null;
		}
	},
	["blog-post"],
	{
		revalidate: 3600,
		tags: ["blog"],
	},
);
