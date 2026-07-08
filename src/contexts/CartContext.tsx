import React, { createContext, useContext, useMemo } from "react";

import { STORAGE_KEYS } from "@/constants/config";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { useAsyncStorage } from "@/hooks/useAsyncStorage";
import type { CartItem } from "@/types/order";
import type { MenuItem } from "@/types/menu";
import { calculateTotals, type OrderTotals } from "@/utils/calculateTotals";

interface CartContextValue {
  items: CartItem[];
  totals: OrderTotals;
  isHydrated: boolean;
  addItem: (menuItem: MenuItem) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  removeItem: (menuItemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { value: items, setValue: setItems, isHydrated } = useAsyncStorage<
    CartItem[]
  >(STORAGE_KEYS.cart, []);
  const { settings } = useSettingsContext();

  const addItem = (menuItem: MenuItem) => {
    const existing = items.find((item) => item.menuItem.id === menuItem.id);
    if (existing) {
      setItems(
        items.map((item) =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
      return;
    }
    setItems([...items, { menuItem, quantity: 1 }]);
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }
    setItems(
      items.map((item) =>
        item.menuItem.id === menuItemId ? { ...item, quantity } : item,
      ),
    );
  };

  const removeItem = (menuItemId: string) => {
    setItems(items.filter((item) => item.menuItem.id !== menuItemId));
  };

  const clearCart = () => setItems([]);

  const totals = useMemo(
    () => calculateTotals(items, settings.taxRate),
    [items, settings.taxRate],
  );

  const contextValue = useMemo(
    () => ({
      items,
      totals,
      isHydrated,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, totals, isHydrated],
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export function useCartContext(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}
