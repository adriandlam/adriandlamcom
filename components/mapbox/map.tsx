"use client";

import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

export default function Map() {
	const mapContainerRef = useRef(null);

	useEffect(() => {
		mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

		const map = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: "mapbox://styles/mapbox/outdoors-v12",
			center: [-123.1207, 49.2827],
			zoom: 12,
		});

		// Map initialization code goes here

		return () => map.remove();
	}, []);

	return <div className="h-screen" ref={mapContainerRef} />;
}
