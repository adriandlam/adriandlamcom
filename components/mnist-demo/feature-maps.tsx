"use client";

import { useEffect, useRef } from "react";

import type { CnnInferenceResult } from "./cnn-inference";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FeatureMapsProps {
	result: CnnInferenceResult | null;
}

interface LayerConfig {
	key: keyof CnnInferenceResult["featureMaps"];
	label: string;
	channels: number;
	height: number;
	width: number;
	scale: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

/** Show 8 representative channels out of 32, evenly spaced */
const SAMPLED_CHANNELS = [0, 4, 8, 12, 16, 20, 24, 28] as const;

const LAYERS: LayerConfig[] = [
	{
		key: "conv1",
		label: "Conv1 + ReLU (32 × 26 × 26)",
		channels: 32,
		height: 26,
		width: 26,
		scale: 2,
	},
	{
		key: "pool1",
		label: "MaxPool (32 × 13 × 13)",
		channels: 32,
		height: 13,
		width: 13,
		scale: 4,
	},
	{
		key: "conv2",
		label: "Conv2 + ReLU (32 × 11 × 11)",
		channels: 32,
		height: 11,
		width: 11,
		scale: 4,
	},
	{
		key: "pool2",
		label: "MaxPool (32 × 5 × 5)",
		channels: 32,
		height: 5,
		width: 5,
		scale: 8,
	},
];

/** Warm colormap endpoints */
const COLOR_LO = { r: 0x10, g: 0x10, b: 0x10 }; // #101010
const COLOR_HI = { r: 0xff, g: 0xc7, b: 0x99 }; // #ffc799

// ─── Sub-component: single feature map canvas ────────────────────────────────

function FeatureMapCanvas({
	data,
	channelIndex,
	height,
	width,
	scale,
}: {
	data: Float32Array;
	channelIndex: number;
	height: number;
	width: number;
	scale: number;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		drawFeatureMap(ctx, data, channelIndex, height, width, scale);
	}, [data, channelIndex, height, width, scale]);

	return (
		<canvas
			ref={canvasRef}
			width={width * scale}
			height={height * scale}
			className="rounded-sm"
		/>
	);
}

// ─── Drawing helper ──────────────────────────────────────────────────────────

function drawFeatureMap(
	ctx: CanvasRenderingContext2D,
	data: Float32Array,
	channelIndex: number,
	height: number,
	width: number,
	scale: number,
) {
	const channelSize = height * width;
	const offset = channelIndex * channelSize;

	// Find min/max for this channel to normalize
	let min = Infinity;
	let max = -Infinity;
	for (let i = 0; i < channelSize; i++) {
		const v = data[offset + i];
		if (v < min) min = v;
		if (v > max) max = v;
	}

	const range = max - min || 1; // avoid division by zero

	const imageData = ctx.createImageData(width * scale, height * scale);
	const pixels = imageData.data;

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const t = (data[offset + y * width + x] - min) / range;

			// Interpolate between dark and warm accent
			const r = COLOR_LO.r + t * (COLOR_HI.r - COLOR_LO.r);
			const g = COLOR_LO.g + t * (COLOR_HI.g - COLOR_LO.g);
			const b = COLOR_LO.b + t * (COLOR_HI.b - COLOR_LO.b);

			// Fill the scaled block
			for (let sy = 0; sy < scale; sy++) {
				for (let sx = 0; sx < scale; sx++) {
					const px = x * scale + sx;
					const py = y * scale + sy;
					const idx = (py * width * scale + px) * 4;
					pixels[idx] = r;
					pixels[idx + 1] = g;
					pixels[idx + 2] = b;
					pixels[idx + 3] = 255;
				}
			}
		}
	}

	ctx.putImageData(imageData, 0, 0);
}

// ─── Main component ──────────────────────────────────────────────────────────

export function FeatureMaps({ result }: FeatureMapsProps) {
	if (!result) {
		return (
			<p className="text-sm text-muted-foreground">
				Draw a digit to see CNN feature maps
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			{LAYERS.map((layer) => (
				<div key={layer.key}>
					<p className="text-xs font-mono text-muted-foreground mb-1.5">
						{layer.label}
					</p>
					<div className="flex flex-wrap gap-1.5">
						{SAMPLED_CHANNELS.map((ch) => (
							<FeatureMapCanvas
								key={ch}
								data={result.featureMaps[layer.key]}
								channelIndex={ch}
								height={layer.height}
								width={layer.width}
								scale={layer.scale}
							/>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
