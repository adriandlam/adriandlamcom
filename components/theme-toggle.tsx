"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	// Only render after mounting to avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	const buttonClassname =
		"font-mono text-sm px-2 py-1 transition-all duration-200 ease-out hover:text-primary hover:bg-secondary/50 text-muted-foreground";

	return (
		<div className="fixed bottom-0 right-0 md:top-0 md:right-0 m-4 border md:border-none p-0.5 bg-background">
			<div className="flex items-center space-x-0.5">
				<button
					onClick={() => setTheme("light")}
					type="button"
					className={cn(
						buttonClassname,
						mounted && theme === "light" && "text-primary bg-secondary",
					)}
				>
					light
				</button>
				<span className="text-muted-foreground hidden md:inline"> / </span>
				<button
					onClick={() => setTheme("dark")}
					type="button"
					className={cn(
						buttonClassname,
						mounted && theme === "dark" && "text-primary bg-secondary",
					)}
				>
					dark
				</button>
			</div>
		</div>
	);
}
