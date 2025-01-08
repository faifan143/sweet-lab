"use client";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import MaterialModal from "@/components/common/MaterialModal";
import Navbar from "@/components/common/Navbar";
import SplineBackground from "@/components/common/SplineBackground";
import { useItemGroups } from "@/hooks/items/useItemGroups";
import { useDeleteItem, useItems } from "@/hooks/items/useItems";
import { Item, ItemType } from "@/types/items.type";
import { motion } from "framer-motion";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

const MaterialsPage = () => {
  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<ItemType | "all">("all");
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Queries
  const { data: items, isLoading: isLoadingItems } = useItems();
  const { data: itemGroups, isLoading: isLoadingGroups } = useItemGroups();
  const deleteItem = useDeleteItem();

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    itemId: number | null;
  }>({
    isOpen: false,
    itemId: null,
  });

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
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const MobileTable = () => {
    return (
      <>
        {/* Mobile Cards - Shown only on Mobile */}
        <div className="md:hidden space-y-4 p-4">
          {filteredItems?.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-700/30 rounded-lg p-4 space-y-3"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-slate-200 font-medium">{item.name}</h3>
                  <span className="text-sm text-slate-400">
                    {item.group.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                    onClick={() => {
                      setEditingItem(item);
                      setModalVisible(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                    onClick={() => {
                      setDeleteConfirmation({
                        isOpen: true,
                        itemId: item.id,
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-400 block mb-1">النوع</span>
                  <span className="text-slate-200">
                    {item.type === "production" ? "منتج" : "مادة خام"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">السعر</span>
                  <span className="text-emerald-400">{item.price} ل.س</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">الوحدة</span>
                  <span className="text-slate-200">{item.unit}</span>
                </div>
              </div>

              {/* Description */}
              {item.description && (
                <div className="pt-2 border-t border-slate-600/50">
                  <span className="text-sm text-slate-400 block mb-1">
                    الوصف
                  </span>
                  <p className="text-sm text-slate-300">{item.description}</p>
                </div>
              )}
            </motion.div>
          ))}

          {/* No Results Message */}
          {(!filteredItems || filteredItems.length === 0) && (
            <div className="text-center py-6 text-slate-400">
              لا توجد عناصر متطابقة مع معايير البحث
            </div>
          )}
        </div>
      </>
    );
  };

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

              {/* Groups Filter - Scrollable on mobile */}
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

            {/* Items Table/Cards */}
            <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden backdrop-blur-sm">
              {/* Desktop Table - Hidden on Mobile */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full" dir="rtl">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-right text-slate-300 p-4">الاسم</th>
                      <th className="text-right text-slate-300 p-4">النوع</th>
                      <th className="text-right text-slate-300 p-4">التصنيف</th>
                      <th className="text-right text-slate-300 p-4">السعر</th>
                      <th className="text-right text-slate-300 p-4">الوحدة</th>
                      <th className="text-right text-slate-300 p-4">الوصف</th>
                      <th className="text-right text-slate-300 p-4">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems?.map((item) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-slate-700/50 hover:bg-slate-700/25 transition-colors"
                      >
                        <td className="p-4 text-slate-200">{item.name}</td>
                        <td className="p-4 text-slate-200">
                          {item.type === "production" ? "منتج" : "مادة خام"}
                        </td>
                        <td className="p-4 text-slate-200">
                          {item.group.name}
                        </td>
                        <td className="p-4 text-emerald-400">
                          {item.price} ل.س
                        </td>
                        <td className="p-4 text-slate-200">{item.unit}</td>
                        <td className="p-4 text-slate-400 max-w-xs truncate">
                          {item.description}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <button
                              className="p-1 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                              onClick={() => {
                                setEditingItem(item);
                                setModalVisible(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              className="p-1 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                              onClick={() => {
                                setDeleteConfirmation({
                                  isOpen: true,
                                  itemId: item.id,
                                });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <MobileTable />
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
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

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, itemId: null })}
        onConfirm={() => {
          if (deleteConfirmation.itemId) {
            deleteItem.mutate(deleteConfirmation.itemId);
          }
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
