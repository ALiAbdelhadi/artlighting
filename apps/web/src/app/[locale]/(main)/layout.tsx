import DiscountBanner from "@/components/discount-banner"
import Footer from "@/components/footer/footer"
import HeaderWrapper from "@/components/header/header-wrapper"
import type { SupportedLanguage } from "@/types/products"
import "@repo/ui/styles.css"
import type React from "react"

export default async function MainLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ locale: SupportedLanguage }> 
}) {
    const { locale } = await params

    return (
        <>
            <DiscountBanner />
            <HeaderWrapper locale={locale} />
            <main role="main">{children}</main>
            <Footer />
        </>
    )
}
