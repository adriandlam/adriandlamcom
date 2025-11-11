"use server";

import { list, type ListBlobResult } from "@vercel/blob";

export async function getPhotos() {
	const photos: ListBlobResult = await list();
	const sortedPhotos = photos.blobs
		.sort((a, b) => {
			return (
				new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
			);
		})
		.reverse();
	return sortedPhotos;
}
