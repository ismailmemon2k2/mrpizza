import React, { createContext, useContext, useMemo } from "react";

import { STORAGE_KEYS } from "@/constants/config";
import { useAsyncStorage } from "@/hooks/useAsyncStorage";
import { verifyPin } from "@/services/authService";
import type { EmployeeRole, EmployeeSession } from "@/types/employee";

interface AuthContextValue {
  session: EmployeeSession | null;
  isHydrated: boolean;
  isAdmin: boolean;
  login: (pin: string) => Promise<EmployeeRole | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { value: session, setValue: setSession, isHydrated } =
    useAsyncStorage<EmployeeSession | null>(STORAGE_KEYS.session, null);

  const login = async (pin: string) => {
    const employee = await verifyPin(pin);
    if (!employee) return null;

    setSession({ employeeId: employee.id, name: employee.name, role: employee.role });
    return employee.role;
  };

  const logout = () => setSession(null);

  const contextValue = useMemo(
    () => ({
      session,
      isHydrated,
      isAdmin: session?.role === "admin",
      login,
      logout,
    }),
    [session, isHydrated],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
