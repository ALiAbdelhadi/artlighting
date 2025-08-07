"use client";
import React from "react";

interface SpecificationsTable {
  [key: string]: string;
  "Color Temperature": string;
}

interface ColorTemperatureSectionProps {
  specificationsTable: SpecificationsTable;
}

const createParagraphWithStrong = (text: string) => (
  <p className="text-xl tracking-wide my-2">
    <strong>{text}</strong>
  </p>
);

const createStrongForListItem = (text: string) => (
  <strong className="text-muted-foreground md:text-lg text-xl md:leading-9 leading-6 tracking-wide">
    {text}
  </strong>
);

const createListItemWithStrong = (text: string) => (
  <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
    {text}
  </li>
);

export default function ColorTemperatureSection({
  specificationsTable,
}: ColorTemperatureSectionProps) {
  return (
    <div>
      {specificationsTable["Color Temperature"]?.includes("3000K") && (
        <ul>
        {createParagraphWithStrong("Warm lighting: ")}
        <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
          {createStrongForListItem("Not recommended for office use")} : The
          soft, warm glow of the LED ceiling lights may be too relaxing and
          inviting for office environments.
        </li>
        {createListItemWithStrong(
          "Warm lighting is ideally suited for bedrooms, living rooms, and kitchens. Its gentle, inviting radiance cultivates a cozy ambiance, promoting relaxation and comfort in these areas. It Helps You to be More relax and It's improve Your Sleep.",
        )}
      </ul>
    )}
    {specificationsTable["Color Temperature"]?.includes("4000K") && (
      <ul>
        {createParagraphWithStrong("Cool lighting: ")}
        {createListItemWithStrong(
          "Boosts alertness and productivity in work and study spaces.",
        )}
        {createListItemWithStrong("Enlivens modern or light décor.")}
        {createListItemWithStrong(
          "Creates a vibrant and energetic atmosphere.",
        )}
      </ul>
    )}
    {specificationsTable["Color Temperature"]?.includes("6500K") && (
      <ul>
        {createParagraphWithStrong("White lighting: ")}
        <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
          {createStrongForListItem("Recommended for")} : study spaces and
          offices as it aids in maintaining focus during work.
        </li>
        {createListItemWithStrong(
          "Cultivates a sophisticated and modern ambiance ideal for creating a neutral and contemporary setting. Perfect for enhancing spaces with its white color temperature.",
        )}
      </ul>
    )}
  </div>
);
}