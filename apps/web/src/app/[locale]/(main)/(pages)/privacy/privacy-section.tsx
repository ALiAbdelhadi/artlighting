"use client";
import { useTranslations } from "next-intl";
import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import { Container } from "@/components/container"
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";

export default function PrivacySection() {
  const t = useTranslations("privacy");
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
  const [lastUpdate, setLastUpdate] = useState<string>("");
  useEffect(() => {
    const date = new Date();
    const formateDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
    setLastUpdate(formateDate);
  }, []);
  return (
    <motion.div initial="hidden" animate="visible" variants={variants}>
      <Breadcrumb />
      <div className="w-full py-12 md:py-16 lg:py-20 bg-background text-foreground">
        <Container className=" max-w-6xl">
          <div className="grid gap-12">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {t("title")}
              </h1>
              <p className="mt-4 text-muted-foreground">
                {t("lastUpdated", { date: lastUpdate })}
              </p>
            </div>
            <div className="grid gap-8">
              <div>
                <h2 className="text-2xl font-bold">{t("s1.title")}</h2>
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">{t("s1.q1")}</h3>
                    <p className="mt-2 text-muted-foreground">{t("s1.desc")}</p>
                    <ul className="list-disc list-inside mt-2 text-muted-foreground">
                      <li>{t("s1.list.0")}</li>
                      <li>{t("s1.list.1")}</li>
                      <li>{t("s1.list.2")}</li>
                      <li>{t("s1.list.3")}</li>
                      <li>{t("s1.list.4")}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{t("s2.title")}</h2>
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">{t("s2.q1")}</h3>
                    <p className="mt-2 text-muted-foreground">{t("s2.desc")}</p>
                    <ul className="list-disc list-inside mt-2 text-muted-foreground">
                      <li>{t("s2.list.0")}</li>
                      <li>{t("s2.list.1")}</li>
                      <li>{t("s2.list.2")}</li>
                      <li>{t("s2.list.3")}</li>
                      <li>{t("s2.list.4")}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{t("s3.title")}</h2>
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">{t("s3.q1")}</h3>
                    <p className="mt-2 text-muted-foreground">{t("s3.desc")}</p>
                    <ul className="list-disc list-inside mt-2 text-muted-foreground">
                      <li>{t("s3.list.0")}</li>
                      <li>{t("s3.list.1")}</li>
                      <li>{t("s3.list.2")}</li>
                      <li>{t("s3.list.3")}</li>
                    </ul>
                    <p className="mt-2 text-muted-foreground">{t("s3.footer")}</p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{t("s4.title")}</h2>
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">{t("s4.q1")}</h3>
                    <p className="mt-2 text-muted-foreground">{t("s4.desc")}</p>
                    <ul className="list-disc list-inside mt-2 text-muted-foreground">
                      <li>{t("s4.list.0")}</li>
                      <li>{t("s4.list.1")}</li>
                      <li>{t("s4.list.2")}</li>
                      <li>{t("s4.list.3")}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{t("s5.title")}</h2>
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">{t("s5.q1")}</h3>
                    <p className="mt-2 text-muted-foreground">{t("s5.desc")}</p>
                    <ul className="list-disc list-inside mt-2 text-muted-foreground">
                      <li>{t("s5.list.0")}</li>
                      <li>{t("s5.list.1")}</li>
                      <li>{t("s5.list.2")}</li>
                      <li>{t("s5.list.3")}</li>
                      <li>{t("s5.list.4")}</li>
                    </ul>
                    <p className="mt-2 text-muted-foreground">{t("s5.footer")}</p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{t("s6.title")}</h2>
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">{t("s6.q1")}</h3>
                    <p className="mt-2 text-muted-foreground">{t("s6.desc")}</p>
                    <div className="mt-2 text-muted-foreground">
                      {t.rich("s6.contact", {
                        phone: (chunk) => (
                          <Link
                            href="tel:01154466259"
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {chunk}
                          </Link>
                        ),
                        email: (chunk) => (
                          <Link
                            href="mailto:smartlight.balocm@gamil.com?Subject=Privacy Policy Inquiry"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {chunk}
                          </Link>
                        )
                      })}
                    </div>
                    <p className="mt-2 text-muted-foreground">{t("s6.footer")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </motion.div>
  );
}