import employeesData from "@/services/mocks/employees.json";
import { STORAGE_KEYS } from "@/constants/config";
import { readJSON, writeJSON } from "@/services/storage/asyncStorage";
import type { Employee } from "@/types/employee";

async function getAll(): Promise<Employee[]> {
  const stored = await readJSON<Employee[] | null>(STORAGE_KEYS.employees, null);
  if (stored) return stored;

  const seeded = employeesData as Employee[];
  await writeJSON(STORAGE_KEYS.employees, seeded);
  return seeded;
}

async function save(employees: Employee[]): Promise<void> {
  await writeJSON(STORAGE_KEYS.employees, employees);
}

export async function getEmployees(): Promise<Employee[]> {
  return getAll();
}

export async function create(employee: Employee): Promise<void> {
  const employees = await getAll();
  await save([...employees, employee]);
}

export async function update(employee: Employee): Promise<void> {
  const employees = await getAll();
  await save(
    employees.map((existing) => (existing.id === employee.id ? employee : existing)),
  );
}

export async function remove(employeeId: string): Promise<void> {
  const employees = await getAll();
  await save(employees.filter((existing) => existing.id !== employeeId));
}
