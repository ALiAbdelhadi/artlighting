"use client";

import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function FAQs() {
  const t = useTranslations("faq");
  const tAbout = useTranslations("header");

  const variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.3,
      },
    },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={variants}>
      <Breadcrumb />
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 lg:py-20 bg-background text-foreground">
        <div className="grid gap-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t("title")}
            </h1>
            <p className="mt-4 text-muted-foreground">{t("description")}</p>
          </div>
          <div className="grid gap-8">
            <div>
              <h2 className="text-2xl font-bold">{t("products.title")}</h2>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">{t("products.q1")}</h3>
                  <p className="mt-2 text-muted-foreground">{t("products.a1")}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t("products.q2")}</h3>
                  <p className="mt-2 text-muted-foreground">{t("products.a2")}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t("products.q3")}</h3>
                  <p className="mt-2 text-muted-foreground">{t("products.a3")}</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{t("shipping.title")}</h2>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">{t("shipping.q1")}</h3>
                  <p className="mt-2 text-muted-foreground">{t("shipping.a1")}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t("shipping.q2")}</h3>
                  <p className="mt-2 text-muted-foreground">{t("shipping.a2")}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t("shipping.q3")}</h3>
                  <p className="mt-2 text-muted-foreground">{t("shipping.a3")}</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{t("support.title")}</h2>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">{t("support.q1")}</h3>
                  <p className="mt-2 text-muted-foreground">{t("support.a1")}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t("support.q2")}</h3>
                  <p className="mt-2 text-muted-foreground">{t("support.a2")}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t("support.q3")}</h3>
                  <p className="mt-2 text-muted-foreground">
                    {t.rich("support.a3", {
                      phone: "+2 (011) 54466259",
                      email: "artlightingofficial@gamil.com",
                      phoneLink: (chunks) => (
                        <Link
                          dir="ltr"
                          href="tel:01154466259"
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {chunks}
                        </Link>
                      ),
                      emailLink: (chunks) => (
                        <Link
                          dir="ltr"
                          href="mailto:artlightingofficial@gamil.com"
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {chunks}
                        </Link>
                      ),
                    })}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{t("company.title")}</h2>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">{t("company.q1")}</h3>
                  <p className="mt-2 text-muted-foreground">{t("company.a1")}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t("company.q2")}</h3>
                  <p className="mt-2 text-muted-foreground">
                    {t("company.a2")}{" "}
                    <Link
                      href="/about-us"
                      className="text-primary hover:underline"
                      prefetch={false}
                    >
                      {tAbout('about-us')}
                    </Link>
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t("company.q3")}</h3>
                  <p className="mt-2 text-muted-foreground" >
                    {t.rich("support.a3", {
                      phone: "+2 (011) 54466259",
                      email: "artlightingofficial@gamil.com",
                      phoneLink: (chunks) => (
                        <Link
                          dir="ltr"
                          href="tel:01154466259"
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {chunks}
                        </Link>
                      ),
                      emailLink: (chunks) => (
                        <Link
                          dir="ltr"
                          href="mailto:artlightingofficial@gamil.com"
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {chunks}
                        </Link>
                      ),
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
