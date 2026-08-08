"use client";

import { DollarSign, Users, ShoppingBag } from "lucide-react";
import { formatPrice } from "../lib/utils";
import SummaryCard from "./summary-card";

const DashboardSummary = ({
  totalSales,
  totalCustomers,
  totalOrders,
}: {
  totalSales: number | null;
  totalCustomers: number;
  totalOrders: number;
}) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <SummaryCard
      title="Total Sales"
      description="Completed orders, after cancellations"
      value={formatPrice(totalSales ?? 0)}
      icon={<DollarSign className="h-4 w-4" />}
    />
    <SummaryCard
      title="Customers"
      description="Registered accounts"
      value={totalCustomers}
      icon={<Users className="h-4 w-4" />}
    />
    <SummaryCard
      title="Orders"
      description="Completed orders"
      value={totalOrders}
      icon={<ShoppingBag className="h-4 w-4" />}
    />
  </div>
);

export default DashboardSummary;
