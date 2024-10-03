import { PrismaClient } from '@prisma/client'
import { MetadataRoute } from 'next'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

async function fetchAllProducts() {
    return await prisma.product.findMany({
        select: {
            id: true,
            Brand: true,
            productId: true,
            sectionType: true,
            category: {
                select: {
                    name: true,
                },
            },
            lightingtype: {
                select: {
                    name: true,
                },
            },
        },
    })
}

async function fetchAllCategories() {
    return await prisma.category.findMany({
        select: {
            id: true,
            name: true,
        },
    })
}

async function fetchAllLightingTypes() {
    return await prisma.lightingType.findMany({
        select: {
            id: true,
            name: true,
        },
    })
}

async function fetchAllProjects() {
    const filePath = path.join(process.cwd(), 'json', 'project.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    const projectsData = JSON.parse(fileContents)
    return Object.values(projectsData.projects)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://eg-artlighting.vercel.app'

    const products = await fetchAllProducts()
    const categories = await fetchAllCategories()
    const lightingTypes = await fetchAllLightingTypes()
    const projects = await fetchAllProjects()

    const productUrls = products.map((product) => ({
        url: `${baseUrl}/category/${product.Brand}/${product.sectionType}/${product.lightingtype.name}/${product.productId}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }))

    const categoryUrls = categories.map((category) => ({
        url: `${baseUrl}/category/${category.name}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    const lightingTypeUrls = lightingTypes.map((lightingType) => ({
        url: `${baseUrl}/category/All/${lightingType.name}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))

    const projectUrls = projects.map((project: any) => ({
        url: `${baseUrl}/All-Projects/${project.ProjectId}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/AboutUs`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/All-Projects`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/Blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        },
        {
            url: `${baseUrl}/category`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/Collection`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/ContactUs`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/FAQs`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.4,
        },
    ]

    return [...staticPages, ...productUrls, ...categoryUrls, ...lightingTypeUrls, ...projectUrls]
}