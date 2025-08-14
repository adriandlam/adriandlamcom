import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Nav from "@/components/nav";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Adrian Lam | Mathematics Student & Developer",
	description:
		"Portfolio of Adrian Lam, Mathematics student at UBC and software developer passionate about building meaningful projects.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
			<Script
				defer
				src="https://cloud.umami.is/script.js"
				data-website-id="5457805a-0169-41e3-b6ce-6ca2025c6dac"
			/>
			<body className="antialiased">
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					forcedTheme="dark"
					disableTransitionOnChange
				>
					<div className="max-w-screen-md mx-auto pt-10 md:pt-20 border-x border-dashed">
						{/* <div className="max-w-screen-md mx-auto pt-10 md:pt-20 px-4 sm:px-6 lg:px-8 border-x border-dashed"> */}
						<Nav />
						{children}
						<Footer />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
