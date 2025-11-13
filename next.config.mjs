/** @type {import('next').NextConfig} */
const nextConfig = {
	// Configure `pageExtensions` to include markdown and MDX files
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
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
};

export default nextConfig;
