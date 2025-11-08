"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
	return (
        <div className="fixed top-0 right-0 m-4">
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} type="button" className="font-mono text-sm px-2 py-1 transition-all duration-200 ease-out hover:text-primary hover:bg-secondary/50">
                {theme === "dark" ? "light" : "dark"}
            </button>
        </div>
	);
}