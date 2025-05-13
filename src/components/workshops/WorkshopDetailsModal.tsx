"use client";

import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { useMokkBar } from "@/components/providers/MokkBarContext";
import { Role, useRoles } from "@/hooks/users/useRoles";
import { useRemoveEmployeeFromWorkshop, useWorkshopFinancialSummary } from "@/hooks/workshops/useWorkshops";
import { WorkType } from "@/types/employees.type";
import { Workshop } from "@/types/workshops/workshop.type";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Clock, DollarSign, FileText, Plus, Trash2, Users, X } from "lucide-react";
import React, { useState } from "react";
import AddEmployeeToWorkshopModal from "./AddEmployeeToWorkshopModal";
import WorkshopHoursModal from "./WorkshopHoursModal";
import WorkshopProductionModal from "./WorkshopProductionModal";
import WorkshopSettlementModal from "./WorkshopSettlementModal";

interface WorkshopDetailsModalProps {
  workshop: Workshop;
  password: string;
  onClose: () => void;
  onUpdate?: () => void;
}

const WorkshopDetailsModal: React.FC<WorkshopDetailsModalProps> = ({ workshop, password, onClose, onUpdate }) => {
  const [showProductionModal, setShowProductionModal] = useState(false);
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"summary" | "employees" | "activities">("summary");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [employeeToRemove, setEmployeeToRemove] = useState<{ id: number; name: string } | null>(null);

  const { hasAnyRole } = useRoles();
  const { setSnackbarConfig } = useMokkBar();
  const removeEmployeeFromWorkshop = useRemoveEmployeeFromWorkshop();

  const canManageWorkshops = hasAnyRole([
    Role.ADMIN,
    Role.MANAGER,
    Role.TreasuryManager,
  ]);

  // Get financial summary for the current month
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();

  const { data: financialSummary } = useWorkshopFinancialSummary(
    workshop.id,
    { startDate, endDate },
  );

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("ar-SY", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleRemoveEmployee = async (employeeId: number, employeeName: string) => {
    setEmployeeToRemove({ id: employeeId, name: employeeName });
    setShowConfirmDialog(true);
  };

  const confirmRemoveEmployee = async () => {
    if (!employeeToRemove) return;

    try {
      await removeEmployeeFromWorkshop.mutateAsync({
        workshopId: workshop.id,
        employeeId: employeeToRemove.id,
      });

      setSnackbarConfig({
        open: true,
        severity: "success",
        message: `تم إزالة ${employeeToRemove.name} من الورشة بنجاح`,
      });

      // Call onUpdate to refresh the workshop data
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error removing employee from workshop:", error);
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "حدث خطأ أثناء إزالة الموظف",
      });
    } finally {
      setShowConfirmDialog(false);
      setEmployeeToRemove(null);
    }
  };


  const stats = [
    {
      title: "الرصيد الحالي",
      icon: <DollarSign className="h-5 w-5 text-yellow-400" />,
      value: financialSummary?.netAmount || 0,
      color: "from-yellow-500/10 to-yellow-900/10",
    },
    {
      title: "إجمالي الدخل",
      icon: <Activity className="h-5 w-5 text-green-400" />,
      value: financialSummary?.totalEarnings || 0,
      color: "from-green-500/10 to-green-900/10",
    },
    {
      title: "إجمالي السحب",
      icon: <Activity className="h-5 w-5 text-blue-400" />,
      value: financialSummary?.totalWithdrawals || 0,
      color: "from-blue-500/10 to-blue-900/10",
    },
    {
      title: "إجمالي الديون",
      icon: <Activity className="h-5 w-5 text-red-400" />,
      value: financialSummary?.totalDebt || 0,
      color: "from-red-500/10 to-red-900/10",
    },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "summary":
        return (
          <div className="space-y-6 ">
            {
              stats.map((card, index) => (
                <div
                  key={index}
                  className={`
                  relative bg-gradient-to-br ${card.color}
                  backdrop-blur-lg border border-white/10 
                  rounded-xl p-5 shadow-sm hover:shadow-md 
                  transition-all duration-300 hover:-translate-y-1
                  overflow-hidden group
                `}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300   "></div>
                  <div className="relative flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {card.icon}
                      <span className="text-sm font-medium text-slate-300">{card.title}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-2xl font-bold text-white tracking-tight">
                    {formatCurrency(card.value)}
                  </div>
                  {/* Subtle bottom border animation */}
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-white/30 group-hover:w-full transition-all duration-300"></div>
                </div>
              ))
            }
            {/* Actions */}
            {canManageWorkshops && (
              <div className="flex flex-wrap gap-3">
                {workshop.workType === WorkType.HOURLY && (
                  <button
                    onClick={() => setShowHoursModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 
                      text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
                  >
                    <Clock className="h-4 w-4" />
                    إضافة ساعات عمل
                  </button>
                )}

                {workshop.workType === WorkType.PRODUCTION && (
                  <button
                    onClick={() => setShowProductionModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 
                      text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors"
                  >
                    <Activity className="h-4 w-4" />
                    إضافة إنتاج
                  </button>
                )}

                <button
                  onClick={() => setShowSettlementModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 
                    text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  محاسبة الورشة                </button>
              </div>
            )}
          </div>
        );

      case "employees":
        return (
          <div className="space-y-4">
            {workshop.employees && workshop.employees.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">
                    الموظفون في الورشة ({workshop.employees.length})
                  </h3>
                  {canManageWorkshops && (
                    <button
                      onClick={() => setShowAddEmployeeModal(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 
                        text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      إضافة موظف
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {workshop.employees.map((employee, index) => {
                    if (!employee || !employee.id) return null;
                    return (
                      <div
                        key={`employee-${employee.id + " - " + index}`}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-white font-medium">{employee.name}</h4>
                            <p className="text-sm text-slate-400">{employee.phone || "لا يوجد رقم هاتف"}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium
                                ${employee.workType === WorkType.HOURLY
                                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                  : "bg-green-500/10 text-green-400 border border-green-500/20"
                                }`}
                            >
                              {employee.workType === WorkType.HOURLY ? "بالساعة" : "بالإنتاج"}
                            </span>
                            {canManageWorkshops && (
                              <button
                                onClick={() => handleRemoveEmployee(employee.id, employee.name)}
                                className="p-2 rounded-lg bg-red-500/10 text-red-400 
                                  border border-red-500/20 hover:bg-red-500/20 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-400">لا يوجد موظفون في هذه الورشة</p>
                {canManageWorkshops && (
                  <button
                    onClick={() => setShowAddEmployeeModal(true)}
                    className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 
                      text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    إضافة موظف
                  </button>
                )}
              </div>
            )}
          </div>
        );

      case "activities":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white mb-4">الأنشطة الأخيرة</h3>

            {/* Recent Hour Records (for hourly workshops) */}
            {workshop.workType === WorkType.HOURLY && (
              <>
                {financialSummary?.dailySummary && financialSummary.dailySummary.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm text-slate-400 font-medium">سجلات ساعات العمل</h4>
                    {financialSummary.dailySummary.slice(0, 5).map((dailySummary, index) => {
                      if (!dailySummary.employees || dailySummary.employees.length === 0) return null;
                      return (
                        <div key={`daily-${index}`} className="space-y-2">
                          <div className="text-sm text-slate-400 mb-2">
                            {format(new Date(dailySummary.date), "dd MMMM yyyy", { locale: ar })}
                          </div>
                          {dailySummary.employees.map((employeeRecord, empIndex) => (
                            <div
                              key={`hour-${index}-${empIndex}`}
                              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <Clock className="h-4 w-4 text-cyan-400" />
                                  <div className="flex justify-between gap-4">
                                    <span className="text-white">{employeeRecord.employeeName}</span>
                                    <span className="text-slate-400 text-sm mx-2">
                                      {employeeRecord.hours} ساعة × {formatCurrency(employeeRecord.hourlyRate)}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-sm text-green-400">
                                  {formatCurrency(employeeRecord.amount)}
                                </span>
                              </div>
                            </div>
                          ))}
                          <div className="text-sm text-slate-400 px-3 flex justify-between items-center">
                            <span>إجمالي اليوم:</span>
                            <span className="text-white">
                              {dailySummary.totalHours} ساعة - {formatCurrency(dailySummary.totalAmount || 0)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* Recent Production Records (for production workshops) */}
            {workshop.workType === WorkType.PRODUCTION && (
              <>
                {workshop.productionRecords && workshop.productionRecords.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm text-slate-400 font-medium">سجلات الإنتاج</h4>
                    {workshop.productionRecords.slice(0, 5).map((record, index) => {
                      if (!record || !record.id) return null;
                      return (
                        <div
                          key={`production-${record.id + "-" + index}`}
                          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <Activity className="h-4 w-4 text-green-400" />
                              <div>
                                <span className="text-white">{record.items.length} منتج</span>
                                <span className="text-slate-400 text-sm mx-2">
                                  {format(new Date(record.date), "dd MMMM yyyy", { locale: ar })}
                                </span>
                              </div>
                            </div>
                            <span className="text-sm text-green-400">
                              {formatCurrency(record.totalProduction)}
                            </span>
                          </div>
                          {/* Show production items */}
                          {record.items.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {record.items.map((item, itemIndex) => (
                                <div key={`production-${record.id}-item-${itemIndex}`} className="text-xs text-slate-400 pr-7">
                                  • {item.itemName}: {item.quantity} × {formatCurrency(item.rate)} = {formatCurrency(item.total)}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* Recent Settlements (for both types) */}
            {workshop.settlements && workshop.settlements.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm text-slate-400 font-medium">المحاسبات الأخيرة</h4>
                {workshop.settlements.slice(0, 5).map((settlement, index) => {
                  if (!settlement || !settlement.id) return null;
                  return (
                    <div
                      key={`settlement-${settlement.id + "-" + index}`}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-blue-400" />
                          <div>
                            <span className="text-white">محاسبة مالية</span>
                            <span className="text-slate-400 text-sm mx-2">
                              {format(new Date(settlement.date), "dd MMMM yyyy", { locale: ar })}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm text-green-400">
                          {formatCurrency(settlement.paidAmount)}
                        </span>
                      </div>
                      {settlement.notes && (
                        <p className="text-xs text-slate-400 mt-1 pr-7">{settlement.notes}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* No activities message */}
            {workshop.workType === WorkType.HOURLY &&
              (!financialSummary?.dailySummary || financialSummary.dailySummary.filter(ds => ds.employees && ds.employees.length > 0).length === 0) &&
              (!workshop.settlements || workshop.settlements.length === 0) && (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-400">لا توجد أنشطة مسجلة</p>
                </div>
              )}

            {workshop.workType === WorkType.PRODUCTION &&
              (!workshop.productionRecords || workshop.productionRecords.length === 0) &&
              (!workshop.settlements || workshop.settlements.length === 0) && (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-400">لا توجد أنشطة مسجلة</p>
                </div>
              )}
          </div>
        );

      default:
        return null;
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
          dir="rtl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 w-full max-w-3xl 
            shadow-2xl border border-white/10 max-h-[80vh] overflow-y-auto no-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">{workshop.name}</h2>
              <p className="text-sm text-slate-400 mt-1">
                نوع العمل: {workshop.workType === WorkType.HOURLY ? "بالساعة" : "بالإنتاج"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-white/10 mb-6">
            <button
              onClick={() => setActiveTab("summary")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "summary"
                ? "text-white border-b-2 border-blue-500"
                : "text-slate-400 hover:text-white"
                }`}
            >
              الملخص المالي
            </button>
            <button
              onClick={() => setActiveTab("employees")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "employees"
                ? "text-white border-b-2 border-blue-500"
                : "text-slate-400 hover:text-white"
                }`}
            >
              الموظفون
            </button>
            <button
              onClick={() => setActiveTab("activities")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "activities"
                ? "text-white border-b-2 border-blue-500"
                : "text-slate-400 hover:text-white"
                }`}
            >
              الأنشطة
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {renderTabContent()}
          </div>
        </motion.div>
      </motion.div>

      {/* Sub-modals */}
      {showAddEmployeeModal && (
        <AddEmployeeToWorkshopModal
          workshopId={workshop.id}
          workshopName={workshop.name}
          workshopType={workshop.workType}
          currentEmployeeIds={workshop.employees?.map(e => e.id).filter(id => id !== undefined && id !== null) || []}
          password={password}
          onClose={() => setShowAddEmployeeModal(false)}
          onSuccess={() => {
            setShowAddEmployeeModal(false);
            // The main modal will be refreshed by the parent component
            if (onUpdate) {
              onUpdate();
            }
          }}
        />
      )}

      {showProductionModal && (
        <WorkshopProductionModal
          workshopId={workshop.id}
          password={password}
          onClose={() => setShowProductionModal(false)}
          onSuccess={() => {
            setShowProductionModal(false);
            // Refetch data
          }}
        />
      )}

      {showHoursModal && (
        <WorkshopHoursModal
          workshopId={workshop.id}
          workType={workshop.workType}
          employees={workshop.employees || []}
          password={password}
          onClose={() => setShowHoursModal(false)}
          onSuccess={() => {
            setShowHoursModal(false);
            // Refetch data
          }}
        />
      )}

      {showSettlementModal && (
        <WorkshopSettlementModal
          workshopId={workshop.id}
          currentBalance={financialSummary?.netAmount ?? 0}
          password={password}
          workType={workshop.workType}
          onClose={() => setShowSettlementModal(false)}
          onSuccess={() => {
            setShowSettlementModal(false);
            // Refetch data
          }}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setEmployeeToRemove(null);
        }}
        onConfirm={confirmRemoveEmployee}
        title="إزالة موظف"
        message={`هل أنت متأكد من إزالة ${employeeToRemove?.name} من الورشة؟`}
        confirmText="إزالة"
        cancelText="إلغاء"
        type="danger"
      />
    </AnimatePresence>
  );
};

export default WorkshopDetailsModal;
