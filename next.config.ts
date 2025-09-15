import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: false,
	compiler: {
		// removeConsole: true,
		// removeConsole: process.env.NODE_ENV === "production",
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "bshots.egcvi.com",
			},
			{
				protocol: "https",
				hostname: "aiimage.online",
			},
			{
				protocol: "https",
				hostname: "khpic.cdn568.net",
			},
			{ protocol: "https", hostname: "assets.coingecko.com" },
			{
				protocol: "https",
				hostname: "img-3-2.cdn568.ne",
			},
			{
				protocol: "https",
				hostname: "icon.aiimage.online",
			},
			{
				protocol: "https",
				hostname: "img-3-2.cdn568.net",
			},
			{
				protocol: "https",
				hostname: "img.dyn123.com",
			},
			{
				protocol: "https",
				hostname: "tokens.1inch.io",
			},
			{
				protocol: "https",
				hostname: "img.dyn123.com",
			},
			{ protocol: "https", hostname: "raw.githubusercontent.com" },
			{ protocol: "https", hostname: "tokens-data.1inch.io" },
			{ protocol: "http", hostname: "apiv2.xx88zz77.site" },
			{ protocol: "https", hostname: "images.unsplash.com" },
		],
	},
};

export default nextConfig;
