"use client";

import React, { useState } from "react";
import { Users, Plus, Search, Edit, Trash2, Activity, Loader2, Phone, Clock, DollarSign, FileWarning, Eye, Hammer } from "lucide-react";
import { useEmployeesList } from "@/hooks/employees/useEmployees";
import { useEmployeesDebtsTracking } from "@/hooks/debts/useDebts";
import { Employee, WorkType } from "@/types/employees.type";
import { EmployeeDebt } from "@/types/debts.type";
import Navbar from "@/components/common/Navbar";
import { Role, useRoles } from "@/hooks/users/useRoles";
import EmployeeModal from "@/components/employees/EmployeeModal";
import EmployeeDetailsModal from "@/components/employees/EmployeeDetailsModal";
import SplineBackground from "@/components/common/SplineBackground";
import PageSpinner from "@/components/common/PageSpinner";
import { AnimatePresence, motion } from "framer-motion";
import EmployeeDebtsTable from "@/components/common/EmployeeDebtsTable";
import EmployeeDebtDetailsModal from "@/components/common/EmployeeDebtDetailsModal";
import WorkshopList from "@/components/workshops/WorkshopList";
import PasswordModal from "@/components/common/PasswordModal";
import { Workshop } from "@/types/workshops/workshop.type";

// Format currency function
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("ar-SY", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(amount);
};

const EmployeesPage = () => {
  const [activeTab, setActiveTab] = useState<"employees" | "debts" | "workshops">("employees");
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState("");
  const [workshopSearchQuery, setWorkshopSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterWorkType, setFilterWorkType] = useState<"all" | WorkType>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedEmployeeDebt, setSelectedEmployeeDebt] = useState<EmployeeDebt | null>(null);
  const [showDebtDetailsModal, setShowDebtDetailsModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'view' | 'edit' | null>(null);
  const [verifiedPassword, setVerifiedPassword] = useState<string | null>(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [verifiedWorkshop, setVerifiedWorkshop] = useState<Workshop | null>(null);
  const [pendingWorkshopAction, setPendingWorkshopAction] = useState<'view' | 'edit' | null>(null);

  const { data: employees, isLoading, refetch } = useEmployeesList();
  const { data: employeeDebts, isLoading: isDebtsLoading } = useEmployeesDebtsTracking();
  const { hasAnyRole } = useRoles();

  const canManageEmployees = hasAnyRole([
    Role.ADMIN,
    Role.MANAGER,
    Role.TreasuryManager,
  ]);

  // Filter employees based on search query and work type
  const filteredEmployees = employees?.filter(
    (employee) => {
      // Search filter
      const searchMatch =
        employee.name.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
        (employee.phone &&
          employee.phone.toLowerCase().includes(employeeSearchQuery.toLowerCase()));

      // Work type filter
      const workTypeMatch = filterWorkType === "all" || employee.workType === filterWorkType;

      return searchMatch && workTypeMatch;
    }
  );

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setShowAddModal(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowAddModal(true);
  };

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDetailsModal(true);
  };

  const handleViewDebtDetails = (debt: EmployeeDebt) => {
    setSelectedEmployeeDebt(debt);
    setShowDebtDetailsModal(true);
  };

  const handleWorkshopPasswordRequired = (workshop: Workshop, action: 'view' | 'edit') => {
    setSelectedWorkshop(workshop);
    setPendingAction(action);
    setShowPasswordModal(true);
  };

  const handlePasswordVerify = async (password: string): Promise<boolean> => {
    // Check for workshop password only
    if (selectedWorkshop?.password && selectedWorkshop.password === password) {
      setVerifiedPassword(password);
      setVerifiedWorkshop(selectedWorkshop);
      setShowPasswordModal(false);
      setPendingWorkshopAction(pendingAction);
      setPendingAction(null);
      setSelectedWorkshop(null);
      return true;
    }

    return false;
  };

  const resetPasswordFlow = () => {
    setShowPasswordModal(false);
    setShowDetailsModal(false);
    setShowAddModal(false);
    setSelectedEmployee(null);
    setSelectedWorkshop(null);
    setVerifiedPassword(null);
    setVerifiedWorkshop(null);
    setPendingAction(null);
    setPendingWorkshopAction(null);
  };

  // Helper function to get work type text
  const getWorkTypeText = (workType?: WorkType | string) => {
    switch (workType) {
      case WorkType.HOURLY:
        return "بالساعة";
      case WorkType.PRODUCTION:
        return "بالإنتاج";
      default:
        return "—";
    }
  };

  // Helper function to get work type icon
  const getWorkTypeIcon = (workType?: WorkType | string) => {
    switch (workType) {
      case WorkType.HOURLY:
        return <Clock className="w-4 h-4" />;
      case WorkType.PRODUCTION:
        return <DollarSign className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-900 relative transition-colors duration-300">
        {(isLoading || isDebtsLoading) && <PageSpinner />}
        <SplineBackground activeTab="employees" />
        <div className="relative ">
          <Navbar />
          <main className="py-16 p-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Page Header */}
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-2">
                  إدارة الموظفين
                </h1>
                <p className="text-slate-400">
                  عرض وإدارة بيانات الموظفين في المؤسسة
                </p>
              </div>
              {/* Tabs Navigation - Responsive */}
              <div className="flex gap-2 sm:gap-4 border-b border-slate-700/50 mb-8 overflow-x-auto no-scrollbar" dir="rtl">
                <button
                  onClick={() => setActiveTab("employees")}
                  className={`px-3 sm:px-6 py-2 sm:py-3 -mb-px text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center gap-1 sm:gap-2 whitespace-nowrap ${activeTab === "employees"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>الموظفين</span>
                </button>
                <button
                  onClick={() => setActiveTab("debts")}
                  className={`px-3 sm:px-6 py-2 sm:py-3 -mb-px text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center gap-1 sm:gap-2 whitespace-nowrap ${activeTab === "debts"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <FileWarning className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>ديون الموظفين</span>
                </button>
                <button
                  onClick={() => setActiveTab("workshops")}
                  className={`px-3 sm:px-6 py-2 sm:py-3 -mb-px text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center gap-1 sm:gap-2 whitespace-nowrap ${activeTab === "workshops"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Hammer className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>ورشات</span>
                </button>
              </div>
              {/* Tab Content */}
              {activeTab === "employees" && (
                <>
                  {/* Statistics - Moved to top */}
                  <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-white mb-2">
                        {filteredEmployees?.length || 0}
                      </div>
                      <div className="text-slate-400">إجمالي الموظفين</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-cyan-400 mb-2">
                        {filteredEmployees?.filter(e => e.workType === WorkType.HOURLY).length || 0}
                      </div>
                      <div className="text-slate-400">موظفين بالساعة</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">
                        {filteredEmployees?.filter(e => e.workType === WorkType.PRODUCTION).length || 0}
                      </div>
                      <div className="text-slate-400">موظفين بالإنتاج</div>
                    </div>
                  </div>
                  {/* Combined Search, Filters, and Add Button Row */}
                  <div
                    className="mb-8 flex flex-col lg:flex-row gap-4 px-4"
                    dir="rtl"
                  >
                    {/* Search */}
                    <div className="relative flex-1">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="بحث عن موظف..."
                        value={employeeSearchQuery}
                        onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                        className="w-full px-4 pr-10 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>
                    {/* Work Type Filter - Responsive */}
                    <div className="flex flex-wrap sm:flex-nowrap gap-2">
                      <button
                        onClick={() => setFilterWorkType("all")}
                        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${filterWorkType === "all"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                          }`}
                      >
                        جميع الموظفين
                      </button>
                      <button
                        onClick={() => setFilterWorkType(WorkType.HOURLY)}
                        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${filterWorkType === WorkType.HOURLY
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                          }`}
                      >
                        <Clock className="h-4 w-4" />
                        بالساعة
                      </button>
                      <button
                        onClick={() => setFilterWorkType(WorkType.PRODUCTION)}
                        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${filterWorkType === WorkType.PRODUCTION
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                          }`}
                      >
                        <DollarSign className="h-4 w-4" />
                        بالإنتاج
                      </button>
                    </div>
                    {/* View Toggle */}
                    <div className="flex rounded-lg overflow-hidden border border-white/10">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`flex items-center gap-2 px-4 py-2 transition-colors ${viewMode === "grid"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-white/5 text-white hover:bg-white/10"
                          }`}
                      >
                        <Users className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setViewMode("table")}
                        className={`flex items-center gap-2 px-4 py-2 transition-colors ${viewMode === "table"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-white/5 text-white hover:bg-white/10"
                          }`}
                      >
                        <Activity className="h-5 w-5" />
                      </button>
                    </div>
                    {/* Add Employee Button */}
                    {canManageEmployees && (
                      <button
                        onClick={handleAddEmployee}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg
                          bg-blue-500 text-white hover:bg-blue-600 transition-colors
                          shadow-lg shadow-blue-500/20 whitespace-nowrap"
                        dir="rtl"
                      >
                        <Plus className="h-5 w-5" />
                        إضافة موظف جديد
                      </button>
                    )}
                  </div>
                  {/* Employees Content */}
                  <div className="container mx-auto px-4" dir="rtl">
                    {isLoading ? (
                      <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />
                      </div>
                    ) : filteredEmployees && filteredEmployees.length === 0 ? (
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 text-center text-gray-400">
                        {employeeSearchQuery || filterWorkType !== "all"
                          ? "لا توجد نتائج للبحث"
                          : "لا يوجد موظفين"}
                      </div>
                    ) : viewMode === "grid" ? (
                      // Grid View - Responsive columns
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        <AnimatePresence>
                          {filteredEmployees && filteredEmployees.map((employee, index) => (
                            <motion.div
                              key={`employee-${employee.id + " - " + index}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-white/10 rounded-xl p-6
                                        hover:shadow-lg hover:shadow-blue-500/5 hover:border-blue-500/30 transition-all duration-300"
                              onClick={() => handleViewDetails(employee)}
                            >
                              <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-medium text-white line-clamp-1">
                                  {employee.name}
                                </h3>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1
                                    ${employee.workType === WorkType.HOURLY
                                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                      : "bg-green-500/10 text-green-400 border border-green-500/20"
                                    }`}
                                >
                                  {getWorkTypeIcon(employee.workType)}
                                  {getWorkTypeText(employee.workType)}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mb-6">
                                <Phone className="w-5 h-5 text-blue-500" />
                                <div>
                                  <div className="text-sm text-gray-400">
                                    رقم الهاتف
                                  </div>
                                  <div className="text-white" dir="ltr">
                                    {employee.phone || "—"}
                                  </div>
                                </div>
                              </div>
                              {/* Action Buttons */}
                              <div className="flex gap-2 pt-4 border-t border-white/10">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(employee);
                                  }}
                                  className="flex-1 flex items-center justify-center gap-2 px-2 py-2 rounded-lg
                                          bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors
                                          border border-blue-500/20"
                                >
                                  <Activity className="w-4 h-4" />
                                  عرض
                                </button>
                                {canManageEmployees && (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditEmployee(employee);
                                      }}
                                      className="flex-1 flex items-center justify-center gap-2 px-2 py-2 rounded-lg
                                              bg-slate-600/30 text-slate-300 hover:bg-slate-600/50 transition-colors
                                              border border-slate-600/30"
                                    >
                                      <Edit className="w-4 h-4" />
                                      تعديل
                                    </button>
                                    <button
                                      className="flex items-center justify-center gap-2 px-2 py-2 rounded-lg
                                              bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors
                                              border border-red-500/20"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    ) : (
                      // Table View
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-slate-700/50">
                            <tr>
                              <th className="text-center text-slate-200 p-4">الاسم</th>
                              <th className="text-center text-slate-200 p-4">رقم الهاتف</th>
                              <th className="text-center text-slate-200 p-4">نوع العمل</th>
                              <th className="text-center text-slate-200 p-4">الإجراءات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredEmployees && filteredEmployees.map((employee, index) => (
                              <tr
                                key={`employee-${employee.id + " - " + index}`}
                                className="border-t border-white/10 hover:bg-slate-700/20 transition-colors"
                                onClick={() => handleViewDetails(employee)}
                              >
                                <td className="p-4 text-center text-slate-300 font-medium">
                                  {employee.name}
                                </td>
                                <td className="p-4 text-center text-slate-300" dir="ltr">
                                  {employee.phone || "—"}
                                </td>
                                <td className="p-4 text-center">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 inline-flex justify-center
                                    ${employee.workType === WorkType.HOURLY
                                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                      : "bg-green-500/10 text-green-400 border border-green-500/20"
                                    }`}>
                                    {getWorkTypeIcon(employee.workType)}
                                    {getWorkTypeText(employee.workType)}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div
                                    className="flex gap-2 justify-center"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      onClick={() => handleViewDetails(employee)}
                                      className="flex items-center gap-1 px-2 py-1.5 rounded-lg
                                              bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors
                                              border border-blue-500/20 text-sm"
                                    >
                                      <Activity className="w-3 h-3" />
                                      عرض
                                    </button>
                                    {canManageEmployees && (
                                      <>
                                        <button
                                          onClick={() => handleEditEmployee(employee)}
                                          className="flex items-center gap-1 px-2 py-1.5 rounded-lg
                                                  bg-slate-600/30 text-slate-300 hover:bg-slate-600/50 transition-colors
                                                  border border-slate-600/30 text-sm"
                                        >
                                          <Edit className="w-3 h-3" />
                                          تعديل
                                        </button>
                                        <button
                                          className="flex items-center gap-1 px-2 py-1.5 rounded-lg
                                                  bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors
                                                  border border-red-500/20 text-sm"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                          حذف
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}
              {/* Employee Debt Records Tab Content */}
              {activeTab === "debts" && (
                <div className="space-y-6">
                  {/* Debt Statistics - Responsive grid */}
                  {isDebtsLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
                          <div className="text-3xl font-bold text-white mb-2">
                            {employeeDebts?.length || 0}
                          </div>
                          <div className="text-slate-400">إجمالي السجلات</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
                          <div className="text-3xl font-bold text-yellow-400 mb-2">
                            {employeeDebts?.filter(d => d.status === "active").length || 0}
                          </div>
                          <div className="text-slate-400">ديون نشطة</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
                          <div className="text-3xl font-bold text-green-400 mb-2">
                            {employeeDebts?.filter(d => d.status === "paid").length || 0}
                          </div>
                          <div className="text-slate-400">ديون مسددة</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
                          <div className="text-3xl font-bold text-red-400 mb-2">
                            {formatCurrency(
                              employeeDebts?.reduce((sum, debt) => sum + (debt.status === "active" ? debt.remainingAmount : 0), 0) || 0
                            )}
                          </div>
                          <div className="text-slate-400">إجمالي المبالغ المستحقة</div>
                        </div>
                      </div>
                      {/* Debt Records Table */}
                      {employeeDebts && employeeDebts.length > 0 ? (
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                          <EmployeeDebtsTable
                            debts={employeeDebts}
                            onViewDetails={handleViewDebtDetails}
                          />
                        </div>
                      ) : (
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-12 text-center">
                          <FileWarning className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                          <p className="text-xl text-slate-300">لا توجد سجلات ديون للموظفين</p>
                          <p className="text-slate-400 mt-2">جميع الموظفين ليس لديهم ديون مستحقة حالياً</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
              {/* Workshops Tab Content */}
              {activeTab === "workshops" && (
                <div className="space-y-6">
                  {/* Search, Filters for Workshops */}
                  <div
                    className="mb-8 flex flex-col lg:flex-row gap-4 px-4"
                    dir="rtl"
                  >
                    {/* Search */}
                    <div className="relative flex-1">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="بحث عن ورشة..."
                        value={workshopSearchQuery}
                        onChange={(e) => setWorkshopSearchQuery(e.target.value)}
                        className="w-full px-4 pr-10 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>
                    {/* Work Type Filter */}
                    <div className="flex flex-wrap sm:flex-nowrap gap-2">
                      <button
                        onClick={() => setFilterWorkType("all")}
                        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${filterWorkType === "all"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                          }`}
                      >
                        جميع الورشات
                      </button>
                      <button
                        onClick={() => setFilterWorkType(WorkType.HOURLY)}
                        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${filterWorkType === WorkType.HOURLY
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                          }`}
                      >
                        <Clock className="h-4 w-4" />
                        بالساعة
                      </button>
                      <button
                        onClick={() => setFilterWorkType(WorkType.PRODUCTION)}
                        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${filterWorkType === WorkType.PRODUCTION
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                          }`}
                      >
                        <DollarSign className="h-4 w-4" />
                        بالإنتاج
                      </button>
                    </div>
                  </div>
                  {/* Workshop List Component */}
                  <WorkshopList
                    searchQuery={workshopSearchQuery}
                    filterWorkType={filterWorkType}
                    onPasswordRequired={handleWorkshopPasswordRequired}
                    verifiedWorkshop={verifiedWorkshop}
                    verifiedPassword={verifiedPassword}
                    pendingWorkshopAction={pendingWorkshopAction}
                  />
                </div>
              )}
            </div>
          </main>
        </div>
        {/* Employee Add/Edit Modal */}
        {showAddModal && (
          <EmployeeModal
            employee={selectedEmployee}
            onClose={() => {
              setShowAddModal(false);
              setVerifiedPassword(null);
            }}
            onSave={() => {
              setShowAddModal(false);
              setVerifiedPassword(null);
              refetch();
            }}
          />
        )}
        {/* Employee Details Modal */}
        {showDetailsModal && selectedEmployee && (
          <EmployeeDetailsModal
            employee={selectedEmployee}
            onClose={() => setShowDetailsModal(false)}
          />
        )}
        {/* Employee Debt Details Modal */}
        {showDebtDetailsModal && selectedEmployeeDebt && (
          <EmployeeDebtDetailsModal
            isOpen={showDebtDetailsModal}
            onClose={() => setShowDebtDetailsModal(false)}
            debt={selectedEmployeeDebt}
          />
        )}
      </div>
      {/* Password Modal for Workshop Authentication */}
      {selectedWorkshop && (
        <PasswordModal
          title="التحقق من الهوية"
          entityName={selectedWorkshop.name}
          entityType="workshop"
          onClose={resetPasswordFlow}
          onVerify={handlePasswordVerify}
          isOpen={showPasswordModal}
        />
      )}
    </>
  );
};

export default EmployeesPage;
