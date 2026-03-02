import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/footer";
import Nav from "@/components/nav";
import RESUME from "@/data/resume";

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
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
			<body className="antialiased">
				<div className="px-4 py-2.5 border relative">
					<p className="text-center text-accent-foreground text-sm font-mono">
						The projects page is a work in progress.
					</p>
				</div>
				<div className="max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto px-4">
					<Nav />
					<div className="pt-12 md:pt-18 lg:pt-20">{children}</div>
					<Footer />
				</div>
				<Analytics />
			</body>
		</html>
	);
}
