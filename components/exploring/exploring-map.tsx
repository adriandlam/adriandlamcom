"use client";

import polyline from "@mapbox/polyline";
import { useCallback, useEffect, useRef, useState } from "react";
import MapGL, { Layer, type MapRef, Popup, Source } from "react-map-gl/mapbox";
import type { Hike } from "@/lib/strava";
import type { Landmark } from "@/lib/exploring";
import { cn } from "@/lib/utils";
import "mapbox-gl/dist/mapbox-gl.css";

interface ExploringMapProps {
	hikes: Hike[];
	landmarks: Landmark[];
}

type SelectedFeature =
	| { type: "hike"; hike: Hike; lng: number; lat: number }
	| { type: "landmark"; landmark: Landmark };

function hikesToGeoJSON(hikes: Hike[], selectedId: string | null) {
	return {
		type: "FeatureCollection" as const,
		features: hikes.map((hike) => ({
			type: "Feature" as const,
			properties: {
				id: hike.id,
				selected: hike.id === selectedId,
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

function formatDate(dateString: string): string {
	return new Date(dateString)
		.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		})
		.toLowerCase();
}

export function ExploringMap({ hikes, landmarks }: ExploringMapProps) {
	const mapRef = useRef<MapRef>(null);
	const rotationRef = useRef<number | null>(null);
	const hasInteractedRef = useRef(false);
	const hasFlewInRef = useRef(false);
	const drawAnimRef = useRef<number | null>(null);
	const [drawingCoords, setDrawingCoords] = useState<[number, number][] | null>(
		null,
	);
	const [selected, setSelected] = useState<SelectedFeature | null>(null);

	const selectedHikeId = selected?.type === "hike" ? selected.hike.id : null;

	// Enable hillshade, contour lines, trails on map load
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

		// Pointer cursor on interactive layers
		const interactiveLayers = [
			"hikes-line",
			"hike-starts-dot",
			"landmarks-circle",
			"landmarks-glow",
		];
		for (const layer of interactiveLayers) {
			map.on("mouseenter", layer, () => {
				map.getCanvas().style.cursor = "pointer";
			});
			map.on("mouseleave", layer, () => {
				map.getCanvas().style.cursor = "";
			});
		}
	}, []);

	// Fly to selected feature and draw trail
	useEffect(() => {
		if (!selected || !mapRef.current) return;
		hasInteractedRef.current = true;

		if (selected.type === "hike") {
			const { hike } = selected;
			if (!hike.startLatLng) return;

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
		}

		if (selected.type === "landmark") {
			const { landmark } = selected;
			mapRef.current.flyTo({
				center: [landmark.lng, landmark.lat],
				zoom: 10,
				duration: 1500,
			});
		}
	}, [selected]);

	// Clear drawing when deselected
	useEffect(() => {
		if (!selected || selected.type !== "hike") {
			setDrawingCoords(null);
			if (drawAnimRef.current) {
				cancelAnimationFrame(drawAnimRef.current);
				drawAnimRef.current = null;
			}
		}
	}, [selected]);

	// Cinematic initial globe
	useEffect(() => {
		if (hasInteractedRef.current) return;

		const densest = getDensestRegion(hikes);

		function stopRotation() {
			if (rotationRef.current !== null) {
				cancelAnimationFrame(rotationRef.current);
				rotationRef.current = null;
			}
		}

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

	// Handle clicks on trails, start dots, and landmarks
	const handleClick = useCallback(
		(
			event: mapboxgl.MapMouseEvent & {
				features?: mapboxgl.GeoJSONFeature[];
			},
		) => {
			const feature = event.features?.[0];

			if (!feature) {
				setSelected(null);
				return;
			}

			const layerId = feature.layer?.id;

			// Landmark click
			if (layerId === "landmarks-circle" || layerId === "landmarks-glow") {
				const label = feature.properties?.label as string;
				const lm = landmarks.find((l) => l.label === label);
				if (lm) setSelected({ type: "landmark", landmark: lm });
				return;
			}

			// Hike trail or start dot click
			if (layerId === "hikes-line" || layerId === "hike-starts-dot") {
				const id = feature.properties?.id as string;
				const hike = hikes.find((h) => h.id === id);
				if (hike) {
					setSelected({
						type: "hike",
						hike,
						lng: event.lngLat.lng,
						lat: event.lngLat.lat,
					});
				}
				return;
			}

			setSelected(null);
		},
		[hikes, landmarks],
	);

	const hikesGeoJSON = hikesToGeoJSON(hikes, selectedHikeId);
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

	// Info card popup coordinates
	const popupCoords: [number, number] | null =
		selected?.type === "hike" && selected.hike.startLatLng
			? [selected.hike.startLatLng[1], selected.hike.startLatLng[0]]
			: selected?.type === "landmark"
				? [selected.landmark.lng, selected.landmark.lat]
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
			interactiveLayerIds={[
				"hikes-line",
				"hike-starts-dot",
				"landmarks-circle",
				"landmarks-glow",
			]}
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
		>
			{/* Hike trail lines */}
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
						"line-opacity": ["case", ["get", "selected"], 0, 0.6],
					}}
					layout={{
						"line-cap": "round",
						"line-join": "round",
					}}
				/>
			</Source>

			{/* Start-point x markers */}
			<Source id="hike-starts" type="geojson" data={hikeStartsGeoJSON}>
				<Layer
					id="hike-starts-dot"
					type="symbol"
					layout={{
						"text-field": "×",
						"text-size": [
							"interpolate",
							["linear"],
							["zoom"],
							1,
							10,
							8,
							16,
							14,
							22,
						],
						"text-allow-overlap": true,
						"text-ignore-placement": true,
					}}
					paint={{
						"text-color": "#99ffe4",
						"text-opacity": 0.8,
					}}
				/>
			</Source>

			{/* Animated trail drawing */}
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

			{/* Landmark dots */}
			<Source id="landmarks" type="geojson" data={landmarksGeoJSON}>
				<Layer
					id="landmarks-glow"
					type="circle"
					paint={{
						"circle-radius": 10,
						"circle-color": "#ff8080",
						"circle-opacity": 0.15,
						"circle-blur": 1,
					}}
				/>
				<Layer
					id="landmarks-circle"
					type="circle"
					paint={{
						"circle-radius": 4,
						"circle-color": "#ff8080",
						"circle-opacity": 0.9,
					}}
				/>
			</Source>

			{/* Info card popup */}
			{selected && popupCoords && (
				<Popup
					longitude={popupCoords[0]}
					latitude={popupCoords[1]}
					anchor="bottom"
					closeButton={false}
					closeOnClick={false}
					offset={12}
					className="exploring-popup"
				>
					{selected.type === "hike" ? (
						<div className="min-w-48 max-w-64">
							<div className="text-sm font-medium text-vesper-text leading-tight">
								{selected.hike.name}
							</div>
							<div className="flex items-center gap-3 mt-1.5 font-mono text-xs text-vesper-dim">
								<span>{formatDate(selected.hike.date)}</span>
							</div>
							<div className="flex items-center gap-3 mt-1 font-mono text-xs">
								<span className="text-vesper-orange">
									{selected.hike.distance} km
								</span>
								<span className="text-vesper-dim">
									{selected.hike.elevationGain}m elev
								</span>
								<span className="text-vesper-dim">
									{selected.hike.movingTime}
								</span>
							</div>
						</div>
					) : (
						<div className="min-w-32">
							<div className="flex items-center gap-2">
								<span className="size-1.5 rounded-full bg-vesper-red shrink-0" />
								<span className="text-sm font-medium text-vesper-text">
									{selected.landmark.label}
								</span>
							</div>
							<div className="font-mono text-xs text-vesper-dim mt-1">
								{selected.landmark.type}
							</div>
						</div>
					)}
				</Popup>
			)}
		</MapGL>
	);
}
