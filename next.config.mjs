/** @type {import('next').NextConfig} */

const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['localhost', 'eg-artlighting.vercel.app'],
    },
    compiler: {
        styledComponents: true,
    },
    async headers() {
        return [
            {
                // Define the routes for which to enable HSTS
                source: "/(.*)",
                headers: [
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload", // HSTS header with preload
                    },
                ],
            },
        ];
    },
}

export default nextConfig
