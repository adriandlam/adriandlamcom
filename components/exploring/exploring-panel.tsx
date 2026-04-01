"use client";

import { useRef, useState } from "react";
import type { Hike } from "@/lib/strava";
import type { Landmark } from "@/lib/exploring";
import { cn } from "@/lib/utils";

interface ExploringPanelProps {
	hikes: Hike[];
	landmarks: Landmark[];
	onHikeHover: (id: string | null) => void;
	highlightedLandmark: string | null;
}

function formatDate(dateString: string): string {
	return new Date(dateString)
		.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		})
		.toLowerCase();
}

export function ExploringPanel({
	hikes,
	landmarks,
	onHikeHover,
	highlightedLandmark,
}: ExploringPanelProps) {
	const landmarkRefs = useRef<Map<string, HTMLDivElement>>(new Map());

	const scrollToLandmark = (label: string) => {
		const el = landmarkRefs.current.get(label);
		if (el) {
			el.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	};

	// Scroll to landmark when clicked on map
	const prevHighlighted = useRef<string | null>(null);
	if (highlightedLandmark && highlightedLandmark !== prevHighlighted.current) {
		prevHighlighted.current = highlightedLandmark;
		setTimeout(() => scrollToLandmark(highlightedLandmark), 100);
	}

	return (
		<div
			className={cn(
				"absolute bottom-0 right-0 z-10 w-80 max-h-[70vh]",
				"bg-background/90 backdrop-blur-md",
				"border-t border-l border-border rounded-tl-lg",
				"flex flex-col",
				"max-md:left-0 max-md:w-full max-md:rounded-tl-lg max-md:rounded-tr-lg max-md:border-r-0",
			)}
		>
			{/* Panel header */}
			<div className="px-4 py-3 border-b border-border">
				<span className="font-mono text-xs text-vesper-dim uppercase tracking-wide">
					hikes
				</span>
			</div>

			{/* Scrollable content */}
			<div className="overflow-y-auto">
				{/* Hikes */}
				{hikes.map((hike) => (
					<div
						key={hike.id}
						onMouseEnter={() => onHikeHover(hike.id)}
						onMouseLeave={() => onHikeHover(null)}
						className="px-4 py-2.5 border-b border-border/50 cursor-pointer hover:bg-muted/50 transition-colors"
					>
						<div className="flex items-baseline justify-between">
							<span className="text-sm text-vesper-text">{hike.name}</span>
							<span className="font-mono text-xs text-vesper-orange">
								{hike.distance} km
							</span>
						</div>
						<div className="font-mono text-xs text-vesper-dim mt-0.5">
							{formatDate(hike.date)} · {hike.elevationGain}m elev ·{" "}
							{hike.movingTime}
						</div>
					</div>
				))}

				{/* Landmarks section */}
				{landmarks.length > 0 && (
					<>
						<div className="px-4 py-2.5 border-t border-border">
							<span className="font-mono text-xs text-vesper-dim uppercase tracking-wide">
								landmarks
							</span>
						</div>
						{landmarks.map((lm) => (
							<div
								key={lm.label}
								ref={(el) => {
									if (el) landmarkRefs.current.set(lm.label, el);
								}}
								className={cn(
									"px-4 py-2.5 border-b border-border/50 cursor-pointer hover:bg-muted/50 transition-colors",
									highlightedLandmark === lm.label && "bg-muted/50",
								)}
							>
								<div className="flex items-center gap-2">
									<span className="size-1.5 rounded-full bg-vesper-aqua shrink-0" />
									<span className="text-sm text-vesper-text">{lm.label}</span>
									<span className="ml-auto font-mono text-xs text-vesper-dim">
										{lm.type}
									</span>
								</div>
							</div>
						))}
					</>
				)}
			</div>
		</div>
	);
}
