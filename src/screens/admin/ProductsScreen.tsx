import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { Controller, useForm } from "react-hook-form";

import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FilterChips } from "@/components/ui/FilterChips";
import { FormInput } from "@/components/ui/FormInput";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { FontSize, FontWeight, Radius, Shadows, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import {
  createMenuItem,
  deleteMenuItem,
  getCategories,
  getMenuItems,
  updateMenuItem,
} from "@/services/menuService";
import { menuItemSchema, type Category, type MenuItem, type MenuItemFormValues } from "@/types/menu";
import { formatPrice } from "@/utils/currency";

export default function ProductsScreen() {
  const { colors } = useTheme();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    const [loadedItems, loadedCategories] = await Promise.all([
      getMenuItems(),
      getCategories(),
    ]);
    setItems(loadedItems);
    setCategories(loadedCategories);
  }, []);

  useEffect(() => {
    loadData().finally(() => setIsLoading(false));
  }, [loadData]);

  const categoryName = (categoryId: string) =>
    categories.find((category) => category.id === categoryId)?.name ?? categoryId;

  const openAddForm = () => {
    setEditingItem(null);
    setIsFormVisible(true);
  };

  const openEditForm = (item: MenuItem) => {
    setEditingItem(item);
    setIsFormVisible(true);
  };

  const handleDelete = (item: MenuItem) => {
    setPendingDelete(item);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteMenuItem(pendingDelete.id);
    setPendingDelete(null);
    await loadData();
  };

  const handleSaved = async () => {
    setIsFormVisible(false);
    await loadData();
  };

  const columns: DataTableColumn<MenuItem>[] = [
    {
      key: "name",
      label: "Name",
      flex: 1.4,
      render: (item) => <Text style={[styles.cell, { color: colors.text }]}>{item.name}</Text>,
    },
    {
      key: "category",
      label: "Category",
      flex: 1,
      render: (item) => (
        <Text style={[styles.cell, { color: colors.text }]}>{categoryName(item.categoryId)}</Text>
      ),
    },
    {
      key: "price",
      label: "Price",
      flex: 0.8,
      render: (item) => (
        <Text style={[styles.cellStrong, { color: colors.text }]}>{formatPrice(item.price)}</Text>
      ),
    },
    {
      key: "cost",
      label: "Cost",
      flex: 0.8,
      render: (item) => <Text style={[styles.cell, { color: colors.text }]}>{formatPrice(item.costPrice)}</Text>,
    },
    {
      key: "margin",
      label: "Margin",
      flex: 0.7,
      render: (item) => (
        <Text style={[styles.cell, { color: colors.text }]}>
          {item.price ? `${Math.round(((item.price - item.costPrice) / item.price) * 100)}%` : "—"}
        </Text>
      ),
    },
    {
      key: "actions",
      label: "",
      flex: 1,
      render: (item) => (
        <View style={styles.actionsRow}>
          <Text style={[styles.actionLink, { color: colors.primary }]} onPress={() => openEditForm(item)}>
            Edit
          </Text>
          <Text style={[styles.actionLink, { color: colors.danger }]} onPress={() => handleDelete(item)}>
            Delete
          </Text>
        </View>
      ),
    },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppHeader title="Products" />

      {isLoading ? (
        <LoadingSpinner fullscreen label="Loading products..." />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.actionRow}>
            <Button label="Add Item" onPress={openAddForm} />
          </View>

          <DataTable columns={columns} rows={items} keyExtractor={(item) => item.id} />
        </ScrollView>
      )}

      <ProductFormModal
        visible={isFormVisible}
        categories={categories}
        editingItem={editingItem}
        onClose={() => setIsFormVisible(false)}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        visible={!!pendingDelete}
        title="Delete item"
        message={`Delete "${pendingDelete?.name}" from the menu? This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </View>
  );
}

interface ProductFormModalProps {
  visible: boolean;
  categories: Category[];
  editingItem: MenuItem | null;
  onClose: () => void;
  onSaved: () => void;
}

function ProductFormModal({
  visible,
  categories,
  editingItem,
  onClose,
  onSaved,
}: ProductFormModalProps) {
  const { colors } = useTheme();
  const { control, handleSubmit, reset, formState: { errors } } = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: editingItem?.name ?? "",
      categoryId: editingItem?.categoryId ?? categories[0]?.id ?? "",
      price: editingItem?.price ?? 0,
      costPrice: editingItem?.costPrice ?? 0,
    },
  });

  useEffect(() => {
    reset({
      name: editingItem?.name ?? "",
      categoryId: editingItem?.categoryId ?? categories[0]?.id ?? "",
      price: editingItem?.price ?? 0,
      costPrice: editingItem?.costPrice ?? 0,
    });
  }, [editingItem, categories, reset, visible]);

  const onSubmit = async (values: MenuItemFormValues) => {
    if (editingItem) {
      await updateMenuItem({ ...editingItem, ...values });
    } else {
      await createMenuItem(values);
    }
    onSaved();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }, Shadows.lg]}>
          <Text style={[styles.sheetTitle, { color: colors.text }]}>
            {editingItem ? "Edit Item" : "Add Item"}
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

          <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Category</Text>
          <Controller
            control={control}
            name="categoryId"
            render={({ field: { onChange, value } }) => (
              <FilterChips
                options={categories.map((category) => ({ value: category.id, label: category.name }))}
                selected={value}
                onSelect={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="price"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Selling Price"
                keyboardType="decimal-pad"
                value={String(value)}
                onChangeText={(text) => onChange(Number(text) || 0)}
                onBlur={onBlur}
                error={errors.price?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="costPrice"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Cost Price"
                keyboardType="decimal-pad"
                value={String(value)}
                onChangeText={(text) => onChange(Number(text) || 0)}
                onBlur={onBlur}
                error={errors.costPrice?.message}
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
  cellStrong: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
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
  fieldLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  sheetActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
