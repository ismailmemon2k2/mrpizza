import type { Category } from "@/types/menu";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/types/order";
import { dayKey, formatDateLabel } from "@/utils/date";

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

// Cancelled orders never collected/kept revenue, so they're excluded from
// every money and "best seller" calculation below. Pending/preparing/ready
// orders still count — payment is captured at checkout time, before the
// kitchen workflow completes.
function isRevenueRecognized(order: Order): boolean {
  return order.status !== "cancelled";
}

export interface DashboardStats {
  totalOrders: number;
  statusCounts: Record<OrderStatus, number>;
  grossRevenue: number;
  totalCost: number;
  grossProfit: number;
  totalRevenueWithTax: number;
  averageOrderValue: number;
}

export function computeDashboardStats(orders: Order[]): DashboardStats {
  const activeOrders = orders.filter(isRevenueRecognized);

  let grossRevenue = 0;
  let totalCost = 0;
  let totalRevenueWithTax = 0;

  for (const order of activeOrders) {
    grossRevenue += order.subtotal;
    totalRevenueWithTax += order.total;

    for (const line of order.items) {
      totalCost += line.menuItem.costPrice * line.quantity;
    }
  }

  const statusCounts = ORDER_STATUSES.reduce((counts, status) => {
    counts[status] = orders.filter((order) => order.status === status).length;
    return counts;
  }, {} as Record<OrderStatus, number>);

  return {
    totalOrders: orders.length,
    statusCounts,
    grossRevenue: round(grossRevenue),
    totalCost: round(totalCost),
    grossProfit: round(grossRevenue - totalCost),
    totalRevenueWithTax: round(totalRevenueWithTax),
    averageOrderValue: activeOrders.length
      ? round(totalRevenueWithTax / activeOrders.length)
      : 0,
  };
}

export interface ChartPoint {
  label: string;
  value: number;
}

export function computeRevenueByDay(orders: Order[], days = 7): ChartPoint[] {
  return buildDailySeries(orders, days, (order) => order.total);
}

export function computeOrdersByDay(orders: Order[], days = 7): ChartPoint[] {
  return buildDailySeries(orders, days, () => 1);
}

function buildDailySeries(
  orders: Order[],
  days: number,
  valueOf: (order: Order) => number,
): ChartPoint[] {
  const activeOrders = orders.filter(isRevenueRecognized);
  const buckets = new Map<string, number>();

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString();
    buckets.set(dayKey(date), 0);
  }

  for (const order of activeOrders) {
    const key = dayKey(order.createdAt);
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + valueOf(order));
    }
  }

  return Array.from(buckets.entries()).map(([key, value]) => ({
    label: formatDateLabel(`${key}T00:00:00.000Z`),
    value: round(value),
  }));
}

export interface CategorySales {
  categoryId: string;
  categoryName: string;
  revenue: number;
  percentage: number;
}

export function computeCategorySales(
  orders: Order[],
  categories: Category[],
): CategorySales[] {
  const activeOrders = orders.filter(isRevenueRecognized);
  const revenueByCategory = new Map<string, number>();

  for (const order of activeOrders) {
    for (const line of order.items) {
      const key = line.menuItem.categoryId;
      const lineRevenue = line.menuItem.price * line.quantity;
      revenueByCategory.set(key, (revenueByCategory.get(key) ?? 0) + lineRevenue);
    }
  }

  const totalRevenue = Array.from(revenueByCategory.values()).reduce(
    (sum, value) => sum + value,
    0,
  );

  return categories
    .map((category) => {
      const revenue = revenueByCategory.get(category.id) ?? 0;
      return {
        categoryId: category.id,
        categoryName: category.name,
        revenue: round(revenue),
        percentage: totalRevenue ? round((revenue / totalRevenue) * 100) : 0,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);
}

export interface TopItem {
  itemId: string;
  name: string;
  quantity: number;
  revenue: number;
}

export function computeTopItems(orders: Order[], limit = 5): TopItem[] {
  const activeOrders = orders.filter(isRevenueRecognized);
  const stats = new Map<string, TopItem>();

  for (const order of activeOrders) {
    for (const line of order.items) {
      const existing = stats.get(line.menuItem.id);
      const revenue = line.menuItem.price * line.quantity;
      if (existing) {
        existing.quantity += line.quantity;
        existing.revenue = round(existing.revenue + revenue);
      } else {
        stats.set(line.menuItem.id, {
          itemId: line.menuItem.id,
          name: line.menuItem.name,
          quantity: line.quantity,
          revenue: round(revenue),
        });
      }
    }
  }

  return Array.from(stats.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}
