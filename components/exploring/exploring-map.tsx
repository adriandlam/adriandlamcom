"use client";

import polyline from "@mapbox/polyline";
import { useCallback, useEffect, useRef, useState } from "react";
import MapGL, { Layer, type MapRef, Source } from "react-map-gl/mapbox";
import type { Hike } from "@/lib/strava";
import type { Landmark } from "@/lib/exploring";
import "mapbox-gl/dist/mapbox-gl.css";

interface ExploringMapProps {
	hikes: Hike[];
	landmarks: Landmark[];
	highlightedHikeId: string | null;
	onLandmarkClick: (label: string) => void;
}

function hikesToGeoJSON(hikes: Hike[], highlightedId: string | null) {
	return {
		type: "FeatureCollection" as const,
		features: hikes.map((hike) => ({
			type: "Feature" as const,
			properties: {
				id: hike.id,
				highlighted: hike.id === highlightedId,
			},
			geometry: {
				type: "LineString" as const,
				coordinates: polyline
					.decode(hike.polyline)
					.map(([lat, lng]) => [lng, lat]),
			},
		})),
	};
}

function hikeStartsToGeoJSON(hikes: Hike[]) {
	return {
		type: "FeatureCollection" as const,
		features: hikes
			.filter((h) => h.startLatLng !== null)
			.map((hike) => ({
				type: "Feature" as const,
				properties: { id: hike.id },
				geometry: {
					type: "Point" as const,
					coordinates: [hike.startLatLng![1], hike.startLatLng![0]],
				},
			})),
	};
}

function landmarksToGeoJSON(landmarks: Landmark[]) {
	return {
		type: "FeatureCollection" as const,
		features: landmarks.map((lm) => ({
			type: "Feature" as const,
			properties: {
				label: lm.label,
				type: lm.type,
			},
			geometry: {
				type: "Point" as const,
				coordinates: [lm.lng, lm.lat],
			},
		})),
	};
}

// Find the densest cluster of hikes using a grid approach
function getDensestRegion(hikes: Hike[]): [number, number] | null {
	const starts = hikes
		.map((h) => h.startLatLng)
		.filter((s): s is [number, number] => s !== null);
	if (starts.length === 0) return null;
	if (starts.length === 1) return starts[0];

	const grid = new Map<string, { lat: number; lng: number; count: number }>();
	for (const [lat, lng] of starts) {
		const key = `${Math.round(lat / 10)},${Math.round(lng / 10)}`;
		const cell = grid.get(key);
		if (cell) {
			cell.lat += lat;
			cell.lng += lng;
			cell.count++;
		} else {
			grid.set(key, { lat, lng, count: 1 });
		}
	}

	let best = grid.values().next().value!;
	for (const cell of grid.values()) {
		if (cell.count > best.count) best = cell;
	}

	return [best.lat / best.count, best.lng / best.count];
}

export function ExploringMap({
	hikes,
	landmarks,
	highlightedHikeId,
	onLandmarkClick,
}: ExploringMapProps) {
	const mapRef = useRef<MapRef>(null);
	const rotationRef = useRef<number | null>(null);
	const hasInteractedRef = useRef(false);
	const hasFlewInRef = useRef(false);
	const drawAnimRef = useRef<number | null>(null);
	const pulseAnimRef = useRef<number | null>(null);
	const [drawingCoords, setDrawingCoords] = useState<[number, number][] | null>(
		null,
	);
	const [pulseRadius, setPulseRadius] = useState(4);

	// Pulsing animation for start point dots
	useEffect(() => {
		const startTime = performance.now();
		const animate = (now: number) => {
			const elapsed = (now - startTime) / 1000;
			// Smooth sine pulse between 3 and 6
			const radius = 4.5 + Math.sin(elapsed * 2) * 1.5;
			setPulseRadius(radius);
			pulseAnimRef.current = requestAnimationFrame(animate);
		};
		pulseAnimRef.current = requestAnimationFrame(animate);
		return () => {
			if (pulseAnimRef.current) cancelAnimationFrame(pulseAnimRef.current);
		};
	}, []);

	// Enable 3D terrain, hillshade, contour lines on map load
	const handleLoad = useCallback(() => {
		const map = mapRef.current?.getMap();
		if (!map) return;

		map.addSource("mapbox-dem", {
			type: "raster-dem",
			url: "mapbox://mapbox.mapbox-terrain-dem-v1",
			tileSize: 512,
			maxzoom: 14,
		});
		map.addSource("mapbox-dem-hillshade", {
			type: "raster-dem",
			url: "mapbox://mapbox.mapbox-terrain-dem-v1",
			tileSize: 512,
			maxzoom: 14,
		});
		// Terrain disabled — causes line rendering to be blurry
		// map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

		// Hillshade layer — separate DEM source for full resolution
		map.addLayer(
			{
				id: "hillshade",
				type: "hillshade",
				source: "mapbox-dem-hillshade",
				paint: {
					"hillshade-illumination-direction": 315,
					"hillshade-exaggeration": 0.5,
					"hillshade-shadow-color": "#000000",
					"hillshade-highlight-color": "#1a1a1a",
					"hillshade-accent-color": "#111111",
				},
			},
			"land-structure-polygon",
		);

		// Contour lines from Mapbox terrain tileset
		map.addSource("contours", {
			type: "vector",
			url: "mapbox://mapbox.mapbox-terrain-v2",
		});
		map.addLayer(
			{
				id: "contour-lines",
				type: "line",
				source: "contours",
				"source-layer": "contour",
				paint: {
					"line-color": "#cccccc",
					"line-width": ["interpolate", ["linear"], ["zoom"], 12, 0.3, 16, 0.8],
					"line-opacity": ["match", ["get", "index"], 5, 0.12, 10, 0.16, 0.05],
				},
				layout: {
					"line-cap": "round",
					"line-join": "round",
				},
				minzoom: 11,
			},
			"hikes-line",
		);

		// Subtle trail/path features from OSM data
		map.addLayer(
			{
				id: "trails",
				type: "line",
				source: "composite",
				"source-layer": "road",
				filter: ["in", ["get", "class"], ["literal", ["path", "track"]]],
				paint: {
					"line-color": "#99ffe4",
					"line-width": [
						"interpolate",
						["linear"],
						["zoom"],
						10,
						0.5,
						14,
						1,
						18,
						1.5,
					],
					"line-opacity": [
						"interpolate",
						["linear"],
						["zoom"],
						10,
						0.1,
						14,
						0.2,
					],
					"line-dasharray": [1, 4],
				},
				layout: {
					"line-cap": "round",
					"line-join": "round",
				},
				minzoom: 10,
			},
			"hikes-line",
		);
	}, []);

	// Fly to highlighted hike, then draw trail after camera arrives
	useEffect(() => {
		if (!highlightedHikeId || !mapRef.current) return;
		const hike = hikes.find((h) => h.id === highlightedHikeId);
		if (!hike?.startLatLng) return;

		hasInteractedRef.current = true;

		const fullCoords = polyline
			.decode(hike.polyline)
			.map(([lat, lng]) => [lng, lat] as [number, number]);

		const map = mapRef.current.getMap();
		mapRef.current.flyTo({
			center: [hike.startLatLng[1], hike.startLatLng[0]],
			zoom: 13,
			pitch: 0,
			duration: 1500,
		});

		// Start trail drawing only after flyTo completes
		if (drawAnimRef.current) cancelAnimationFrame(drawAnimRef.current);
		const startDraw = () => {
			const totalPoints = fullCoords.length;
			const duration = 1200;
			const startTime = performance.now();

			const animate = (now: number) => {
				const elapsed = now - startTime;
				const progress = Math.min(elapsed / duration, 1);
				const eased = 1 - (1 - progress) ** 3;
				const pointCount = Math.max(2, Math.round(totalPoints * eased));
				setDrawingCoords(fullCoords.slice(0, pointCount));

				if (progress < 1) {
					drawAnimRef.current = requestAnimationFrame(animate);
				} else {
					drawAnimRef.current = null;
				}
			};
			drawAnimRef.current = requestAnimationFrame(animate);
		};
		map.once("moveend", startDraw);

		return () => {
			map.off("moveend", startDraw);
			if (drawAnimRef.current) cancelAnimationFrame(drawAnimRef.current);
		};
	}, [highlightedHikeId, hikes]);

	// Clear drawing when unhovered
	useEffect(() => {
		if (!highlightedHikeId) {
			setDrawingCoords(null);
			if (drawAnimRef.current) {
				cancelAnimationFrame(drawAnimRef.current);
				drawAnimRef.current = null;
			}
		}
	}, [highlightedHikeId]);

	// Cinematic initial globe: tilted, slow drift, then fly to densest region
	useEffect(() => {
		if (hasInteractedRef.current) return;

		const densest = getDensestRegion(hikes);

		function stopRotation() {
			if (rotationRef.current !== null) {
				cancelAnimationFrame(rotationRef.current);
				rotationRef.current = null;
			}
		}

		// Slow drift with slight bearing rotation for cinematic feel
		let bearing = 0;
		const rotate = () => {
			if (mapRef.current && !hasInteractedRef.current) {
				const center = mapRef.current.getCenter();
				bearing += 0.03;
				mapRef.current.getMap().jumpTo({
					center: [center.lng + 0.008, center.lat],
					bearing,
				});
				rotationRef.current = requestAnimationFrame(rotate);
			}
		};
		rotationRef.current = requestAnimationFrame(rotate);

		if (densest && !hasFlewInRef.current) {
			const timeout = setTimeout(() => {
				if (!hasInteractedRef.current && mapRef.current) {
					stopRotation();
					hasFlewInRef.current = true;
					mapRef.current.flyTo({
						center: [densest[1], densest[0]],
						zoom: 5,
						pitch: 0,
						bearing: 0,
						duration: 3500,
						curve: 1.8,
					});
				}
			}, 2500);
			return () => {
				stopRotation();
				clearTimeout(timeout);
			};
		}

		return stopRotation;
	}, [hikes]);

	const handleClick = useCallback(
		(
			event: mapboxgl.MapMouseEvent & { features?: mapboxgl.GeoJSONFeature[] },
		) => {
			const feature = event.features?.[0];
			if (feature?.properties?.label) {
				onLandmarkClick(feature.properties.label as string);
			}
		},
		[onLandmarkClick],
	);

	const hikesGeoJSON = hikesToGeoJSON(hikes, highlightedHikeId);
	const hikeStartsGeoJSON = hikeStartsToGeoJSON(hikes);
	const landmarksGeoJSON = landmarksToGeoJSON(landmarks);

	const drawingGeoJSON = drawingCoords
		? {
				type: "Feature" as const,
				properties: {},
				geometry: {
					type: "LineString" as const,
					coordinates: drawingCoords,
				},
			}
		: null;

	return (
		<MapGL
			ref={mapRef}
			mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
			initialViewState={{
				longitude: 0,
				latitude: 20,
				zoom: 1.5,
				pitch: 15,
			}}
			projection={{ name: "globe" }}
			style={{ width: "100%", height: "100%" }}
			mapStyle="mapbox://styles/mapbox/dark-v11"
			fog={{
				color: "#0a0a0a",
				"high-color": "#0a0a0a",
				"space-color": "#000000",
				"horizon-blend": 0.02,
				"star-intensity": 0.2,
			}}
			interactiveLayerIds={["landmarks-circle"]}
			onClick={handleClick}
			onLoad={handleLoad}
			onDragStart={() => {
				hasInteractedRef.current = true;
			}}
			onZoomStart={() => {
				hasInteractedRef.current = true;
			}}
			attributionControl={false}
			logoPosition="top-left"
			cursor="grab"
		>
			{/* Hike trail lines — highlighted trail hidden here, shown via drawing layer */}
			<Source id="hikes" type="geojson" data={hikesGeoJSON}>
				<Layer
					id="hikes-line"
					type="line"
					paint={{
						"line-color": "#99ffe4",
						"line-width": [
							"interpolate",
							["linear"],
							["zoom"],
							1,
							1.5,
							5,
							2,
							12,
							2.5,
						],
						"line-opacity": ["case", ["get", "highlighted"], 0, 0.6],
					}}
					layout={{
						"line-cap": "round",
						"line-join": "round",
					}}
				/>
			</Source>

			{/* Pulsing start-point dots */}
			<Source id="hike-starts" type="geojson" data={hikeStartsGeoJSON}>
				{/* Outer pulse glow */}
				<Layer
					id="hike-starts-pulse"
					type="circle"
					paint={{
						"circle-radius": pulseRadius * 2,
						"circle-color": "#99ffe4",
						"circle-opacity": 0.08,
						"circle-blur": 1,
					}}
				/>
				{/* Inner dot */}
				<Layer
					id="hike-starts-dot"
					type="circle"
					paint={{
						"circle-radius": pulseRadius * 0.5,
						"circle-color": "#99ffe4",
						"circle-opacity": 0.7,
					}}
				/>
			</Source>

			{/* Animated trail drawing — only visible when hovering a hike */}
			{drawingGeoJSON && (
				<Source id="drawing" type="geojson" data={drawingGeoJSON}>
					<Layer
						id="drawing-line"
						type="line"
						paint={{
							"line-color": "#99ffe4",
							"line-width": 3,
							"line-opacity": 1,
						}}
						layout={{
							"line-cap": "round",
							"line-join": "round",
						}}
					/>
				</Source>
			)}

			{/* Landmark glow */}
			<Source id="landmarks" type="geojson" data={landmarksGeoJSON}>
				<Layer
					id="landmarks-glow"
					type="circle"
					paint={{
						"circle-radius": 10,
						"circle-color": "#99ffe4",
						"circle-opacity": 0.15,
						"circle-blur": 1,
					}}
				/>
				<Layer
					id="landmarks-circle"
					type="circle"
					paint={{
						"circle-radius": 4,
						"circle-color": "#99ffe4",
						"circle-opacity": 0.9,
					}}
				/>
			</Source>
		</MapGL>
	);
}
