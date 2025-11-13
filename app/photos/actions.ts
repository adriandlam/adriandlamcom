"use server";

import { list, type ListBlobResult } from "@vercel/blob";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

if (!accountId || !accessKeyId || !secretAccessKey) {
	throw new Error("Missing R2 credentials");
}

const s3Client = new S3Client({
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

const command = new ListObjectsV2Command({
	Bucket: "photos",
});

export async function getPhotos() {
	try {
		const response = await s3Client.send(command);

		if (!response.Contents) {
			return [];
		}

		const photos = response.Contents.filter(
			(obj) => obj.Key && /\.(jpg|jpeg|png|gif|webp)$/i.test(obj.Key),
		)
			.sort((a, b) => {
				const aDate = a.LastModified ? new Date(a.LastModified).getTime() : 0;
				const bDate = b.LastModified ? new Date(b.LastModified).getTime() : 0;
				return bDate - aDate;
			})
			.map((obj) => ({
				name: obj.Key!,
				url: `https://photos.adriandlam.com/${obj.Key}`,
				lastModified: obj.LastModified?.toISOString(),
				size: obj.Size,
			}));
		return photos;
	} catch (error) {
		console.error("Error fetching photos:", error);
		return [];
	}
}
