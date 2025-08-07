"use client";

import { useHotkeys } from "react-hotkeys-hook";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type ImageStatus = "idle" | "loading" | "loaded" | "error";

export default function PhotosPage() {
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<{ name: string; url: string }[]>([]);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [imageStatuses, setImageStatuses] = useState<Map<number, ImageStatus>>(
    new Map()
  );
  const navigationTimeoutRef = useRef<NodeJS.Timeout>();

  const navigatePrevious = useCallback(() => {
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    navigationTimeoutRef.current = setTimeout(() => {
      setCarouselIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
    }, 50);
  }, [photos.length]);

  const navigateNext = useCallback(() => {
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    navigationTimeoutRef.current = setTimeout(() => {
      setCarouselIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
    }, 50);
  }, [photos.length]);

  useHotkeys("esc", () => setCarouselOpen(false), { enabled: carouselOpen });
  useHotkeys("left", navigatePrevious, { enabled: carouselOpen });
  useHotkeys("right", navigateNext, { enabled: carouselOpen });

  // Disable scroll when carousel is open
  useEffect(() => {
    if (carouselOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [carouselOpen]);

  // Preload current and adjacent images when carousel opens or index changes
  useEffect(() => {
    if (!carouselOpen || photos.length === 0) return;

    const indicesToLoad = [
      carouselIndex - 1,
      carouselIndex,
      carouselIndex + 1,
    ].filter((index) => index >= 0 && index < photos.length);

    indicesToLoad.forEach((index) => {
      startLoadingImage(index);
    });
  }, [carouselIndex, carouselOpen, photos.length]);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch("/api/photos");
        if (response.ok) {
          const data = await response.json();
          setPhotos(data.photos);
        } else {
          console.error("Failed to fetch photos");
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, []);

  const startLoadingImage = useCallback(
    (index: number) => {
      if (!photos[index]) return;

      const currentStatus = imageStatuses.get(index) || "idle";
      if (currentStatus !== "idle") return;

      setImageStatuses((prev) => new Map(prev).set(index, "loading"));

      const img = new Image();
      img.onload = () => {
        setImageStatuses((prev) => new Map(prev).set(index, "loaded"));
      };
      img.onerror = () => {
        setImageStatuses((prev) => new Map(prev).set(index, "error"));
      };
      img.src = photos[index].url;
    },
    [photos, imageStatuses]
  );

  // Intersection Observer for lazy loading visibility
  useEffect(() => {
    if (photos.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute("data-index") || "0"
            );
            startLoadingImage(index);
          }
        });
      },
      {
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    const timer = setTimeout(() => {
      const photoElements = document.querySelectorAll("[data-index]");
      photoElements.forEach((element) => observer.observe(element));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [photos.length, startLoadingImage]);

  return (
    <main className="px-8 pt-8 border-t border-dashed">
      <div className="mb-8">
        <h1 className="text-4xl font-medium tracking-tight">Photos</h1>
        <p className=" text-muted-foreground mt-2">
          A collection of photos I've taken over the years. I'm not a
          professional photographer, but I enjoy capturing moments.
        </p>
      </div>
      <p className="text-sm opacity-80">
        My photos are taken with a Panasonic Lumix G85 with a Panasonic Lumix G
        25mm F1.7. lens but I've also recently upgraded to a Panasonic Lumix G
        Vario 12-60mm f/3.5-5.6.
      </p>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-12">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <Skeleton
                key={i}
                className="aspect-square rounded w-full h-full bg-muted animate-pulse"
              />
            ))
          : photos.map((photo, i) => {
              const status = imageStatuses.get(i) || "idle";
              return (
                <div
                  key={photo.url}
                  onClick={() => {
                    setCarouselOpen(true);
                    setCarouselIndex(i);
                  }}
                  className="hover:cursor-pointer relative aspect-square w-full overflow-hidden rounded-xl bg-muted"
                  data-index={i}
                >
                  {status !== "loaded" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
                      {status === "loading" && (
                        <div className="w-7 h-7 border-2 border-muted-foreground/20 border-t-muted-foreground/60 rounded-full animate-spin" />
                      )}
                    </div>
                  )}
                  <Image
                    src={photo.url}
                    alt={`Photo ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className={`object-cover transition-opacity duration-300 ${
                      status === "loaded" ? "opacity-100" : "opacity-0"
                    }`}
                    priority={i < 3}
                    onLoad={() => {
                      setImageStatuses((prev) =>
                        new Map(prev).set(i, "loaded")
                      );
                    }}
                    onError={() => {
                      setImageStatuses((prev) => new Map(prev).set(i, "error"));
                    }}
                  />
                </div>
              );
            })}
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
            variant="ghost"
            className="fixed top-4 right-4 z-[60] p-2 rounded-full h-6 flex justify-between gap-1 border"
            aria-label="Close carousel"
          >
            <X />
            Close
          </Button>

          {/* Previous button */}
          <button
            onClick={navigatePrevious}
            className="fixed left-4 top-1/2 -translate-y-1/2 z-[60] cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next button */}
          <button
            onClick={navigateNext}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-[60] cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight size={24} />
          </button>

          {/* Image container */}
          <div className="flex items-center justify-center w-full h-full relative z-[55] pointer-events-none">
            {photos
              .slice(
                Math.max(0, carouselIndex - 1),
                Math.min(photos.length, carouselIndex + 2)
              )
              .map((photo, relativeIndex) => {
                const actualIndex =
                  Math.max(0, carouselIndex - 1) + relativeIndex;
                const isActive = actualIndex === carouselIndex;
                const status = imageStatuses.get(actualIndex) || "idle";

                return (
                  <div
                    key={`${photo.url}-${actualIndex}`}
                    className={`absolute ${isActive ? "z-10" : "z-0"}`}
                  >
                    {isActive && status !== "loaded" && (
                      <div className="flex items-center justify-center w-[90vw] h-[80vh] bg-black/50 rounded-lg">
                        {status === "loading" && (
                          <div className="w-12 h-12 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                        )}
                      </div>
                    )}
                    <Image
                      src={photo.url}
                      alt={`Photo ${actualIndex + 1} of ${photos.length}`}
                      width={1200}
                      height={800}
                      className={`max-w-[90vw] max-h-[80vh] w-auto h-auto rounded-lg transition-opacity duration-200 pointer-events-auto object-contain ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                      priority
                      onLoad={() => {
                        setImageStatuses((prev) =>
                          new Map(prev).set(actualIndex, "loaded")
                        );
                      }}
                      onError={() => {
                        setImageStatuses((prev) =>
                          new Map(prev).set(actualIndex, "error")
                        );
                      }}
                    />
                  </div>
                );
              })}
          </div>

          {/* Photo counter */}
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] px-3 py-1 bg-black/75 backdrop-blur-md text-white text-sm rounded-full border border-white/20">
            {carouselIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </main>
  );
}
