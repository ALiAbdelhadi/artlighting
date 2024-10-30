import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const formatPrice = (price: number) => {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EGP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
    return formatter.format(price)
}

export const authFormConfirmingOrderSchema = z.object({
    fullName: z.string().min(3),
    phoneNumber: z.string().min(11),
    address: z.string().max(150),
    state: z.string().min(2),
    city: z.string().min(2),
    zipCode: z.string().min(2).max(10).optional(),
    country: z.string().min(2)
});