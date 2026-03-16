"use client";

import { useCallback, useState } from "react";
import type { CnnInferenceResult } from "./cnn-inference";
import { DrawingCanvas } from "./drawing-canvas";
import { FeatureMaps } from "./feature-maps";
import type { InferenceResult } from "./inference";
import { ModelComparison } from "./model-comparison";
import { NetworkVisualizer } from "./network-visualizer";

export function MnistDemo() {
	const [pixels, setPixels] = useState<Float32Array | null>(null);
	const [mlpResult, setMlpResult] = useState<InferenceResult | null>(null);
	const [cnnResult, setCnnResult] = useState<CnnInferenceResult | null>(null);

	const handleDraw = useCallback((p: Float32Array) => {
		const hasContent = p.some((v) => v > 0.01);
		setPixels(hasContent ? p : null);
	}, []);

	const handleMlpResult = useCallback((r: InferenceResult | null) => {
		setMlpResult(r);
	}, []);

	const handleCnnResult = useCallback((r: CnnInferenceResult | null) => {
		setCnnResult(r);
	}, []);

	return (
		<div className="not-prose my-8 flex flex-col gap-8">
			{/* Drawing + network visualization */}
			<div className="flex flex-col lg:flex-row gap-6 items-start">
				<div className="shrink-0">
					<DrawingCanvas onDraw={handleDraw} size={280} />
				</div>
				<div className="flex-1 min-w-0">
					<NetworkVisualizer result={mlpResult} />
				</div>
			</div>

			{/* Model comparison: MLP vs CNN side-by-side */}
			<ModelComparison
				pixels={pixels}
				onMlpResult={handleMlpResult}
				onCnnResult={handleCnnResult}
			/>

			{/* CNN feature maps */}
			<FeatureMaps result={cnnResult} />
		</div>
	);
}
