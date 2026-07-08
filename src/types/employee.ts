import { z } from "zod";

export type EmployeeRole = "employee" | "admin";

export interface Employee {
  id: string;
  name: string;
  pin: string;
  role: EmployeeRole;
}

export interface EmployeeSession {
  employeeId: string;
  name: string;
  role: EmployeeRole;
}

export const employeeSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  pin: z.string().regex(/^\d{4,6}$/, "PIN must be 4-6 digits"),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
