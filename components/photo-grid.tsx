"use client";

import { useCallback, useRef, useState } from "react";
import { HoverParallaxImage } from "@/components/hover-parallax-image";
import { PhotoLightbox } from "@/components/photo-lightbox";

interface Photo {
	name: string;
	url: string;
	blurDataURL?: string;
}

interface PhotoGridProps {
	photos: Photo[];
}

interface LightboxState {
	index: number;
	originRect: { top: number; left: number; width: number; height: number };
}

export function PhotoGrid({ photos }: PhotoGridProps) {
	const [lightbox, setLightbox] = useState<LightboxState | null>(null);
	const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

	const setItemRef = useCallback(
		(index: number) => (node: HTMLDivElement | null) => {
			if (node) {
				itemRefs.current.set(index, node);
			} else {
				itemRefs.current.delete(index);
			}
		},
		[],
	);

	const handlePhotoClick = useCallback((index: number) => {
		const el = itemRefs.current.get(index);
		if (!el) return;

		const rect = el.getBoundingClientRect();
		setLightbox({
			index,
			originRect: {
				top: rect.top,
				left: rect.left,
				width: rect.width,
				height: rect.height,
			},
		});
	}, []);

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
				{photos.map((photo, i) => (
					<HoverParallaxImage
						key={photo.url}
						src={photo.url}
						alt={photo.name}
						containerRef={setItemRef(i)}
						disableEntrance={i < 2}
						isActive={lightbox?.index === i}
						onClick={() => handlePhotoClick(i)}
						priority={i < 2}
						sizes="(max-width: 640px) 100vw, 50vw"
						placeholder={photo.blurDataURL ? "blur" : "empty"}
						blurDataURL={photo.blurDataURL}
					/>
				))}
			</div>

			{lightbox !== null && (
				<PhotoLightbox
					photos={photos}
					initialIndex={lightbox.index}
					originRect={lightbox.originRect}
					onClose={() => setLightbox(null)}
				/>
			)}
		</>
	);
}
