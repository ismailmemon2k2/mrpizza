import { ADMIN_PIN } from "@/constants/config";
import { getEmployees } from "@/services/employeeService";
import type { Employee } from "@/types/employee";

export const ADMIN_ACCOUNT: Employee = {
  id: "admin",
  name: "Admin",
  pin: ADMIN_PIN,
  role: "admin",
};

// No backend yet — swap for `api.post('/auth/pin', { pin })` once one exists.
export async function verifyPin(pin: string): Promise<Employee | null> {
  if (pin === ADMIN_PIN) return ADMIN_ACCOUNT;

  const employees = await getEmployees();
  return employees.find((candidate) => candidate.pin === pin) ?? null;
}
