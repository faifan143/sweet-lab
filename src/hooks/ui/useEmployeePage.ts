import { useState, useMemo } from "react";
import { Employee, WorkType } from "@/types/employees.type";
import { EmployeeDebt } from "@/types/debts.type";
import { useEmployeesList } from "@/hooks/employees/useEmployees";
import { useEmployeesDebtsTracking } from "@/hooks/debts/useDebts";

export interface FilteredEmployeesOptions {
  searchQuery: string;
  filterWorkType: "all" | WorkType;
}

export function useFilteredEmployees(options: FilteredEmployeesOptions) {
  const { searchQuery, filterWorkType } = options;
  const { data: employees, isLoading, refetch } = useEmployeesList();

  const filteredEmployees = useMemo(() => {
    if (!employees) return [];
    
    return employees.filter((employee) => {
      // Search filter
      const searchMatch =
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (employee.phone &&
          employee.phone.toLowerCase().includes(searchQuery.toLowerCase()));

      // Work type filter
      const workTypeMatch = filterWorkType === "all" || employee.workType === filterWorkType;

      return searchMatch && workTypeMatch;
    });
  }, [employees, searchQuery, filterWorkType]);

  const statistics = useMemo(() => {
    return {
      total: filteredEmployees.length,
      hourly: filteredEmployees.filter(e => e.workType === WorkType.HOURLY).length,
      production: filteredEmployees.filter(e => e.workType === WorkType.PRODUCTION).length,
    };
  }, [filteredEmployees]);

  return {
    employees: filteredEmployees,
    statistics,
    isLoading,
    refetch,
  };
}

export function useEmployeeDebtsStatistics() {
  const { data: employeeDebts, isLoading } = useEmployeesDebtsTracking();

  const statistics = useMemo(() => {
    if (!employeeDebts) {
      return {
        total: 0,
        active: 0,
        paid: 0,
        totalAmount: 0,
      };
    }

    return {
      total: employeeDebts.length,
      active: employeeDebts.filter(d => d.status === "active").length,
      paid: employeeDebts.filter(d => d.status === "paid").length,
      totalAmount: employeeDebts.reduce((sum, debt) => 
        sum + (debt.status === "active" ? debt.remainingAmount : 0), 0
      ),
    };
  }, [employeeDebts]);

  return {
    debts: employeeDebts || [],
    statistics,
    isLoading,
  };
}

export function useEmployeePageState() {
  const [activeTab, setActiveTab] = useState<"employees" | "debts" | "workshops">("employees");
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState("");
  const [workshopSearchQuery, setWorkshopSearchQuery] = useState("");
  const [filterWorkType, setFilterWorkType] = useState<"all" | WorkType>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  return {
    activeTab,
    setActiveTab,
    employeeSearchQuery,
    setEmployeeSearchQuery,
    workshopSearchQuery,
    setWorkshopSearchQuery,
    filterWorkType,
    setFilterWorkType,
    viewMode,
    setViewMode,
  };
}
