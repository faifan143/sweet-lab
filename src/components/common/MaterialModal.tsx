import { Category, Material } from "@/app/materials/page";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

interface MaterialModalProps {
  onClose: () => void;
  onSubmit: (data: Material) => void;
  material: Material | null;
  categories: Category[];
  onAddCategory: (category: Category) => void;
}

const MaterialModal: React.FC<MaterialModalProps> = ({
  onClose,
  onSubmit,
  material,
  categories,
  onAddCategory,
}) => {
  const isEditing = !!material;
  const [formData, setFormData] = useState<Material>(
    material || {
      id: 0,
      name: "",
      categoryId: 0,
      price: 0,
      quantity: 0,
      minQuantity: 0,
      unit: "",
    }
  );
  const [newCategory, setNewCategory] = useState<string>("");
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "categoryId" ||
        name === "price" ||
        name === "quantity" ||
        name === "minQuantity"
          ? Number(value)
          : value,
    }));
  };

  const handleAddCategory = () => {
    if (newCategory.trim() === "") return;

    const newCategoryObject: Category = {
      id: categories.length + 1, // Generate a unique ID
      name: newCategory,
    };

    onAddCategory(newCategoryObject);
    setNewCategory("");
    setIsAddingCategory(false);
    setFormData((prev) => ({
      ...prev,
      categoryId: newCategoryObject.id,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-100">
            {isEditing ? "تعديل مادة" : "إضافة مادة جديدة"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form className="space-y-4" dir="rtl" onSubmit={handleSubmit}>
          {/* Name Input */}
          <div>
            <label className="block text-slate-200 mb-2">اسم المادة</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-500/50"
              placeholder="أدخل اسم المادة"
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-slate-200 mb-2">التصنيف</label>
            <div className="flex items-center gap-2">
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-500/50"
              >
                <option value="">اختر التصنيف</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsAddingCategory((prev) => !prev)}
                className="bg-blue-500/40 text-white px-3 py-2 rounded-lg hover:bg-blue-600/40"
              >
                +
              </button>
            </div>
            {isAddingCategory && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="إضافة تصنيف جديد"
                  className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-500/50"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  أضف
                </button>
              </div>
            )}
          </div>

          {/* Remaining Inputs */}
          {/* Price Input */}
          <div>
            <label className="block text-slate-200 mb-2">السعر</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-500/50"
              placeholder="أدخل السعر"
            />
          </div>

          {/* Quantity and Unit Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-200 mb-2">الكمية</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-500/50"
                placeholder="الكمية"
              />
            </div>
            <div>
              <label className="block text-slate-200 mb-2">الوحدة</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-500/50"
                placeholder="مثال: كغ، قطعة"
              />
            </div>
          </div>

          {/* Min Quantity Input */}
          <div>
            <label className="block text-slate-200 mb-2">
              الحد الأدنى للكمية
            </label>
            <input
              type="number"
              name="minQuantity"
              value={formData.minQuantity}
              onChange={handleChange}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-500/50"
              placeholder="أدخل الحد الأدنى"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex-1 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {isEditing ? "حفظ التغييرات" : "إضافة المادة"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default MaterialModal;
