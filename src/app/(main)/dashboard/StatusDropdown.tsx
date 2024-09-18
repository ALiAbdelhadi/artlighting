"use client"
import { OrderStatus } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { changeOrderStatus } from "./action";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const LABEL_MAP: Record<OrderStatus, string> = {
  awaiting_shipment: "Awaiting Shipment",
  processing: "Processing Shipment",
  cancelled: "Cancelled",
  fulfilled: "Fulfilled",
};

const StatusDropdown = ({ id, orderStatus }: { id: number; orderStatus: OrderStatus }) => {
  const router = useRouter()
  const { mutate } = useMutation({
    mutationKey: ["change-order-status"],
    mutationFn: changeOrderStatus,
    onSuccess: () => router.refresh(),
  })
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-52 flex justify-between items-center" variant="outline">
          {LABEL_MAP[orderStatus]}
          <ChevronsUpDown className="ml-2 w-4 h-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0">
        {Object.values(OrderStatus).map((status) => (
          <DropdownMenuItem
            onClick={() => mutate({ id, newStatus: status as OrderStatus })}
            key={status}
            className={cn(
              "flex text-sm gap-1 items-center p-2.5 cursor-default hover:bg-zinc-100",
              { "bg-zinc-100": orderStatus === status }
            )}
          >
            <Check
              className={cn("mr-2 h-4 w-4 text-primary", {
                "opacity-100": orderStatus === status,
                "opacity-0": orderStatus !== status,
              })}
            />
            {LABEL_MAP[status as OrderStatus]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusDropdown;
