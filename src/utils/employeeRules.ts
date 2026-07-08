import type { Employee } from "@/types/employee";

// Returns a human-readable reason the deletion is blocked, or null if it's
// allowed. `allEmployees` must include every account the app treats as a
// login identity (the fixed admin account plus the managed employee list) so
// the "last admin" check is accurate.
export function getEmployeeDeleteBlockReason(
  target: Employee,
  allEmployees: Employee[],
  currentEmployeeId: string | undefined,
): string | null {
  if (target.id === currentEmployeeId) {
    return "You cannot delete your own account while logged in.";
  }

  if (target.role === "admin") {
    const adminCount = allEmployees.filter((employee) => employee.role === "admin").length;
    if (adminCount <= 1) {
      return "At least one admin account must remain.";
    }
  }

  return null;
}
