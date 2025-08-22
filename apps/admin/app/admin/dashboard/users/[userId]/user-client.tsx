"use client";

import NormalPrice from "@/components//normal-price";
import { Container } from "@repo/ui";
import DiscountPrice from "@/components/discount-price";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserAvatar from "@/components/user-avatar";
import { formatPrice } from "@repo/ui/lib";
import { format } from "date-fns";
import { Edit2, FilePenIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import StatusDropdown from "../../status-dropdown-menu";
import { User, ShippingAddress, Product, Order } from "@prisma/client";

interface UserWithDetails extends User {
  shippingAddress: ShippingAddress | null;
  product: Product | null;
  orders: Order[];
}
interface UserPageClientProps {
  user: UserWithDetails;
}
const UserPageClient = ({ user }: UserPageClientProps) => {
  const [filter, setFilter] = useState<string>("all");
  const filteredOrders = useMemo(() => {
    if (!user) return [];
    return user.orders.filter((order) => {
      if (filter === "all") return true;
      return order.status.toLowerCase() === filter.toLowerCase();
    });
  }, [filter, user]);
  const renderOrders = useMemo(
    () =>
      filteredOrders.map((order) => (
        <TableRow key={order.id}>
          <TableCell className="hover:text-primary hover:underline">
            <Link href={`/admin/dashboard/Orders/${order.id}`}># {order.id}</Link>
          </TableCell>
          <TableCell className="flex w-[250px] items-center">
            {order.productImages && order.productImages.length > 0 && (
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
            {order && order.Brand === "balcom" ? order.productIp : "No IP"}
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
          <TableCell>{order.createdAt?.toLocaleDateString()}</TableCell>
          <TableCell className="text-nowrap">
            {order.OrderTimeReceived?.toLocaleDateString()}
          </TableCell>
          <TableCell>
            <StatusDropdown id={order.id} orderStatus={order.status} />
          </TableCell>
        </TableRow>
      )),
    [filteredOrders],
  );
  return (
    <div className="py-8">
      <Container>
        <h1 className="text-3xl font-bold mb-8">
          {user.shippingAddress?.fullName}&apos;s Account
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Personal Information
                <Button variant="ghost" size="icon">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <UserAvatar email={user.email} className="mr-1.5" />
                <div>
                  <h2 className="text-xl font-semibold">{user.email}</h2>
                  <p className="text-sm text-muted-foreground">
                    Member since {format(new Date(user.createdAt), "MMMM yyyy")}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p>
                  <strong>Full Name:</strong> {user.shippingAddress?.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {user.shippingAddress?.phoneNumber || "Not provided"}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Shipping Information
                <Button variant="ghost" size="icon">
                  <FilePenIcon className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Billing Address</h3>
                  <div className="space-y-1">
                    <p>{user.shippingAddress?.address}</p>
                    <p>{user.email}</p>
                    <p>{user.shippingAddress?.phoneNumber}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
                  <div className="space-y-1">
                    <p>{user.shippingAddress?.address}</p>
                    <p>{user.shippingAddress?.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>View and manage your past orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all" onClick={() => setFilter("all")}>
                  All Orders
                </TabsTrigger>
                <TabsTrigger
                  value="awaiting_shipment"
                  onClick={() => setFilter("awaiting_shipment")}
                >
                  Awaiting Shipment
                </TabsTrigger>
                <TabsTrigger
                  value="processing"
                  onClick={() => setFilter("processing")}
                >
                  Processing
                </TabsTrigger>
                <TabsTrigger
                  value="fulfilled"
                  onClick={() => setFilter("fulfilled")}
                >
                  Completed
                </TabsTrigger>
                <TabsTrigger
                  value="cancelled"
                  onClick={() => setFilter("cancelled")}
                >
                  Cancelled
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <div className="overflow-x-auto custom-scrollbar">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-nowrap">Order #</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-nowrap pl-4">
                          Product Color Temp
                        </TableHead>
                        <TableHead className="text-nowrap ">
                          IP Rating
                        </TableHead>
                        <TableHead className="text-nowrap ">
                          Lamp Wattage
                        </TableHead>
                        <TableHead className="text-nowrap">
                          Product Price
                        </TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead className="text-nowrap">
                          Product Price After Discount
                        </TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead className="text-nowrap">
                          Shipping Fee
                        </TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-nowrap">
                          Estimated Order Date
                        </TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>{renderOrders}</TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};
export default UserPageClient;
