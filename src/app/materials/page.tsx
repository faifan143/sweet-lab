"use client";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import MaterialModal from "@/components/common/MaterialModal";
import MaterialTable from "@/components/common/MaterialTable";
import Navbar from "@/components/common/Navbar";
import PageSpinner from "@/components/common/PageSpinner";
import SplineBackground from "@/components/common/SplineBackground";
import { useItemGroups } from "@/hooks/items/useItemGroups";
import { useDeleteItem, useItems } from "@/hooks/items/useItems";
import { Role, useRoles } from "@/hooks/users/useRoles";
import { Item, ItemType } from "@/types/items.type";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

const MaterialsPage = () => {
  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<ItemType | "all">("all");
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    itemId: number | null;
  }>({
    isOpen: false,
    itemId: null,
  });

  const { hasAnyRole } = useRoles();
  // Queries
  const { data: items, isLoading: isLoadingItems } = useItems();
  const { data: itemGroups, isLoading: isLoadingGroups } = useItemGroups();
  const deleteItem = useDeleteItem();

  // Helper function to get the default unit price for display
  const getDefaultUnitPrice = (item: Item): number => {
    if (!item.units || item.units.length === 0) return 0;

    const defaultUnit = item.units.find((u) => u.unit === item.defaultUnit);
    return defaultUnit ? defaultUnit.price : item.units[0].price;
  };

  // Filter items
  const filteredItems = items?.filter((item) => {
    const matchesType =
      selectedType === "all" ? true : item.type === selectedType;
    const matchesGroup = selectedGroup ? item.groupId === selectedGroup : true;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesType && matchesGroup && matchesSearch;
  });

  // Loading state
  if (isLoadingItems || isLoadingGroups) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <PageSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative">
      <SplineBackground activeTab="عام" />
      <div className="relative z-10">
        <Navbar />
        <main className="pt-32 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8" dir="rtl">
              <h1 className="text-2xl font-bold text-slate-100">
                إدارة المواد والمنتجات
              </h1>
              {hasAnyRole([Role.ADMIN]) && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors"
                  onClick={() => {
                    setEditingItem(null);
                    setModalVisible(true);
                  }}
                >
                  <Plus className="h-5 w-5" />
                  إضافة جديد
                </motion.button>
              )}
            </div>

            {/* Filters */}
            <div className="mb-6 space-y-4" dir="rtl">
              {/* Search and Type Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="بحث..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-4 pr-12 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>
                <select
                  value={selectedType}
                  onChange={(e) =>
                    setSelectedType(e.target.value as ItemType | "all")
                  }
                  className="bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 px-4 py-2 focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="production">منتجات</option>
                  <option value="raw">مواد خام</option>
                </select>
              </div>

              {/* Groups Filter */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                <button
                  onClick={() => setSelectedGroup(null)}
                  className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                    selectedGroup === null
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                  }`}
                >
                  الكل
                </button>
                {itemGroups?.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroup(group.id)}
                    className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                      selectedGroup === group.id
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                    }`}
                  >
                    {group.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden backdrop-blur-sm">
              <MaterialTable
                items={filteredItems || []}
                getDefaultUnitPrice={getDefaultUnitPrice}
                onEdit={(item) => {
                  setEditingItem(item);
                  setModalVisible(true);
                }}
                onDelete={(itemId) => {
                  setDeleteConfirmation({
                    isOpen: true,
                    itemId,
                  });
                }}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {modalVisible && (
        <MaterialModal
          onClose={() => {
            setModalVisible(false);
            setEditingItem(null);
          }}
          item={editingItem}
          itemGroups={itemGroups || []}
        />
      )}

      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, itemId: null })}
        onConfirm={() => {
          if (deleteConfirmation.itemId) {
            deleteItem.mutate(deleteConfirmation.itemId);
          }
          setDeleteConfirmation({ isOpen: false, itemId: null });
        }}
        title="حذف العنصر"
        message="هل أنت متأكد من أنك تريد حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="نعم، احذف"
        cancelText="إلغاء"
      />
    </div>
  );
};

export default MaterialsPage;
