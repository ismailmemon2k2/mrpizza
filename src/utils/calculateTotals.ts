import type { CartItem } from "@/types/order";

export interface OrderTotals {
  subtotal: number;
  tax: number;
  total: number;
}

export function calculateTotals(items: CartItem[], taxRate: number): OrderTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0,
  );
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return {
    subtotal: round(subtotal),
    tax: round(tax),
    total: round(total),
  };
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
