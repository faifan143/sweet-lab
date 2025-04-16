// src/components/common/BreakageConversionModal.tsx
import { Invoice } from "@/types/invoice.type";
import { motion } from "framer-motion";
import { FileX, Loader2, X } from "lucide-react";
import { useState } from "react";

interface BreakageConversionModalProps {
    invoice: Invoice;
    onClose: () => void;
    onConfirm: (initialPayment: number, notes: string) => void;
    isProcessing: boolean;
}

const BreakageConversionModal = ({
    invoice,
    onClose,
    onConfirm,
    isProcessing,
}: BreakageConversionModalProps) => {
    const [initialPayment, setInitialPayment] = useState<number>(0);
    const [notes, setNotes] = useState<string>("");

    // Validate initial payment (must be > 0 and < invoice total)
    const isInitialPaymentValid = initialPayment > 0 && initialPayment < invoice.totalAmount;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-slate-800 border border-white/10 rounded-xl w-full max-w-md shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                dir="rtl"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-800/50">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <FileX className="h-5 w-5 text-blue-400" />
                        تحويل إلى فاتورة كسر
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">رقم الفاتورة:</span>
                            <span className="text-white">{invoice.invoiceNumber}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">المبلغ الإجمالي:</span>
                            <span className="text-white">{invoice.totalAmount.toLocaleString()} ليرة</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">العميل:</span>
                            <span className="text-white">{invoice.customer?.name || "-"}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="initialPayment" className="block text-sm font-medium text-gray-300">
                                الدفعة الأولى (مطلوب)
                            </label>
                            <input
                                type="number"
                                id="initialPayment"
                                value={initialPayment}
                                onChange={(e) => setInitialPayment(Number(e.target.value))}
                                placeholder="أدخل قيمة الدفعة الأولى"
                                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {!isInitialPaymentValid && initialPayment !== 0 && (
                                <p className="text-red-400 text-xs">
                                    يجب أن تكون الدفعة الأولى أكبر من صفر وأقل من القيمة الإجمالية للفاتورة
                                </p>
                            )}
                            {isInitialPaymentValid && (
                                <p className="text-emerald-400 text-xs">
                                    المبلغ المتبقي: {(invoice.totalAmount - initialPayment).toLocaleString()} ليرة
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-300">
                                ملاحظات
                            </label>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="أدخل أي ملاحظات إضافية..."
                                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[100px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-slate-800/50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                        disabled={isProcessing}
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={() => onConfirm(initialPayment, notes)}
                        disabled={!isInitialPaymentValid || isProcessing}
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>جاري التحويل...</span>
                            </div>
                        ) : (
                            "تأكيد التحويل"
                        )}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default BreakageConversionModal;