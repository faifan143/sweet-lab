import React, { useMemo } from 'react';
import { useEmployeesList } from '@/hooks/employees/useEmployees';
import { useEmployeesDebtsTracking } from '@/hooks/debts/useDebts';
import { InvoiceCategory } from '@/types/invoice.type';
import { Employee, WorkType } from '@/types/employees.type';
import { AlertCircle, DollarSign, Loader2, User, WalletIcon } from 'lucide-react';
import Select, { GroupBase, StylesConfig } from 'react-select';

interface EmployeeOption {
  value: number;
  label: string;
  employee: Employee;
}

interface EmployeeSectionProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  type: InvoiceCategory;
  mode: "income" | "expense";
}

const EmployeeSection: React.FC<EmployeeSectionProps> = ({
  formData,
  setFormData,
  mode
}) => {
  const { data: employees, isLoading } = useEmployeesList();
  const { data: employeeDebts, isLoading: isLoadingDebts } = useEmployeesDebtsTracking();

  // Format employees for react-select
  const employeeOptions: EmployeeOption[] = useMemo(() => {
    return (employees || []).map(employee => ({
      value: employee.id,
      label: `${employee.name}${employee.phone ? ` - ${employee.phone}` : ''}`,
      employee
    }));
  }, [employees]);

  // Handle employee selection change
  const handleEmployeeSelect = (selectedOption: EmployeeOption | null) => {
    if (selectedOption) {
      setFormData((prev: any) => ({
        ...prev,
        employeeId: selectedOption.value,
        relatedEmployeeId: selectedOption.value,
        employeeName: selectedOption.label
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        employeeId: undefined,
        relatedEmployeeId: undefined,
        employeeName: ""
      }));
    }
  };

  // Get employee debt amount
  const getEmployeeDebtAmount = (employeeId: number): number => {
    if (!employeeDebts) return 0;

    const activeDebts = employeeDebts.filter(
      debt => debt.employeeId === employeeId && debt.status === 'active'
    );

    return activeDebts.reduce((total, debt) => total + debt.remainingAmount, 0);
  };

  // Get employee total withdrawals
  const getEmployeeTotalWithdrawals = (employeeId: number): number => {
    if (!employees) return 0;

    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee?.withdrawals?.length) return 0;

    return employee.withdrawals.reduce((total, withdrawal) => total + withdrawal.amount, 0);
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ar-SY', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Determine current selection for controlled component
  const currentEmployeeValue = useMemo(() => {
    if (formData.employeeId && employees) {
      const employee = employees.find(e => e.id === formData.employeeId);
      if (employee) {
        return {
          value: employee.id,
          label: `${employee.name}${employee.phone ? ` - ${employee.phone}` : ''}`,
          employee
        };
      }
    }
    return null;
  }, [formData.employeeId, employees]);

  // Custom styles for react-select
  const employeeSelectStyles: StylesConfig<EmployeeOption, false, GroupBase<EmployeeOption>> = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(51, 65, 85, 0.5)',
      borderColor: 'rgba(71, 85, 105, 0.5)',
      borderRadius: '0.5rem',
      padding: '0.25rem',
      boxShadow: 'none',
      '&:hover': {
        borderColor: 'rgba(71, 85, 105, 0.8)'
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'rgb(30, 41, 59)',
      border: '1px solid rgba(51, 65, 85, 0.5)',
      borderRadius: '0.5rem',
      zIndex: 9999
    }),
    option: (provided, { isSelected, isFocused }) => ({
      ...provided,
      backgroundColor: isSelected
        ? 'rgba(59, 130, 246, 0.5)'
        : isFocused
          ? 'rgba(51, 65, 85, 0.7)'
          : 'transparent',
      color: 'rgb(226, 232, 240)',
      textAlign: 'right',
      '&:hover': {
        backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.5)' : 'rgba(51, 65, 85, 0.7)'
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'rgb(226, 232, 240)',
      textAlign: 'right'
    }),
    input: (provided) => ({
      ...provided,
      color: 'rgb(226, 232, 240)',
      textAlign: 'right'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'rgb(148, 163, 184)',
      textAlign: 'right'
    }),
    indicatorSeparator: () => ({
      display: 'none'
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: 'rgb(148, 163, 184)'
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: 'rgb(148, 163, 184)'
    })
  };

  // Get operation type label based on formData.operationType
  const getOperationTypeLabel = () => {
    if (mode === "income") {
      return formData.operationType === "debtPayment"
        ? "تسديد دين للموظف"
        : "إرجاع سحب";
    } else {
      // For expense mode
      switch (formData.operationType) {
        case "debt": return "دين للموظف";
        case "salary_advance": return "سلفة على الراتب";
        case "production": return "إضافة إنتاج";
        case "hours": return "إضافة ساعات";
        case "daily_salary": return "أجر يومي للموظف";
        default: return "عملية موظف";
      }
    }
  };

  if (isLoading || isLoadingDebts) {
    return (
      <div className="flex justify-center items-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <span className="mx-2 text-slate-300">جاري تحميل بيانات الموظفين...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="block text-slate-200">
        {getOperationTypeLabel()}
        <span className="text-red-400 mx-1">*</span>
      </label>

      <div className="space-y-4">
        <div className="relative flex-1">
          <Select<EmployeeOption, false, GroupBase<EmployeeOption>>
            value={currentEmployeeValue}
            onChange={handleEmployeeSelect}
            options={employeeOptions}
            styles={employeeSelectStyles}
            isRtl={true}
            placeholder="اختر الموظف"
            noOptionsMessage={() => "لا يوجد موظفين"}
            isClearable
            menuPlacement="auto"
            classNamePrefix="react-select"
          />
        </div>
      </div>

      {!formData.employeeId && (
        <div className="text-red-400 text-sm mt-1">
          يجب اختيار موظف لإتمام العملية
        </div>
      )}

      {formData.employeeId && employees && (
        <div className="space-y-2 mt-3">
          {/* Show employee details if available */}
          {currentEmployeeValue?.employee?.workType && (
            <div className="text-sm text-slate-300">
              نوع العمل: {currentEmployeeValue.employee.workType === WorkType.HOURLY ? 'بالساعة' : 'إنتاج'}
            </div>
          )}

          {/* Show Employee Financial Summary */}
          <div className="mt-3 bg-slate-700/30 p-3 rounded-lg space-y-2">
            <h4 className="text-sm font-medium text-slate-200 mb-2">ملخص الموظف المالي:</h4>

            {/* Employee Debt */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <span className="text-sm text-slate-300">إجمالي الديون:</span>
              </div>
              <span className={`text-sm font-medium ${getEmployeeDebtAmount(formData.employeeId) > 0 ? 'text-red-400' : 'text-slate-300'}`}>
                {formatCurrency(getEmployeeDebtAmount(formData.employeeId))} ل.س
              </span>
            </div>

            {/* Employee Withdrawals */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-slate-300">إجمالي السحوبات:</span>
              </div>
              <span className={`text-sm font-medium ${getEmployeeTotalWithdrawals(formData.employeeId) > 0 ? 'text-blue-400' : 'text-slate-300'}`}>
                {formatCurrency(getEmployeeTotalWithdrawals(formData.employeeId))} ل.س
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSection;
