import React from "react";
import { DollarSign } from "lucide-react";

interface TotalAmountDisplayProps {
  totalAmount: number;
  discount: number;
  additionalAmount: number;
}

const TotalAmountDisplay: React.FC<TotalAmountDisplayProps> = ({ 
  totalAmount, 
  discount, 
  additionalAmount 
}) => {
  const calculateTotal = () => {
    return totalAmount - discount + additionalAmount;
  };

  return (
    <div className="space-y-2">
      <label className="block text-slate-200">
        الإجمالي بعد الخصم والإضافات
      </label>
      <div className="relative">
        <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          readOnly
          value={calculateTotal()}
          className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
        />
      </div>
    </div>
  );
};

export default TotalAmountDisplay;