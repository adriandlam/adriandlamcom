/**
 * Returns an onTransitionReady callback that animates the
 * page-content view transition pseudo-elements as a directional slide.
 *
 * Vertical:
 *   "up"   → old content slides down, new content enters from top
 *   "down" → old content slides up, new content enters from bottom
 *
 * Horizontal:
 *   "left"  → old content slides left, new content enters from right (drill in)
 *   "right" → old content slides right, new content enters from left (drill out)
 */
export function slideTransition(
	direction: "up" | "down" | "left" | "right",
): () => void {
	const slideDistance = 45;
	const duration = 180;

	const isHorizontal = direction === "left" || direction === "right";
	const axis = isHorizontal ? "X" : "Y";

	// old content slides away in the given direction
	// new content enters from the opposite side
	const oldSlide =
		direction === "up" || direction === "right"
			? slideDistance
			: -slideDistance;
	const newSlide = -oldSlide;

	return () => {
		// Old content: fade out fast, slide away, blur out
		document.documentElement.animate(
			[
				{ opacity: 1, transform: `translate${axis}(0)`, filter: "blur(0px)" },
				{
					opacity: 0,
					transform: `translate${axis}(${oldSlide * 0.5}px)`,
					filter: "blur(3px)",
					offset: 0.25,
				},
				{
					opacity: 0,
					transform: `translate${axis}(${oldSlide}px)`,
					filter: "blur(3px)",
				},
			],
			{
				duration,
				easing: "cubic-bezier(0.4, 0, 1, 1)",
				fill: "forwards",
				pseudoElement: "::view-transition-old(page-content)",
			},
		);
		// New content: slight delay so old is gone, then slide into place
		document.documentElement.animate(
			[
				{ opacity: 0, transform: `translate${axis}(${newSlide}px)` },
				{
					opacity: 0,
					transform: `translate${axis}(${newSlide * 0.6}px)`,
					offset: 0.2,
				},
				{ opacity: 1, transform: `translate${axis}(0)` },
			],
			{
				duration,
				easing: "cubic-bezier(0, 0, 0.2, 1)",
				fill: "forwards",
				pseudoElement: "::view-transition-new(page-content)",
			},
		);
	};
}
