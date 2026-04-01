"use client";

import { useCallback, useState } from "react";
import type { Hike } from "@/lib/strava";
import type { Landmark } from "@/lib/exploring";
import { ExploringMap } from "./exploring-map";
import { ExploringPanel } from "./exploring-panel";

interface ExploringClientProps {
	hikes: Hike[];
	landmarks: Landmark[];
}

export function ExploringClient({ hikes, landmarks }: ExploringClientProps) {
	const [highlightedHikeId, setHighlightedHikeId] = useState<string | null>(
		null,
	);
	const [highlightedLandmark, setHighlightedLandmark] = useState<string | null>(
		null,
	);

	const handleLandmarkClick = useCallback((label: string) => {
		setHighlightedLandmark(label);
		setTimeout(() => setHighlightedLandmark(null), 3000);
	}, []);

	return (
		<>
			<ExploringMap
				hikes={hikes}
				landmarks={landmarks}
				highlightedHikeId={highlightedHikeId}
				onLandmarkClick={handleLandmarkClick}
			/>
			<ExploringPanel
				hikes={hikes}
				landmarks={landmarks}
				onHikeHover={setHighlightedHikeId}
				highlightedLandmark={highlightedLandmark}
			/>
		</>
	);
}
