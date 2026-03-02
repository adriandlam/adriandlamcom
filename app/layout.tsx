import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/footer";
import Nav from "@/components/nav";
import RESUME from "@/data/resume";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ViewTransitions } from "next-view-transitions";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: `${RESUME.name}`,
	description: `${RESUME.bio.intro}`,
	alternates: {
		types: {
			"application/rss+xml": "/feed",
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ViewTransitions>
			<html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
				<body className="antialiased">
					<div className="max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto px-4">
						<Nav />
						<div
							className="pt-12 md:pt-18 lg:pt-20"
							style={{ viewTransitionName: "page-content" }}
						>
							{children}
						</div>
						<Footer />
					</div>
					<Analytics />
					<SpeedInsights />
				</body>
			</html>
		</ViewTransitions>
	);
}
