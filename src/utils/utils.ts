import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { addDays, format } from "date-fns";
import { enUS } from "date-fns/locale";
import { ProductChandLamp } from "@prisma/client";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(price);
};

export const authFormConfirmingOrderSchema = z.object({
  fullName: z.string().min(3, {
    message: "Full Name Must be At Least 3 Characters",
  }),
  phoneNumber: z.string().min(11, {
    message: "Please enter a valid number that contains 11 numbers",
  }),
  address: z.string().max(150, {
    message: "Address Must be clear",
  }),
  state: z.string().min(2, {
    message: "State Must be at least 2 characters like: Nasr City",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters ",
  }),
  zipCode: z
    .string()
    .min(2)
    .max(10, {
      message: "Zip Code Must be clear like cairo zip code: 4461232",
    })
    .optional(),
  country: z.string().min(2, {
    message: "country must be at least 2 characters like : EG",
  }),
});
export const calculateEstimatedDeliveryDate = () => {
  const currentDate = new Date();
  const estimatedDeliveryDate = addDays(currentDate, 4); // Adding 4 days to the current date
  return format(estimatedDeliveryDate, "dd MMM, yyyy", { locale: enUS });
};
export function isProductChandLamp(value: string): value is ProductChandLamp {
  return value === "lamp9w" || value === "lamp12w";
}
