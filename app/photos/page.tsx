import Image from "next/image";
import { getPhotos } from "./actions";

export default async function PhotosPage() {
	const photos = await getPhotos();

	return (
		<main className="container mx-auto">
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

			{/* Photo Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
				{photos.map((photo, i) => (
					<Image
						key={photo.url}
						src={photo.url}
						alt={`Photo ${i + 1}`}
						width={1200}
						height={1600}
						className="object-cover w-full h-full"
						priority={i < 2}
						sizes="(max-width: 640px) 100vw, 50vw"
					/>
				))}
			</div>
		</main>
	);
}
