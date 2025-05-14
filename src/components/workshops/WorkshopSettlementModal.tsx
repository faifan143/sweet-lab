"use client";

import React, { useState } from "react";
import { X, Save, Loader2, FileText, DollarSign, Plus, Trash2 } from "lucide-react";
import { CreateWorkshopSettlementDTO, Workshop } from "@/types/workshops/workshop.type";
import { WorkType } from "@/types/employees.type";
import { useCreateWorkshopSettlement, useWorkshop } from "@/hooks/workshops/useWorkshops";
import { useFunds } from "@/hooks/funds/useFunds";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface EmployeeDistribution {
  employeeId: string;
  amount: string;
}

interface WorkshopSettlementModalProps {
  workshopId: number;
  currentBalance: number;
  password: string;
  workType: Workshop['workType'];
  onClose: () => void;
  onSuccess: () => void;
}

const WorkshopSettlementModal: React.FC<WorkshopSettlementModalProps> = ({
  workshopId,
  currentBalance,
  password,
  workType,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    amount: "",
    fundId: "",
    notes: "",
    distributeImmediately: true,
    distributionType: (workType === WorkType.HOURLY ? "automatic" : "manual") as 'manual' | 'automatic'
  });
  const [manualDistributions, setManualDistributions] = useState<EmployeeDistribution[]>([
    { employeeId: "", amount: "" }
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createSettlementMutation = useCreateWorkshopSettlement();
  const { data: funds } = useFunds();
  const { data: workshop } = useWorkshop(workshopId);
  const isLoading = createSettlementMutation.isPending;

  // Filter active funds only
  const activeFunds = funds ?? [];
  // Available employees
  const availableEmployees = workshop?.employees || [];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Check fund selection
    if (!formData.fundId) {
      newErrors.fundId = "يجب اختيار صندوق";
    }

    // Check total amount
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "المبلغ يجب أن يكون أكبر من صفر";
    }

    if (parseFloat(formData.amount) > currentBalance) {
      newErrors.amount = "المبلغ يتجاوز الرصيد الحالي";
    }

    // If manual distribution, validate distributions
    if (formData.distributionType === 'manual' && formData.distributeImmediately) {
      let hasValidDistribution = false;
      let distributedAmount = 0;

      manualDistributions.forEach((distribution, index) => {
        if (distribution.employeeId && distribution.amount) {
          hasValidDistribution = true;
          const amount = parseFloat(distribution.amount);
          if (amount <= 0) {
            newErrors[`employee_${index}_amount`] = "المبلغ يجب أن يكون أكبر من صفر";
          } else {
            distributedAmount += amount;
          }
        } else if (distribution.employeeId || distribution.amount) {
          // Partial entry
          if (!distribution.employeeId) {
            newErrors[`employee_${index}_id`] = "يجب اختيار موظف";
          }
          if (!distribution.amount) {
            newErrors[`employee_${index}_amount`] = "يجب إدخال المبلغ";
          }
        }
      });

      if (!hasValidDistribution) {
        newErrors.general = "يجب إضافة موظف واحد على الأقل للتوزيع";
      }

      if (distributedAmount !== parseFloat(formData.amount)) {
        newErrors.totalDistributed = `المبلغ الموزع (${formatCurrency(distributedAmount)}) لا يساوي المبلغ الإجمالي (${formatCurrency(parseFloat(formData.amount))})`;
      }
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
      const settlementData: CreateWorkshopSettlementDTO = {
        amount: parseFloat(formData.amount),
        fundId: parseInt(formData.fundId),
        notes: formData.notes || undefined,
        distributionType: formData.distributionType
      };

      // Add manual distributions if applicable
      if (formData.distributionType === 'manual' && formData.distributeImmediately) {
        const validDistributions = manualDistributions
          .filter(d => d.employeeId && d.amount)
          .map(d => ({
            employeeId: parseInt(d.employeeId),
            amount: parseFloat(d.amount)
          }));

        settlementData.manualDistributions = validDistributions;
      }

      await createSettlementMutation.mutateAsync({
        workshopId,
        data: settlementData
      });

      toast.success("تمت الحسبة بنجاح");
      onSuccess();
    } catch (error) {
      console.error("Error creating settlement:", error);
      toast.error("حدث خطأ أثناء إنشاء الحسبة");
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleDistributionChange = (index: number, field: keyof EmployeeDistribution, value: string) => {
    const newDistributions = [...manualDistributions];
    newDistributions[index] = { ...newDistributions[index], [field]: value };
    setManualDistributions(newDistributions);

    // Clear errors for this field
    const errorKey = `employee_${index}_${field === 'employeeId' ? 'id' : 'amount'}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: "" }));
    }
  };

  const addEmployee = () => {
    setManualDistributions([...manualDistributions, { employeeId: "", amount: "" }]);
  };

  const removeEmployee = (index: number) => {
    const newDistributions = manualDistributions.filter((_, i) => i !== index);
    setManualDistributions(newDistributions);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("ar-SY", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTotalDistributed = () => {
    return manualDistributions.reduce((total, distribution) => {
      return total + (distribution.amount ? parseFloat(distribution.amount) : 0);
    }, 0);
  };

  // Get already selected employee IDs
  const selectedEmployeeIds = manualDistributions.map(d => d.employeeId).filter(id => id);

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
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 w-full max-w-2xl shadow-2xl border border-white/10 max-h-[85vh] overflow-auto no-scrollbar"
          onClick={(e) => e.stopPropagation()}
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">
                حسبة الورشة
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Current Balance Display */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">الرصيد الحالي</span>
              <span className="text-xl font-bold text-yellow-400">
                {formatCurrency(currentBalance)}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Total Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                مبلغ الحسبة *
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all
                  ${errors.amount ? "border-red-500" : "border-white/10"}`}
                placeholder="0"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-400">{errors.amount}</p>
              )}
            </div>

            {/* Fund Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                الصندوق *
              </label>
              <select
                value={formData.fundId}
                onChange={(e) => handleChange("fundId", e.target.value)}
                className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all
                  ${errors.fundId ? "border-red-500" : "border-white/10"}`}
              >
                <option value="">اختر صندوق...</option>
                {activeFunds.map((fund) => (
                  <option key={fund.id} value={fund.id}>
                    {fund.fundType} - الرصيد: {formatCurrency(fund.currentBalance)}
                  </option>
                ))}
              </select>
              {errors.fundId && (
                <p className="mt-1 text-sm text-red-400">{errors.fundId}</p>
              )}
            </div>

            {/* Distribution Type */}
            {workType === WorkType.PRODUCTION && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">
                  نوع التوزيع
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="distributionType"
                      value="manual"
                      checked={formData.distributionType === "manual"}
                      onChange={(e) => handleChange("distributionType", e.target.value)}
                      className="text-blue-500"
                    />
                    <span className="text-white">توزيع يدوي</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="distributionType"
                      value="automatic"
                      checked={formData.distributionType === "automatic"}
                      onChange={(e) => handleChange("distributionType", e.target.value)}
                      className="text-blue-500"
                    />
                    <span className="text-white">توزيع تلقائي</span>
                  </label>
                </div>
              </div>
            )}

            {/* For hourly workshops, show automatic distribution message */}
            {workType === WorkType.HOURLY && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-sm text-blue-400">
                  سيتم توزيع المبلغ تلقائياً على الموظفين بناءً على ساعات العمل المسجلة
                </p>
              </div>
            )}

            {/* Manual Distribution */}
            {formData.distributionType === 'manual' && (
              <div className="max-h-[30vh] overflow-y-auto space-y-4 pr-2">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-slate-300">
                    توزيع المبالغ على الموظفين
                  </label>
                  <button
                    type="button"
                    onClick={addEmployee}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500/20 
                      text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 
                      transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    إضافة موظف
                  </button>
                </div>

                {errors.general && (
                  <div className="text-sm text-red-400 text-center mb-2">{errors.general}</div>
                )}

                {manualDistributions.map((distribution, index) => (
                  <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <select
                          value={distribution.employeeId}
                          onChange={(e) => handleDistributionChange(index, 'employeeId', e.target.value)}
                          className={`w-full px-3 py-2 bg-white/5 border rounded-lg text-white
                            focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all
                            ${errors[`employee_${index}_id`] ? "border-red-500" : "border-white/10"}`}
                        >
                          <option value="">اختر موظف...</option>
                          {availableEmployees
                            .filter(emp => !selectedEmployeeIds.includes(emp.id.toString()) || emp.id.toString() === distribution.employeeId)
                            .map((employee) => (
                              <option key={employee.id} value={employee.id}>
                                {employee.name}
                              </option>
                            ))}
                        </select>
                        {errors[`employee_${index}_id`] && (
                          <p className="mt-1 text-xs text-red-400">{errors[`employee_${index}_id`]}</p>
                        )}
                      </div>

                      <div className="flex-1">
                        <input
                          type="number"
                          value={distribution.amount}
                          onChange={(e) => handleDistributionChange(index, 'amount', e.target.value)}
                          className={`w-full px-3 py-2 bg-white/5 border rounded-lg text-white
                            focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all
                            ${errors[`employee_${index}_amount`] ? "border-red-500" : "border-white/10"}`}
                          placeholder="المبلغ"
                        />
                        {errors[`employee_${index}_amount`] && (
                          <p className="mt-1 text-xs text-red-400">{errors[`employee_${index}_amount`]}</p>
                        )}
                      </div>

                      {manualDistributions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEmployee(index)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Distribution Total */}
                {formData.amount && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 mt-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">المبلغ الموزع:</span>
                      <span className={`font-bold ${getTotalDistributed() === parseFloat(formData.amount) ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(getTotalDistributed())} / {formatCurrency(parseFloat(formData.amount))}
                      </span>
                    </div>
                    {errors.totalDistributed && (
                      <p className="mt-2 text-xs text-red-400">{errors.totalDistributed}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                ملاحظات
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white 
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 
                  transition-all resize-none"
                placeholder="ملاحظات إضافية..."
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading || activeFunds.length === 0}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                  bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري المحاسبة...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    محاسبة الورشة
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

export default WorkshopSettlementModal;
