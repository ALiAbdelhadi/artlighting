"use client";

import { Button } from "@/components/ui/button";
import { ProductIP } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { changeProductIP } from "@/app/(main)/actions/productIP";
import { cn } from "../utils/utils";
import { Droplets } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
const PRODUCT_IP_LABEL_MAP: Record<ProductIP, { label: string; description: string }> = {
    IP20: { label: "IP 20", description: "Protected against solid objects over 12mm" },
    IP44: { label: "IP 44", description: "Protected against water splashes from all directions" },
    IP54: { label: "IP 54", description: "Protected against dust and water splashes" },
    IP65: { label: "IP 65", description: "Dust tight and protected against water jets" },
    IP68: { label: "IP 68", description: "Dust tight and protected against long periods of immersion" },
}

interface ProductIpStatusProps {
    productId: string;
    productIp: ProductIP;
    onProductIpChange: (newProductIp: ProductIP) => void;
}
interface ProductIpButtonsProps {
    productId: string;
    productIp: ProductIP;
    onProductIpChange: (newProductIp: ProductIP) => void;
}
export default function ProductIPButtons({
    productId,
    productIp,
    onProductIpChange,
}: ProductIpButtonsProps) {
    const router = useRouter();
    const [activeIp, setActiveIp] = useState<ProductIP>(productIp);

    const { mutate } = useMutation({
        mutationKey: ["change-product-ip"],
        mutationFn: changeProductIP,
        onSuccess: () => router.refresh(),
    });

    const handleIpChange = (ip: ProductIP) => {
        setActiveIp(ip);
        onProductIpChange(ip);
        mutate({ productId, newProductIp: ip });
    };

    return (
        <div className="space-y-2">
            <h3 className="text-lg font-semibold mb-2">
                Water Resistance (IP Rating)
            </h3>
            <div className="grid sm:grid-cols-3 grid-cols-1 gap-2">
                {Object.entries(PRODUCT_IP_LABEL_MAP).map(
                    ([ip, { label, description }]) => (
                        <TooltipProvider key={ip}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={() => handleIpChange(ip as ProductIP)}
                                        variant={activeIp === ip ? "default" : "outline"}
                                        className={cn(
                                            " flex items-center justify-center w-full rounded-full",
                                            activeIp === ip
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-background hover:bg-secondary"
                                        )}
                                    >
                                        <Droplets className="w-4 h-4 mr-1" />
                                        <span className="ml-1">{label}</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="sm:block hidden font-medium">
                                    {description}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )
                )}
            </div>
        </div>
    );
}
