import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { Invoice } from "@/types/invoice.type";

interface DeleteConfirmationModalProps {
  invoice: Invoice;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  invoice,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-800 p-6 rounded-lg shadow-xl max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="text-slate-400 hover:text-slate-300 transition-colors disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-6 w-6" />
            <h2 className="text-xl font-bold">تأكيد الحذف</h2>
          </div>
        </div>

        <div className="space-y-4" dir="rtl">
          <p className="text-slate-300 text-lg text-center">
            هل أنت متأكد من حذف الفاتورة{" "}
            <span className="font-bold text-white">
              {invoice.invoiceNumber}
            </span>
            ؟
          </p>
          <p className="text-slate-400 text-sm text-center">
            سيتم حذف الفاتورة نهائياً ولا يمكن التراجع عن هذا الإجراء.
          </p>

          <div className="flex gap-4 pt-4">
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>جاري الحذف...</span>
                </div>
              ) : (
                <span>تأكيد الحذف</span>
              )}
            </button>
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 bg-slate-700/50 text-slate-300 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              إلغاء
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteConfirmationModal;
