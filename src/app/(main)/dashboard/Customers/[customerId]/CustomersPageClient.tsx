'use client';
import Container from '@/app/components/Container';
import UserAvatar from '@/app/components/UserAvatar';
import DiscountPrice from '@/app/helpers/DiscountPrice';
import NormalPrice from '@/app/helpers/NormalPrice';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from '@/lib/utils';
import { Order, Product, ShippingAddress, User } from '@prisma/client';
import { format } from 'date-fns';
import { Edit2, FilePenIcon } from 'lucide-react';
import Link from 'next/link';
import StatusDropdown from '../../StatusDropdown';

interface UserClientProps {
    user: User & {
        shippingAddress: ShippingAddress | null
        product: Product | null
        orders: Order[]
    }
}

const CustomersPageClient = ({ user }: UserClientProps) => {
    const getStatusBadgeClassName = (status: string) => {
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

    const LABEL_MAP_COLOR: Record<string, string> = {
        awaiting_shipment: "Awaiting Shipment",
        processing: "Processing Shipment",
        cancelled: "Cancelled",
        fulfilled: "Fulfilled",
    };

    return (
        <div className="py-8">
            <Container>
                <h1 className="text-3xl font-bold mb-8">{user.shippingAddress?.fullName}'s Account</h1>
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
                            <UserAvatar email={user.email} className="mr-1.5"/>
                                <div>
                                    <h2 className="text-xl font-semibold">{user.email}</h2>
                                    <p className="text-sm text-muted-foreground">Member since {format(new Date(user.createdAt), 'MMMM yyyy')}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Phone:</strong> {user.shippingAddress?.phoneNumber || 'Not provided'}</p>
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
                                        <p>{user.shippingAddress?.fullName}</p>
                                        <p>{user.shippingAddress?.address}</p>
                                        <p>{user.email}</p>
                                        <p>{user.shippingAddress?.phoneNumber}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
                                    <div className="space-y-1">
                                        <p>{user.shippingAddress?.fullName}</p>
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
                                <TabsTrigger value="all">All Orders</TabsTrigger>
                                <TabsTrigger value="processing">Processing</TabsTrigger>
                                <TabsTrigger value="completed">Completed</TabsTrigger>
                            </TabsList>
                            <TabsContent value="all">
                                <div className="overflow-x-auto custom-scrollbar">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-nowrap">Order #</TableHead>
                                                <TableHead>Product</TableHead>
                                                <TableHead className="text-nowrap pl-4">Product Color Temp</TableHead>
                                                <TableHead className="text-nowrap ">IP Rating</TableHead>
                                                <TableHead className="text-nowrap ">Lamp Wattage</TableHead>
                                                <TableHead className="text-nowrap">Product Price</TableHead>
                                                <TableHead>Discount</TableHead>
                                                <TableHead className="text-nowrap">Product Price After Discount</TableHead>
                                                <TableHead>Qty</TableHead>
                                                <TableHead className="text-nowrap">Shipping Fee</TableHead>
                                                <TableHead>Total</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead className="text-nowrap">Estimated Order Date</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {
                                                user.orders.map((order) => (
                                                    <TableRow key={order.id}>
                                                        <TableCell className="hover:text-primary hover:underline">
                                                            <Link href={`/dashboard/Orders/${order.id}`}>
                                                                # {order.id}
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell className="flex w-[250px] items-center">
                                                            {order.productImages && order.productImages.length > 0 && (
                                                                <img
                                                                    src={order.productImages[0]}
                                                                    alt="Product Image"
                                                                    width={40}
                                                                    height={40}
                                                                    className="rounded-md object-cover"
                                                                />
                                                            )}
                                                            <p className="ml-2 uppercase text-nowrap font-medium">{order.productName}</p>
                                                        </TableCell>
                                                        <TableCell className="capitalize font-medium pl-6">{order.productColorTemp}</TableCell>
                                                        <TableCell className="font-medium">
                                                            {order && order.Brand === "Balcom" ? order.productIp : "No IP"}
                                                        </TableCell>
                                                        <TableCell>
                                                            {order && order.Brand === "MisterLed" && order.product?.ChandelierLightingType === "lamp"
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
                                                                <DiscountPrice price={order.configPrice} discount={order.discountRate} />
                                                            ) : (
                                                                <span>No Discount On This Product</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>{order.quantity}</TableCell>
                                                        <TableCell>{formatPrice(order.shippingPrice)}</TableCell>
                                                        <TableCell>
                                                            {
                                                                order.discountRate && order.discountRate > 0 ? (
                                                                    <DiscountPrice
                                                                        price={order.configPrice}
                                                                        discount={order.discountRate}
                                                                        quantity={order.quantity}
                                                                        shippingPrice={order.shippingPrice}
                                                                    />
                                                                ) : (
                                                                    <NormalPrice price={order.configPrice} shippingPrice={order.shippingPrice} quantity={order.quantity} />
                                                                )}
                                                        </TableCell>
                                                        <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
                                                        <TableCell className="text-nowrap">{order.OrderTimeReceived?.toLocaleDateString()}</TableCell>
                                                        <TableCell>
                                                            <StatusDropdown id={order.id} orderStatus={order.status} />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </Container>
            <style jsx global>{`
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #a0aec0 #edf2f7;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    height: 8px;
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #edf2f7;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, #4a5568, #2d3748);
                    border-radius: 10px;
                    border: 2px solid #edf2f7;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(180deg, #2d3748, #1a202c);
                }
            `}</style>
        </div>
    )
}

export default CustomersPageClient