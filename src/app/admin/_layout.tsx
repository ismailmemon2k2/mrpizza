import { Tabs, router } from "expo-router";
import React, { useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

export default function AdminLayout() {
  const { session, isHydrated, isAdmin } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    if (!isHydrated) return;
    if (!session) {
      router.replace("/login");
    } else if (!isAdmin) {
      router.replace("/menu");
    }
  }, [isHydrated, session, isAdmin]);

  if (!isHydrated || !isAdmin) return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="orders" options={{ title: "Orders" }} />
      <Tabs.Screen name="analytics" options={{ title: "Analytics" }} />
      <Tabs.Screen name="products" options={{ title: "Products" }} />
      <Tabs.Screen name="employees" options={{ title: "Employees" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
