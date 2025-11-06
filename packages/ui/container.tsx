import React from "react";
import { cn } from "./lib/utils";

export function Container({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("container w-full mx-auto px-6 lg:px-8 py-0 max-w-[1500px]", className)}>
      {children}
    </div>
  );
}