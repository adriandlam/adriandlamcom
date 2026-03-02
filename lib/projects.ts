import { unstable_cache } from "next/cache";
import RESUME from "@/data/resume";

export type NavProject = {
	slug: string;
	name: string;
};

const getProjectsUncached = (): NavProject[] => {
	return RESUME.projects.map((project) => ({
		slug: project.slug,
		name: project.name,
	}));
};

export const getProjectsForNav = unstable_cache(
	async () => getProjectsUncached(),
	["projects-for-nav"],
	{
		revalidate: false,
		tags: ["projects"],
	},
);
