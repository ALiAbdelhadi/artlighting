import { cn } from "@/lib/utils";
import React from "react";

const Container = ({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("container px-0 md:px-6 lg:px-8 py-0", className)}>
      {children}
    </div>
  );
};

export default Container;
