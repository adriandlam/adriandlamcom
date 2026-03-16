"use client";

import { Fragment, useEffect, useState } from "react";

interface ConfusionData {
	cnn: {
		matrix: number[][];
		accuracy: number;
	};
	mlp: {
		matrix: number[][];
		accuracy: number;
	};
}

let cachedData: ConfusionData | null = null;

function cellStyle(
	value: number,
	maxVal: number,
	isDiagonal: boolean,
): React.CSSProperties {
	if (value === 0) return {};

	const normalized = value / maxVal;

	if (isDiagonal) {
		return {
			backgroundColor: `rgba(153, 255, 228, ${normalized})`,
			color: normalized > 0.5 ? "#000" : "var(--color-muted-foreground)",
		};
	}

	return {
		backgroundColor: `rgba(255, 128, 128, ${normalized * 0.8})`,
		color: normalized > 0.3 ? "#000" : "var(--color-muted-foreground)",
	};
}

export function ConfusionMatrix() {
	const [data, setData] = useState<ConfusionData | null>(cachedData);
	const [error, setError] = useState<string | null>(null);
	const [model, setModel] = useState<"cnn" | "mlp">("cnn");

	useEffect(() => {
		if (cachedData) return;

		let cancelled = false;

		async function load() {
			try {
				const res = await fetch("/models/mnist-confusion.json");
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				const json: ConfusionData = await res.json();
				cachedData = json;
				if (!cancelled) setData(json);
			} catch (err) {
				if (!cancelled)
					setError(err instanceof Error ? err.message : "Failed to load data");
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
				Loading confusion matrix…
			</p>
		);
	}

	const current = data[model];
	const matrix = current.matrix;

	// Find max value for normalization
	const maxVal = Math.max(...matrix.flat());

	const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

	return (
		<div className="not-prose flex flex-col gap-3">
			{/* Model toggle */}
			<div className="flex gap-4">
				<button
					onClick={() => setModel("cnn")}
					className={`text-xs font-mono pb-0.5 transition-colors ${
						model === "cnn"
							? "text-foreground border-b border-accent-interactive"
							: "text-muted-foreground hover:text-foreground"
					}`}
				>
					CNN
				</button>
				<button
					onClick={() => setModel("mlp")}
					className={`text-xs font-mono pb-0.5 transition-colors ${
						model === "mlp"
							? "text-foreground border-b border-accent-interactive"
							: "text-muted-foreground hover:text-foreground"
					}`}
				>
					MLP
				</button>
			</div>

			{/* Matrix */}
			<div className="flex flex-col gap-1">
				<span className="text-[10px] font-mono text-muted-foreground text-center pl-7">
					Predicted
				</span>

				<div className="flex gap-1">
					<div className="flex items-center">
						<span
							className="text-[10px] font-mono text-muted-foreground"
							style={{
								writingMode: "vertical-rl",
								transform: "rotate(180deg)",
							}}
						>
							True
						</span>
					</div>

					<div
						className="grid gap-px"
						style={{
							gridTemplateColumns: `auto repeat(10, 28px)`,
							gridTemplateRows: `auto repeat(10, 28px)`,
						}}
					>
						{/* Empty top-left corner */}
						<div />

						{/* Column headers */}
						{digits.map((d) => (
							<div
								key={`col-${d}`}
								className="flex items-center justify-center text-xs font-mono text-muted-foreground"
							>
								{d}
							</div>
						))}

						{/* Rows */}
						{digits.map((row) => (
							<Fragment key={`row-${row}`}>
								{/* Row header */}
								<div className="flex items-center justify-center text-xs font-mono text-muted-foreground pr-1">
									{row}
								</div>

								{/* Cells */}
								{digits.map((col) => {
									const value = matrix[row][col];
									const isDiagonal = row === col;

									return (
										<div
											key={`${row}-${col}`}
											className="flex items-center justify-center rounded-[2px]"
											style={cellStyle(value, maxVal, isDiagonal)}
											title={`True: ${row}, Predicted: ${col}, Count: ${value}`}
										>
											{value > 0 && (
												<span className="text-[9px] font-mono">{value}</span>
											)}
										</div>
									);
								})}
							</Fragment>
						))}
					</div>
				</div>
			</div>

			{/* Accuracy */}
			<p className="text-xs font-mono text-muted-foreground">
				Accuracy:{" "}
				<span className="text-accent-interactive">{current.accuracy}%</span>
			</p>
		</div>
	);
}
