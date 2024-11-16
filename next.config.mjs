import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    reactStrictMode: true,
    images: {
        domains: ['localhost', 'https://eg-artlighting.vercel.app'],
        unoptimized: true
    },
    compiler: {
        styledComponents: true,
    },
    serverExternalPackages: ['@prisma/client', 'bcrypt'],
}

const sentryConfig = {
    org: "artlighting",
    project: "javascript-nextjs",
    silent: !process.env.CI,
    widenClientFileUpload: true,
    reactComponentAnnotation: {
        enabled: true,
    },
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
}

export default withSentryConfig(nextConfig, sentryConfig);