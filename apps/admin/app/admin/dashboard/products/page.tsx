
import DashboardHeader from "@/components/dashboard-header";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@repo/database";
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
import { MoveHorizontalIcon } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Products = async () => {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId || !user) {
    console.log("User Not Found.");
    return notFound();
  }
  const isAuthenticated = !!userId;
  console.log("Is user authenticated", isAuthenticated);
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  if (user.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
    console.log("User Not authorized");
    return notFound();
  }
  const orders = await prisma.order.findMany({
    where: {
      isCompleted: true,
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      shippingAddress: true,
      product: true,
    },
  });
  return (
    <div className="flex flex-col min-h-screen pb-10">
      <DashboardHeader Route="Products" />
      <div className="mt-8">
        <Container>
          <h1 className="font-semibold text-lg">Products</h1>
          <div className="overflow-x-auto border rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>quantity</TableHead>
                  <TableHead>action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="flex items-center">
                      <Image
                        src={order.productImages[0]}
                        alt={order.productName}
                        width={60}
                        height={60}
                        className="rounded-lg"
                      />
                      <p className="ml-2 uppercase">{order.productName}</p>
                    </TableCell>
                    <TableCell>{order.product.brand}</TableCell>
                    <TableCell>
                      {formatPrice(order.productPrice + order.shippingPrice)}
                    </TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoveHorizontalIcon className="w-4 h-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View order</DropdownMenuItem>
                          <DropdownMenuItem>Customer details</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Products;
