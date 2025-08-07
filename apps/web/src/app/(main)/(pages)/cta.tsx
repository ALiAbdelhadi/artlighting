import { Button } from "@repo/ui/button"
import { Facebook, Instagram, Youtube, Phone, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function Cta() {
    return (
        <section className="w-full py-16 bg-background text-foreground">
            <div className="max-w-4xl mx-auto px-6 text-center space-y-10">
                <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-primary">Illuminate Your World</h2>
                    <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                        Explore our exquisite collection of lighting fixtures designed to transform any space. Find the ideal
                        illumination for your home or business.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Link href="/collections">Shop All Collections</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link href="tel:+201154466259" className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Get Expert Advice
                        </Link>
                    </Button>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-2">
                    <Link
                        href="https://wa.me/201154466259"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors bg-[#25D366] hover:bg-[#25D366]/90 h-10 px-4 py-2 text-sm text-white"
                    >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        24/7 WhatsApp Support
                    </Link>
                    <div className="flex gap-6">
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
    )
}
