"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProduct } from "@/lib/actions/products";

type Category = { id: string; name: string; slug: string; parentId: string | null };

export default function NewProductForm({
  topCategories,
  childCategories,
}: {
  topCategories: Category[];
  childCategories: Category[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("balcom");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [categoryId, setCategoryId] = useState(topCategories[0]?.id ?? "");
  const [lightingtypeId, setLightingtypeId] = useState("");

  const availableChildren = childCategories.filter((c) => c.parentId === categoryId);
  const selectedTop = topCategories.find((c) => c.id === categoryId);
  const selectedChild = childCategories.find((c) => c.id === lightingtypeId);

  function handleSubmit() {
    if (!productId || !productName || !price || !categoryId || !lightingtypeId) {
      toast.error("Fill in product ID, name, price, and category/subcategory");
      return;
    }
    if (!selectedTop || !selectedChild) {
      toast.error("Invalid category selection");
      return;
    }

    startTransition(async () => {
      try {
        const product = await createProduct({
          productId,
          productName,
          brand,
          sectionType: selectedTop.slug,
          spotlightType: selectedChild.slug,
          categoryId,
          lightingtypeId,
          price: Number(price),
          quantity: Number(quantity),
        });
        toast.success("Product created");
        router.push(`/admin/dashboard/products/${product.id}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to create product");
      }
    });
  }

  return (
    <Container>
      <Card className="max-w-lg glass-surface rounded-2xl">
        <CardHeader>
          <CardTitle>New product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Product ID / SKU</Label>
            <Input
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="e.g. jy-999-15w"
            />
          </div>
          <div className="space-y-2">
            <Label>Product name</Label>
            <Input value={productName} onChange={(e) => setProductName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Brand</Label>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balcom">Balcom</SelectItem>
                <SelectItem value="mister-led">Mister LED</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={categoryId}
              onValueChange={(v) => {
                setCategoryId(v);
                setLightingtypeId("");
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {topCategories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Subcategory (lighting type)</Label>
            <Select value={lightingtypeId} onValueChange={setLightingtypeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subcategory" />
              </SelectTrigger>
              <SelectContent>
                {availableChildren.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Price (EGP)</Label>
              <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Initial stock</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>
          <Button disabled={isPending} onClick={handleSubmit} className="w-full">
            Create product
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
