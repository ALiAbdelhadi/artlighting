"use client";

import { useTranslations } from "next-intl";

interface SpecificationsTable {
  [key: string]: string;
  "Color Temperature": string;
}

interface ColorTemperatureSectionProps {
  specificationsTable: SpecificationsTable;
}

export default function ColorTemperatureSection({
  specificationsTable,
}: ColorTemperatureSectionProps) {
  const t = useTranslations("colorTemperature");

  return (
    <div>
      {specificationsTable["Color Temperature"]?.includes("3000K") && (
        <ul>
          <p className="text-xl tracking-wide my-2">
            <strong>{t("warm.title")}</strong>
          </p>
          <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
            <strong>{t("warm.notRecommended")}</strong> : {t("warm.notRecommendedDesc")}
          </li>
          <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
            {t("warm.desc")}
          </li>
        </ul>
      )}

      {specificationsTable["Color Temperature"]?.includes("4000K") && (
        <ul>
          <p className="text-xl tracking-wide my-2">
            <strong>{t("cool.title")}</strong>
          </p>
          <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
            {t("cool.boost")}
          </li>
          <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
            {t("cool.decor")}
          </li>
          <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
            {t("cool.energy")}
          </li>
        </ul>
      )}

      {specificationsTable["Color Temperature"]?.includes("6500K") && (
        <ul>
          <p className="text-xl tracking-wide my-2">
            <strong>{t("white.title")}</strong>
          </p>
          <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
            <strong>{t("white.recommended")}</strong> : {t("white.recommendedDesc")}
          </li>
          <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
            {t("white.desc")}
          </li>
        </ul>
      )}
    </div>
  );
}
