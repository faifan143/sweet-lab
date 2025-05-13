import { AlertTriangle, Calendar, CreditCard } from "lucide-react";
import React from "react";

export type PaymentType = "paid" | "unpaid" | "breakage";

interface PaymentTypeSelectorProps {
  paymentType: PaymentType;
  onChange: (type: PaymentType) => void;
}

const PaymentTypeSelector: React.FC<PaymentTypeSelectorProps> = ({ paymentType, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-slate-200">حالة الدفع</label>
      <div className="flex gap-4">
        <button
          onClick={() => onChange("paid")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            paymentType === "paid"
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
          }`}
        >
          <CreditCard className="h-5 w-5" />
          دفعة كاملة
        </button>
        <button
          onClick={() => onChange("unpaid")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            paymentType === "unpaid"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
          }`}
        >
          <Calendar className="h-5 w-5" />
          غير مدفوع
        </button>
        <button
          onClick={() => onChange("breakage")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            paymentType === "breakage"
              ? "bg-red-500/20 text-red-400"
              : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
          }`}
        >
          <AlertTriangle className="h-5 w-5" />
          كسر
        </button>
      </div>
    </div>
  );
};

export default PaymentTypeSelector;