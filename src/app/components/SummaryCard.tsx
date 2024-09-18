"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryCardProps {
    title: string;
    description: string;
    value: string | number;
    percentage: string;
    valueClass?: string;
}

const SummaryCard = ({ title, description, value, percentage, valueClass}: SummaryCardProps) => (
    <Card className="shadow-sm">
        <CardHeader>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className={`text-4xl font-bold ${valueClass}`}>{value}</div>
            <div className="text-sm ">{percentage}</div>
        </CardContent>
    </Card>
);

export default SummaryCard;
