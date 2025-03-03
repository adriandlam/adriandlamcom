import fs from "fs";
import path from "path";

// Function to get all photo filenames
function getPhotoFilenames(): string[] {
	const photoDirectory = path.join(process.cwd(), "public/photos");
	const filenames = fs.readdirSync(photoDirectory);
	return filenames;
}

export default function PhotosPage() {
	const photoFilenames = getPhotoFilenames();

	return (
		<div>
			<h1 className="text-3xl font-bold">Photos</h1>
			<p className="mt-2 font-mono">
				A collection of photos I've taken over the years. I'm not a professional
				photographer, but I enjoy capturing moments.
			</p>
			<p className="mt-2 font-mono">
				My photos are taken with a Panasonic Lumix G85 and a Panasonic Lumix G
				25mm F1.7. lens.
			</p>

			{/* Photo Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
				{photoFilenames.map((filename, i) => (
					<div key={filename} className="relative w-full rounded">
						<img
							src={`/photos/${filename}`}
							// biome-ignore lint/a11y/noRedundantAlt: <explanation>
							alt={`Photo ${i + 1}`}
							className="object-cover"
						/>
					</div>
				))}
			</div>
		</div>
	);
}
