import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-background text-foreground py-12 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-primary">Indoor Lighting</h3>
                        <ul className="space-y-2">
                            {[
                                "strip",
                                "linear",
                                "family202",
                                "family500",
                                "family800",
                                "family900",
                                "DoubleSpotlight",
                            ].map((item) => (
                                <li key={item} className="hover:text-primary transition-colors">
                                    <Link
                                        href={`/category/Balcom/Indoor/${item.toLowerCase()}`}
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-primary">Outdoor Lighting</h3>
                        <ul className="space-y-2">
                            {["Spikes", "Bollard", "uplight", "Floodlight"].map(
                                (item) => (
                                    <li
                                        key={item}
                                        className="hover:text-primary transition-colors "
                                    >
                                        <Link
                                            href={`/category/Balcom/Outdoor/${item}`}
                                        >
                                            <span className="capitalize">
                                                {item}
                                            </span>
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-primary">Chandeliers</h3>
                        <ul className="space-y-2 grid grid-cols-2 gap-x-4">
                            {[
                                "MC15C",
                                "MC15F",
                                "MC15G",
                                "MC15P",
                                "MC15E",
                                "MC1608",
                                "MC6014",
                                "MC6015",
                                "MC6031",
                                "MC6038",
                                "MC6041",
                                "MC6051",
                                "MC6091",
                                "MC6094",
                                "MC6097",
                                "MC7021",
                                "MC7023",
                                "MC7091",
                                "MC7104",
                                "MC7105",
                                "OH0109",
                                "OH1109",
                                "OH1203",
                                "OH1207",
                                "OH1209",
                                "OH1309",
                                "OH1601",
                                "MC15W",
                            ].map((item) => (
                                <li key={item} className="hover:text-primary transition-colors">
                                    <Link href={`/category/MisterLed/Chandelier/${item}`}>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-primary">Company</h3>
                        <ul className="space-y-2">
                            {[
                                { name: "About Us", href: "/AboutUs" },
                                { name: "Contact", href: "/ContactUs" },
                                { name: "FAQs", href: "/FAQs" },
                                { name: "Privacy Policy", href: "#" },
                            ].map((item) => (
                                <li
                                    key={item.name}
                                    className="hover:text-primary transition-colors"
                                >
                                    <Link href={item.href}>{item.name}</Link>
                                </li>
                            ))}
                        </ul>
                        <div className="pt-4">
                            <h4 className="text-lg font-semibold text-primary mb-2">
                                Follow Us
                            </h4>
                            <div className="flex space-x-4">
                                <Link
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                    href="https://www.instagram.com/artlightingofficial"
                                    target="_blank"
                                >
                                    <Instagram size={24} />
                                    <span className="sr-only">Instagram</span>
                                </Link>
                                <Link
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                    href="https://www.facebook.com/ArtLightingOfficial/"
                                    target="_blank"
                                >
                                    <Facebook size={24} />
                                    <span className="sr-only">Facebook</span>
                                </Link>
                                <Link
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                    href="https://www.youtube.com/channel/UC__8-8U4dAIgK1JYWvqv5cQ"
                                    target="_blank"
                                >
                                    <Youtube size={24} />
                                    <span className="sr-only">YouTube</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-border text-center">
                    <p className="text-muted-foreground">
                        © {new Date().getFullYear()} Art Lighting | Your Lighting Store.
                        All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
