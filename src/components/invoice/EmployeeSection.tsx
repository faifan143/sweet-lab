import React, { useMemo } from 'react';
import { useEmployeesList } from '@/hooks/employees/useEmployees';
import { InvoiceCategory } from '@/types/invoice.type';
import { Employee, WorkType } from '@/types/employees.type';
import { Loader2, User } from 'lucide-react';
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

  if (isLoading) {
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
        <div>
          {/* Show employee details if available */}
          {currentEmployeeValue?.employee?.workType && (
            <div className="text-sm text-slate-300 mb-2">
              نوع العمل: {currentEmployeeValue.employee.workType === WorkType.HOURLY ? 'بالساعة' : 'إنتاج'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeSection;
