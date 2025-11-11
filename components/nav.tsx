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
		<nav>
			<div className="block lg:hidden pt-4">
				<ul className="flex items-center gap-1">
					{tabs.map((tab) => {
						const isActive =
							pathname === tab.href || pathname.startsWith(tab.href + "/");
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
								<Link href={tab.href} className="block py-1 px-4">
									{tab.name}
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
			<div className="fixed right-0 left-0 m-8 z-10 w-32 hidden lg:inline lg:w-48 overflow-hidden">
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
									(t) =>
										pathname === t.href || pathname.startsWith(t.href + "/"),
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
									<span className="flex gap-0.5">
										github
										<svg
											className="mt-1 size-3"
											viewBox="0 0 12 12"
											fill="currentColor"
											xmlns="http://www.w3.org/2000/svg"
										>
											<title>External link</title>
											<path
												d="M3.5 3C3.22386 3 3 3.22386 3 3.5C3 3.77614 3.22386 4 3.5 4V3ZM8.5 3.5H9C9 3.22386 8.77614 3 8.5 3V3.5ZM8 8.5C8 8.77614 8.22386 9 8.5 9C8.77614 9 9 8.77614 9 8.5H8ZM2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L2.64645 8.64645ZM3.5 4H8.5V3H3.5V4ZM8 3.5V8.5H9V3.5H8ZM8.14645 3.14645L2.64645 8.64645L3.35355 9.35355L8.85355 3.85355L8.14645 3.14645Z"
												fill="var(--grey1)"
											></path>
										</svg>
									</span>
									<Kbd>g</Kbd>
								</Link>
							</li>
						</motion.ul>
					)}
				</AnimatePresence>
			</div>
		</nav>
	);
}
