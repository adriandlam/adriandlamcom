import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/blog";
import RESUME from "@/data/resume";

const SITE_URL = "https://adriandlam.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const posts = await getBlogPosts();

	const blogEntries = posts.map((post) => ({
		url: `${SITE_URL}/blog/${post.slug}`,
		lastModified: new Date(post.publishedAt),
		changeFrequency: "monthly" as const,
		priority: 0.7,
	}));

	const projectEntries = RESUME.projects.map((project) => ({
		url: `${SITE_URL}/projects/${project.slug}`,
		changeFrequency: "monthly" as const,
		priority: 0.6,
	}));

	return [
		{
			url: SITE_URL,
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${SITE_URL}/blog`,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${SITE_URL}/projects`,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${SITE_URL}/photos`,
			changeFrequency: "monthly",
			priority: 0.5,
		},
		...blogEntries,
		...projectEntries,
	];
}
