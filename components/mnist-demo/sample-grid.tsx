"use client";

import { useEffect, useRef, useState } from "react";

interface Sample {
	pixels: number[];
	label: number;
	cnn_pred: number;
	mlp_pred: number;
}

interface SamplesData {
	samples: Sample[];
	cnn_accuracy: number;
	mlp_accuracy: number;
}

let cachedData: SamplesData | null = null;

function SampleCanvas({ pixels }: { pixels: number[] }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const imageData = ctx.createImageData(28, 28);
		for (let i = 0; i < 784; i++) {
			const v = pixels[i];
			imageData.data[i * 4] = v;
			imageData.data[i * 4 + 1] = v;
			imageData.data[i * 4 + 2] = v;
			imageData.data[i * 4 + 3] = 255;
		}

		ctx.putImageData(imageData, 0, 0);
	}, [pixels]);

	return (
		<canvas
			ref={canvasRef}
			width={28}
			height={28}
			className="rounded-sm"
			style={{
				width: 56,
				height: 56,
				imageRendering: "pixelated",
			}}
		/>
	);
}

export function SampleGrid() {
	const [data, setData] = useState<SamplesData | null>(cachedData);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (cachedData) return;

		let cancelled = false;

		async function load() {
			try {
				const res = await fetch("/models/mnist-samples.json");
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				const json: SamplesData = await res.json();
				cachedData = json;
				if (!cancelled) setData(json);
			} catch (err) {
				if (!cancelled)
					setError(
						err instanceof Error ? err.message : "Failed to load samples",
					);
			}
		}

		load();
		return () => {
			cancelled = true;
		};
	}, []);

	if (error) {
		return <p className="text-xs text-vesper-red font-mono">Error: {error}</p>;
	}

	if (!data) {
		return (
			<p className="text-xs text-muted-foreground font-mono">
				Loading samples…
			</p>
		);
	}

	const { samples, cnn_accuracy, mlp_accuracy } = data;

	return (
		<div className="not-prose flex flex-col gap-3">
			<p className="text-xs font-mono text-muted-foreground">
				{samples.length} test samples — MLP: {mlp_accuracy}% | CNN:{" "}
				{cnn_accuracy}%
			</p>

			<div className="flex flex-wrap gap-3">
				{samples.map((sample, i) => {
					const mlpCorrect = sample.mlp_pred === sample.label;
					const cnnCorrect = sample.cnn_pred === sample.label;
					const disagree = sample.mlp_pred !== sample.cnn_pred;

					return (
						<div
							key={i}
							className={`bg-secondary rounded-lg p-2 flex flex-col gap-1 items-center ${
								disagree ? "ring-1 ring-accent-foreground/30" : ""
							}`}
						>
							<SampleCanvas pixels={sample.pixels} />
							<span className="text-[10px] font-mono text-muted-foreground">
								Label: {sample.label}
							</span>
							<span
								className={`text-[10px] font-mono ${
									mlpCorrect ? "text-accent-interactive" : "text-vesper-red"
								}`}
							>
								MLP: {sample.mlp_pred}
							</span>
							<span
								className={`text-[10px] font-mono ${
									cnnCorrect ? "text-accent-interactive" : "text-vesper-red"
								}`}
							>
								CNN: {sample.cnn_pred}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
