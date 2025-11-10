"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	const buttonClassname =
		"font-mono text-sm px-2 py-1 transition-all duration-200 ease-out hover:text-primary hover:bg-secondary/50 text-muted-foreground";

	return (
		<div className="fixed top-0 right-0 m-4">
			<div className="flex items-center space-x-0.5 mt-0.5">
				<button
					onClick={() => setTheme("light")}
					type="button"
					className={cn(
						buttonClassname,
						theme === "light" && "text-primary bg-secondary",
					)}
				>
					light
				</button>
				<span className="text-muted-foreground"> / </span>
				<button
					onClick={() => setTheme("dark")}
					type="button"
					className={cn(
						buttonClassname,
						theme === "dark" && "text-primary bg-secondary",
					)}
				>
					dark
				</button>
			</div>
		</div>
	);
}
