import * as menuRepository from "@/services/storage/menuRepository";
import type { Category, MenuItem } from "@/types/menu";

export async function getCategories(): Promise<Category[]> {
  return menuRepository.getCategories();
}

export async function getMenuItems(): Promise<MenuItem[]> {
  return menuRepository.getItems();
}

export async function createMenuItem(
  input: Omit<MenuItem, "id">,
): Promise<MenuItem> {
  const item: MenuItem = { ...input, id: `item-${Date.now()}` };
  await menuRepository.create(item);
  return item;
}

export async function updateMenuItem(item: MenuItem): Promise<void> {
  await menuRepository.update(item);
}

export async function deleteMenuItem(itemId: string): Promise<void> {
  await menuRepository.remove(itemId);
}
