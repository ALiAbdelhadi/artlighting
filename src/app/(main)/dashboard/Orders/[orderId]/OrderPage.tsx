import Container from "@/app/components/Container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatPrice } from "@/lib/utils";
import { Order } from "@prisma/client";
import { Box, Calendar, MapPin, Phone, Tag, Truck, User } from "lucide-react";
import React from 'react';
import StatusDropdown from "../../StatusDropdown";

interface OrderClientPageProps {
    order: Order;
}

export default function Component({ order }: OrderClientPageProps) {
    const orderProgress = getOrderProgress(order.status);

    return (
        <div>
            <Card>
                <CardHeader className="bg-primary px-4 md:px-6  text-white rounded-lg ">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-3xl">Order #{order.id}</CardTitle>
                            <p className="text-primary-foreground/80">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <StatusDropdown id={order.id} orderStatus={order.status} />
                    </div>
                </CardHeader>
            </Card>
            <Container >
                <Card className="overflow-hidden">
                    <CardContent className="py-6 px-4 space-y-8">
                        {/* Order Status */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 flex items-center">
                                <Tag className="mr-2" /> Order Status
                            </h2>
                            <div className="mb-2 text-sm text-muted-foreground">
                                Last updated: {new Date(order.updatedAt).toLocaleString()}
                            </div>
                            <Progress value={orderProgress} className="w-full h-3" />
                            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                                <span>Ordered</span>
                                <span>Processing</span>
                                <span>fulfilled</span>
                            </div>
                        </section>
                        {/* Product Information */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 flex items-center">
                                <Box className="mr-2" /> Product Information
                            </h2>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                                        {order.productImages?.[0] && (
                                            <img
                                                src={order.productImages[0]}
                                                alt={order.productName}
                                                className="w-full md:w-48 h-48 object-cover rounded-md shadow-md mb-4 md:mb-0"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold mb-2">{order.productName}</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                                <ProductDetail label="Quantity" value={order.quantity} />
                                                <ProductDetail label="Color Temperature" value={order.productColorTemp} />
                                                <ProductDetail label="IP Rating" value={order.productIp} />
                                                <ProductDetail label="Lamp Type" value={order.productChandLamp} />
                                                {order.Brand && <ProductDetail label="Brand" value={order.Brand} />}
                                                {order.ChandelierLightingType && <ProductDetail label="Lighting Type" value={order.ChandelierLightingType} />}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>
                        {/* Price Breakdown */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 flex items-center">
                                Price Breakdown
                            </h2>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <PriceDetail label="Product Price" value={formatPrice(order.productPrice)} />
                                        <PriceDetail label="Configuration Price" value={formatPrice(order.configPrice)} />
                                        {order.priceIncrease > 0 && (
                                            <PriceDetail label="Price Increase" value={formatPrice(order.priceIncrease)} />
                                        )}
                                        {order.discountApplied && (
                                            <PriceDetail
                                                label={`Discount (${(order.discountRate * 100).toFixed(0)}%)`}
                                                value={`-${formatPrice((order.productPrice - (order.discountedPrice || 0)) * order.quantity)}`}
                                                className="text-green-600"
                                            />
                                        )}
                                        <PriceDetail label="Shipping" value={formatPrice(order.shippingPrice)} />
                                        <div className="border-t pt-4 mt-4">
                                            <PriceDetail label="Total" value={formatPrice(order.totalPrice)} className="font-bold text-lg" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Shipping Information */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 flex items-center">
                                <Truck className="mr-2" /> Shipping Information
                            </h2>
                            <Card>
                                <CardContent className="p-6">
                                    {order.shippingAddress ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <ShippingDetail icon={User} value={order.shippingAddress.fullName} />
                                                <ShippingDetail icon={Phone} value={order.shippingAddress.phoneNumber} />
                                            </div>
                                            <div className="space-y-4">
                                                <ShippingDetail
                                                    icon={MapPin}
                                                    value={`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`}
                                                />
                                                {order.OrderTimeReceived && (
                                                    <ShippingDetail
                                                        icon={Calendar}
                                                        value={`Estimated Delivery: ${new Date(order.OrderTimeReceived).toLocaleDateString()}`}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">No shipping information available</p>
                                    )}
                                </CardContent>
                            </Card>
                        </section>
                    </CardContent>
                </Card>
            </Container>
        </div>
    );
}

function ProductDetail({ label, value }: { label: string; value: string | number }) {
    return (
        <div>
            <span className="text-muted-foreground">{label}:</span>
            <Badge variant="secondary" className="ml-2">
                {value}
            </Badge>
        </div>
    );
}

function PriceDetail({ label, value, className = '' }: { label: string; value: string; className?: string }) {
    return (
        <div className={`flex justify-between items-center ${className}`}>
            <span className="text-muted-foreground">{label}:</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}

function ShippingDetail({ icon: Icon, value }: { icon: React.ElementType; value: string }) {
    return (
        <div className="flex items-start">
            <Icon className="mr-2 h-5 w-5 mt-1 text-muted-foreground" />
            <span>{value}</span>
        </div>
    );
}

function getOrderProgress(status: string): number {
    switch (status.toLowerCase()) {
        case 'processing':
            return 50;
        case 'fulfilled':
            return 100;
        default:
            return 0;
    }
}