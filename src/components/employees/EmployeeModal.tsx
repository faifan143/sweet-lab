import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Clock, DollarSign } from "lucide-react";
import { useMokkBar } from "@/components/providers/MokkBarContext";
import { Employee, CreateEmployeeDTO, UpdateEmployeeDTO, WorkType } from "@/types/employees.type";
import { useCreateEmployee, useUpdateEmployee } from "@/hooks/employees/useEmployees";

interface EmployeeModalProps {
  employee: Employee | null; // If null, we're adding a new employee
  onClose: () => void;
  onSave: () => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  employee,
  onClose,
  onSave,
}) => {
  const isEditing = !!employee;
  const { setSnackbarConfig } = useMokkBar();

  // State for form fields - using only fields from the API
  const [formData, setFormData] = useState<CreateEmployeeDTO | UpdateEmployeeDTO>({
    name: "",
    phone: "",
    workType: WorkType.HOURLY, // Default to hourly
    workshopId: undefined,
  });

  // Initialize form data when editing an existing employee
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        phone: employee.phone || "",
        workType: employee.workType || WorkType.HOURLY,
        workshopId: employee.workshopId,
      });
    }
  }, [employee]);

  // Mutations
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();

  // Form handling
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "يجب إدخال اسم الموظف",
      });
      return;
    }

    try {
      if (isEditing && employee) {
        // Update existing employee
        await updateEmployee.mutateAsync({
          employeeId: employee.id,
          data: formData as UpdateEmployeeDTO,
        });
        setSnackbarConfig({
          open: true,
          severity: "success",
          message: "تم تحديث بيانات الموظف بنجاح",
        });
      } else {
        // Create new employee
        await createEmployee.mutateAsync(formData as CreateEmployeeDTO);
        setSnackbarConfig({
          open: true,
          severity: "success",
          message: "تم إضافة الموظف بنجاح",
        });
      }
      onSave();
    } catch (error) {
      console.error("Error submitting form:", error);
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "حدث خطأ أثناء حفظ البيانات",
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
        className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-sm p-6 rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto no-scrollbar border border-white/10"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? "تعديل بيانات الموظف" : "إضافة موظف جديد"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
          {/* Basic Info Section */}
          <div className="space-y-4">
            {/* Employee Name */}
            <div className="space-y-2">
              <label className="block text-white">اسم الموظف*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                placeholder="أدخل اسم الموظف"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="block text-white">رقم الهاتف</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                placeholder="أدخل رقم الهاتف"
              />
            </div>

            {/* Work Type */}
            <div className="space-y-2">
              <label className="block text-white">نوع العمل*</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, workType: WorkType.HOURLY }))}
                  className={`px-4 py-3 rounded-lg border transition-colors flex items-center justify-center gap-2
                    ${formData.workType === WorkType.HOURLY
                      ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                      : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                    }`}
                >
                  <Clock className="h-5 w-5" />
                  <span>بالساعة</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, workType: WorkType.PRODUCTION }))}
                  className={`px-4 py-3 rounded-lg border transition-colors flex items-center justify-center gap-2
                    ${formData.workType === WorkType.PRODUCTION
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                    }`}
                >
                  <DollarSign className="h-5 w-5" />
                  <span>بالإنتاج</span>
                </button>
              </div>
            </div>
          </div>

          {/* Work Type Info */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-sm text-slate-300">
              {formData.workType === WorkType.HOURLY ? (
                <>
                  <Clock className="inline-block h-4 w-4 mx-1 text-cyan-400" />
                  سيتم حساب أجر الموظف بناءً على عدد ساعات العمل
                </>
              ) : (
                <>
                  <DollarSign className="inline-block h-4 w-4 mx-1 text-green-400" />
                  سيتم حساب أجر الموظف بناءً على كمية الإنتاج
                </>
              )}
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4 border-t border-white/10 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg font-medium transition-colors border border-white/10"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={createEmployee.isPending || updateEmployee.isPending}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {createEmployee.isPending || updateEmployee.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : null}
              {isEditing ? "حفظ التغييرات" : "إضافة الموظف"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EmployeeModal;