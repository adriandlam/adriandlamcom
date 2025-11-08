import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Nav from "@/components/nav";
import { ThemeProvider } from "@/components/theme-provider";
import RESUME from "@/data/resume";
import { Analytics } from "@vercel/analytics/next";
import Sidebar from "@/components/sidebar";
import ThemeToggle from "@/components/theme-toggle";

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
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					disableTransitionOnChange
				>
					<Nav />
					<ThemeToggle />
					<div className="max-w-screen-md mx-auto pt-10 md:pt-16">
						{/* <div className="max-w-screen-md mx-auto pt-10 md:pt-20 px-4 sm:px-6 lg:px-8 border-x border-dashed"> */}
						{children}
						<Footer />
					</div>
				</ThemeProvider>
				<Analytics />
			</body>
		</html>
	);
}
