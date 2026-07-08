import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { Controller, useForm } from "react-hook-form";

import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FormInput } from "@/components/ui/FormInput";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { FontSize, FontWeight, Radius, Shadows, Spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { ADMIN_ACCOUNT } from "@/services/authService";
import {
  addEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "@/services/employeeService";
import { employeeSchema, type Employee, type EmployeeFormValues } from "@/types/employee";
import { getEmployeeDeleteBlockReason } from "@/utils/employeeRules";

export default function EmployeesScreen() {
  const { session } = useAuth();
  const { colors } = useTheme();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Employee | null>(null);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadEmployees = useCallback(async () => {
    setEmployees(await getEmployees());
  }, []);

  useEffect(() => {
    loadEmployees().finally(() => setIsLoading(false));
  }, [loadEmployees]);

  // The admin account is a fixed system login (not stored in the employees
  // repository), but it's shown here so the "last admin" / "can't delete
  // yourself" rules are visible and enforceable in the UI.
  const allAccounts = useMemo(() => [ADMIN_ACCOUNT, ...employees], [employees]);

  const openAddForm = () => {
    setEditingEmployee(null);
    setIsFormVisible(true);
  };

  const openEditForm = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormVisible(true);
  };

  const handleDelete = (employee: Employee) => {
    const blockReason = getEmployeeDeleteBlockReason(employee, allAccounts, session?.employeeId);
    if (blockReason) {
      setBlockedMessage(blockReason);
      return;
    }
    setBlockedMessage(null);
    setPendingDelete(employee);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteEmployee(pendingDelete.id);
    setPendingDelete(null);
    await loadEmployees();
  };

  const handleSaved = async () => {
    setIsFormVisible(false);
    await loadEmployees();
  };

  const columns: DataTableColumn<Employee>[] = [
    {
      key: "name",
      label: "Name",
      flex: 1.4,
      render: (employee) => <Text style={[styles.cell, { color: colors.text }]}>{employee.name}</Text>,
    },
    {
      key: "pin",
      label: "PIN",
      flex: 0.8,
      render: (employee) => <Text style={[styles.cell, { color: colors.text }]}>{employee.pin}</Text>,
    },
    {
      key: "role",
      label: "Role",
      flex: 0.8,
      render: (employee) => (
        <Text style={[styles.cell, { color: employee.role === "admin" ? colors.primary : colors.text, fontWeight: FontWeight.bold }]}>
          {employee.role === "admin" ? "Admin" : "Employee"}
        </Text>
      ),
    },
    {
      key: "actions",
      label: "",
      flex: 1,
      render: (employee) =>
        employee.role === "admin" ? (
          <Text style={[styles.systemBadge, { color: colors.textMuted }]}>System account</Text>
        ) : (
          <View style={styles.actionsRow}>
            <Text style={[styles.actionLink, { color: colors.primary }]} onPress={() => openEditForm(employee)}>
              Edit
            </Text>
            <Text style={[styles.actionLink, { color: colors.danger }]} onPress={() => handleDelete(employee)}>
              Delete
            </Text>
          </View>
        ),
    },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppHeader title="Employees" />

      {isLoading ? (
        <LoadingSpinner fullscreen label="Loading employees..." />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.actionRow}>
            <Button label="Add Employee" onPress={openAddForm} />
          </View>

          {blockedMessage ? (
            <Text style={[styles.blockedMessage, { color: colors.danger }]}>{blockedMessage}</Text>
          ) : null}

          <DataTable columns={columns} rows={allAccounts} keyExtractor={(employee) => employee.id} />
        </ScrollView>
      )}

      <EmployeeFormModal
        visible={isFormVisible}
        editingEmployee={editingEmployee}
        onClose={() => setIsFormVisible(false)}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        visible={!!pendingDelete}
        title="Delete employee"
        message={`Remove ${pendingDelete?.name} from the team? This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </View>
  );
}

interface EmployeeFormModalProps {
  visible: boolean;
  editingEmployee: Employee | null;
  onClose: () => void;
  onSaved: () => void;
}

function EmployeeFormModal({
  visible,
  editingEmployee,
  onClose,
  onSaved,
}: EmployeeFormModalProps) {
  const { colors } = useTheme();
  const { control, handleSubmit, reset, formState: { errors } } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: { name: editingEmployee?.name ?? "", pin: editingEmployee?.pin ?? "" },
  });

  useEffect(() => {
    reset({ name: editingEmployee?.name ?? "", pin: editingEmployee?.pin ?? "" });
  }, [editingEmployee, reset, visible]);

  const onSubmit = async (values: EmployeeFormValues) => {
    if (editingEmployee) {
      await updateEmployee({ ...editingEmployee, ...values });
    } else {
      await addEmployee(values);
    }
    onSaved();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }, Shadows.lg]}>
          <Text style={[styles.sheetTitle, { color: colors.text }]}>
            {editingEmployee ? "Edit Employee" : "Add Employee"}
          </Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="pin"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="PIN"
                keyboardType="number-pad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.pin?.message}
              />
            )}
          />

          <View style={styles.sheetActions}>
            <Button label="Cancel" variant="secondary" onPress={onClose} />
            <Button label="Save" onPress={handleSubmit(onSubmit)} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cell: {
    fontSize: FontSize.sm,
  },
  systemBadge: {
    fontSize: FontSize.sm,
    fontStyle: "italic",
  },
  blockedMessage: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  actionsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  actionLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: Spacing.lg,
  },
  sheet: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  sheetTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  sheetActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
