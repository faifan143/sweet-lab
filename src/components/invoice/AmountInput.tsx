import { InvoiceCategory } from "@/types/invoice.type";
import { Calculator } from "lucide-react";
import React from "react";

interface AmountInputProps {
  totalAmount: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: InvoiceCategory;
  mode: "income" | "expense";
}

const AmountInput: React.FC<AmountInputProps> = ({ totalAmount, onChange, type, mode }) => {
  const getLabel = () => {
    if (type === InvoiceCategory.ADVANCE) {
      return mode === "income" ? "قيمة السلفة" : "قيمة إرجاع السلفة";
    } else if (type === InvoiceCategory.EMPLOYEE) {
      return mode === "income" ? "قيمة العملية" : "قيمة العملية";
    } else {
      return "القيمة";
    }
  };

  const getPlaceholder = () => {
    if (type === InvoiceCategory.ADVANCE) {
      return mode === "income" ? "قيمة السلفة" : "قيمة إرجاع السلفة";
    } else if (type === InvoiceCategory.EMPLOYEE) {
      return mode === "income" ? "قيمة العملية" : "قيمة العملية";
    } else {
      return "القيمة";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-slate-200">
        {getLabel()}
      </label>
      <div className="relative">
        <Calculator className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="number"
          name="totalAmount"
          value={totalAmount}
          onChange={onChange}
          className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
          placeholder={`أدخل ${getPlaceholder()}`}
        />
      </div>
    </div>
  );
};

export default AmountInput;