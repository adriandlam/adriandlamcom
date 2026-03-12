"use client";

import { useTransitionRouter } from "next-view-transitions";
import { useEffect } from "react";
import { slideTransition } from "@/lib/transitions";

interface TransitionLinkProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	href: string;
	direction: "up" | "down" | "left" | "right";
	children?: React.ReactNode;
}

/**
 * A link component that triggers directional view transitions.
 * Use in place of next/link when you need animated page transitions
 * from server components.
 */
export function TransitionLink({
	href,
	direction,
	children,
	...props
}: TransitionLinkProps) {
	const router = useTransitionRouter();

	useEffect(() => {
		router.prefetch(href);
	}, [router, href]);

	return (
		<a
			href={href}
			onClick={(e) => {
				e.preventDefault();
				router.push(href, {
					onTransitionReady: slideTransition(direction),
				});
			}}
			{...props}
		>
			{children}
		</a>
	);
}
