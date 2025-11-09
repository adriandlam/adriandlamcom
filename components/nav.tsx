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

// export default function Nav() {
// 	const pathname = usePathname();
// 	const [activeTab, setActiveTab] = useState("");
// 	const [hydrated, setHydrated] = useState(false);
// 	const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
// 	const [hoverStyle, setHoverStyle] = useState({ left: 0, width: 0 });
// 	const tabRefs = useRef<(HTMLElement | null)[]>([]);

// 	useEffect(() => {
// 		preload("/api/photos", fetcher);

// 		setHydrated(true);
// 	}, []);

// 	useEffect(() => {
// 		const tab = tabs.find((tab) => pathname.includes(tab.name));
// 		if (tab) setActiveTab(tab.name);
// 	}, [pathname]);

// 	useEffect(() => {
// 		const activeIndex = tabs.findIndex((tab) => tab.name === activeTab);
// 		const activeTabElement = tabRefs.current[activeIndex];

// 		if (activeTabElement) {
// 			const { offsetLeft, offsetWidth } = activeTabElement;
// 			setIndicatorStyle({
// 				left: offsetLeft,
// 				width: offsetWidth,
// 			});
// 			setHoverStyle({
// 				left: offsetLeft,
// 				width: offsetWidth,
// 			});
// 		}
// 	}, [activeTab, hydrated]);

// 	return (
// 		<>
// 			{hydrated && (
// 				<nav className="fixed left-0 bottom-3 px-4 w-full flex justify-center z-10">
// 					<TooltipProvider>
// 						<div className="p-0.5 bg-background/75 shadow-xl rounded-lg border h-full flex justify-center max-w-xl backdrop-blur-sm">
// 							<div
// 								className="relative"
// 								onMouseLeave={() => {
// 									setHoverStyle({
// 										left: indicatorStyle.left,
// 										width: indicatorStyle.width,
// 									});
// 								}}
// 							>
// 								{/* Hover indicator */}
// 								<div
// 									className="absolute top-0 rounded-md bg-input/5 transition-all duration-150 ease-out z-0 border"
// 									style={{
// 										left: hoverStyle.left,
// 										width: hoverStyle.width,
// 										height: 36,
// 										opacity:
// 											hoverStyle.left !== indicatorStyle.left ||
// 											hoverStyle.width !== indicatorStyle.width
// 												? 1
// 												: 0,
// 									}}
// 								/>
// 								{/* Active indicator */}
// 								<div
// 									className="absolute top-0 rounded-md bg-input/50 border transition-all duration-200 ease-out z-0"
// 									style={{
// 										left: indicatorStyle.left,
// 										width: indicatorStyle.width,
// 										height: 36,
// 									}}
// 								/>
// 								<ul className="flex items-center gap-0.5 relative z-10">
// 									{tabs.map((tab, index) => (
// 										<li key={tab.name}>
// 											<Tooltip delayDuration={500}>
// 												<TooltipTrigger asChild>
// 													<Button
// 														size="icon"
// 														variant="ghost"
// 														asChild
// 														className="h-9 w-9"
// 														ref={(el) => {
// 															tabRefs.current[index] = el;
// 														}}
// 														onMouseEnter={() => {
// 															setHoverStyle({
// 																left: tabRefs.current[index]?.offsetLeft ?? 0,
// 																width: tabRefs.current[index]?.offsetWidth ?? 0,
// 															});
// 														}}
// 													>
// 														<Link
// 															href={tab.href}
// 															className={cn(
// 																"text-foreground transition-opacity duration-200",
// 																activeTab === tab.name
// 																	? "text-primary opacity-100"
// 																	: "opacity-35 hover:opacity-75",
// 															)}
// 														>
// 															{tab.icon}
// 														</Link>
// 													</Button>
// 												</TooltipTrigger>
// 												<TooltipContent className="bg-background text-foreground">
// 													<p>
// 														{tab.name.charAt(0).toUpperCase() +
// 															tab.name.slice(1)}
// 													</p>
// 												</TooltipContent>
// 											</Tooltip>
// 										</li>
// 									))}
// 									<Separator
// 										orientation="vertical"
// 										className="min-h-4! mx-0.5"
// 									/>
// 									<li>
// 										<Tooltip delayDuration={500}>
// 											<TooltipTrigger asChild>
// 												<Button
// 													size="icon"
// 													variant="ghost"
// 													asChild
// 													className="text-muted-foreground opacity-75 hover:opacity-100 h-9 w-9"
// 												>
// 													<Link href="mailto:me@adriandlam.com">
// 														<Mail />
// 													</Link>
// 												</Button>
// 											</TooltipTrigger>
// 											<TooltipContent className="bg-background text-foreground">
// 												<p>Email</p>
// 											</TooltipContent>
// 										</Tooltip>
// 									</li>
// 									{/* <li>
// 						<Button
// 							size="icon"
// 							variant="ghost"
// 							asChild
// 							className="text-muted-foreground"
// 						>
// 							<Link href="https://x.com/adrianlam_dev" target="_blank">
// 								<XIcon />
// 							</Link>
// 						</Button>
// 					</li> */}
// 									<li>
// 										<Tooltip delayDuration={500}>
// 											<TooltipTrigger asChild>
// 												<Button
// 													size="icon"
// 													variant="ghost"
// 													asChild
// 													className="text-muted-foreground opacity-75 hover:opacity-100 h-9 w-9"
// 												>
// 													<Link
// 														href="https://www.github.com/adriandlam"
// 														target="_blank"
// 													>
// 														<svg
// 															viewBox="0 0 24 24"
// 															xmlns="http://www.w3.org/2000/svg"
// 															className="w-6 h-6"
// 															fill="currentColor"
// 														>
// 															<title>GitHub</title>
// 															<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
// 														</svg>
// 													</Link>
// 												</Button>
// 											</TooltipTrigger>
// 											<TooltipContent className="bg-background text-foreground">
// 												<p>GitHub</p>
// 											</TooltipContent>
// 										</Tooltip>
// 									</li>
// 								</ul>
// 							</div>
// 						</div>
// 					</TooltipProvider>
// 				</nav>
// 			)}
// 		</>
// 	);
// }

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

	useEffect(() => {
		preload("/api/photos", fetcher);
	}, []);

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
		"line-clamp-1 font-mono text-[15px] px-2 py-1 transition-all duration-200 ease-out hover:text-primary hover:bg-secondary/50";

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
								className="inline-flex items-center gap-1 w-full"
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
								<Link href={child.href} className="block">
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
										className="flex items-center justify-between w-full"
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
								className="flex items-center justify-between w-full"
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
