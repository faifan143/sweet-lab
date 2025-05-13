import React from "react";
import { Calculator } from "lucide-react";

interface AdditionalAmountInputProps {
  additionalAmount: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AdditionalAmountInput: React.FC<AdditionalAmountInputProps> = ({ 
  additionalAmount, 
  onChange 
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-slate-200">
        المبلغ الإضافي
      </label>
      <div className="relative">
        <Calculator className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="number"
          name="additionalAmount"
          value={additionalAmount}
          onChange={onChange}
          min="0"
          className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
          placeholder="قيمة المبلغ الإضافي"
        />
      </div>
      <p className="text-xs text-slate-400">
        يمكنك إضافة مبلغ إضافي على الفاتورة مثل قيمة التوصيل أو رسوم إضافية
      </p>
    </div>
  );
};

export default AdditionalAmountInput;