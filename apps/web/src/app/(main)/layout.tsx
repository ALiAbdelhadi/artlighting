import DiscountBanner from "@/components/discount-banner";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import "@repo/ui/styles.css";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <DiscountBanner />
            <Header />
            <main role="main">{children}</main>
            <Footer />
        </>
    );
}