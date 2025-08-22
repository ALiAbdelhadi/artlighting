"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

export default function ConfirmOrderButton({
  productId,
}: {
  productId: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleConfirmOrder = async () => {
    try {
      const response = await fetch("/api/check-auth", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        // User is authenticated, proceed with order
        router.push(`/confirm?productId=${productId}`);
      } else {
        // User is not authenticated, show dialog
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
    }
  };

  return (
    <>
      <Button onClick={handleConfirmOrder}>Confirm Your Order</Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to complete your order.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => router.push("/api/auth/login")}>
              Log In / Sign Up
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
