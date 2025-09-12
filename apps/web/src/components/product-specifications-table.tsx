import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SpecificationsTable } from "@/types/products"
import { cn } from "@repo/ui"

interface ProductSpecificationsTableProps {
  specificationsTable: SpecificationsTable
  Brand?: string
  chandelierLightingType?: string | undefined
  hNumber?: number | null
  sectionType?: string
  locale: string
  maximumWattage?: number
  productName?: string
}

export default function ProductSpecificationsTable({
  specificationsTable,
  Brand,
  chandelierLightingType,
  hNumber,
  sectionType,
  locale,
  maximumWattage,
  productName,
}: ProductSpecificationsTableProps) {

  const labels = {
    ar: {
      title: "المواصفات التقنية",
      specification: "المواصفة",
      value: "القيمة",
      numberOfArms: "عدد الأذرع",
      hours: "ساعات"
    },
    en: {
      title: "Technical Specifications",
      specification: "Specification",
      value: "Value",
      numberOfArms: "Number of Arms",
      hours: "Hours"
    }
  };

  const currentLabels = labels[locale as keyof typeof labels] || labels.en;

  const calculateWattage = (): string => {
    if (Brand === "mister-led" && sectionType === "chandelier") {
      if (chandelierLightingType === "lamp" && hNumber) {
        const wattageText = locale === 'ar' ? "وات (لمبة 12وات)" : "W (12W lamp)";
        return `${hNumber * 12}${wattageText}`;
      }
      if (chandelierLightingType === "LED") {
        if (typeof maximumWattage === 'number' && maximumWattage > 0) {
          return `${maximumWattage}W`;
        }
        if (productName) {
          const match = /([0-9]{1,4})\s*W/i.exec(productName);
          if (match) {
            const parsed = Number(match[1]);
            if (parsed > 0) return `${parsed}W`;
          }
        }
      }
    }
    return specificationsTable[locale === 'ar' ? "أقصى قوة" : "Maximum wattage"] || "15W/M";
  };

  const formatValue = (key: string, value: string): string => {
    if (key.includes("Maximum wattage") || key.includes("أقصى قوة")) {
      // Unified chandelier handling for Mister LED
      if (sectionType === "chandelier") {
        return calculateWattage();
      }
      return calculateWattage();
    } else if (key.toLowerCase().includes("hnumber") && hNumber) {
      return hNumber.toString();
    }
    return value;
  };

  const filteredSpecs = Object.entries(specificationsTable).filter(([, value]) =>
    value && String(value).trim() !== ""
  );

  return (
    <div className="space-y-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <h2 className="text-xl md:text-2xl font-semibold">{currentLabels.title}</h2>
      <div className="overflow-x-auto">
        <Table className="w-full border" dir={locale === "ar" ? "rtl" : "ltr"}>
          <TableHeader>
            <TableRow>
              <TableHead className={cn(
                "font-semibold text-foreground border-r text-base",
                locale === 'ar' && "text-right"
              )}>
                {currentLabels.specification}
              </TableHead>
              <TableHead className={cn(
                "font-semibold text-foreground border-r text-base",
                locale === 'ar' && "text-right"
              )}>
                {currentLabels.value}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSpecs.map(([key, value]) => (
              <TableRow key={key}>
                <TableCell className={cn(
                  "font-medium border-r text-base",
                  locale === 'ar' && "text-right"
                )}>
                  {key}
                </TableCell>
                <TableCell className={cn(
                  "text-base",
                  locale === 'ar' && "text-right"
                )}>
                  {formatValue(key, String(value || ''))}
                </TableCell>
              </TableRow>
            ))}

            {chandelierLightingType === "lamp" &&
              !specificationsTable["hNumber"] &&
              !specificationsTable["عدد الأذرع"] &&
              hNumber && (
                <TableRow>
                  <TableCell className={cn(
                    "font-medium border-r",
                    locale === 'ar' && "text-right"
                  )}>
                    {currentLabels.numberOfArms}
                  </TableCell>
                  <TableCell className={cn(
                    locale === 'ar' && "text-right"
                  )}>
                    {hNumber}
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}