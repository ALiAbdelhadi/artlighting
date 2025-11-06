import { ChandelierItems, IndoorItems, OutdoorItems } from "@/constants";
import { Link } from "@/i18n/navigation";
import { Container } from "@repo/ui/container";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";
import ChangeTheme from "../theme-changer";

export default function Footer() {
  const t = useTranslations("footer");
  const tProducts = useTranslations("products");

  return (
    <footer className="bg-muted/30 py-12 shadow-lg">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 lg:gap-16">
          <div className="space-y-4">
            <Link
              href="/"
              className="text-2xl font-bold text-primary hover:text-primary-foreground transition-colors"
            >
              {t("brandName")}
            </Link>
            <p className="text-sm text-muted-foreground">
              {t("brandDescription")}
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">{t("indoorLighting")}</h3>
            <ul className="space-y-2">
              {IndoorItems.map((IndoorItem) => (
                <li key={IndoorItem.id} className="hover:text-primary transition-colors">
                  <Link href={IndoorItem.href}>
                    {tProducts(`indoor.${IndoorItem.id}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">{t("outdoorLighting")}</h3>
            <ul className="space-y-2">
              {OutdoorItems.map((OutdoorItem) => (
                <li key={OutdoorItem.id} className="hover:text-primary transition-colors">
                  <Link href={OutdoorItem.href}>
                    <span className="capitalize">
                      {tProducts(`outdoor.${OutdoorItem.id}`)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">{t("chandeliers")}</h3>
            <ul className="space-y-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              {ChandelierItems.map((ChandelierItem) => (
                <li key={ChandelierItem.id} className="hover:text-primary transition-colors">
                  <Link href={ChandelierItem.href}>
                    {tProducts(`chandelier.${ChandelierItem.id}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary">{t("company")}</h3>
              <ul className="space-y-2">
                {[
                  { name: t("aboutUs"), href: "/about-us" },
                  { name: t("contact"), href: "/contact-us" },
                  { name: t("faqs"), href: "/faqs" },
                  { name: t("privacyPolicy"), href: "/privacy" },
                ].map((item) => (
                  <li key={item.name} className="hover:text-primary transition-colors">
                    <Link href={item.href}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4">
              <h4 className="text-lg font-semibold text-primary mb-2">{t("followUs")}</h4>
              <div className="flex space-x-2">
                <Link
                  className="text-muted-foreground hover:text-primary hover:bg-accent p-2 rounded-full transition-colors"
                  href="https://www.instagram.com/artlightingofficial"
                  target="_blank"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </Link>
                <Link
                  className="text-muted-foreground hover:text-primary hover:bg-accent p-2 rounded-full transition-colors"
                  href="https://www.facebook.com/ArtLightingOfficial/"
                  target="_blank"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </Link>
                <Link
                  className="text-muted-foreground hover:text-primary hover:bg-accent p-2 rounded-full transition-colors"
                  href="https://www.youtube.com/channel/UC__8-8U4dAIgK1JYWvqv5cQ"
                  target="_blank"
                  aria-label="YouTube"
                >
                  <Youtube size={20} />
                </Link>
              </div>
            </div>
            <div className="pt-2">
              <h4 className="text-lg font-semibold text-primary mb-2">{t("theme")}</h4>
              <ChangeTheme />
            </div>
          </div>
        </div>
        <div className="border-t border-border text-center mt-12 pt-6">
          <p className="text-muted-foreground text-sm">
            {t("copyright", {
              year: new Date().getFullYear(),
              brand: t("brandName"),
            })}
          </p>
        </div>
      </Container>
    </footer>
  );
}