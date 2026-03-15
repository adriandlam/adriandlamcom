import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PhotoGrid } from "@/components/photo-grid";
import { getPhotos } from "@/lib/photos";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Photos",
	description: "Shot on a Lumix G85 with a 25mm F1.7 and 12-60mm.",
};

function PhotoGridSkeleton() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
			{Array.from({ length: 4 }).map((_, i) => (
				<Skeleton
					// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton items
					key={i}
					className="aspect-3/4 w-full rounded-none"
				/>
			))}
		</div>
	);
}

async function PhotoGridServer() {
	const photos = await getPhotos();
	return <PhotoGrid photos={photos} />;
}

export default function PhotosPage() {
	return (
		<main>
			<div>
				<h1>Photos</h1>
				<p className="text-muted-foreground mt-2">
					A collection of photos I've taken over the years. I'm not a
					professional photographer, but I enjoy capturing moments.
				</p>
				<p className="mt-4">
					My photos are taken with a Panasonic Lumix G85 with a Panasonic Lumix
					G 25mm F1.7. lens but I've also recently upgraded to a Panasonic Lumix
					G Vario 12-60mm f/3.5-5.6.
				</p>
			</div>

			<Suspense fallback={<PhotoGridSkeleton />}>
				<PhotoGridServer />
			</Suspense>
		</main>
	);
}
