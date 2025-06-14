"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, AlertTriangle, DollarSign } from "lucide-react";

interface CompleteClosureModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  isLoading?: boolean;
  initialAmount?: number;
  shiftId?: number;
}

const CompleteClosureModal: React.FC<CompleteClosureModalProps> = ({
  open,
  onClose,
  onConfirm,
  isLoading = false,
  initialAmount = 0,
  shiftId,
}) => {
  const [amount, setAmount] = useState<number>(initialAmount);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (open) {
      setAmount(initialAmount);
      setError("");
    }
  }, [open, initialAmount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(amount) || amount <= 0) {
      setError("يرجى إدخال مبلغ صحيح");
      return;
    }
    setError("");
    onConfirm(amount);
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 transition-colors"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
          <h2 className="text-xl font-bold text-slate-100">
            إنهاء الوردية {shiftId ? `#${shiftId}` : ""}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="w-8 h-8 text-amber-400" />
            <div>
              <h3 className="text-lg font-semibold text-amber-400 mb-1">
                هل أنت متأكد من رغبتك في إنهاء الوردية؟
              </h3>
              <p className="text-slate-300 text-sm">
                أدخل المبلغ الفعلي لإكمال الإغلاق.
              </p>
            </div>
          </div>
          <div>
            <label className="block text-slate-200 mb-2">المبلغ الفعلي</label>
            <div className="relative">
              <input
                type="number"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 appearance-none pr-10"
                placeholder="أدخل المبلغ الفعلي"
                min={0}
                disabled={isLoading}
                autoFocus
              />
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            {error && <div className="text-red-400 mt-2 text-sm">{error}</div>}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-600 text-slate-200 hover:bg-slate-700 transition-colors"
              disabled={isLoading}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "جارٍ الإنهاء..." : "تأكيد الإنهاء"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CompleteClosureModal;
