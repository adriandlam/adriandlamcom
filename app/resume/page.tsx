"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	ArrowLeft,
	ArrowRight,
	DownloadIcon,
	ZoomInIcon,
	ZoomOutIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function ResumePage() {
	const [numPages, setNumPages] = useState<number>(0);
	const [loading, setLoading] = useState(true);
	const [scale, setScale] = useState(1.0);
	const [windowWidth, setWindowWidth] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Get window width for responsive sizing
		if (typeof window !== "undefined") {
			setWindowWidth(window.innerWidth);

			const handleResize = () => {
				setWindowWidth(window.innerWidth);
			};

			window.addEventListener("resize", handleResize);
			return () => window.removeEventListener("resize", handleResize);
		}
	}, []);

	function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
		console.log("PDF loaded successfully with", numPages, "pages");
		setNumPages(numPages);
		setLoading(false);
		setError(null);
	}

	function onDocumentLoadError(error: Error) {
		console.error("PDF failed to load:", error);
		setLoading(false);
		setError(`Error loading PDF: ${error.message}`);
	}

	// Zoom functions
	const zoomIn = () => {
		if (scale < 2.0) setScale(scale + 0.1);
	};

	const zoomOut = () => {
		if (scale > 0.5) setScale(scale - 0.1);
	};

	// Calculate responsive width
	const getPageWidth = () => {
		if (!windowWidth) return 800;
		if (windowWidth < 640) return windowWidth - 40; // Small screens
		if (windowWidth < 1024) return 600; // Medium screens
		return 650; // Large screens
	};

	return (
		<main className="max-w-2xl mx-auto px-4">
			<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
				<div>
					<h1 className="text-3xl font-semibold tracking-tight">Resume</h1>
					<p className="font-mono mt-2 text-muted-foreground">
						A little bit into my professional life
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Link href="/adrian_lam_resume.pdf" target="_blank" download>
						<Button variant="default" className="bg-cyan-500 hover:bg-cyan-600">
							<DownloadIcon size={16} className="mr-2" />
							Download PDF
						</Button>
					</Link>
					<Button
						variant="outline"
						onClick={zoomOut}
						size="icon"
						disabled={loading}
					>
						<ZoomOutIcon size={16} />
					</Button>
					<Button
						variant="outline"
						onClick={zoomIn}
						size="icon"
						disabled={loading}
					>
						<ZoomInIcon size={16} />
					</Button>
				</div>
			</div>

			{error && (
				<Alert variant="destructive">
					<AlertTitle>
						<p>Error loading PDF</p>
					</AlertTitle>
					<AlertDescription>
						If you're having trouble viewing the PDF, you can download it
						directly using the button above.
					</AlertDescription>
				</Alert>
			)}

			<div className="pt-4 md:pt-8 flex flex-col items-center overflow-auto">
				{loading && <Skeleton className="h-[50dvh] w-full" />}

				{/* PDF Document */}
				<div className="flex justify-center">
					<Document
						file="/adrian_lam_resume.pdf"
						onLoadSuccess={onDocumentLoadSuccess}
						onLoadError={onDocumentLoadError}
						loading={null}
						error={null}
					>
						{numPages && numPages > 0 && (
							<Page
								pageNumber={1}
								scale={scale}
								width={getPageWidth()}
								renderTextLayer={false}
								renderAnnotationLayer={false}
							/>
						)}
					</Document>
				</div>
			</div>

			{/* Fallback for browsers or cases where the PDF viewer doesn't work */}
			{error && (
				<div className="mt-8 p-4 border rounded text-center">
					<p className="mb-4">
						If you continue having trouble with the PDF viewer, you can use this
						direct link:
					</p>
					<Link href="/adrian_lam_resume.pdf" target="_blank">
						<Button variant="secondary">Open PDF in New Tab</Button>
					</Link>
				</div>
			)}
		</main>
	);
}
