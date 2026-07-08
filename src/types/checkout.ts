import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Customer name is required"),
  customerPhone: z
    .string()
    .min(7, "Enter a valid phone number")
    .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number"),
  tableNumber: z.string().max(10, "Table number is too long").optional(),
  customerNote: z.string().max(200, "Note is too long").optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
