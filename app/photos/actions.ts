import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { unstable_cache } from "next/cache";
import sharp from "sharp";
import { env } from "@/lib/env";

function getS3Client(): S3Client | null {
	const accountId = env.CLOUDFLARE_ACCOUNT_ID;
	const accessKeyId = env.CLOUDFLARE_R2_ACCESS_KEY_ID;
	const secretAccessKey = env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

	if (!accountId || !accessKeyId || !secretAccessKey) {
		return null;
	}

	return new S3Client({
		region: "auto",
		endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId,
			secretAccessKey,
		},
		requestHandler: {
			requestTimeout: 5000, // 5 second timeout
		},
	});
}

async function generateBlurDataURL(url: string): Promise<string | undefined> {
	try {
		const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
		if (!response.ok) return undefined;

		const buffer = Buffer.from(await response.arrayBuffer());
		const resized = await sharp(buffer)
			.resize(16, 16, { fit: "inside" })
			.blur()
			.webp({ quality: 20 })
			.toBuffer();

		return `data:image/webp;base64,${resized.toString("base64")}`;
	} catch {
		return undefined;
	}
}

export const getPhotos = unstable_cache(
	async () => {
		try {
			const s3Client = getS3Client();
			if (!s3Client) {
				return [];
			}

			const command = new ListObjectsV2Command({
				Bucket: "photos",
			});
			const response = await s3Client.send(command);

			if (!response.Contents) {
				return [];
			}

			const photoEntries = response.Contents.filter(
				(obj) => obj.Key && /\.(jpg|jpeg|png|gif|webp)$/i.test(obj.Key),
			).sort((a, b) => {
				const aDate = a.LastModified ? new Date(a.LastModified).getTime() : 0;
				const bDate = b.LastModified ? new Date(b.LastModified).getTime() : 0;
				return bDate - aDate;
			});

			// Generate blur placeholders in parallel
			const photos = await Promise.all(
				photoEntries.map(async (obj) => {
					const url = `https://photos.adriandlam.com/${obj.Key}`;
					const blurDataURL = await generateBlurDataURL(url);
					return {
						name: obj.Key,
						url,
						lastModified: obj.LastModified?.toISOString(),
						size: obj.Size,
						blurDataURL,
					};
				}),
			);

			return photos;
		} catch (error) {
			console.error("Error fetching photos:", error);
			return [];
		}
	},
	["photos-list"],
	{
		revalidate: 604800, // 1 week in seconds
		tags: ["photos"],
	},
);
