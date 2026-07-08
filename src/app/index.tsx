import { Redirect } from "expo-router";
import React from "react";

import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const { session, isHydrated, isAdmin } = useAuth();

  if (!isHydrated) return null;

  if (!session) return <Redirect href="/login" />;
  return <Redirect href={isAdmin ? "/admin" : "/menu"} />;
}
