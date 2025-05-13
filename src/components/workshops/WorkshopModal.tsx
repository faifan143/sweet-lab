"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { Workshop, CreateWorkshopDTO, UpdateWorkshopDTO } from "@/types/workshops/workshop.type";
import { WorkType } from "@/types/employees.type";
import { useCreateWorkshop, useUpdateWorkshop } from "@/hooks/workshops/useWorkshops";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface WorkshopModalProps {
  workshop: Workshop | null;
  currentPassword?: string;
  onClose: () => void;
  onSave: () => void;
}

const WorkshopModal: React.FC<WorkshopModalProps> = ({ workshop, currentPassword, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    workType: WorkType.HOURLY,
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createWorkshopMutation = useCreateWorkshop();
  const updateWorkshopMutation = useUpdateWorkshop();

  const isEditing = !!workshop;
  const isLoading = createWorkshopMutation.isPending || updateWorkshopMutation.isPending;

  useEffect(() => {
    if (workshop) {
      setFormData({
        name: workshop.name,
        workType: workshop.workType,
        password: "",
      });
    }
  }, [workshop]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "اسم الورشة مطلوب";
    }

    if (!isEditing && !formData.password.trim()) {
      newErrors.password = "كلمة المرور مطلوبة";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing) {
        const updateData: UpdateWorkshopDTO = {
          name: formData.name,
          workType: formData.workType,
        };

        if (formData.password) {
          updateData.password = formData.password;
        }

        await updateWorkshopMutation.mutateAsync({
          id: workshop.id,
          data: updateData,
        });

        toast.success("تم تحديث الورشة بنجاح");
      } else {
        const createData: CreateWorkshopDTO = {
          name: formData.name,
          workType: formData.workType,
          password: formData.password,
        };

        await createWorkshopMutation.mutateAsync(createData);
        toast.success("تم إنشاء الورشة بنجاح");
      }

      onSave();
    } catch (error) {
      console.error("Error saving workshop:", error);
      toast.error("حدث خطأ أثناء حفظ الورشة");
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 w-full max-w-md shadow-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {isEditing ? "تعديل الورشة" : "إضافة ورشة جديدة"}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Workshop Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                اسم الورشة *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all
                  ${errors.name ? "border-red-500" : "border-white/10"}`}
                placeholder="أدخل اسم الورشة"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Work Type */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                نوع العمل
              </label>
              <select
                value={formData.workType}
                onChange={(e) => handleChange("workType", e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
              >
                <option value={WorkType.HOURLY}>بالساعة</option>
                <option value={WorkType.PRODUCTION}>بالإنتاج</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                كلمة المرور {isEditing ? "(اتركها فارغة للاحتفاظ بالقديمة)" : "*"}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all
                  ${errors.password ? "border-red-500" : "border-white/10"}`}
                placeholder={isEditing ? "أدخل كلمة مرور جديدة إذا أردت تغييرها" : "أدخل كلمة المرور"}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>


            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                  bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    {isEditing ? "حفظ التغييرات" : "إضافة الورشة"}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-lg border border-white/10 text-slate-300
                  hover:bg-white/5 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WorkshopModal;
