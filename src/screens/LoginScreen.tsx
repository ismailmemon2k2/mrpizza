import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Logo } from "@/components/ui/Logo";
import { NumberPad } from "@/components/ui/NumberPad";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { FontSize, FontWeight, Spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

const PIN_LENGTH = 4;

export default function LoginScreen() {
  const { login } = useAuth();
  const { colors } = useTheme();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleDigitPress = async (digit: string) => {
    if (pin.length >= PIN_LENGTH) return;

    const nextPin = pin + digit;
    setPin(nextPin);
    setError(null);

    if (nextPin.length === PIN_LENGTH) {
      const role = await login(nextPin);
      if (role) {
        router.replace(role === "admin" ? "/admin" : "/menu");
      } else {
        setError("Incorrect PIN");
        setPin("");
      }
    }
  };

  const handleBackspace = () => {
    setPin((current) => current.slice(0, -1));
    setError(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.themeToggleSlot}>
        <ThemeToggle />
      </View>

      <Logo size="large" />
      <Text style={[styles.title, { color: colors.text }]}>Enter Employee PIN</Text>
      <View style={styles.dots}>
        {Array.from({ length: PIN_LENGTH }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { borderColor: colors.border },
              index < pin.length && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
          />
        ))}
      </View>
      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
      <NumberPad onDigitPress={handleDigitPress} onBackspace={handleBackspace} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.lg,
    padding: Spacing.lg,
  },
  themeToggleSlot: {
    position: "absolute",
    top: Spacing.xl,
    right: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  dots: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  error: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
});
