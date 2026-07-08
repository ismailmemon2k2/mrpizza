import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useTheme } from "@/hooks/useTheme";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <RootNavigator />
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { colors, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { color: colors.text },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="menu" />
        <Stack.Screen name="cart" options={{ headerShown: true, title: "Cart" }} />
        <Stack.Screen
          name="checkout"
          options={{ headerShown: true, title: "Checkout" }}
        />
        <Stack.Screen name="orders" options={{ headerShown: true, title: "My Orders" }} />
        <Stack.Screen name="admin" />
      </Stack>
    </>
  );
}
