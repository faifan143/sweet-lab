"use client";

import React, { useState } from "react";
import { X, Plus, Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Employee, WorkType } from "@/types/employees.type";
import { useEmployeesList } from "@/hooks/employees/useEmployees";
import { useAddEmployeeToWorkshop } from "@/hooks/workshops/useWorkshops";
import { useMokkBar } from "@/components/providers/MokkBarContext";

interface AddEmployeeToWorkshopModalProps {
  workshopId: number;
  workshopName: string;
  workshopType: WorkType;
  currentEmployeeIds: number[];
  password: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AddEmployeeToWorkshopModal: React.FC<AddEmployeeToWorkshopModalProps> = ({
  workshopId,
  workshopName,
  workshopType,
  currentEmployeeIds,
  password,
  onClose,
  onSuccess,
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { setSnackbarConfig } = useMokkBar();

  const { data: employees, isLoading } = useEmployeesList();
  const addEmployeeToWorkshop = useAddEmployeeToWorkshop();

  // Filter employees to remove any duplicates based on ID
  const uniqueEmployees = employees?.reduce((acc: Employee[], employee) => {
    if (employee && employee.id !== undefined && employee.id !== null) {
      const exists = acc.some(e => e.id === employee.id);
      if (!exists) {
        acc.push(employee);
      }
    }
    return acc;
  }, []) || [];

  // Filter employees based on workshop type and not already in workshop
  const availableEmployees = uniqueEmployees.filter(employee => {
    const isValid = employee.workType === workshopType &&
      !currentEmployeeIds.includes(employee.id) &&
      (!employee.workshopId || employee.workshopId === 0);

    return isValid;
  });

  // Filter by search query
  const filteredEmployees = availableEmployees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (employee.phone && employee.phone.includes(searchQuery))
  );

  const handleAddEmployee = async () => {
    if (!selectedEmployeeId) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "يرجى اختيار موظف",
      });
      return;
    }

    try {
      await addEmployeeToWorkshop.mutateAsync({
        workshopId,
        employeeId: selectedEmployeeId,
      });

      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم إضافة الموظف إلى الورشة بنجاح",
      });

      onSuccess();
    } catch (error) {
      console.error("Error adding employee to workshop:", error);
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "حدث خطأ أثناء إضافة الموظف",
      });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 w-full max-w-md 
            shadow-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">إضافة موظف إلى الورشة</h2>
              <p className="text-sm text-slate-400 mt-1">{workshopName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="بحث عن موظف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-white/5 border border-white/10 rounded-lg 
                text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* Employee List */}
          <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar mb-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
              </div>
            ) : filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => {
                return (
                  <div
                    key={employee.id}
                    onClick={() => setSelectedEmployeeId(employee.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all
                      ${selectedEmployeeId === employee.id
                        ? "bg-blue-500/20 border-blue-500/30 text-white"
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                      }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{employee.name}</h4>
                        <p className="text-sm text-slate-400">{employee.phone || "لا يوجد رقم هاتف"}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-white/10">
                        {employee.workType === WorkType.HOURLY ? "بالساعة" : "بالإنتاج"}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400">لا يوجد موظفون متاحون للإضافة</p>
                <p className="text-sm text-slate-500 mt-2">
                  جميع الموظفين إما مضافون بالفعل أو مرتبطون بورشات أخرى
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAddEmployee}
              disabled={!selectedEmployeeId || addEmployeeToWorkshop.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addEmployeeToWorkshop.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  إضافة موظف
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-white/10 text-slate-300
                hover:bg-white/5 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddEmployeeToWorkshopModal;
