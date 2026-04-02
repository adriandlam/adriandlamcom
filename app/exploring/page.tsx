import type { Metadata } from "next";
import { ExploringClient } from "@/components/exploring/exploring-client";
import { ExploringStatsOverlay } from "@/components/exploring/exploring-stats";
import { computeStats, getHikes, getLandmarks } from "@/lib/exploring";

export const revalidate = 86400;

export const metadata: Metadata = {
	title: "Exploring",
	description: "Trails, summits, and places I've been.",
};

export default async function ExploringPage() {
	const [hikes, landmarks] = await Promise.all([getHikes(), getLandmarks()]);
	const stats = computeStats(hikes, landmarks);

	return (
		<div className="relative h-full w-full">
			{/* Title overlay */}
			<div className="absolute top-6 left-6 z-10 max-md:top-4 max-md:left-4">
				<h1 className="text-3xl tracking-tight font-normal">Exploring</h1>
				<p className="text-sm text-muted-foreground mt-1">
					Trails, summits, and places i've been
				</p>
			</div>

			{/* Stats overlay */}
			<ExploringStatsOverlay stats={stats} />

			{/* Legend */}
			<div className="absolute bottom-4 left-4 z-10 flex gap-3 font-mono text-xs text-muted-foreground max-md:left-4">
				<span className="flex items-center gap-1">
					<span className="text-vesper-aqua text-sm leading-none">×</span>
					trails
				</span>
				<span className="flex items-center gap-1.5">
					<span className="inline-block size-1.5 rounded-full bg-vesper-red" />
					landmarks
				</span>
			</div>

			{/* Map + Panel (client) */}
			<ExploringClient hikes={hikes} landmarks={landmarks} />
		</div>
	);
}
