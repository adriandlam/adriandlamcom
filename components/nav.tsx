"use client";

import { ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { preload } from "swr";
import { BLOG_POSTS } from "@/data/blog-posts";
import RESUME from "@/data/resume";
import { cn, fetcher } from "@/lib/utils";
import { Kbd } from "./ui/kbd";
import { Separator } from "./ui/separator";

interface Tab {
	name: string;
	href: string;
	children?: Tab[];
}

const tabs: Tab[] = [
	{ name: "home", href: "/" },
	{
		name: "blog",
		href: "/blog",
		children: [
			...BLOG_POSTS.map((post) => ({
				name: post.title,
				href: `/blog/${post.slug}`,
			})),
		],
	},
	{
		name: "projects",
		href: "/projects",
		children: [
			...RESUME.projects.map((project) => ({
				name: project.name,
				href: `/projects/${project.slug}`,
			})),
		],
	},
	{ name: "photos", href: "/photos" },
];

export default function Nav() {
	const router = useRouter();
	const pathname = usePathname();

	// Calculate activeParentTab immediately during render to avoid flash
	let activeParentTab: Tab | null = null;
	for (const tab of tabs) {
		if (tab.children) {
			const isOnChildPage = tab.children.some(
				(child) => pathname === child.href,
			);
			if (isOnChildPage) {
				activeParentTab = tab;
				break;
			}
		}
	}

	// j/k navigation through tabs
	useHotkeys("j", () => {
		// Find current tab index
		const currentIndex = tabs.findIndex(
			(tab) => pathname === tab.href || pathname.startsWith(tab.href + "/"),
		);
		// Go to next tab, stop at the end
		if (currentIndex >= 0 && currentIndex < tabs.length - 1) {
			router.push(tabs[currentIndex + 1].href);
		}
	});

	useHotkeys("k", () => {
		// Find current tab index
		const currentIndex = tabs.findIndex(
			(tab) => pathname === tab.href || pathname.startsWith(tab.href + "/"),
		);
		// Go to previous tab, stop at the beginning
		if (currentIndex > 0) {
			router.push(tabs[currentIndex - 1].href);
		}
	});

	useHotkeys("g", () => {
		window.open("https://github.com/adriandlam", "_blank");
	});

	const tabClassname =
		"line-clamp-1 font-mono text-[15px] transition-all duration-200 ease-out hover:text-primary hover:bg-secondary/50";

	return (
		<nav className="fixed right-0 left-0 m-8 inline z-10 w-48 overflow-hidden">
			<AnimatePresence mode="popLayout" initial={false}>
				{activeParentTab ? (
					<motion.ul
						key="children-tabs"
						className="space-y-0.5"
						initial={{ opacity: 0, translateX: 20 }}
						animate={{ opacity: 1, translateX: 0 }}
						exit={{ opacity: 0, translateX: 20 }}
						transition={{ duration: 0.15, ease: "easeOut" }}
					>
						<li className={cn(tabClassname, "text-muted-foreground")}>
							<Link
								href={activeParentTab.href}
								className="inline-flex items-center gap-1 w-full py-1 px-2"
							>
								<ChevronLeft className="size-4" />
								back to {activeParentTab.name}
							</Link>
						</li>
						<Separator className="mx-0.5 my-1.5" />
						{activeParentTab.children?.map((child) => (
							<li
								key={child.name}
								className={cn(
									tabClassname,
									pathname === child.href
										? "text-primary bg-secondary"
										: "text-muted-foreground",
								)}
							>
								<Link href={child.href} className="block py-1 px-2">
									{child.name}
								</Link>
							</li>
						))}
					</motion.ul>
				) : (
					<motion.ul
						key="parent-tabs"
						className="space-y-0.5"
						initial={{ opacity: 0, translateX: -20 }}
						animate={{ opacity: 1, translateX: 0 }}
						exit={{ opacity: 0, translateX: -20 }}
						transition={{ duration: 0.15, ease: "easeOut" }}
					>
						{tabs.map((tab, index) => {
							const isActive =
								pathname === tab.href || pathname.startsWith(tab.href + "/");
							const activeIndex = tabs.findIndex(
								(t) => pathname === t.href || pathname.startsWith(t.href + "/"),
							);

							// Show 'k' on item above active, 'j' on item below active
							let shortcut: string | undefined;
							if (activeIndex >= 0) {
								if (index === activeIndex - 1) shortcut = "k";
								else if (index === activeIndex + 1) shortcut = "j";
							}

							return (
								<li
									key={tab.name}
									className={cn(
										tabClassname,
										isActive
											? "text-primary bg-secondary"
											: "text-muted-foreground",
									)}
								>
									<Link
										href={tab.href}
										className="flex items-center justify-between w-full py-1 px-2"
									>
										{tab.name}
										{shortcut && <Kbd>{shortcut}</Kbd>}
									</Link>
								</li>
							);
						})}
						<Separator className="mx-0.5 my-1.5" />
						<li className={cn(tabClassname, "text-muted-foreground w-full")}>
							<Link
								href="https://github.com/adriandlam"
								target="_blank"
								className="flex items-center justify-between w-full py-1 px-2"
							>
								github
								<Kbd>g</Kbd>
							</Link>
						</li>
					</motion.ul>
				)}
			</AnimatePresence>
		</nav>
	);
}
