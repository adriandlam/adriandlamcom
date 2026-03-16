"use client";

import { motion } from "motion/react";
import { useMemo } from "react";
import type { InferenceResult } from "./inference";

interface NetworkVisualizerProps {
	result: InferenceResult | null;
}

const SVG_WIDTH = 600;
const SVG_HEIGHT = 300;

const LAYER_X = {
	input: 60,
	hidden1: 170,
	hidden2: 280,
	hidden3: 390,
	output: 510,
} as const;

const HIDDEN_NODE_COUNT = 12;
const HIDDEN_RADIUS = 7;
const OUTPUT_RADIUS = 10;
const REAL_HIDDEN_SIZE = 256;

const GRID_SIZE = 28;
const PIXEL_SIZE = 3;
const GRID_TOTAL = GRID_SIZE * PIXEL_SIZE; // 84px

const NODE_MARGIN_TOP = 20;
const NODE_AREA_HEIGHT = SVG_HEIGHT - 40; // 260px usable

const DARK = "#1a1a1a";
const ACCENT = "#99ffe4";

const LAYER_LABELS = ["784", "256", "256", "256", "10"] as const;
const LAYER_LABEL_X = [
	LAYER_X.input,
	LAYER_X.hidden1,
	LAYER_X.hidden2,
	LAYER_X.hidden3,
	LAYER_X.output,
] as const;

function getHiddenNodeY(index: number, count: number): number {
	return (
		NODE_MARGIN_TOP +
		(index * NODE_AREA_HEIGHT) / (count + 1) +
		NODE_AREA_HEIGHT / (count + 1)
	);
}

function getOutputNodeY(index: number): number {
	return NODE_MARGIN_TOP + ((index + 1) * NODE_AREA_HEIGHT) / 11;
}

function sampleActivations(full: Float32Array, count: number): number[] {
	const step = full.length / count;
	const sampled: number[] = [];
	for (let i = 0; i < count; i++) {
		sampled.push(full[Math.floor(i * step)]);
	}
	const max = Math.max(...sampled, 0.001);
	return sampled.map((v) => Math.min(Math.max(v / max, 0), 1));
}

function hiddenColor(activation: number): string {
	const c = Math.min(Math.max(activation, 0), 1);
	const r = Math.round(0x1a + (0xff - 0x1a) * c * 0.6);
	const g = Math.round(0x1a + (0xc7 - 0x1a) * c * 0.6);
	const b = Math.round(0x1a + (0x99 - 0x1a) * c * 0.6);
	return `rgb(${r},${g},${b})`;
}

function outputColor(probability: number): string {
	const c = Math.min(Math.max(probability, 0), 1);
	const r = Math.round(0x1a + (0x99 - 0x1a) * c);
	const g = Math.round(0x1a + (0xff - 0x1a) * c);
	const b = Math.round(0x1a + (0xe4 - 0x1a) * c);
	return `rgb(${r},${g},${b})`;
}

export function NetworkVisualizer({ result }: NetworkVisualizerProps) {
	const hasResult = result !== null;

	// Compute sampled/normalized activations for hidden layers
	const hiddenActivations = useMemo(() => {
		if (!result) {
			return {
				h1: Array(HIDDEN_NODE_COUNT).fill(0) as number[],
				h2: Array(HIDDEN_NODE_COUNT).fill(0) as number[],
				h3: Array(HIDDEN_NODE_COUNT).fill(0) as number[],
			};
		}
		return {
			h1: sampleActivations(result.activations.hidden1, HIDDEN_NODE_COUNT),
			h2: sampleActivations(result.activations.hidden2, HIDDEN_NODE_COUNT),
			h3: sampleActivations(result.activations.hidden3, HIDDEN_NODE_COUNT),
		};
	}, [result]);

	const outputProbs = useMemo(() => {
		if (!result) return Array(10).fill(0) as number[];
		return Array.from(result.probabilities);
	}, [result]);

	const topIndex = useMemo(() => {
		const max = Math.max(...outputProbs);
		return max > 0 ? outputProbs.indexOf(max) : -1;
	}, [outputProbs]);

	// Precompute node positions
	const hiddenYPositions = useMemo(() => {
		const positions: number[] = [];
		for (let i = 0; i < HIDDEN_NODE_COUNT; i++) {
			positions.push(getHiddenNodeY(i, HIDDEN_NODE_COUNT));
		}
		return positions;
	}, []);

	const outputYPositions = useMemo(() => {
		const positions: number[] = [];
		for (let i = 0; i < 10; i++) {
			positions.push(getOutputNodeY(i));
		}
		return positions;
	}, []);

	// Input pixel grid, top-left corner
	const gridOriginX = LAYER_X.input - GRID_TOTAL / 2;
	const gridOriginY = (SVG_HEIGHT - GRID_TOTAL) / 2;
	const gridCenterX = LAYER_X.input;
	const gridCenterY = SVG_HEIGHT / 2;

	// Input pixel data
	const inputPixels = useMemo(() => {
		if (!result) return null;
		return result.activations.input;
	}, [result]);

	return (
		<svg
			viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
			className="w-full max-w-[600px] h-auto"
			style={{ minWidth: 400 }}
		>
			{/* === Connections === */}

			{/* Input → Hidden1 */}
			{hiddenYPositions.map((hy, hi) => (
				<motion.line
					key={`conn-in-h1-${hi}`}
					x1={gridCenterX}
					y1={gridCenterY}
					x2={LAYER_X.hidden1}
					y2={hy}
					stroke="#2a2a2a"
					strokeWidth={0.5}
					animate={{
						opacity: hasResult ? 0.05 + hiddenActivations.h1[hi] * 0.3 : 0.03,
					}}
					transition={{ duration: 0.4, delay: 0 }}
				/>
			))}

			{/* Hidden1 → Hidden2 */}
			{hiddenYPositions.map((h1y, h1i) =>
				hiddenYPositions.map((h2y, h2i) => (
					<motion.line
						key={`conn-h1-h2-${h1i}-${h2i}`}
						x1={LAYER_X.hidden1}
						y1={h1y}
						x2={LAYER_X.hidden2}
						y2={h2y}
						stroke="#2a2a2a"
						strokeWidth={0.3}
						animate={{
							opacity: hasResult
								? 0.03 +
									hiddenActivations.h1[h1i] * hiddenActivations.h2[h2i] * 0.4
								: 0.03,
						}}
						transition={{ duration: 0.4, delay: 0.1 }}
					/>
				)),
			)}

			{/* Hidden2 → Hidden3 */}
			{hiddenYPositions.map((h2y, h2i) =>
				hiddenYPositions.map((h3y, h3i) => (
					<motion.line
						key={`conn-h2-h3-${h2i}-${h3i}`}
						x1={LAYER_X.hidden2}
						y1={h2y}
						x2={LAYER_X.hidden3}
						y2={h3y}
						stroke="#2a2a2a"
						strokeWidth={0.3}
						animate={{
							opacity: hasResult
								? 0.03 +
									hiddenActivations.h2[h2i] * hiddenActivations.h3[h3i] * 0.4
								: 0.03,
						}}
						transition={{ duration: 0.4, delay: 0.2 }}
					/>
				)),
			)}

			{/* Hidden3 → Output */}
			{hiddenYPositions.map((h3y, h3i) =>
				outputYPositions.map((oy, oi) => (
					<motion.line
						key={`conn-h3-out-${h3i}-${oi}`}
						x1={LAYER_X.hidden3}
						y1={h3y}
						x2={LAYER_X.output}
						y2={oy}
						stroke="#2a2a2a"
						strokeWidth={0.3}
						animate={{
							opacity: hasResult
								? 0.03 + hiddenActivations.h3[h3i] * outputProbs[oi] * 0.4
								: 0.03,
						}}
						transition={{ duration: 0.4, delay: 0.3 }}
					/>
				)),
			)}

			{/* === Input pixel grid === */}
			{Array.from({ length: GRID_SIZE }, (_, row) =>
				Array.from({ length: GRID_SIZE }, (_, col) => {
					const idx = row * GRID_SIZE + col;
					const intensity = inputPixels ? inputPixels[idx] : 0;
					const gray = Math.round(intensity * 255);
					return (
						<rect
							key={`px-${idx}`}
							x={gridOriginX + col * PIXEL_SIZE}
							y={gridOriginY + row * PIXEL_SIZE}
							width={PIXEL_SIZE}
							height={PIXEL_SIZE}
							fill={`rgb(${gray},${gray},${gray})`}
						/>
					);
				}),
			)}

			{/* === Hidden layer 1 nodes === */}
			{hiddenYPositions.map((y, i) => (
				<motion.circle
					key={`h1-${i}`}
					cx={LAYER_X.hidden1}
					cy={y}
					r={HIDDEN_RADIUS}
					animate={{ fill: hiddenColor(hiddenActivations.h1[i]) }}
					transition={{ duration: 0.3 }}
				/>
			))}

			{/* === Hidden layer 2 nodes === */}
			{hiddenYPositions.map((y, i) => (
				<motion.circle
					key={`h2-${i}`}
					cx={LAYER_X.hidden2}
					cy={y}
					r={HIDDEN_RADIUS}
					animate={{ fill: hiddenColor(hiddenActivations.h2[i]) }}
					transition={{ duration: 0.3 }}
				/>
			))}

			{/* === Hidden layer 3 nodes === */}
			{hiddenYPositions.map((y, i) => (
				<motion.circle
					key={`h3-${i}`}
					cx={LAYER_X.hidden3}
					cy={y}
					r={HIDDEN_RADIUS}
					animate={{ fill: hiddenColor(hiddenActivations.h3[i]) }}
					transition={{ duration: 0.3 }}
				/>
			))}

			{/* === Output layer nodes === */}
			{outputYPositions.map((y, i) => (
				<g key={`out-${i}`}>
					<motion.circle
						cx={LAYER_X.output}
						cy={y}
						r={OUTPUT_RADIUS}
						animate={{
							fill: outputColor(outputProbs[i]),
							stroke: i === topIndex && hasResult ? ACCENT : "none",
							strokeWidth: i === topIndex && hasResult ? 1.5 : 0,
						}}
						transition={{ duration: 0.3 }}
					/>
					<text
						x={LAYER_X.output}
						y={y}
						textAnchor="middle"
						dominantBaseline="central"
						className="text-[7px] font-mono fill-background pointer-events-none"
						style={{ userSelect: "none" }}
					>
						{i}
					</text>
				</g>
			))}

			{/* === Layer labels === */}
			{LAYER_LABELS.map((label, i) => (
				<text
					key={`label-${label}-${i}`}
					x={LAYER_LABEL_X[i]}
					y={SVG_HEIGHT - 6}
					textAnchor="middle"
					className="text-[8px] font-mono fill-muted-foreground"
				>
					{label}
				</text>
			))}
		</svg>
	);
}
