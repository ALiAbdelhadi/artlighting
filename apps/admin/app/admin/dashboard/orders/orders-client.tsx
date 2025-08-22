"use client";

import DashboardHeader from "@/components/dashboard-header";
import DiscountPrice from "@/components/discount-price";
import NormalPrice from "@/components/normal-price";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@repo/ui/lib";
import { Prisma } from "@repo/database";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import StatusDropdown from "../status-dropdown-menu";

type OrderWithShipping = Prisma.OrderGetPayload<{
  include: { shippingAddress: true; product: true; configuration: true };
}>;

interface OrdersClientProps {
  orders: OrderWithShipping[];
}

const OrdersClient: React.FC<OrdersClientProps> = ({ orders }) => {
  const [searchItem, setSearchItem] = useState<string>("");
  const [filteredOrders, setFilteredOrders] =
    useState<OrderWithShipping[]>(orders);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchItem(searchValue);
    setLoading(true);
    setError(null);
    try {
      const searchId = Number(searchValue);
      const newFilteredOrders = orders.filter(
        (order) =>
          order.id === searchId ||
          order.productName.toLowerCase().includes(searchValue.toLowerCase()) ||
          order.shippingAddress?.fullName
            .toLowerCase()
            .includes(searchValue.toLowerCase()),
      );
      setFilteredOrders(newFilteredOrders);
    } catch (error) {
      setError("Error filtering orders.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col min-h-screen pb-10">
      <DashboardHeader Route="Orders">
        <div className="flex items-center gap-4 md:ml-auto">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchItem}
                onChange={handleInputChange}
                type="text"
                placeholder="Search on orders."
                className="pl-8 w-full sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
        </div>
      </DashboardHeader>
      <div className="mt-10 px-6">
        <h2 className="text-xl font-semibold mb-7">All Orders</h2>
        <div className="overflow-x-auto border rounded-lg shadow custom-scrollbar">
          <div className="flex items-center">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-nowrap">Order #</TableHead>
                  <TableHead className="text-nowrap">Customer Name</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-nowrap pl-4">
                    Product Color Temp
                  </TableHead>
                  <TableHead className="text-nowrap ">IP Rating</TableHead>
                  <TableHead className="text-nowrap ">Lamp Wattage</TableHead>
                  <TableHead className="text-nowrap">Product Price</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead className="text-nowrap">
                    Product Price After Discount
                  </TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="text-nowrap">Shipping Fee</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-nowrap">Customer</TableHead>
                  <TableHead className="text-nowrap">Phone Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-nowrap">
                    Estimated Order Date
                  </TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
                {error && (
                  <TableRow>
                    <TableCell
                      colSpan={12}
                      className="text-center text-destructive"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                )}
                {!loading && !error && filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center">
                      No Orders Found
                    </TableCell>
                  </TableRow>
                )}
                {!loading &&
                  !error &&
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="px-4 py-2">
                        <Link
                          href={`/admin/dashboard/orders/${order.id}`}
                          className="hover:text-primary hover:underline"
                        >
                          # {order.id}
                        </Link>
                      </TableCell>
                      <TableCell className="px-4 py-2 text-nowrap">
                        {order.shippingAddress?.fullName}
                      </TableCell>
                      <TableCell className="flex w-[250px] items-center">
                        {order.productImages &&
                          order.productImages.length > 0 && (
                            <Image
                              src={order.productImages[0]}
                              alt="Product Image"
                              width={40}
                              height={40}
                              className="rounded-md object-cover"
                            />
                          )}
                        <p className="ml-2 uppercase text-nowrap font-medium">
                          {order.productName}
                        </p>
                      </TableCell>
                      <TableCell className="capitalize font-medium pl-6">
                        {order.productColorTemp}
                      </TableCell>
                      <TableCell className="font-medium">
                        {order && order.Brand === "balcom"
                          ? order.configuration?.productIp
                          : "No IP"}
                      </TableCell>
                      <TableCell>
                        {order &&
                          order.Brand === "mister-led" &&
                          order.product?.chandelierLightingType === "lamp"
                          ? order.productChandLamp
                          : "No Lamp"}
                      </TableCell>
                      <TableCell className="px-4 py-2 font-medium">
                        <NormalPrice price={order.configPrice} />
                      </TableCell>
                      <TableCell className="text-nowrap px-4 py-2">
                        {order.discountRate && order.discountRate > 0 ? (
                          `${order.discountRate * 100}%`
                        ) : (
                          <span>No discount</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {order.discountRate && order.discountRate > 0 ? (
                          <DiscountPrice
                            price={order.configPrice}
                            discount={order.discountRate}
                          />
                        ) : (
                          <span>No Discount On This Product</span>
                        )}
                      </TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{formatPrice(order.shippingPrice)}</TableCell>
                      <TableCell>
                        {order.discountRate && order.discountRate > 0 ? (
                          <DiscountPrice
                            price={order.configPrice}
                            discount={order.discountRate}
                            quantity={order.quantity}
                            shippingPrice={order.shippingPrice}
                          />
                        ) : (
                          <NormalPrice
                            price={order.configPrice}
                            shippingPrice={order.shippingPrice}
                            quantity={order.quantity}
                          />
                        )}
                      </TableCell>
                      <TableCell className="text-nowrap">
                        {order.shippingAddress?.fullName}
                      </TableCell>
                      <TableCell>
                        {order.shippingAddress?.phoneNumber}
                      </TableCell>
                      <TableCell>
                        {order.createdAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-nowrap">
                        {order.OrderTimeReceived?.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <StatusDropdown
                          id={order.id}
                          orderStatus={order.status}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersClient;
