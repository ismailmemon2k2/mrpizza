import type { ThemeColors } from "@/constants/theme";
import type { OrderStatus } from "@/types/order";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};

// Colors depend on the active theme, so this is computed per-render from
// `useTheme().colors` rather than a static export.
export function getOrderStatusColors(colors: ThemeColors): Record<OrderStatus, string> {
  return {
    pending: colors.textMuted,
    preparing: colors.primary,
    ready: colors.warning,
    completed: colors.success,
    cancelled: colors.danger,
  };
}

const WORKFLOW_ORDER: OrderStatus[] = ["pending", "preparing", "ready", "completed"];

// Completed and cancelled orders are terminal. Anything else can move to the
// next workflow step or be cancelled — this is the constraint employees are
// held to. Admins bypass this (they can set any status directly).
export function getAvailableNextStatuses(current: OrderStatus): OrderStatus[] {
  if (current === "completed" || current === "cancelled") return [];

  const currentIndex = WORKFLOW_ORDER.indexOf(current);
  const next = WORKFLOW_ORDER[currentIndex + 1];
  return next ? [next, "cancelled"] : ["cancelled"];
}

export function isOrderTerminal(status: OrderStatus): boolean {
  return status === "completed" || status === "cancelled";
}
