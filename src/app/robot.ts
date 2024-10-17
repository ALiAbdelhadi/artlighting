import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: "/",
            disallow: [
                '/api/',
                '/dashboard/',
                '/preview/'
            ]
        },
        host: 'https://eg-artlighting.vercel.app'
    }
}