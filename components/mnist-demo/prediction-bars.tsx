"use client";

import { motion } from "motion/react";

interface PredictionBarsProps {
	probabilities: Float32Array | null;
}

export function PredictionBars({ probabilities }: PredictionBarsProps) {
	const probs = probabilities
		? Array.from(probabilities)
		: (Array(10).fill(0) as number[]);

	const maxProb = Math.max(...probs);
	const topIndex = maxProb > 0.05 ? probs.indexOf(maxProb) : -1;

	return (
		<div className="flex flex-col gap-2">
			<span className="text-xs font-mono text-accent-foreground">
				Predictions
			</span>
			{probs.map((prob, digit) => {
				const isTop = digit === topIndex;
				const hasInput = topIndex !== -1;
				const barColor = isTop
					? "var(--color-accent-interactive)"
					: "var(--color-muted-foreground)";
				const opacity = hasInput ? (isTop ? 1 : 0.3) : 0.3;

				return (
					<div key={digit} className="flex items-center gap-2">
						<span
							className="w-3 text-xs font-mono text-muted-foreground text-right"
							style={{ opacity: hasInput ? (isTop ? 1 : 0.5) : 1 }}
						>
							{digit}
						</span>
						<div className="flex-1 h-1 rounded bg-secondary overflow-hidden">
							<motion.div
								className="h-full rounded-sm"
								style={{
									backgroundColor: barColor,
									opacity,
								}}
								animate={{ width: `${prob * 100}%` }}
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 30,
								}}
							/>
						</div>
						<span
							className="w-12 text-right text-xs font-mono text-muted-foreground"
							style={{ opacity: hasInput ? (isTop ? 1 : 0.5) : 1 }}
						>
							{(prob * 100).toFixed(1)}%
						</span>
					</div>
				);
			})}
		</div>
	);
}
