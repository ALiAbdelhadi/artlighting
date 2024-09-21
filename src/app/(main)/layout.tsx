import DiscountBanner from "../components/banner/DiscountBanner";
import Footer from "../components/footer/Footer";
import HeaderAndRightNav from "../components/header/HeaderAndRightNav";
import { Toaster } from "@/components/ui/toaster"

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <DiscountBanner />
            <HeaderAndRightNav />
            <main>{children}</main>
            <Footer />
            <Toaster />
        </>
    );
}