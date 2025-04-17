import fs from "fs";
import path from "path";
import { Camera } from "lucide-react";
import Image from "next/image";

// Function to get all photo filenames
function getPhotoFilenames(): string[] {
	const photoDirectory = path.join(process.cwd(), "public/photos");
	const filenames = fs.readdirSync(photoDirectory);
	return filenames;
}

export default function PhotosPage() {
	const photoFilenames = getPhotoFilenames();

	return (
		<main>
			<div className="relative">
				<Camera
					strokeWidth={1.75}
					className="text-muted w-14 h-14 absolute -z-10 -top-8 -left-10"
				/>
				<h1 className="text-4xl font-medium tracking-tight">Photos</h1>
				<p className="font-mono text-muted-foreground mt-2">
					A collection of photos I've taken over the years. I'm not a
					professional photographer, but I enjoy capturing moments.
				</p>
			</div>
			<p className="mt-2 font-mono">
				My photos are taken with a Panasonic Lumix G85 and a Panasonic Lumix G
				25mm F1.7. lens.
			</p>

			{/* Photo Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
				{photoFilenames.map((filename, i) => (
					<div
						key={filename}
						className="relative aspect-square w-full overflow-hidden rounded shadow-sm"
					>
						<Image
							src={`/photos/${filename}`}
							alt={`Photo ${i + 1}`}
							fill
							className="object-cover"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					</div>
				))}
			</div>
		</main>
	);
}
