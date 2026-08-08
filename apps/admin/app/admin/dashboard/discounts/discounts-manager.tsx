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
import { formatPrice } from "@/lib/utils";
import { createDiscount, deactivateDiscount } from "@/lib/actions/discounts";

type Discount = {
  id: string;
  type: string;
  scope: string;
  value: number;
  code: string | null;
  product: { productName: string } | null;
  category: { name: string } | null;
};
type Category = { id: string; name: string };

export default function DiscountsManager({
  discounts,
  categories,
  isOwner,
}: {
  discounts: Discount[];
  categories: Category[];
  isOwner: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [scope, setScope] = useState<"category" | "global">("global");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState("");
  const [code, setCode] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");

  function run(fn: () => Promise<unknown>, msg: string) {
    startTransition(async () => {
      try {
        await fn();
        toast.success(msg);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  return (
    <Container>
      {isOwner && (
        <Card className="max-w-2xl mb-6 glass-surface rounded-2xl">
          <CardHeader>
            <CardTitle>New store-wide or category discount</CardTitle>
            <p className="text-sm text-muted-foreground">
              Product-specific discounts are created from that product's edit page.
            </p>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-2 items-end">
            <div className="space-y-1">
              <Label>Scope</Label>
              <Select value={scope} onValueChange={(v) => setScope(v as "category" | "global")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Store-wide</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {scope === "category" && (
              <div className="space-y-1">
                <Label>Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as "percentage" | "fixed")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Value</Label>
              <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Coupon code (optional)</Label>
              <Input value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
            <Button
              className="col-span-2 md:col-span-5"
              disabled={isPending || !value}
              onClick={() =>
                run(
                  () =>
                    createDiscount({
                      type,
                      scope,
                      value: Number(value),
                      code: code || null,
                      categoryId: scope === "category" ? categoryId : null,
                    }),
                  "Discount created"
                )
              }
            >
              Create discount
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="glass-surface rounded-2xl">
        <CardHeader>
          <CardTitle>Active discounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {discounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active discounts.</p>
          ) : (
            discounts.map((d) => (
              <div key={d.id} className="flex items-center justify-between border rounded-lg p-2">
                <span>
                  {d.type === "percentage" ? `${d.value}%` : formatPrice(d.value)} off —{" "}
                  {d.scope === "global"
                    ? "store-wide"
                    : d.scope === "category"
                      ? d.category?.name
                      : d.product?.productName}
                  {d.code ? ` — code ${d.code}` : ""}
                </span>
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isPending}
                    onClick={() => run(() => deactivateDiscount(d.id), "Discount deactivated")}
                  >
                    Deactivate
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
