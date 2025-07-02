"use client";

import { useHotkeys, useHotkeysContext } from "react-hotkeys-hook";
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function PhotosPage() {
  const [loading, setLoading] = useState(true);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useHotkeys("esc", () => setCarouselOpen(false), { enabled: carouselOpen });
  useHotkeys(
    "left",
    () => {
      if (carouselOpen) {
        setCarouselIndex((prev) =>
          prev > 0 ? prev - 1 : photoUrls.length - 1
        );
      }
    },
    [carouselOpen, photoUrls.length]
  );
  useHotkeys(
    "right",
    () => {
      if (carouselOpen) {
        setCarouselIndex((prev) =>
          prev < photoUrls.length - 1 ? prev + 1 : 0
        );
      }
    },
    [carouselOpen, photoUrls.length]
  );

  // Disable scroll when carousel is open
  useEffect(() => {
    if (carouselOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [carouselOpen]);

  useEffect(() => {
    async function fetchPhotos() {
      const { data, error } = await supabase.storage.from("photos").list();
      if (data) {
        const sortedData = data
          .sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          )
          .reverse();
        const photos = sortedData.map((photo) => photo.name);
        const urls = photos.map(
          (photo) =>
            supabase.storage.from("photos").getPublicUrl(photo).data.publicUrl
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
        <p className=" text-muted-foreground mt-2">
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
              <span
                key={url}
                onClick={() => {
                  setCarouselOpen(true);
                  setCarouselIndex(i);
                }}
                className="hover:cursor-pointer transition-all duration-300 hover:scale-105 hover:brightness-105 relative aspect-square w-full overflow-hidden rounded shadow-md"
              >
                <Image
                  src={url}
                  alt={`Photo ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </span>
            ))}
      </div>
      {carouselOpen && (
        <div className="fixed inset-0 z-50">
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => setCarouselOpen(false)}
          />

          {/* Close button */}
          <Button
            onClick={() => setCarouselOpen(false)}
            variant="secondary"
            className="fixed top-4 right-4 z-[60] p-2 rounded-full h-6 flex justify-between gap-1 border"
            aria-label="Close carousel"
          >
            <X />
            Close
          </Button>

          {/* Previous button */}
          <button
            onClick={() =>
              setCarouselIndex((prev) =>
                prev > 0 ? prev - 1 : photoUrls.length - 1
              )
            }
            className="fixed left-4 top-1/2 -translate-y-1/2 z-[60] cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next button */}
          <button
            onClick={() =>
              setCarouselIndex((prev) =>
                prev < photoUrls.length - 1 ? prev + 1 : 0
              )
            }
            className="fixed right-4 top-1/2 -translate-y-1/2 z-[60] cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight size={24} />
          </button>

          {/* Image container */}
          <div className="flex items-center justify-center w-full h-full relative z-[55] pointer-events-none">
            {photoUrls.map((url, index) => (
              <Image
                key={url}
                src={url}
                alt={`Photo ${index + 1} of ${photoUrls.length}`}
                width={0}
                height={0}
                sizes="100vw"
                className={`max-w-[90vw] max-h-[80vh] w-auto h-auto rounded-lg absolute transition-opacity duration-200 pointer-events-auto ${
                  index === carouselIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
                priority={Math.abs(index - carouselIndex) <= 1}
              />
            ))}
          </div>

          {/* Photo counter */}
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] px-3 py-1 bg-black/75 backdrop-blur-md text-white text-sm rounded-full border border-white/20">
            {carouselIndex + 1} / {photoUrls.length}
          </div>
        </div>
      )}
    </main>
  );
}
