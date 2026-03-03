import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unstable_cache } from "next/cache";
import { cache } from "react";

export type Project = {
	slug: string;
	name: string;
	description: string;
	shortDescription?: string;
	url?: string;
	featured?: boolean;
	inProgress?: boolean;
	year: number;
};

export type ProjectWithContent = {
	metadata: {
		name: string;
		description: string;
		shortDescription?: string;
		url?: string;
		featured?: boolean;
		inProgress?: boolean;
		year: number;
		draft?: boolean;
	};
	content: string;
};

const PROJECTS_DIR = path.join(process.cwd(), "content/projects");

// Get all projects (listing page + homepage)
const getProjectsUncached = async (): Promise<Project[]> => {
	const filenames = fs.readdirSync(PROJECTS_DIR);

	const projects = filenames
		.filter((filename) => filename.endsWith(".mdx"))
		.map((filename) => {
			const filePath = path.join(PROJECTS_DIR, filename);
			const fileContent = fs.readFileSync(filePath, "utf8");
			const { data } = matter(fileContent);
			if (data.draft) return undefined;
			return {
				slug: filename.replace(/\.mdx$/, ""),
				name: data.name,
				description: data.description,
				shortDescription: data.shortDescription,
				url: data.url,
				featured: data.featured,
				inProgress: data.inProgress,
				year: data.year,
			};
		})
		.filter(Boolean) as Project[];

	return projects.sort((a, b) => b.year - a.year);
};

export const getProjects = unstable_cache(getProjectsUncached, ["projects"], {
	revalidate: false,
	tags: ["projects"],
});

// Lightweight function for navbar
export type NavProject = {
	slug: string;
	name: string;
};

const getProjectsForNavUncached = async (): Promise<NavProject[]> => {
	const filenames = fs.readdirSync(PROJECTS_DIR);

	const projects = filenames
		.filter((filename) => filename.endsWith(".mdx"))
		.map((filename) => {
			const filePath = path.join(PROJECTS_DIR, filename);
			const fileContent = fs.readFileSync(filePath, "utf8");
			const { data } = matter(fileContent);
			if (data.draft) return undefined;
			return {
				slug: filename.replace(/\.mdx$/, ""),
				name: data.name as string,
			};
		})
		.filter(Boolean) as NavProject[];

	return projects.sort((a, b) => a.name.localeCompare(b.name));
};

export const getProjectsForNav = unstable_cache(
	getProjectsForNavUncached,
	["projects-for-nav"],
	{
		revalidate: false,
		tags: ["projects"],
	},
);

// Get a single project with metadata and MDX content
const getProjectCached = unstable_cache(
	async (slug: string): Promise<ProjectWithContent | null> => {
		const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);

		try {
			const fileContent = fs.readFileSync(filePath, "utf8");
			const { data: metadata, content } = matter(fileContent);
			if (metadata.draft) return null;
			return {
				metadata,
				content,
			} as ProjectWithContent;
		} catch {
			return null;
		}
	},
	["project"],
	{
		revalidate: false,
		tags: ["projects"],
	},
);

export const getProject = cache((slug: string) => getProjectCached(slug));
