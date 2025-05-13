import React from 'react';
import { Clock, CreditCard, Package, User, Wallet } from 'lucide-react';

interface EmployeeOperationTypeSelectorProps {
  mode: 'income' | 'expense';
  selectedType: string;
  onChange: (type: string) => void;
}

const EmployeeOperationTypeSelector: React.FC<EmployeeOperationTypeSelectorProps> = ({
  mode,
  selectedType,
  onChange
}) => {
  // Define operation types based on the mode (income or expense)
  const operationTypes = mode === 'income' 
    ? [
        {
          id: 'debtPayment',
          value: 'تسديد دين',
          icon: Wallet,
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10 hover:bg-purple-500/20',
          description: 'تسديد دين للموظف',
        },
        {
          id: 'returnWithdrawal',
          value: 'إرجاع سحب',
          icon: CreditCard,
          color: 'text-pink-400',
          bgColor: 'bg-pink-500/10 hover:bg-pink-500/20',
          description: 'إرجاع سحب سابق للموظف',
        }
      ]
    : [
        {
          id: 'debt',
          value: 'دين',
          icon: Wallet,
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10 hover:bg-purple-500/20',
          description: 'تسجيل دين جديد للموظف',
        },
        {
          id: 'salary_advance',
          value: 'سلفة',
          icon: CreditCard,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10 hover:bg-yellow-500/20',
          description: 'سلفة على الراتب',
        },
        {
          id: 'production',
          value: 'إنتاج',
          icon: Package,
          color: 'text-green-400',
          bgColor: 'bg-green-500/10 hover:bg-green-500/20',
          description: 'تسجيل إنتاج للموظف',
        },
        {
          id: 'hours',
          value: 'ساعات',
          icon: Clock,
          color: 'text-amber-400',
          bgColor: 'bg-amber-500/10 hover:bg-amber-500/20',
          description: 'تسجيل ساعات عمل للموظف',
        },
        {
          id: 'daily_salary',
          value: 'أجر يومي',
          icon: User,
          color: 'text-orange-400',
          bgColor: 'bg-orange-500/10 hover:bg-orange-500/20',
          description: 'أجر للموظف اليومي',
        }
      ];

  return (
    <div className="space-y-2">
      <label className="block text-slate-200">نوع العملية</label>
      <div className="grid grid-cols-2 gap-2">
        {operationTypes.map((type) => {
          const isSelected = selectedType === type.id;
          const IconComponent = type.icon;
          
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onChange(type.id)}
              className={`flex items-center p-3 gap-2 rounded-lg transition-colors text-right ${
                isSelected
                  ? `${type.bgColor} border-2 border-${type.color.replace('text-', '')}`
                  : `${type.bgColor} border border-slate-700/50`
              }`}
            >
              <div className={`p-2 rounded-lg ${type.bgColor} ${type.color}`}>
                <IconComponent size={18} />
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${type.color} text-sm`}>
                  {type.value}
                </h3>
                <p className="text-slate-400 text-xs truncate">{type.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EmployeeOperationTypeSelector;
