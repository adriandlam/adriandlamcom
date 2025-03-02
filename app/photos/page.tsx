import fs from "fs";
import path from "path";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Format date helper function
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

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
        A collection of photos I've taken over the years. I'm not a professional photographer, but I enjoy capturing moments.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {photoFilenames.map((filename, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded">
            <Image
              src={`/photos/${filename}`}
              alt={`Photo ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}