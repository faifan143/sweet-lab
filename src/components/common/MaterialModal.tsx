import { useCreateItemGroup } from "@/hooks/items/useItemGroups";
import { useCreateItem, useUpdateItem } from "@/hooks/items/useItems";
import { Item, ItemGroup, ItemType } from "@/types/items.type";
import { motion } from "framer-motion";
import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { useMokkBar } from "../providers/MokkBarContext";

interface MaterialModalProps {
  onClose: () => void;
  item: Item | null;
  itemGroups: ItemGroup[];
}

const MaterialModal: React.FC<MaterialModalProps> = ({
  onClose,
  item,
  itemGroups,
}) => {
  const isEditing = !!item;
  const [formData, setFormData] = useState<Partial<Item>>(
    item || {
      name: "",
      type: "production" as ItemType,
      unit: "",
      price: 0,
      description: "",
      groupId: 0,
    }
  );

  // Mutations
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const { setSnackbarConfig } = useMokkBar();

  // Inside MaterialModal component, add new state
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    name: "",
    type: "production" as ItemType,
    description: "",
  });

  // Add the create group mutation
  const createItemGroup = useCreateItemGroup();

  // Add handler for group creation
  const handleGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createItemGroup.mutateAsync(newGroupData);
      setShowGroupForm(false);
      setNewGroupData({
        name: "",
        type: "production",
        description: "",
      });
    } catch (error) {
      console.error("Error creating group:", error);
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "حدث خطأ أثناء إنشاء المجموعة",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "groupId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && item) {
        await updateItem.mutateAsync({
          id: item.id,
          data: formData,
        });
      } else {
        await createItem.mutateAsync(formData as Omit<Item, "id">);
      }
      onClose();
    } catch (error) {
      console.error("Error saving item:", error);
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "حدث خطأ أثناء حفظ المجموعة",
      });
    }
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
        className="bg-slate-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[85vh] flex flex-col "
        // className="bg-slate-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-100">
            {isEditing ? "تعديل عنصر" : "إضافة عنصر جديد"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form
          className="space-y-4 overflow-y-auto pr-2 -mr-2 no-scrollbar"
          dir="rtl"
          onSubmit={handleSubmit}
        >
          {" "}
          {/* Name Input */}
          <div>
            <label className="block text-slate-200 mb-2">الاسم</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/50"
              placeholder="أدخل اسم العنصر"
            />
          </div>
          {/* Type Select */}
          <div>
            <label className="block text-slate-200 mb-2">النوع</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/50"
            >
              <option value="production">منتج</option>
              <option value="raw">مادة خام</option>
            </select>
          </div>
          {/* Group Select */}
          {/* Group Select with Add Option */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-slate-200">التصنيف</label>
              <button
                type="button"
                onClick={() => setShowGroupForm(!showGroupForm)}
                className="p-1 hover:bg-slate-700/50 rounded-full transition-colors"
              >
                <Plus
                  className={`h-5 w-5 text-emerald-400 transform transition-transform ${
                    showGroupForm ? "rotate-45" : ""
                  }`}
                />
              </button>
            </div>

            {/* Group Creation Form */}
            {showGroupForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="bg-slate-700/30 p-3 rounded-lg space-y-3 mb-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-200 text-sm mb-1">
                        اسم المجموعة
                      </label>
                      <input
                        type="text"
                        value={newGroupData.name}
                        onChange={(e) =>
                          setNewGroupData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50"
                        placeholder="أدخل اسم المجموعة"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-200 text-sm mb-1">
                        النوع
                      </label>
                      <select
                        value={newGroupData.type}
                        onChange={(e) =>
                          setNewGroupData((prev) => ({
                            ...prev,
                            type: e.target.value as ItemType,
                          }))
                        }
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50"
                      >
                        <option value="production">منتج</option>
                        <option value="raw">مادة خام</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-200 text-sm mb-1">
                      الوصف
                    </label>
                    <textarea
                      value={newGroupData.description}
                      onChange={(e) =>
                        setNewGroupData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={2}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50 resize-none"
                      placeholder="وصف المجموعة..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleGroupSubmit}
                      disabled={createItemGroup.isPending}
                      className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {createItemGroup.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : null}
                      إضافة مجموعة
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Group Select */}
            <select
              name="groupId"
              value={formData.groupId}
              onChange={handleChange}
              required
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/50"
            >
              <option value="">اختر التصنيف</option>
              {itemGroups
                .filter((group) => group.type === formData.type)
                .map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
            </select>
          </div>
          {/* Price and Unit Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-200 mb-2">السعر</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/50"
                placeholder="السعر"
              />
            </div>
            <div>
              <label className="block text-slate-200 mb-2">الوحدة</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/50"
                placeholder="مثال: كغ، قطعة"
              />
            </div>
          </div>
          {/* Description */}
          <div>
            <label className="block text-slate-200 mb-2">الوصف</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/50 resize-none"
              placeholder="أدخل وصف العنصر..."
            />
          </div>
          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={createItem.isPending || updateItem.isPending}
              className="flex-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {createItem.isPending || updateItem.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : null}
              {isEditing ? "حفظ التغييرات" : "إضافة العنصر"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default MaterialModal;
