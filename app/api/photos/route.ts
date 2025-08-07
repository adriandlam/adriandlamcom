import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

export async function GET() {
  try {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

    if (!accountId || !accessKeyId || !secretAccessKey) {
      return NextResponse.json(
        { error: "Missing R2 credentials" },
        { status: 500 }
      );
    }

    const s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const command = new ListObjectsV2Command({
      Bucket: "photos",
    });

    const response = await s3Client.send(command);

    if (!response.Contents) {
      return NextResponse.json({ photos: [] });
    }

    const photos = response.Contents.filter(
      (obj) => obj.Key && /\.(jpg|jpeg|png|gif|webp)$/i.test(obj.Key)
    )
      .sort((a, b) => {
        const aDate = a.LastModified ? new Date(a.LastModified).getTime() : 0;
        const bDate = b.LastModified ? new Date(b.LastModified).getTime() : 0;
        return bDate - aDate;
      })
      .map((obj) => ({
        name: obj.Key!,
        // Grid thumbnail - higher quality for sharp previews
        thumbnail: `https://photos.adriandlam.com/cdn-cgi/image/width=800,quality=90,format=auto/${obj.Key}`,
        // Full view (for carousel) - high quality
        fullSize: `https://photos.adriandlam.com/cdn-cgi/image/width=1600,quality=95,format=auto/${obj.Key}`,
        // Original for download
        original: `https://photos.adriandlam.com/${obj.Key}`,
        lastModified: obj.LastModified?.toISOString(),
        size: obj.Size || 0,
      }));

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}
