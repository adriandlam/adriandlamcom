import "server-only";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { unstable_cache } from "next/cache";
import { env } from "@/lib/env";

interface ManifestEntry {
	original: string;
	lastModified: string | null;
}

type Manifest = Record<string, ManifestEntry>;

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
			requestTimeout: 5000,
		},
	});
}

/** Fetch a text object from R2 */
async function fetchTextObject(
	s3Client: S3Client,
	key: string,
): Promise<string | undefined> {
	try {
		const response = await s3Client.send(
			new GetObjectCommand({
				Bucket: "photos-optimized",
				Key: key,
			}),
		);
		if (!response.Body) return undefined;
		return await response.Body.transformToString();
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

			// Fetch the manifest
			const manifestText = await fetchTextObject(s3Client, "_manifest.json");
			if (!manifestText) {
				return [];
			}

			const manifest = JSON.parse(manifestText) as Manifest;

			// Sort by lastModified (newest first)
			const entries = Object.entries(manifest).sort(([, a], [, b]) => {
				const aDate = a.lastModified ? new Date(a.lastModified).getTime() : 0;
				const bDate = b.lastModified ? new Date(b.lastModified).getTime() : 0;
				return bDate - aDate;
			});

			// Fetch blur placeholders in parallel
			const photos = await Promise.all(
				entries.map(async ([hash], index) => {
					const url = `https://photos.adriandlam.com/${hash}.webp`;
					const blurText = await fetchTextObject(s3Client, `${hash}.blur.txt`);
					const blurDataURL = blurText?.startsWith("data:")
						? blurText
						: undefined;

					return {
						name: `Photo ${index + 1}`,
						url,
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
