import React from "react";
import { motion } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

interface CloseShiftModalProps {
  onClose: () => void;
  onConfirm: () => void;
  shiftType: "صباحي" | "مسائي";
}

const CloseShiftModal: React.FC<CloseShiftModalProps> = ({
  onClose,
  onConfirm,
  shiftType,
}) => {
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
          <h2 className="text-xl font-bold text-slate-100">
            تأكيد إغلاق الوردية
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6" dir="rtl">
          {/* Warning Icon and Message */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="w-12 h-12 text-amber-400" />
            <div>
              <h3 className="text-lg font-semibold text-amber-400 mb-1">
                هل أنت متأكد من إغلاق الوردية {shiftType}؟
              </h3>
              <p className="text-slate-300 text-sm">
                سيتم حفظ جميع البيانات وإغلاق الوردية الحالية
              </p>
            </div>
          </div>

          {/* Current Shift Info */}
          <div className="p-4 rounded-lg bg-slate-700/50 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">نوع الوردية:</span>
              <span className="text-slate-200">{shiftType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">وقت الفتح:</span>
              <span className="text-slate-200">09:00 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">المدة:</span>
              <span className="text-slate-200">8 ساعات</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              className="flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg font-medium transition-colors border border-red-500/20"
            >
              تأكيد الإغلاق
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 bg-slate-700/50 text-slate-300 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              إلغاء
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CloseShiftModal;
