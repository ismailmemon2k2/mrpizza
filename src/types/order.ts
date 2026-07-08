import type { MenuItem } from "@/types/menu";

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  note?: string;
}

export type OrderStatus = "pending" | "preparing" | "ready" | "completed" | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

export interface Order {
  id: string;
  employeeId: string;
  employeeName: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  tableNumber?: string;
  customerNote?: string;
  createdAt: string;
}
