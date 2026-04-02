import "server-only";
import fs from "node:fs";
import path from "node:path";
import { unstable_cache } from "next/cache";
import { env } from "@/lib/env";
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

async function reverseGeocode(
	lat: number,
	lng: number,
): Promise<string | null> {
	const token = env.NEXT_PUBLIC_MAPBOX_TOKEN;
	if (!token) return null;

	const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&types=place,locality,neighborhood,district,region&limit=1&access_token=${token}`;

	try {
		const res = await fetch(url);
		if (!res.ok) {
			console.error(`[geocode] failed for ${lat},${lng}:`, res.status);
			return null;
		}
		const data = await res.json();
		const feature = data.features?.[0];
		if (!feature) {
			console.warn(`[geocode] no results for ${lat},${lng}`);
			return null;
		}

		const props = feature.properties;
		const featureType = props?.feature_type;
		const name = props?.name;
		const region = props?.context?.region?.name;
		const country = props?.context?.country?.name;

		let result: string | null = null;
		if (name && country) {
			// Don't append region if the result itself IS the region
			if (featureType === "region") {
				result = `${name}, ${country}`;
			} else if (region && region !== name) {
				result = `${name}, ${region}`;
			} else {
				result = `${name}, ${country}`;
			}
		} else {
			result = name || null;
		}
		console.log(`[geocode] ${lat},${lng} → ${result}`);
		return result;
	} catch (e) {
		console.error(`[geocode] error for ${lat},${lng}:`, e);
		return null;
	}
}

async function enrichWithPlaceNames(hikes: Hike[]): Promise<Hike[]> {
	return Promise.all(
		hikes.map(async (hike) => {
			if (!hike.startLatLng) return hike;

			const placeName = await reverseGeocode(
				hike.startLatLng[0],
				hike.startLatLng[1],
			);
			if (!placeName) return hike;

			return { ...hike, name: placeName };
		}),
	);
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
		const enriched = await enrichWithPlaceNames(hikes);
		return applyOverrides(enriched);
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
