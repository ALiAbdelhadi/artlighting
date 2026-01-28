"use client";
import DashboardHeader from "@/components/dashboard-header";
import DashboardSummary from "@/components/dashboard-summary";
import DiscountPrice from "@/components/discount-price";
import NormalPrice from "@/components/normal-price";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/utils";
import { OrderStatus, Product, ShippingAddress, User } from "@repo/database";
import { MoveHorizontalIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DashboardServer } from "./dashboard-server";

interface Order {
  id: number;
  user: User;
  product: Product;
  shippingAddress: ShippingAddress;
  createdAt: string;
  totalPrice: number;
  status: string;
  configPrice: number;
  quantity: number;
  productPrice: number;
  shippingPrice: number;
  discountRate: number;
}
interface DashboardData {
  orders: Order[];
  totalCustomers: number;
  totalOrdersThatOrdered: number;
  TotalSales: {
    _sum: {
      totalPrice: number | null;
    };
  };
  user: {
    imageUrl: string;
  };
}
const getStatusBadgeClassName = (status: OrderStatus) => {
  switch (status) {
    case "cancelled":
      return "bg-[#ef4444] text-white hover:bg-red-600";
    case "processing":
      return "bg-[#f5a623] text-white hover:bg-[#f5a623]";
    case "fulfilled":
      return "bg-teal-400 text-white hover:bg-teal-400";
    case "awaiting_shipment":
      return "bg-[#0070f3] text-white hover:bg-[#0070f3]";
    default:
      return "bg-[#f3f4f6] text-black hover:bg-[#f0f0f0]";
  }
};
const LABEL_MAP_COLOR: Record<OrderStatus, string> = {
  awaiting_shipment: "Awaiting Shipment",
  processing: "Processing Shipment",
  cancelled: "Cancelled",
  fulfilled: "Fulfilled",
  shipped: "Shipped",
  delivered: "Delivered",
  refunded: "Refunded"
};
const Dashboard = () => {
  
  const [data, setData] = useState<DashboardData | null>(null);
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    const loadData = async () => {
      const dashboardData = await DashboardServer();
      setData(dashboardData);
    };
    loadData();
  }, []);
  const totalSalesAfterCancellation = useMemo(() => {
    if (!data) return 0;
    const cancelledOrdersTotal = data.orders
      .filter((order) => order.status === "cancelled")
      .reduce((acc, order) => acc + (order.configPrice || 0), 0);
    const totalSales = Math.ceil(data.TotalSales?._sum?.totalPrice ?? 0);
    return totalSales - cancelledOrdersTotal;
  }, [data]);
  const filteredOrder = useMemo(() => {
    if (!data) return [];
    return data.orders.filter((order) => {
      return filter === "all" || order.status.toLowerCase() === filter;
    });
  }, [data, filter]);
  const renderOrders = useMemo(
    () =>
      filteredOrder.map((order) => (
        <TableRow key={order.id}>
          <TableCell className="px-4 py-2">
            <Link
              href={`/admin/dashboard/Orders/${order.id}`}
              className="hover:text-primary hover:underline"
            >
              # {order.id}
            </Link>
          </TableCell>
          <TableCell className="px-4 py-2 ext-nowrap ">
            {order.shippingAddress.fullName}
          </TableCell>
          <TableCell className="px-4 py-2 text-nowrap uppercase">
            {order.product?.productName}
          </TableCell>
          <TableCell className="px-4 py-2">
            {order.discountRate > 0 ? (
              <DiscountPrice
                price={order.configPrice}
                discount={order.discountRate}
              />
            ) : (
              <NormalPrice price={order.configPrice} />
            )}
          </TableCell>
          <TableCell className="px-4 py-2">
            {order.discountRate > 0
              ? `${order.discountRate * 100}%`
              : "No discount"}
          </TableCell>
          <TableCell>{order.quantity}</TableCell>
          <TableCell>{formatPrice(order.shippingPrice)}</TableCell>
          <TableCell className="px-4 py-2">
            {order.discountRate > 0 ? (
              <DiscountPrice
                price={order.configPrice}
                discount={order.discountRate}
                quantity={order.quantity}
                shippingPrice={order.shippingPrice}
              />
            ) : (
              <NormalPrice
                price={order.configPrice}
                quantity={order.quantity}
                shippingPrice={order.shippingPrice}
              />
            )}
          </TableCell>
          <TableCell className="px-4 py-2">
            {new Date(order.createdAt).toLocaleDateString()}
          </TableCell>
          <TableCell className="px-4 py-2">
            <Badge
              className={`${getStatusBadgeClassName(order.status as OrderStatus)} rounded-full`}
            >
              {LABEL_MAP_COLOR[order.status as OrderStatus]}
            </Badge>
          </TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoveHorizontalIcon className="w-4 h-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Order</DropdownMenuItem>
                <DropdownMenuItem>Customer Details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      )),
    [filteredOrder],
  );
  if (!data)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  const { totalCustomers, totalOrdersThatOrdered, user } = data;
  return (
    <div className=" min-h-screen">
      <div className="flex flex-col">
        <DashboardHeader user={user} Route="Dashboard" />
        <div className="px-3 lg:px-4">
          <div className="flex-1 flex flex-col gap-4 py-6 lg:py-8">
            <DashboardSummary
              totalSales={totalSalesAfterCancellation}
              totalCustomers={totalCustomers}
              totalOrders={totalOrdersThatOrdered}
            />
            <Tabs defaultValue="all" className="mt-4">
              <TabsList className="space-x-0 md:space-x-2 ">
                <TabsTrigger
                  className="text-[10px] md:text-sm"
                  value="all"
                  onClick={() => setFilter("all")}
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  className="text-[10px] md:text-sm"
                  value="awaiting_shipment"
                  onClick={() => setFilter("awaiting_shipment")}
                >
                  Awaiting Shipment
                </TabsTrigger>
                <TabsTrigger
                  className="text-[10px] md:text-sm"
                  value="fulfilled"
                  onClick={() => setFilter("fulfilled")}
                >
                  Fulfilled
                </TabsTrigger>
                <TabsTrigger
                  className="text-[10px] md:text-sm"
                  value="processing"
                  onClick={() => setFilter("processing")}
                >
                  Processing shipment
                </TabsTrigger>
                <TabsTrigger
                  className="text-[10px] md:text-sm text-wrap"
                  value="cancelled"
                  onClick={() => setFilter("cancelled")}
                >
                  Cancelled
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <section className="pt-5 space-y-6">
              <Card className="shadow-lg">
                <CardHeader className="flex md:flex-row flex-col items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg sm:text-xl font-semibold">
                    Recent Orders
                  </CardTitle>
                  <CardDescription>
                    Overview of recent orders placed on the website.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="overflow-x-auto custom-scrollbar">
                    <div className="min-w-[600px] flex items-center">
                      <Table className="overflow-auto">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="px-4 py-2 text-sm text-nowrap">
                              # Order ID
                            </TableHead>
                            <TableHead className="px-4 py-2 text-sm text-nowrap">
                              Customer
                            </TableHead>
                            <TableHead className="text-nowrap">
                              Product Id
                            </TableHead>
                            <TableHead className="px-4 py-2 text-sm text-nowrap">
                              Product Price
                            </TableHead>
                            <TableHead className="px-4 py-2 text-sm text-nowrap">
                              Discount
                            </TableHead>
                            <TableHead className="px-4 py-2 text-sm text-nowrap">
                              Qty
                            </TableHead>
                            <TableHead className="px-4 py-2 text-sm text-nowrap">
                              Shipping Fee
                            </TableHead>
                            <TableHead className="px-4 py-2 text-sm text-nowrap">
                              Total
                            </TableHead>
                            <TableHead className="px-4 py-2 text-sm text-nowrap">
                              Date
                            </TableHead>
                            <TableHead className="px-4 py-2 text-sm text-nowrap">
                              Status
                            </TableHead>
                            <TableHead className="px-4 py-2 text-sm text-nowrap">
                              Action
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>{renderOrders}</TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
