import { Link } from "@/i18n/navigation"
import { Button } from "@repo/ui/button"
import { Facebook, Instagram, Youtube, Phone, MessageCircle } from "lucide-react"
import { useTranslations } from "next-intl"

export default function Cta() {
    const t = useTranslations("cta")
    
    return (
        <section className="w-full py-16 bg-background text-foreground">
            <div className="max-w-4xl mx-auto px-6 text-center space-y-10">
                <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-primary">
                        {t("title")}
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                        {t("description")}
                    </p>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Link href="/collections">{t("shopAllCollections")}</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link href="tel:+201154466259" className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {t("getExpertAdvice")}
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
                        <MessageCircle className="w-4 h-4 mr-2 rtl:ml-2" />
                        {t("whatsappSupport")}
                    </Link>
                    <div className="flex gap-6">
                        <Link
                            href="https://www.instagram.com/artlightingofficial"
                            target="_blank"
                            className="text-muted-foreground hover:text-primary transition-colors"
                            aria-label="Instagram"
                        >
                            <Instagram size={22} />
                        </Link>
                        <Link
                            href="https://www.facebook.com/ArtLightingOfficial/"
                            target="_blank"
                            className="text-muted-foreground hover:text-primary transition-colors"
                            aria-label="Facebook"
                        >
                            <Facebook size={22} />
                        </Link>
                        <Link
                            href="https://www.youtube.com/channel/UC__8-8U4dAIgK1JYWvqv5cQ"
                            target="_blank"
                            className="text-muted-foreground hover:text-primary transition-colors"
                            aria-label="YouTube"
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
                        {t("address")}
                    </Link>
                    <p>{t("workingHours")}</p>
                </div>
            </div>
        </section>
    )
}