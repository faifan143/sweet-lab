import React, { useEffect, useState } from 'react';
import { User, Search, X } from 'lucide-react';
import { useEmployeesList } from '@/hooks/employees';
import { Employee } from '@/types/employees.type';
import { InvoiceCategory } from '@/types/invoice.type';

interface EmployeeSectionProps {
  formData: {
    employeeId?: number;
    employeeName?: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  type: InvoiceCategory;
  mode: 'income' | 'expense';
}

const EmployeeSection: React.FC<EmployeeSectionProps> = ({
  formData,
  setFormData,
  type,
  mode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch employees list
  const { data: employees, isLoading } = useEmployeesList();

  // Filter employees based on search query
  const filteredEmployees = employees?.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (employee.phone && employee.phone.includes(searchQuery))
  ) || [];

  // Handle employee selection
  const handleSelectEmployee = (employee: Employee) => {
    setFormData((prev: any) => ({
      ...prev,
      employeeId: employee.id,
      employeeName: employee.name,
    }));
    setShowDropdown(false);
    setSearchQuery('');
  };

  // Clear selected employee
  const handleClearEmployee = () => {
    setFormData((prev: any) => ({
      ...prev,
      employeeId: undefined,
      employeeName: '',
    }));
  };

  return (
    <div className="space-y-2">
      <label className="block text-slate-200">الموظف</label>
      <div className="relative">
        {formData.employeeId ? (
          <div className="flex items-center justify-between px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-slate-600/50 text-slate-300">
                <User size={16} />
              </div>
              <span>{formData.employeeName}</span>
            </div>
            <button
              type="button"
              onClick={handleClearEmployee}
              className="text-slate-400 hover:text-slate-300 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <>
            <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onClick={() => setShowDropdown(true)}
              className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
              placeholder="ابحث عن موظف..."
            />

            {showDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-slate-800 border border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-slate-400">جاري التحميل...</div>
                ) : filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <button
                      key={employee.id}
                      type="button"
                      onClick={() => handleSelectEmployee(employee)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-slate-700/70 text-slate-200 transition-colors text-right"
                    >
                      <div className="p-2 rounded-lg bg-slate-700 text-slate-300">
                        <User size={16} />
                      </div>
                      <div className="flex-1">
                        <div>{employee.name}</div>
                        {employee.phone && (
                          <div className="text-sm text-slate-400">{employee.phone}</div>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-400">لا توجد نتائج</div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeSection;
