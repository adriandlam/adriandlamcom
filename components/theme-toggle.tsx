"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Separator } from "./ui/separator";

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [hoveredTab, setHoveredTab] = useState<string | null>(theme ?? null);

	const buttonClassname =
		"font-mono text-sm px-2 py-1 transition-all duration-200 ease-out hover:text-primary text-muted-foreground";

	return (
		<div className="fixed bottom-0 right-0 md:top-0 md:right-0 m-4 border md:border-none p-0.5 bg-background">
			<div className="flex items-center space-x-1">
				{["light", "dark"].map((themeName, index) => (
					<>
						{index === 1 && (
							<Separator
								orientation="vertical"
								className="h-5 mx-1 relative z-10"
							/>
						)}
						<li
							className="relative flex items-center"
							key={themeName}
							onMouseEnter={() => setHoveredTab(themeName)}
							onMouseLeave={() => setHoveredTab(theme ?? null)}
						>
							<button
								onClick={() => setTheme(themeName)}
								type="button"
								className={cn(
									buttonClassname,
									theme === themeName ? "text-primary" : "",
								)}
							>
								{themeName}
							</button>
							{hoveredTab === themeName && (
								<motion.div
									layoutId="hovered-theme"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.2 }}
									className="absolute inset-0 bg-accent -z-10"
								/>
							)}
						</li>
					</>
				))}
			</div>
		</div>
	);
}
