"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  description: string;
  value: string | number;
  valueClass?: string;
  icon?: React.ReactNode;
}

const SummaryCard = ({ title, description, value, valueClass, icon }: SummaryCardProps) => (
  <Card className="glass-surface rounded-2xl">
    <CardHeader className="flex flex-row items-start justify-between space-y-0">
      <div>
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </div>
      {icon && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      )}
    </CardHeader>
    <CardContent>
      <div className={cn("text-3xl font-bold text-foreground", valueClass)}>{value}</div>
    </CardContent>
  </Card>
);

export default SummaryCard;
