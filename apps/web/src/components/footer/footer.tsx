import { ChandelierItems, IndoorItems, OutdoorItems } from "@/constants";
import { Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";
import ChangeTheme from "../theme-changer";
import { Container } from "@repo/ui";

export default function Footer() {
  return (
    <footer className="bg-muted/30 py-6 shadow-lg">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16">
          <div className="space-y-4" role="indoorCategories">
            <h3 className="text-xl font-bold text-primary">Indoor Lighting</h3>
            <ul className="space-y-2">
              {IndoorItems.map((IndoorItem) => (
                <li
                  key={IndoorItem.id}
                  className="hover:text-primary transition-colors "
                >
                  <Link href={`${IndoorItem.href}`}>
                    {IndoorItem.spotlightType}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4" role="outdoorCategories">
            <h3 className="text-xl font-bold text-primary">Outdoor Lighting</h3>
            <ul className="space-y-2">
              {OutdoorItems.map((OutdoorItem) => (
                <li
                  key={OutdoorItem.id}
                  className="hover:text-primary transition-colors  "
                >
                  <Link href={`${OutdoorItem.href}`}>
                    <span className="capitalize">{OutdoorItem.id}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4" role="ChandeliersCategories">
            <h3 className="text-xl font-bold text-primary">Chandeliers</h3>
            <ul className="space-y-2 grid grid-cols-2 gap-x-4">
              {ChandelierItems.map((ChandelierItem) => (
                <li
                  key={ChandelierItem.id}
                  className="hover:text-primary transition-colors "
                >
                  <Link href={`${ChandelierItem.href}`}>
                    {ChandelierItem.spotlightType}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4" role="contentinfo">
            <h3 className="text-xl font-bold text-primary">Company</h3>
            <ul className="space-y-2">
              {[
                { name: "About Us", href: "/about-us" },
                { name: "Contact", href: "/contact-us" },
                { name: "FAQs", href: "/faqs" },
                { name: "Privacy Policy", href: "/privacy" },
              ].map((item) => (
                <li
                  key={item.name}
                  className="hover:text-primary transition-colors "
                >
                  <Link href={item.href}>{item.name}</Link>
                </li>
              ))}
            </ul>
            <div className="pt-4" role="socialMedia accounts">
              <h4 className="text-lg font-semibold text-primary mb-2">
                Follow Us
              </h4>
              <div className="flex space-x-4">
                <Link
                  className="text-black hover:text-primary p-2 rounded-full hover:bg-black transition-colors dark:text-gray-100 dark:hover:bg-gray-100 dark:hover:text-primary"
                  href="https://www.instagram.com/artlightingofficial"
                  target="_blank"
                >
                  <Instagram size={24} />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link
                  className="text-black hover:text-primary p-2 rounded-full hover:bg-black transition-colors dark:text-gray-100 dark:hover:bg-gray-100 dark:hover:text-primary"
                  href="https://www.facebook.com/ArtLightingOfficial/"
                  target="_blank"
                >
                  <Facebook size={24} />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link
                  className="text-black hover:text-primary p-2 rounded-full hover:bg-black transition-colors dark:text-gray-100 dark:hover:bg-gray-100 dark:hover:text-primary"
                  href="https://www.youtube.com/channel/UC__8-8U4dAIgK1JYWvqv5cQ"
                  target="_blank"
                >
                  <Youtube size={24} />
                  <span className="sr-only">YouTube</span>
                </Link>
              </div>
              <div className="pt-2">
                <h4 className="text-lg font-semibold text-primary mb-2">Theme</h4>
                <ChangeTheme />
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-border text-center flex justify-center items-center mt-6 pt-6">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Art Lighting | Your Lighting Store.
            All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
