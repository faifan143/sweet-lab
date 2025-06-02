import React from "react";
import { DollarSign } from "lucide-react";

interface FirstPaymentInputProps {
  firstPayment: number;
  totalAmount: number;
  discount: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FirstPaymentInput: React.FC<FirstPaymentInputProps> = ({
  firstPayment,
  totalAmount,
  discount,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-slate-200">الدفعة الأولى</label>
      <div className="relative">
        <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="number"
          name="firstPayment"
          value={firstPayment}
          onChange={onChange}
          className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
          placeholder="أدخل قيمة الدفعة الأولى"
        />
      </div>
      {firstPayment <= 0 && (
        <div className="text-red-400 text-sm">
          يجب إدخال قيمة أكبر من صفر
        </div>
      )}
      {firstPayment >= totalAmount - discount && totalAmount > 0 && (
        <div className="text-red-400 text-sm">
          يجب أن تكون الدفعة الأولى أقل من المبلغ الإجمالي بعد الخصم
        </div>
      )}
    </div>
  );
};

export default FirstPaymentInput;