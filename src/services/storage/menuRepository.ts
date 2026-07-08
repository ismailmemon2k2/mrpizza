import menuData from "@/services/mocks/menu.json";
import { STORAGE_KEYS } from "@/constants/config";
import { readJSON, writeJSON } from "@/services/storage/asyncStorage";
import type { MenuItem } from "@/types/menu";

const SEED_ITEMS = menuData.items as MenuItem[];

function isValidPrice(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isValidMenuItem(item: MenuItem): boolean {
  return isValidPrice(item.price) && isValidPrice(item.costPrice);
}

// AsyncStorage records are written once and read back verbatim — they don't
// pick up new required fields added to MenuItem after they were persisted
// (e.g. `costPrice`, added after some items were already seeded on a device).
// Repair those records against the current seed definition instead of
// serving partial data to the UI. Anything that still can't be repaired
// (no matching seed record) is dropped rather than shown with missing prices.
function repairMenuItem(item: MenuItem): MenuItem | null {
  if (isValidMenuItem(item)) return item;

  const seedMatch = SEED_ITEMS.find((seedItem) => seedItem.id === item.id);
  const price = isValidPrice(item.price) ? item.price : seedMatch?.price;
  const costPrice = isValidPrice(item.costPrice) ? item.costPrice : seedMatch?.costPrice;

  if (!isValidPrice(price) || !isValidPrice(costPrice)) return null;

  return { ...item, price, costPrice };
}

function repairMenuItems(items: MenuItem[]): { items: MenuItem[]; changed: boolean } {
  let changed = false;
  const repaired: MenuItem[] = [];

  for (const item of items) {
    if (isValidMenuItem(item)) {
      repaired.push(item);
      continue;
    }

    changed = true;
    const fixed = repairMenuItem(item);
    if (fixed) repaired.push(fixed);
  }

  return { items: repaired, changed };
}

async function getAll(): Promise<MenuItem[]> {
  const stored = await readJSON<MenuItem[] | null>(STORAGE_KEYS.menu, null);
  if (!stored) {
    await writeJSON(STORAGE_KEYS.menu, SEED_ITEMS);
    return SEED_ITEMS;
  }

  const { items, changed } = repairMenuItems(stored);
  if (changed) {
    await writeJSON(STORAGE_KEYS.menu, items);
  }
  return items;
}

async function save(items: MenuItem[]): Promise<void> {
  await writeJSON(STORAGE_KEYS.menu, items);
}

export async function getCategories() {
  return menuData.categories;
}

export async function getItems(): Promise<MenuItem[]> {
  return getAll();
}

export async function create(item: MenuItem): Promise<void> {
  const items = await getAll();
  await save([...items, item]);
}

export async function update(item: MenuItem): Promise<void> {
  const items = await getAll();
  await save(items.map((existing) => (existing.id === item.id ? item : existing)));
}

export async function remove(itemId: string): Promise<void> {
  const items = await getAll();
  await save(items.filter((existing) => existing.id !== itemId));
}
