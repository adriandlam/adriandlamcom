"use client";

import { useCallback, useEffect, useRef } from "react";

interface DrawingCanvasProps {
	onDraw: (pixels: Float32Array) => void;
	size?: number;
}

export function DrawingCanvas({ onDraw, size = 280 }: DrawingCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const isDrawingRef = useRef(false);
	const lastPosRef = useRef<{ x: number; y: number } | null>(null);

	const downsampleAndNotify = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const offscreen = document.createElement("canvas");
		offscreen.width = 28;
		offscreen.height = 28;
		const offCtx = offscreen.getContext("2d");
		if (!offCtx) return;

		offCtx.drawImage(canvas, 0, 0, 28, 28);
		const imageData = offCtx.getImageData(0, 0, 28, 28);
		const pixels = new Float32Array(784);
		for (let i = 0; i < 784; i++) {
			pixels[i] = imageData.data[i * 4] / 255;
		}
		onDraw(pixels);
	}, [onDraw]);

	const getCanvasCoords = useCallback(
		(
			canvas: HTMLCanvasElement,
			clientX: number,
			clientY: number,
		): { x: number; y: number } => {
			const rect = canvas.getBoundingClientRect();
			const scaleX = canvas.width / rect.width;
			const scaleY = canvas.height / rect.height;
			return {
				x: (clientX - rect.left) * scaleX,
				y: (clientY - rect.top) * scaleY,
			};
		},
		[],
	);

	const drawDot = useCallback(
		(ctx: CanvasRenderingContext2D, x: number, y: number) => {
			ctx.beginPath();
			ctx.arc(x, y, 10, 0, Math.PI * 2);
			ctx.fill();
		},
		[],
	);

	const drawLine = useCallback(
		(
			ctx: CanvasRenderingContext2D,
			fromX: number,
			fromY: number,
			toX: number,
			toY: number,
		) => {
			ctx.beginPath();
			ctx.moveTo(fromX, fromY);
			ctx.lineTo(toX, toY);
			ctx.stroke();
		},
		[],
	);

	const clearCanvas = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		onDraw(new Float32Array(784));
	}, [onDraw]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Initialize canvas: black background
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Set up drawing style
		ctx.strokeStyle = "#ffffff";
		ctx.fillStyle = "#ffffff";
		ctx.lineWidth = 20;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";

		const startDrawing = (x: number, y: number) => {
			isDrawingRef.current = true;
			lastPosRef.current = { x, y };
			drawDot(ctx, x, y);
			downsampleAndNotify();
		};

		const continueDrawing = (x: number, y: number) => {
			if (!isDrawingRef.current || !lastPosRef.current) return;
			drawLine(ctx, lastPosRef.current.x, lastPosRef.current.y, x, y);
			lastPosRef.current = { x, y };
			downsampleAndNotify();
		};

		const stopDrawing = () => {
			isDrawingRef.current = false;
			lastPosRef.current = null;
		};

		// Mouse events
		const onMouseDown = (e: MouseEvent) => {
			const { x, y } = getCanvasCoords(canvas, e.clientX, e.clientY);
			startDrawing(x, y);
		};

		const onMouseMove = (e: MouseEvent) => {
			const { x, y } = getCanvasCoords(canvas, e.clientX, e.clientY);
			continueDrawing(x, y);
		};

		const onMouseUp = () => stopDrawing();
		const onMouseLeave = () => stopDrawing();

		// Touch events
		const onTouchStart = (e: TouchEvent) => {
			e.preventDefault();
			const touch = e.touches[0];
			const { x, y } = getCanvasCoords(canvas, touch.clientX, touch.clientY);
			startDrawing(x, y);
		};

		const onTouchMove = (e: TouchEvent) => {
			e.preventDefault();
			const touch = e.touches[0];
			const { x, y } = getCanvasCoords(canvas, touch.clientX, touch.clientY);
			continueDrawing(x, y);
		};

		const onTouchEnd = () => stopDrawing();

		canvas.addEventListener("mousedown", onMouseDown);
		canvas.addEventListener("mousemove", onMouseMove);
		canvas.addEventListener("mouseup", onMouseUp);
		canvas.addEventListener("mouseleave", onMouseLeave);
		canvas.addEventListener("touchstart", onTouchStart, { passive: false });
		canvas.addEventListener("touchmove", onTouchMove, { passive: false });
		canvas.addEventListener("touchend", onTouchEnd);

		return () => {
			canvas.removeEventListener("mousedown", onMouseDown);
			canvas.removeEventListener("mousemove", onMouseMove);
			canvas.removeEventListener("mouseup", onMouseUp);
			canvas.removeEventListener("mouseleave", onMouseLeave);
			canvas.removeEventListener("touchstart", onTouchStart);
			canvas.removeEventListener("touchmove", onTouchMove);
			canvas.removeEventListener("touchend", onTouchEnd);
		};
	}, [getCanvasCoords, drawDot, drawLine, downsampleAndNotify]);

	return (
		<div className="flex flex-col items-center gap-2">
			<canvas
				ref={canvasRef}
				width={size}
				height={size}
				className="cursor-crosshair touch-none rounded-lg border border-border"
			/>
			<button
				type="button"
				onClick={clearCanvas}
				className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
			>
				clear
			</button>
		</div>
	);
}
