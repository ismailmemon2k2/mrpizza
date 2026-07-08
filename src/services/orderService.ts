import * as ordersRepository from "@/services/storage/ordersRepository";
import type { Order, OrderStatus } from "@/types/order";

// No backend yet — swap for `api.post('/orders', order)` once one exists.
export async function submitOrder(order: Order): Promise<{ success: true; orderId: string }> {
  await ordersRepository.save(order);
  return { success: true, orderId: order.id };
}

export async function getOrders(): Promise<Order[]> {
  return ordersRepository.getAll();
}

export async function deleteOrder(orderId: string): Promise<void> {
  await ordersRepository.remove(orderId);
}

export async function updateOrder(order: Order): Promise<void> {
  await ordersRepository.update(order);
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  await ordersRepository.updateStatus(orderId, status);
}
