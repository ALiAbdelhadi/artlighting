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
        sitemap: 'https://eg-artlighting.vercel.app/sitemap.xml',
        host: 'https://eg-artlighting.vercel.app'
    }
}