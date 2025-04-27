import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

type SpecificationsTable = {
  [key: string]: string;
};

type ProductSpecificationsProps = {
  specificationsTable: SpecificationsTable;
  productName: string;
  Brand: string;
  ChandelierLightingType: string;
  hNumber?: number;
  sectionType: string;
};

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({
  specificationsTable,
  productName,
  Brand,
  ChandelierLightingType,
  hNumber,
  sectionType,
}) => {
  console.log("Props received:", {
    productName,
    Brand,
    ChandelierLightingType,
    hNumber,
  });

  const calculateWattage = (): string => {
    if (
      Brand === "mister-led" &&
      ChandelierLightingType === "lamp" &&
      hNumber
    ) {
      return `${hNumber * 12}W  (12W lamp)`;
    }
    return specificationsTable["Maximum wattage"] || "15W/M";
  };

  const wattage = calculateWattage();
  console.log("Calculated wattage:", wattage);

  return (
    <>
      <h2 className="sm:text-2xl text-xl font-semibold mt-4">
        Technical Specification:
      </h2>
      <Table className="w-full mt-4 border-collapse border border-gray-300">
        <TableHeader>
          <TableRow className="text-left">
            <TableHead className="pr-4 py-2 border border-gray-300 text-base md:text-lg font-medium ">
              Specifications
            </TableHead>
            <TableHead className="pr-4 py-2 border border-gray-300 text-base md:text-lg font-medium">
              Value
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(specificationsTable).map(([key, value]) => {
            let displayValue = value;
            if (key === "Maximum wattage") {
              if (sectionType === "chandelier") {
                displayValue = hNumber ? `${hNumber * 12}W  (12W lamp)` : "15W/M";
              } else {
                displayValue = wattage;
              }
            } else if (key === "Life Time") {
              displayValue = `${value} Hour`;
            } else if (key.toLowerCase() === "hNumber" && hNumber) {
              displayValue = hNumber.toString();
            }
            console.log(`Displaying: ${key} - ${displayValue}`);
            return (
              <TableRow key={key}>
                <TableCell className="border border-gray-300 p-2 md:text-[16px] text-sm font-medium">
                  {key}
                </TableCell>
                <TableCell className="border border-gray-300 p-2 md:text-[16px] text-sm font-medium">
                  {displayValue}
                </TableCell>
              </TableRow>
            );
          })}
          {ChandelierLightingType === "lamp" &&
            !specificationsTable["hNumber"] &&
            hNumber && (
              <TableRow>
                <TableCell className="border border-gray-300 p-2 md:text-[16px] text-sm font-medium">
                  Number of arms
                </TableCell>
                <TableCell className="border border-gray-300 p-2 md:text-[16px] text-sm font-medium">
                  {hNumber}
                </TableCell>
              </TableRow>
            )}
        </TableBody>
      </Table>
    </>
  );
};

export default ProductSpecifications;
