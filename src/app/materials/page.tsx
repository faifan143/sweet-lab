/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import MaterialModal from "@/components/common/MaterialModal";
import Navbar from "@/components/common/Navbar";
import SplineBackground from "@/components/common/SplineBackground";
import { motion } from "framer-motion";
import { Filter, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

// Types
export interface Material {
  id: number;
  name: string;
  categoryId: number;
  price: number;
  quantity: number;
  minQuantity: number;
  unit: string;
}

export interface Category {
  id: number;
  name: string;
}

// Sample Data
const sampleCategories: Category[] = [
  { id: 1, name: "مشروبات" },
  { id: 2, name: "حلويات" },
  { id: 3, name: "مواد غذائية" },
];

const sampleMaterials: Material[] = [
  {
    id: 1,
    name: "شاي أحمر",
    categoryId: 1,
    price: 25,
    quantity: 100,
    minQuantity: 20,
    unit: "باكيت",
  },
  {
    id: 2,
    name: "قهوة عربية",
    categoryId: 1,
    price: 45,
    quantity: 50,
    minQuantity: 10,
    unit: "كيلو",
  },
];

const MaterialsPage = () => {
  const [materials, setMaterials] = useState<Material[]>(sampleMaterials);
  const [categories] = useState<Category[]>(sampleCategories);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const filteredMaterials = materials.filter((material) => {
    const matchesCategory = selectedCategory
      ? material.categoryId === selectedCategory
      : true;
    const matchesSearch = material.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddOrUpdateMaterial = (materialData: any) => {
    if (editingMaterial) {
      setMaterials((prev) =>
        prev.map((m) =>
          m.id === editingMaterial.id ? { ...m, ...materialData } : m
        )
      );
    } else {
      setMaterials((prev) => [
        ...prev,
        { ...materialData, id: Date.now() }, // Generate unique ID
      ]);
    }
    setModalVisible(false);
    setEditingMaterial(null);
  };

  const handleDeleteMaterial = (id: number) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
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
                إدارة المواد
              </h1>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors"
                  onClick={() => {
                    setEditingMaterial(null);
                    setModalVisible(true);
                  }}
                >
                  <Plus className="h-5 w-5" />
                  إضافة مادة
                </motion.button>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4 items-center" dir="rtl">
              <div className="flex-1 min-w-[280px]">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="بحث عن مادة..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-12 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Filter className="h-5 w-5 text-slate-400" />
                <select
                  value={selectedCategory || ""}
                  onChange={(e) =>
                    setSelectedCategory(Number(e.target.value) || null)
                  }
                  className="bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 px-4 py-2 focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="">جميع التصنيفات</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Materials Table */}
            <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full" dir="rtl">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-right text-slate-300 p-4">الاسم</th>
                      <th className="text-right text-slate-300 p-4">التصنيف</th>
                      <th className="text-right text-slate-300 p-4">السعر</th>
                      <th className="text-right text-slate-300 p-4">الكمية</th>
                      <th className="text-right text-slate-300 p-4">
                        الحد الأدنى
                      </th>
                      <th className="text-right text-slate-300 p-4">الوحدة</th>
                      <th className="text-right text-slate-300 p-4">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMaterials.map((material) => (
                      <motion.tr
                        key={material.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-slate-700/50 hover:bg-slate-700/25 transition-colors"
                      >
                        <td className="p-4 text-slate-200">{material.name}</td>
                        <td className="p-4 text-slate-200">
                          {
                            categories.find((c) => c.id === material.categoryId)
                              ?.name
                          }
                        </td>
                        <td className="p-4 text-slate-200">
                          ${material.price}
                        </td>
                        <td className="p-4 text-slate-200">
                          {material.quantity}
                        </td>
                        <td className="p-4 text-slate-200">
                          {material.minQuantity}
                        </td>
                        <td className="p-4 text-slate-200">{material.unit}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <button
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                              onClick={() => {
                                setEditingMaterial(material);
                                setModalVisible(true);
                              }}
                            >
                              <Pencil className="h-5 w-5" />
                            </button>
                            <button
                              className="text-red-400 hover:text-red-300 transition-colors"
                              onClick={() => handleDeleteMaterial(material.id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Material Modal */}
      {modalVisible && (
        <MaterialModal
          onClose={() => setModalVisible(false)}
          onSubmit={handleAddOrUpdateMaterial}
          material={editingMaterial}
          categories={categories}
          onAddCategory={() => {}}
        />
      )}
    </div>
  );
};

export default MaterialsPage;
