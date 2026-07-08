import { STORAGE_KEYS } from "@/constants/config";
import { readJSON, writeJSON } from "@/services/storage/asyncStorage";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/types/order";

// Records already persisted on a device before a schema change (e.g. the
// "refunded" status was retired in favor of the pending/preparing/ready/
// completed/cancelled workflow, and customerName/customerPhone became
// required) don't retroactively gain the new shape. Repair them on read so
// the UI never has to guess about missing/obsolete fields.
function normalizeOrder(order: Order): { order: Order; changed: boolean } {
  let changed = false;
  const status = order.status as OrderStatus | "refunded";

  const normalizedStatus: OrderStatus = ORDER_STATUSES.includes(status as OrderStatus)
    ? (status as OrderStatus)
    : "cancelled";
  if (normalizedStatus !== order.status) changed = true;

  const customerName = order.customerName || "Walk-in";
  if (customerName !== order.customerName) changed = true;

  const customerPhone = order.customerPhone ?? "";
  if (customerPhone !== order.customerPhone) changed = true;

  return {
    order: { ...order, status: normalizedStatus, customerName, customerPhone },
    changed,
  };
}

export async function getAll(): Promise<Order[]> {
  const stored = await readJSON<Order[]>(STORAGE_KEYS.orders, []);

  let anyChanged = false;
  const normalized = stored.map((order) => {
    const { order: fixed, changed } = normalizeOrder(order);
    if (changed) anyChanged = true;
    return fixed;
  });

  if (anyChanged) {
    await writeJSON(STORAGE_KEYS.orders, normalized);
  }
  return normalized;
}

export async function save(order: Order): Promise<void> {
  const orders = await getAll();
  await writeJSON(STORAGE_KEYS.orders, [order, ...orders]);
}

export async function remove(orderId: string): Promise<void> {
  const orders = await getAll();
  await writeJSON(
    STORAGE_KEYS.orders,
    orders.filter((order) => order.id !== orderId),
  );
}

export async function update(order: Order): Promise<void> {
  const orders = await getAll();
  await writeJSON(
    STORAGE_KEYS.orders,
    orders.map((existing) => (existing.id === order.id ? order : existing)),
  );
}

export async function updateStatus(
  orderId: string,
  status: OrderStatus,
): Promise<void> {
  const orders = await getAll();
  await writeJSON(
    STORAGE_KEYS.orders,
    orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
  );
}
