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
                source: "/(.*)",
                headers: [
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload",
                    },
                ],
            },
        ];
    },
}

export default nextConfig
