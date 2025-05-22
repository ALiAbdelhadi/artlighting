import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";

export function Cta() {
    return (
        <section className="w-full py-16 bg-background text-foreground">
            <div className="max-w-4xl mx-auto px-6 text-center space-y-10">
                <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-primary">
                        Get In Touch With Us
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                        Have a question or need help with your lighting project? Our team is here to support you every step of the way.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <Button asChild variant="default">
                        <a href="tel:+201154466259" className="font-medium transition-colors">
                            +2 (011) 54466259
                        </a>
                    </Button>
                    <a
                        href="https://wa.me/201154466259"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors bg-[#25D366] hover:bg-[#25D366]/90 h-10 px-4 py-2 text-sm text-white"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4 mr-2"
                        >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        24/7 WhatsApp Support
                    </a>
                </div>
                <div className="flex justify-center gap-6 pt-2">
                    <Link
                        href="https://www.instagram.com/artlightingofficial"
                        target="_blank"
                        className="text-muted-foreground hover:text-primary transition-colors"
                    >
                        <Instagram size={22} />
                    </Link>
                    <Link
                        href="https://www.facebook.com/ArtLightingOfficial/"
                        target="_blank"
                        className="text-muted-foreground hover:text-primary transition-colors"
                    >
                        <Facebook size={22} />
                    </Link>
                    <Link
                        href="https://www.youtube.com/channel/UC__8-8U4dAIgK1JYWvqv5cQ"
                        target="_blank"
                        className="text-muted-foreground hover:text-primary transition-colors"
                    >
                        <Youtube size={22} />
                    </Link>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground pt-4">
                    <Link
                        href="https://maps.app.goo.gl/dPppgdkCGUycMwJH6?g_st=aw"
                        target="_blank"
                        className="hover:text-primary transition-colors font-medium"
                    >
                        49 El Shaheed Sayed Zakaria, Sheraton Al Matar, El Nozha, Cairo, Egypt
                    </Link>
                    <p>Saturday - Thursday, 9:30am - 5:30pm</p>
                </div>
            </div>
        </section>
    );
}
