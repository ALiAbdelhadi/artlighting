import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SpecificationsTable } from "@/types/products"

interface ProductSpecificationsTableProps {
  specificationsTable: SpecificationsTable
  Brand?: string
  ChandelierLightingType?: string | undefined
  hNumber?: number | null
  sectionType?: string
}

export default function ProductSpecificationsTable({
  specificationsTable,
  Brand,
  ChandelierLightingType,
  hNumber,
  sectionType,
}: ProductSpecificationsTableProps) {
  const calculateWattage = (): string => {
    if (Brand === "mister-led" && ChandelierLightingType === "lamp" && hNumber) {
      return `${hNumber * 12}W (12W lamp)`
    }
    return specificationsTable["Maximum wattage"] || "15W/M"
  }

  const formatValue = (key: string, value: string): string => {
    if (key === "Maximum wattage") {
      if (sectionType === "chandelier") {
        return hNumber ? `${hNumber * 12}W (12W lamp)` : "15W/M"
      } else {
        return calculateWattage()
      }
    } else if (key === "Life Time") {
      return `${value} Hours`
    } else if (key.toLowerCase() === "hnumber" && hNumber) {
      return hNumber.toString()
    }
    return value
  }

  const filteredSpecs = Object.entries(specificationsTable).filter(([, value]) => value && String(value).trim() !== "")

  return (
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold">Technical Specifications</h2>
      <div className="overflow-x-auto">
        <Table className="w-full border">
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-foreground border-r text-base">Specification</TableHead>
              <TableHead className="font-semibold text-foreground border-r text-base">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSpecs.map(([key, value]) => (
              <TableRow key={key}>
                <TableCell className="font-medium border-r text-base">{key}</TableCell>
                <TableCell className="text-base">{formatValue(key, String(value || ''))}</TableCell>
              </TableRow>
            ))}

            {ChandelierLightingType === "lamp" && !specificationsTable["hNumber"] && hNumber && (
              <TableRow>
                <TableCell className="font-medium border-r">Number of Arms</TableCell>
                <TableCell>{hNumber}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
