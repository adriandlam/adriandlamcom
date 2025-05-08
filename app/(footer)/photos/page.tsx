"use client";

import { Camera } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function PhotosPage() {
	const [loading, setLoading] = useState(true);
	const [photoUrls, setPhotoUrls] = useState<string[]>([]);

	useEffect(() => {
		async function fetchPhotos() {
			const { data, error } = await supabase.storage.from("photos").list();
			if (data) {
				const sortedData = data
					.sort(
						(a, b) =>
							new Date(a.created_at).getTime() -
							new Date(b.created_at).getTime(),
					)
					.reverse();
				const photos = sortedData.map((photo) => photo.name);
				const urls = photos.map(
					(photo) =>
						supabase.storage.from("photos").getPublicUrl(photo).data.publicUrl,
				);
				setPhotoUrls(urls);
				setLoading(false);
			}
		}
		fetchPhotos();
	}, []);

	return (
		<main>
			<div className="relative mb-10">
				<Camera
					strokeWidth={1.75}
					className="text-muted w-12 h-12 absolute opacity-30 -top-6 -left-6 -z-10"
				/>
				<h1 className="text-4xl font-medium tracking-tight">Photos</h1>
				<p className="font-mono text-muted-foreground mt-2">
					A collection of photos I've taken over the years. I'm not a
					professional photographer, but I enjoy capturing moments.
				</p>
			</div>
			<p className="text-sm">
				My photos are taken with a Panasonic Lumix G85 with a Panasonic Lumix G
				25mm F1.7. lens but I've also recently upgraded to a Panasonic Lumix G
				Vario 12-60mm f/3.5-5.6.
			</p>

			{/* Photo Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-14">
				{loading
					? Array.from({ length: 10 }).map((_, i) => (
							<Skeleton
								key={i}
								className="aspect-square rounded w-full h-full bg-muted animate-pulse"
							/>
						))
					: photoUrls.map((url, i) => (
							<Link
								href={url}
								key={url}
								target="_blank"
								className="transition-all duration-300 hover:scale-105 hover:brightness-105 hover:ring hover:ring-accent/30 relative aspect-square w-full overflow-hidden rounded shadow-md"
							>
								<Image
									src={url}
									alt={`Photo ${i + 1}`}
									fill
									className="object-cover"
									sizes="(max-width: 768px) 100vw, 50vw"
								/>
							</Link>
						))}
			</div>
		</main>
	);
}
