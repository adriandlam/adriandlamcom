import "server-only";
import fs from "node:fs";
import path from "node:path";
import { unstable_cache } from "next/cache";
import { fetchHikesFromStrava, type Hike } from "@/lib/strava";

export interface Landmark {
	lat: number;
	lng: number;
	label: string;
	type: "landmark" | "viewpoint" | "temple" | "summit";
	date?: string;
}

interface HikeOverride {
	name?: string;
}

function getHikeOverrides(): Record<string, HikeOverride> {
	const filePath = path.join(process.cwd(), "content/exploring/hikes.json");
	try {
		const content = fs.readFileSync(filePath, "utf8");
		return JSON.parse(content) as Record<string, HikeOverride>;
	} catch {
		return {};
	}
}

function applyOverrides(hikes: Hike[]): Hike[] {
	const overrides = getHikeOverrides();
	return hikes.map((hike) => {
		const override = overrides[hike.id];
		if (!override) return hike;
		return {
			...hike,
			name: override.name ?? hike.name,
		};
	});
}

export const getHikes = unstable_cache(
	async (): Promise<Hike[]> => {
		const hikes = await fetchHikesFromStrava();
		return applyOverrides(hikes);
	},
	["exploring-hikes"],
	{
		revalidate: 86400,
		tags: ["exploring"],
	},
);

export const getLandmarks = unstable_cache(
	async (): Promise<Landmark[]> => {
		const filePath = path.join(process.cwd(), "content/exploring/points.json");
		try {
			const content = fs.readFileSync(filePath, "utf8");
			return JSON.parse(content) as Landmark[];
		} catch {
			return [];
		}
	},
	["exploring-landmarks"],
	{
		revalidate: false,
		tags: ["exploring"],
	},
);

export interface ExploringStats {
	totalDistance: number;
	totalElevation: number;
	hikeCount: number;
	landmarkCount: number;
}

export function computeStats(
	hikes: Hike[],
	landmarks: Landmark[],
): ExploringStats {
	return {
		totalDistance:
			Math.round(hikes.reduce((sum, h) => sum + h.distance, 0) * 10) / 10,
		totalElevation: hikes.reduce((sum, h) => sum + h.elevationGain, 0),
		hikeCount: hikes.length,
		landmarkCount: landmarks.length,
	};
}
