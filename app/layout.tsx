import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ViewTransitions } from "next-view-transitions";
import Footer from "@/components/footer";
import Nav from "@/components/nav";
import { getBlogPostsForNav } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";
import { getProjectsForNav } from "@/lib/projects";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: "Adrian Lam",
		template: "%s | Adrian Lam",
	},
	description:
		"Software engineer, math student at UBC, and incoming intern at Cloudflare. Building things on the web.",
	alternates: {
		types: {
			"application/rss+xml": "/feed",
		},
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const blogPosts = await getBlogPostsForNav();
	const projects = await getProjectsForNav();

	return (
		<ViewTransitions>
			<html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
				<body className="antialiased">
					<div className="max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto px-4">
						<Nav blogPosts={blogPosts} projects={projects} />
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
