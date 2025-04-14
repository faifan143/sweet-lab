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
import { Plus, Search, Filter } from "lucide-react";
import { useState, useMemo } from "react";

const MaterialsPage = () => {
  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<ItemType | "all">("all");
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [showFilters, setShowFilters] = useState(false);
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
  const filteredItems = useMemo(() => {
    return items?.filter((item) => {
      const matchesType = activeTab === "all" ? true : item.type === activeTab;
      const matchesGroup = selectedGroup ? item.groupId === selectedGroup : true;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        (item.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      return matchesType && matchesGroup && matchesSearch;
    });
  }, [items, activeTab, selectedGroup, searchTerm]);

  // Counts for tab badges
  const rawItemsCount = useMemo(() =>
    items?.filter(item => item.type === "raw").length || 0,
    [items]
  );

  const productionItemsCount = useMemo(() =>
    items?.filter(item => item.type === "production").length || 0,
    [items]
  );

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
        <main className="pt-28 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6" dir="rtl">
              <h1 className="text-2xl font-bold text-slate-100">
                إدارة المواد والمنتجات
              </h1>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                  {showFilters ? "إخفاء المرشحات" : "إظهار المرشحات"}
                </motion.button>

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
            </div>

            {/* Tabs */}
            <div className="mb-6" dir="rtl">
              <div className="flex border-b border-slate-700/50">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === "all"
                    ? "text-emerald-400 border-b-2 border-emerald-400"
                    : "text-slate-400 hover:text-slate-300"
                    }`}
                >
                  الكل
                  <span className="mx-2 px-2 py-0.5 bg-slate-700 text-xs rounded-full">
                    {items?.length || 0}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("production")}
                  className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === "production"
                    ? "text-emerald-400 border-b-2 border-emerald-400"
                    : "text-slate-400 hover:text-slate-300"
                    }`}
                >
                  المنتجات
                  <span className="mx-2 px-2 py-0.5 bg-slate-700 text-xs rounded-full">
                    {productionItemsCount}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("raw")}
                  className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === "raw"
                    ? "text-emerald-400 border-b-2 border-emerald-400"
                    : "text-slate-400 hover:text-slate-300"
                    }`}
                >
                  المواد الخام
                  <span className="mx-2 px-2 py-0.5 bg-slate-700 text-xs rounded-full">
                    {rawItemsCount}
                  </span>
                </button>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
                dir="rtl"
              >
                <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm text-slate-400 mb-1">بحث</label>
                      <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="بحث بالاسم أو الوصف..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50"
                        />
                      </div>
                    </div>
                    <div className="sm:w-64">
                      <label className="block text-sm text-slate-400 mb-1">التصنيف</label>
                      <select
                        value={selectedGroup === null ? "all" : selectedGroup}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedGroup(value === "all" ? null : Number(value));
                        }}
                        className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 px-4 py-2 focus:outline-none focus:border-emerald-500/50"
                      >
                        <option value="all">جميع التصنيفات</option>
                        {itemGroups?.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Table Container */}
            <motion.div
              layout
              className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden backdrop-blur-sm"
            >
              <MaterialTable
                items={filteredItems || []}
                getDefaultUnitPrice={getDefaultUnitPrice}
                activeTab={activeTab}
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
            </motion.div>
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
          defaultType={activeTab !== "all" ? activeTab : undefined}
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