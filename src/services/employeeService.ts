import * as employeesRepository from "@/services/storage/employeesRepository";
import type { Employee } from "@/types/employee";

export async function getEmployees(): Promise<Employee[]> {
  return employeesRepository.getEmployees();
}

export async function addEmployee(
  input: Omit<Employee, "id" | "role">,
): Promise<Employee> {
  const employee: Employee = { ...input, id: `emp-${Date.now()}`, role: "employee" };
  await employeesRepository.create(employee);
  return employee;
}

export async function updateEmployee(employee: Employee): Promise<void> {
  await employeesRepository.update(employee);
}

export async function deleteEmployee(employeeId: string): Promise<void> {
  await employeesRepository.remove(employeeId);
}
