import DiscountBanner from "@/components/banner/DiscountBanner";
import Footer from "@/components/footer/Footer";
import HeaderAndRightNav from "@/components/header/HeaderAndRightNav";
import { Toaster } from "@/components/ui/toaster";
import { Fragment } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <DiscountBanner />
      <HeaderAndRightNav />
      <main role="main">{children}</main>
      <Footer />
      <Toaster />
    </Fragment>
  );
}
