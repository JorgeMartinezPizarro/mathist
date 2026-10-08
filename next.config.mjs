/** @type {import('next').NextConfig} */
const nextConfig = {
	basePath: '',
	// Old misspelled API routes, kept so existing links keep working
	async redirects() {
		return [
			{ source: '/api/pithagoreanTree', destination: '/api/pythagoreanTree', permanent: true },
			{ source: '/api/pithagoreanTriple', destination: '/api/pythagoreanTriple', permanent: true },
		];
	},
};

export default nextConfig;
