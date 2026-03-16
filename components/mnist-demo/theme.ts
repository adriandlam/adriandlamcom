/**
 * Shared theme utilities for MNIST demo components.
 *
 * Parses CSS custom properties from the Vesper theme at runtime,
 * so components use theme colors instead of hardcoded hex values.
 */

export interface RGB {
	r: number;
	g: number;
	b: number;
}

/**
 * Parse a hex color string (#rrggbb or #rgb) into RGB components.
 */
function parseHex(hex: string): RGB {
	const h = hex.replace("#", "");
	if (h.length === 3) {
		return {
			r: Number.parseInt(h[0] + h[0], 16),
			g: Number.parseInt(h[1] + h[1], 16),
			b: Number.parseInt(h[2] + h[2], 16),
		};
	}
	return {
		r: Number.parseInt(h.slice(0, 2), 16),
		g: Number.parseInt(h.slice(2, 4), 16),
		b: Number.parseInt(h.slice(4, 6), 16),
	};
}

/**
 * Read a CSS custom property value from the document root.
 * Returns the trimmed string value, or the fallback if unavailable.
 */
function getCssVar(name: string, fallback: string): string {
	if (typeof document === "undefined") return fallback;
	const value = getComputedStyle(document.documentElement)
		.getPropertyValue(name)
		.trim();
	return value || fallback;
}

/**
 * Read a CSS custom property as parsed RGB.
 */
function getCssVarRgb(name: string, fallback: string): RGB {
	return parseHex(getCssVar(name, fallback));
}

/** Cached theme colors — populated once on first access. */
let cached: ThemeColors | null = null;

export interface ThemeColors {
	/** Card/surface background — #1a1a1a (--card) */
	surface: RGB;
	/** Background — #101010 (--background) */
	background: RGB;
	/** Border/selection — #2a2a2a (--border) */
	border: string;
	/** Accent interactive / aqua — #99ffe4 (--accent-interactive) */
	accent: string;
	accentRgb: RGB;
	/** Accent foreground / orange — #ffc799 (--accent-foreground) */
	accentForeground: string;
	accentForegroundRgb: RGB;
	/** Destructive / red — #ff8080 (--destructive) */
	destructive: string;
	destructiveRgb: RGB;
	/** Muted foreground — #a0a0a0 (--muted-foreground) */
	mutedForeground: string;
}

/**
 * Get theme colors, parsed from CSS custom properties.
 * Caches after first call. Safe to call from client components.
 */
export function getThemeColors(): ThemeColors {
	if (cached) return cached;

	cached = {
		surface: getCssVarRgb("--color-card", "#1a1a1a"),
		background: getCssVarRgb("--color-background", "#101010"),
		border: getCssVar("--color-border", "#2a2a2a"),
		accent: getCssVar("--color-accent-interactive", "#99ffe4"),
		accentRgb: getCssVarRgb("--color-accent-interactive", "#99ffe4"),
		accentForeground: getCssVar("--color-accent-foreground", "#ffc799"),
		accentForegroundRgb: getCssVarRgb("--color-accent-foreground", "#ffc799"),
		destructive: getCssVar("--color-destructive", "#ff8080"),
		destructiveRgb: getCssVarRgb("--color-destructive", "#ff8080"),
		mutedForeground: getCssVar("--color-muted-foreground", "#a0a0a0"),
	};

	return cached;
}

/**
 * Interpolate between two RGB colors.
 * t=0 returns `from`, t=1 returns `to`.
 */
export function lerpColor(from: RGB, to: RGB, t: number): string {
	const c = Math.min(Math.max(t, 0), 1);
	const r = Math.round(from.r + (to.r - from.r) * c);
	const g = Math.round(from.g + (to.g - from.g) * c);
	const b = Math.round(from.b + (to.b - from.b) * c);
	return `rgb(${r},${g},${b})`;
}

/**
 * Create an rgba string from an RGB color and alpha.
 */
export function rgbaString(color: RGB, alpha: number): string {
	return `rgba(${color.r},${color.g},${color.b},${alpha})`;
}
