import withBundleAnalyzer from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */
const nextConfig = {
	// Configure `pageExtensions` to include markdown and MDX files
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
	// Optimize package imports for faster builds and smaller bundles
	experimental: {
		optimizePackageImports: [
			"@aws-sdk/client-s3",
			"lucide-react",
			"motion",
			"@radix-ui/react-separator",
			"class-variance-authority",
			"next-view-transitions",
			"mapbox-gl",
			"react-map-gl",
		],
	},
	// Optionally, add any other Next.js config below
	images: {
		minimumCacheTTL: 1209600,
		remotePatterns: [
			{
				hostname: "**.blob.vercel-storage.com",
			},
			{
				hostname: "photos.adriandlam.com",
			},
		],
	},
	transpilePackages: ["next-mdx-remote"],
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-DNS-Prefetch-Control",
						value: "on",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload",
					},
					{
						key: "X-Frame-Options",
						value: "SAMEORIGIN",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "Referrer-Policy",
						value: "origin-when-cross-origin",
					},
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
				],
			},
			{
				source: "/me.jpeg",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=2592000",
					},
				],
			},
			{
				source: "/projects/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=2592000",
					},
				],
			},
			{
				source: "/blog-assets/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=2592000",
					},
				],
			},
		];
	},
};

const bundleAnalyzer = withBundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

export default bundleAnalyzer(nextConfig);
