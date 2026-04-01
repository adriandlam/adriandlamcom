import "server-only";
import { env } from "@/lib/env";

interface StravaTokenResponse {
	access_token: string;
	refresh_token: string;
	expires_at: number;
}

interface StravaActivity {
	id: number;
	name: string;
	type: string;
	sport_type: string;
	start_date: string;
	distance: number;
	total_elevation_gain: number;
	moving_time: number;
	map: {
		summary_polyline: string;
	};
	start_latlng: [number, number] | null;
}

export interface Hike {
	id: string;
	name: string;
	date: string;
	distance: number;
	elevationGain: number;
	movingTime: string;
	polyline: string;
	startLatLng: [number, number] | null;
}

async function getAccessToken(): Promise<string | null> {
	const clientId = env.STRAVA_CLIENT_ID;
	const clientSecret = env.STRAVA_CLIENT_SECRET;
	const refreshToken = env.STRAVA_REFRESH_TOKEN;

	if (!clientId || !clientSecret || !refreshToken) {
		return null;
	}

	const response = await fetch("https://www.strava.com/oauth/token", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			client_id: clientId,
			client_secret: clientSecret,
			refresh_token: refreshToken,
			grant_type: "refresh_token",
		}),
	});

	if (!response.ok) {
		console.error("Strava token refresh failed:", response.status);
		return null;
	}

	const data = (await response.json()) as StravaTokenResponse;
	return data.access_token;
}

function formatMovingTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	if (hours === 0) return `${minutes}m`;
	return `${hours}h ${minutes}m`;
}

export async function fetchHikesFromStrava(): Promise<Hike[]> {
	const accessToken = await getAccessToken();
	if (!accessToken) return [];

	const hikes: Hike[] = [];
	let page = 1;
	const perPage = 100;

	while (true) {
		const url = new URL("https://www.strava.com/api/v3/athlete/activities");
		url.searchParams.set("per_page", String(perPage));
		url.searchParams.set("page", String(page));

		const response = await fetch(url.toString(), {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		if (!response.ok) {
			console.error("Strava activities fetch failed:", response.status);
			break;
		}

		const activities = (await response.json()) as StravaActivity[];
		if (activities.length === 0) break;

		for (const activity of activities) {
			if (activity.type !== "Hike") continue;
			if (!activity.map.summary_polyline) continue;

			hikes.push({
				id: String(activity.id),
				name: activity.name,
				date: activity.start_date,
				distance: Math.round((activity.distance / 1000) * 10) / 10,
				elevationGain: Math.round(activity.total_elevation_gain),
				movingTime: formatMovingTime(activity.moving_time),
				polyline: activity.map.summary_polyline,
				startLatLng: activity.start_latlng,
			});
		}

		if (activities.length < perPage) break;
		page++;
	}

	return hikes.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);
}
