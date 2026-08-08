"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUp, ArrowDown } from "lucide-react";
import { createCategory, moveCategory } from "@/lib/actions/categories";

type CategoryWithCount = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  order: number;
  isActive: boolean;
  _count: { products: number; subProducts: number };
};

export default function CategoriesManager({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState<string>("__top__");

  const topCategories = categories.filter((c) => c.parentId === null);

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
      <Card className="max-w-lg mb-6 glass-surface rounded-2xl">
        <CardHeader>
          <CardTitle>Add category / subcategory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Parent (leave as "Top-level" for a new section)</Label>
            <Select value={parentId} onValueChange={setParentId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__top__">Top-level</SelectItem>
                {topCategories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    Under {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            disabled={isPending || !name || !slug}
            onClick={() =>
              run(async () => {
                await createCategory({
                  name,
                  slug,
                  parentId: parentId === "__top__" ? null : parentId,
                });
                setName("");
                setSlug("");
              }, "Category created")
            }
          >
            Create
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {topCategories.map((top) => {
          const children = categories
            .filter((c) => c.parentId === top.id)
            .sort((a, b) => a.order - b.order);

          return (
            <Card key={top.id} className="glass-surface rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {top.name}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    ({top._count.products} products)
                  </span>
                </CardTitle>
                {!top.isActive && <Badge variant="secondary">Inactive</Badge>}
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {children.map((child, index) => (
                    <li
                      key={child.id}
                      className="flex items-center justify-between border rounded-lg p-2"
                    >
                      <span>
                        {child.name}{" "}
                        <span className="text-sm text-muted-foreground">
                          ({child._count.subProducts} products)
                        </span>
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={isPending || index === 0}
                          onClick={() => run(() => moveCategory(child.id, "up"), "Moved up")}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={isPending || index === children.length - 1}
                          onClick={() =>
                            run(() => moveCategory(child.id, "down"), "Moved down")
                          }
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}
