"use client";

import { useHotkeys } from "react-hotkeys-hook";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";

type ImageStatus = "idle" | "loading" | "loaded" | "error";

type Photo = {
  name: string;
  thumbnail: string;
  fullSize: string;
  original: string;
  lastModified: string;
  size: number;
};

export default function PhotosPage() {
  const { data, error, isLoading } = useSWR("/api/photos", fetcher);
  const photos: Photo[] = data?.photos || [];

  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [imageStatuses, setImageStatuses] = useState<Map<number, ImageStatus>>(
    new Map()
  );
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // SWR handles loading, error states, and caching automatically

  const startLoadingImage = useCallback(
    (index: number, imageType: "thumbnail" | "fullSize" = "thumbnail") => {
      if (!photos[index]) return;

      const statusKey = imageType === "fullSize" ? `${index}-full` : `${index}`;
      const currentStatus = imageStatuses.get(statusKey as any) || "idle";
      if (currentStatus !== "idle") return;

      setImageStatuses((prev) =>
        new Map(prev).set(statusKey as any, "loading")
      );

      const img = new window.Image();
      img.onload = () => {
        setImageStatuses((prev) =>
          new Map(prev).set(statusKey as any, "loaded")
        );
      };
      img.onerror = () => {
        setImageStatuses((prev) =>
          new Map(prev).set(statusKey as any, "error")
        );
      };
      img.src =
        imageType === "fullSize"
          ? photos[index].fullSize
          : photos[index].thumbnail;
    },
    [photos, imageStatuses]
  );

  // Simplified intersection observer - cache makes loading fast
  useEffect(() => {
    if (photos.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute("data-index") || "0"
            );
            startLoadingImage(index, "thumbnail");
          }
        });
      },
      {
        rootMargin: "100px",
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
      <p className="text-sm opacity-80 mb-8">
        My photos are taken with a Panasonic Lumix G85 with a Panasonic Lumix G
        25mm F1.7. lens but I've also recently upgraded to a Panasonic Lumix G
        Vario 12-60mm f/3.5-5.6.
      </p>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {isLoading || error
          ? Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square w-full overflow-hidden rounded-xl bg-muted"
              >
                <Skeleton className="w-full h-full bg-muted animate-pulse" />
              </div>
            ))
          : photos.map((photo, i) => {
              const status = imageStatuses.get(i) || "idle";

              return (
                <motion.div
                  key={photo.name}
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{
                    filter: status === "loaded" ? "blur(0px)" : "blur(10px)",
                    opacity: status === "loaded" ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.5,
                    filter: { duration: 0.5, ease: "easeOut" },
                    delay: (i * 0.1) / 4, // Stagger each photo individually
                  }}
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
                  <img
                    src={photo.thumbnail}
                    alt={`Photo ${i + 1}`}
                    className="object-cover w-full h-full"
                    onLoad={() => {
                      setImageStatuses((prev) =>
                        new Map(prev).set(i, "loaded")
                      );
                    }}
                    onError={() => {
                      setImageStatuses((prev) => new Map(prev).set(i, "error"));
                    }}
                  />
                </motion.div>
              );
            })}
      </div>
      <AnimatePresence mode="popLayout">
        {carouselOpen && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
          >
            {/* Background overlay */}
            <motion.div
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCarouselOpen(false)}
            />

            {/* Top controls */}
            <div className="fixed top-4 right-4 z-[60] flex gap-2">
              <Button
                onClick={() => setCarouselOpen(false)}
                variant="ghost"
                className="p-2 rounded-full h-6 flex justify-between gap-1 border"
                aria-label="Close carousel"
              >
                <X />
                Close
              </Button>
            </div>

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
            <div className="absolute inset-0 flex items-center justify-center z-[55] pointer-events-none">
              {photos
                .slice(
                  Math.max(0, carouselIndex - 1),
                  Math.min(photos.length, carouselIndex + 2)
                )
                .map((photo, relativeIndex) => {
                  const actualIndex =
                    Math.max(0, carouselIndex - 1) + relativeIndex;
                  const isActive = actualIndex === carouselIndex;
                  const statusKey = `${actualIndex}-full`;
                  const status = imageStatuses.get(statusKey as any) || "idle";

                  // Preload fullSize image when it becomes active
                  if (isActive && status === "idle") {
                    startLoadingImage(actualIndex, "fullSize");
                  }

                  return (
                    <motion.div
                      key={`${photo.fullSize}-${actualIndex}`}
                      className={`absolute ${isActive ? "z-10" : "z-0"}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        scale: isActive ? 1 : 0.95,
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {isActive && status !== "loaded" && (
                        <motion.div
                          className="flex items-center justify-center w-[90vw] h-[80vh] bg-black/50 rounded-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {status === "loading" && (
                            <div className="w-12 h-12 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                          )}
                        </motion.div>
                      )}
                      <motion.img
                        src={photo.fullSize}
                        alt={`Photo ${actualIndex + 1} of ${photos.length}`}
                        className="max-w-[90vw] max-h-[80vh] w-auto h-auto rounded-lg pointer-events-auto object-contain"
                        initial={{ filter: "blur(15px)", opacity: 0 }}
                        animate={{
                          filter:
                            status === "loaded" ? "blur(0px)" : "blur(15px)",
                          opacity: status === "loaded" ? 1 : 0,
                        }}
                        transition={{
                          filter: { duration: 0.3, ease: "easeOut" },
                          opacity: { duration: 0.1 },
                        }}
                        onLoad={() => {
                          setImageStatuses((prev) =>
                            new Map(prev).set(statusKey as any, "loaded")
                          );
                        }}
                        onError={() => {
                          setImageStatuses((prev) =>
                            new Map(prev).set(statusKey as any, "error")
                          );
                        }}
                      />
                    </motion.div>
                  );
                })}
            </div>

            {/* Photo counter */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] px-3 py-1 bg-black/75 backdrop-blur-md text-white text-sm rounded-full border border-white/20">
              {carouselIndex + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
