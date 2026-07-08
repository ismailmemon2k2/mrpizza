import { z } from "zod";

export interface Category {
  id: string;
  name: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  costPrice: number;
  imageUrl?: string;
}

export const menuItemSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  categoryId: z.string().min(1, "Category is required"),
  price: z.number().positive("Price must be greater than 0"),
  costPrice: z.number().min(0, "Cost price can't be negative"),
});

export type MenuItemFormValues = z.infer<typeof menuItemSchema>;
