/** @type {import('next').NextConfig} */
const nextConfig = {
	// Configure `pageExtensions` to include markdown and MDX files
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
	// Optionally, add any other Next.js config below
	images: {
		remotePatterns: [
			{
				hostname: "photos.adriandlam.com",
			},
		],
		// formats: ['image/webp', 'image/avif'],
	},
	transpilePackages: ["next-mdx-remote"],
};

export default nextConfig;

// const withMDX = createMDX({
// 	extension: /\.mdx?$/,
// 	// Add markdown plugins here, as desired
// });

// // Merge MDX config with Next.js config
// export default withMDX(nextConfig);
