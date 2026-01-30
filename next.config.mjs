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
			"@radix-ui/react-tooltip",
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
						key: "X-XSS-Protection",
						value: "1; mode=block",
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
				],
			},
		];
	},
};

const bundleAnalyzer = withBundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

export default bundleAnalyzer(nextConfig);
