import DiscountBanner from "@/components/discount-banner"
import Footer from "@/components/footer/footer"
import HeaderWrapper from "@/components/header/header-wrapper"
import type React from "react"

export default async function MainLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
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
