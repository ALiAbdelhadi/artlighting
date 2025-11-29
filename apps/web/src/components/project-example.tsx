"use client"

import { Link } from "@/i18n/navigation"
import Image from "next/image"
import { useTranslations } from "next-intl"

export default function ProjectExample() {
  const t = useTranslations("project-example")

  return (
    <section className="flex flex-col md:flex-row items-start md:items-center pb-16 md:pb-20 gap-6 md:gap-8">
      <div className="w-full md:w-1/2 mt-5">
        <div className="text-sm mb-5 text-left rtl:text-right">{t("dateShort")}</div>
        <Image
          width={720}
          height={480}
          src="/projects/almaza-park/almaza-park-1.jpg"
          alt="almaza park"
          className="rounded-md w-full max-w-180 h-120 object-cover"
        />
      </div>
      <div className="w-full md:w-1/2 mt-4 md:mt-0">
        <div className="text-sm text-muted-foreground mb-2 text-left rtl:text-right">{t("dateLong")}</div>
        <h2 className="md:text-2xl text-xl font-bold sm:mb-4 mb-1 text-left rtl:text-right">{t("title")}</h2>
        <p className="text-muted-foreground sm:mb-6 mb-4 text-left rtl:text-right leading-relaxed">
          {t("description")}
        </p>
        <div className="text-left rtl:text-right">
          <Link
            href="/all-projects/almaza-park"
            className="font-semibold text-primary hover:underline transition-colors"
          >
            {t("readMore")}
          </Link>
        </div>
      </div>
    </section>
  )
}
