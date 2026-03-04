"use client";

import {
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	useCallback,
} from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/toc";

export function TableOfContents({ items }: { items: TocItem[] }) {
	const [activeId, setActiveId] = useState<string>("");
	const observerRef = useRef<IntersectionObserver | null>(null);
	const listRef = useRef<HTMLUListElement>(null);
	const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
	const [indicatorStyle, setIndicatorStyle] = useState<{
		top: number;
		height: number;
	} | null>(null);

	const setItemRef = useCallback(
		(id: string) => (el: HTMLAnchorElement | null) => {
			if (el) {
				itemRefs.current.set(id, el);
			} else {
				itemRefs.current.delete(id);
			}
		},
		[],
	);

	// Measure active item position relative to the <ul>
	useLayoutEffect(() => {
		if (!activeId || !listRef.current) return;
		const activeEl = itemRefs.current.get(activeId);
		if (!activeEl) return;

		const listRect = listRef.current.getBoundingClientRect();
		const itemRect = activeEl.getBoundingClientRect();

		setIndicatorStyle({
			top: itemRect.top - listRect.top,
			height: itemRect.height,
		});
	}, [activeId]);

	useEffect(() => {
		const headingElements = items
			.map((item) => document.getElementById(item.id))
			.filter(Boolean) as HTMLElement[];

		if (headingElements.length === 0) return;

		setActiveId(headingElements[0].id);

		observerRef.current = new IntersectionObserver(
			(entries) => {
				const visibleEntries = entries.filter((e) => e.isIntersecting);
				if (visibleEntries.length > 0) {
					const sorted = visibleEntries.sort(
						(a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
					);
					setActiveId(sorted[0].target.id);
				}
			},
			{
				rootMargin: "0px 0px -80% 0px",
			},
		);

		for (const el of headingElements) {
			observerRef.current.observe(el);
		}

		return () => observerRef.current?.disconnect();
	}, [items]);

	// Simple list for mobile — no animation, no refs
	const mobileTocList = (
		<ul className="border-l">
			{items.map((item) => (
				<li key={item.id}>
					<a
						href={`#${item.id}`}
						className={cn(
							"block text-[13px] leading-snug transition-colors duration-200 ease-out",
							item.level === 3 && "pl-3",
							activeId === item.id
								? "text-foreground border-l border-accent-interactive -ml-px"
								: "text-vesper-muted hover:text-foreground",
						)}
					>
						<span className="block py-1 pl-4">{item.text}</span>
					</a>
				</li>
			))}
		</ul>
	);

	return (
		<>
			{/* Desktop: sticky aside in right margin — xl+ only */}
			<aside className="hidden xl:block absolute -right-12 top-0 translate-x-full w-48 h-full">
				<div className="sticky top-20">
					<span className="uppercase font-mono text-accent-foreground text-xs tracking-widest block mb-3">
						On this page
					</span>
					<ul ref={listRef} className="relative border-l space-y-0.5">
						{/* Animated active indicator */}
						{indicatorStyle && (
							<motion.div
								className="absolute -left-0.5 w-px bg-accent-interactive z-10"
								initial={false}
								animate={{
									top: indicatorStyle.top,
									height: indicatorStyle.height,
								}}
								transition={{ type: "spring", stiffness: 350, damping: 30 }}
							/>
						)}
						{items.map((item) => (
							<li key={item.id}>
								<a
									ref={setItemRef(item.id)}
									href={`#${item.id}`}
									className={cn(
										"block text-sm leading-snug transition-colors duration-200 ease-out",
										item.level === 3 && "pl-3",
										activeId === item.id
											? "text-foreground"
											: "text-vesper-muted hover:text-foreground",
									)}
								>
									<span className="block py-1 pl-4">{item.text}</span>
								</a>
							</li>
						))}
					</ul>
				</div>
			</aside>

			{/* Mobile: collapsible details at top — below xl */}
			<details className="xl:hidden mb-8 group">
				<summary className="uppercase font-mono text-accent-foreground text-xs tracking-widest cursor-pointer list-none flex items-center gap-2 select-none">
					<span
						aria-hidden="true"
						className="text-vesper-dim transition-transform duration-200 group-open:rotate-90"
					>
						▸
					</span>
					on this page
				</summary>
				<div className="mt-3 pl-4">{mobileTocList}</div>
			</details>
		</>
	);
}
