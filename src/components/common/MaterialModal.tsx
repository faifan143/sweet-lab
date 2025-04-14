import { useCreateItemGroup } from "@/hooks/items/useItemGroups";
import { useCreateItem, useUpdateItem } from "@/hooks/items/useItems";
import { Item, ItemGroup, ItemType, ItemUnit } from "@/types/items.type";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useMokkBar } from "../providers/MokkBarContext";
import { sweetShopUnits } from "@/utils/constants";

interface MaterialModalProps {
  onClose: () => void;
  item: Item | null;
  itemGroups: ItemGroup[];
  defaultType?: ItemType;
}

const MaterialModal: React.FC<MaterialModalProps> = ({
  onClose,
  item,
  itemGroups,
  defaultType,
}) => {
  const isEditing = !!item;
  const { setSnackbarConfig } = useMokkBar();

  // Form state for the updated item structure
  const [formData, setFormData] = useState<Partial<Item>>({
    name: "",
    type: defaultType || "production" as ItemType,
    description: "",
    groupId: 0,
    defaultUnit: "",
    cost: 0,
    units: [{ unit: "", price: 0, factor: 1 }],
  });

  // Initialize form data when item changes
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        type: item.type || defaultType || "production",
        description: item.description || "",
        groupId: item.groupId || itemGroups[0]?.id || 0,
        defaultUnit: item.defaultUnit || "",
        cost: item.cost || 0,
        units:
          item.units && item.units.length > 0
            ? [...item.units]
            : [{ unit: "", price: 0, factor: 1 }],
      });
    } else if (defaultType) {
      // Set default type when creating a new item
      setFormData(prev => ({ ...prev, type: defaultType }));
    }
  }, [item, itemGroups, defaultType]);

  // Mutations
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();

  // Group creation
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    name: "",
    type: defaultType || "production" as ItemType,
    description: "",
  });

  useEffect(() => {
    // Update new group type when form data type changes
    setNewGroupData(prev => ({ ...prev, type: formData.type || "production" }));
  }, [formData.type]);

  const createItemGroup = useCreateItemGroup();

  // Form handlers
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "groupId" || name === "cost" ? Number(value) : value,
    }));
  };

  const handleUnitChange = (
    index: number,
    field: keyof ItemUnit,
    value: string | number
  ) => {
    const newUnits = [...(formData.units || [])];
    newUnits[index] = {
      ...newUnits[index],
      [field]: field === "unit" ? value : Number(value),
    };

    setFormData((prev) => ({
      ...prev,
      units: newUnits,
    }));

    // If this is the only unit or the default unit is not set yet,
    // also update the default unit
    if (
      (formData.units?.length === 1 || !formData.defaultUnit) &&
      field === "unit" &&
      typeof value === "string"
    ) {
      setFormData((prev) => ({
        ...prev,
        defaultUnit: value,
      }));
    }
  };

  const addUnit = () => {
    setFormData((prev) => ({
      ...prev,
      units: [...(prev.units || []), { unit: "", price: 0, factor: 1 }],
    }));
  };

  const removeUnit = (index: number) => {
    // Don't remove if it's the last unit
    if (!formData.units || formData.units.length <= 1) return;

    const newUnits = formData.units.filter((_, i) => i !== index);

    // If we're removing the default unit, set the first unit as default
    let newDefaultUnit = formData.defaultUnit;
    if (formData.defaultUnit === formData.units[index].unit) {
      newDefaultUnit = newUnits[0].unit;
    }

    setFormData((prev) => ({
      ...prev,
      units: newUnits,
      defaultUnit: newDefaultUnit,
    }));
  };

  const handleGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newGroupData.name.trim()) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "يجب إدخال اسم المجموعة",
      });
      return;
    }

    try {
      createItemGroup.mutate(newGroupData, {
        onSuccess: () => {
          setShowGroupForm(false);
          setNewGroupData({
            name: "",
            type: formData.type || "production",
            description: "",
          });

          setSnackbarConfig({
            open: true,
            severity: "success",
            message: "تم إضافة المجموعة بنجاح",
          });
        },
      });
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate name
    if (!formData.name?.trim()) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "يجب إدخال اسم العنصر",
      });
      return;
    }

    // Validate units
    if (!formData.units || formData.units.some((unit) => !unit.unit)) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "يجب إدخال اسم الوحدة لجميع الوحدات",
      });
      return;
    }

    // Validate default unit is in units
    if (
      !formData.defaultUnit ||
      !formData.units.some((unit) => unit.unit === formData.defaultUnit)
    ) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "يجب أن تكون الوحدة الافتراضية من ضمن الوحدات المتاحة",
      });
      return;
    }

    try {
      if (isEditing && item) {
        updateItem.mutate({
          id: item.id,
          data: formData,
        }, {
          onSuccess: () => {
            setSnackbarConfig({
              open: true,
              severity: "success",
              message: "تم تحديث العنصر بنجاح",
            });
            onClose();
          }
        });
      } else {
        createItem.mutate(formData as Omit<Item, "id">, {
          onSuccess: () => {
            setSnackbarConfig({
              open: true,
              severity: "success",
              message: "تم إضافة العنصر بنجاح",
            });
            onClose();
          }
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
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
        className="bg-slate-800 p-6 rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto no-scrollbar border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-bold text-slate-100">
            {isEditing ? "تعديل عنصر" : "إضافة عنصر جديد"}
            {formData.type === "production" ? " (منتج)" : " (مادة خام)"}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-200 border-b border-slate-700/50 pb-2">
              معلومات أساسية
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-slate-200">اسم العنصر*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
                  placeholder="أدخل اسم العنصر"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-200">النوع*</label>
                <div className="flex gap-4 gap-reverse">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="production"
                      checked={formData.type === "production"}
                      onChange={() => setFormData(prev => ({ ...prev, type: "production" }))}
                      className="form-radio h-4 w-4 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
                    />
                    <span className="mx-2 text-slate-300">منتج</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="raw"
                      checked={formData.type === "raw"}
                      onChange={() => setFormData(prev => ({ ...prev, type: "raw" }))}
                      className="form-radio h-4 w-4 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
                    />
                    <span className="mx-2 text-slate-300">مادة خام</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Group Selection with Add Option */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-slate-200">التصنيف</label>
                <button
                  type="button"
                  onClick={() => setShowGroupForm(!showGroupForm)}
                  className="p-1 hover:bg-slate-700/50 rounded-full transition-colors"
                >
                  <Plus
                    className={`h-5 w-5 text-emerald-400 transform transition-transform ${showGroupForm ? "rotate-45" : ""
                      }`}
                  />
                </button>
              </div>

              {/* Group Creation Form */}
              <AnimatePresence>
                {showGroupForm && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-slate-700/30 p-3 rounded-lg space-y-3 mb-3 border border-slate-600/30">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-200 text-sm mb-1">
                            اسم المجموعة*
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
              </AnimatePresence>

              {/* Group Select */}
              <select
                name="groupId"
                value={formData.groupId || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
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

            {/* Cost field for raw materials */}
            {formData.type === "raw" && (
              <div className="space-y-2">
                <label className="block text-slate-200">التكلفة</label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost || 0}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
                  placeholder="أدخل التكلفة"
                />
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-slate-200">الوصف</label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 resize-none"
                placeholder="أدخل وصف العنصر..."
              />
            </div>
          </div>

          {/* Units Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-200 border-b border-slate-700/50 pb-2 flex items-center justify-between">
              <span>وحدات العنصر</span>
              <button
                type="button"
                onClick={addUnit}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors text-sm bg-emerald-500/10 px-2 py-1 rounded-lg hover:bg-emerald-500/20"
              >
                <Plus className="h-4 w-4" />
                إضافة وحدة
              </button>
            </h3>

            <div className="space-y-3">
              {formData.units?.map((unit, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30"
                >
                  <div className="space-y-1">
                    <label className="block text-slate-300 text-sm">الوحدة*</label>
                    <select
                      value={unit.unit}
                      onChange={(e) =>
                        handleUnitChange(index, "unit", e.target.value)
                      }
                      className="w-full px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="">اختر الوحدة</option>
                      {sweetShopUnits.map((unitName) => (
                        <option key={unitName} value={unitName}>
                          {unitName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-300 text-sm">السعر*</label>
                    <input
                      type="number"
                      value={unit.price}
                      onChange={(e) =>
                        handleUnitChange(index, "price", e.target.value)
                      }
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-300 text-sm">السعة*</label>
                    <input
                      type="number"
                      value={unit.factor}
                      onChange={(e) =>
                        handleUnitChange(index, "factor", e.target.value)
                      }
                      min="0.01"
                      step="0.01"
                      className="w-full px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeUnit(index)}
                      className="w-full md:w-auto px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center"
                      disabled={formData.units && formData.units.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="mx-1 md:hidden">حذف</span>
                    </button>
                  </div>

                  {/* Default unit radio on mobile */}
                  <div className="md:hidden flex items-center mt-2">
                    <input
                      type="radio"
                      id={`default-unit-${index}`}
                      name="defaultUnitMobile"
                      checked={formData.defaultUnit === unit.unit}
                      onChange={() =>
                        setFormData(prev => ({ ...prev, defaultUnit: unit.unit }))
                      }
                      className="form-radio h-4 w-4 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
                      disabled={!unit.unit}
                    />
                    <label htmlFor={`default-unit-${index}`} className="mx-2 text-slate-300 text-sm">
                      تعيين كوحدة افتراضية
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Default Unit Selection */}
            <div className="mt-4 space-y-2 hidden md:block">
              <label className="block text-slate-200">الوحدة الافتراضية*</label>
              <select
                name="defaultUnit"
                value={formData.defaultUnit || ""}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="">اختر الوحدة الافتراضية</option>
                {formData.units
                  ?.filter((unit) => unit.unit) // Only show units that have names
                  .map((unit, index) => (
                    <option key={index} value={unit.unit}>
                      {unit.unit}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4 border-t border-slate-700 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700/50 text-slate-300 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={createItem.isPending || updateItem.isPending}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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