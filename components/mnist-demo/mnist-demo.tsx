"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DrawingCanvas } from "./drawing-canvas";
import {
	forward,
	loadWeights,
	type InferenceResult,
	type ModelWeights,
} from "./inference";
import { NetworkVisualizer } from "./network-visualizer";
import { PredictionBars } from "./prediction-bars";

export function MnistDemo() {
	const [result, setResult] = useState<InferenceResult | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const weightsRef = useRef<ModelWeights | null>(null);

	useEffect(() => {
		setLoading(true);
		loadWeights()
			.then((w) => {
				weightsRef.current = w;
				setLoading(false);
			})
			.catch((err) => {
				setError("Failed to load model weights.");
				setLoading(false);
				console.error(err);
			});
	}, []);

	const handleDraw = useCallback((pixels: Float32Array) => {
		const weights = weightsRef.current;
		if (!weights) return;

		const hasContent = pixels.some((v) => v > 0.01);
		if (!hasContent) {
			setResult(null);
			return;
		}

		const inferenceResult = forward(pixels, weights);
		setResult(inferenceResult);
	}, []);

	if (error) {
		return (
			<div className="text-vesper-red text-sm font-mono py-4">{error}</div>
		);
	}

	return (
		<div className="not-prose my-8">
			<div className="flex flex-col lg:flex-row gap-6 items-start">
				<div className="shrink-0">
					<DrawingCanvas onDraw={handleDraw} size={280} />
					{loading && (
						<p className="text-xs font-mono text-muted-foreground mt-2 text-center">
							Loading model...
						</p>
					)}
				</div>

				<div className="flex-1 flex flex-col gap-4 min-w-0">
					<NetworkVisualizer result={result} />
					<PredictionBars probabilities={result?.probabilities ?? null} />
				</div>
			</div>
		</div>
	);
}
