"use client";

import type { Hike } from "@/lib/strava";
import type { Landmark } from "@/lib/exploring";
import { ExploringMap } from "./exploring-map";

interface ExploringClientProps {
	hikes: Hike[];
	landmarks: Landmark[];
}

export function ExploringClient({ hikes, landmarks }: ExploringClientProps) {
	return <ExploringMap hikes={hikes} landmarks={landmarks} />;
}
