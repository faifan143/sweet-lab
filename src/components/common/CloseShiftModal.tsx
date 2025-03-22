"use client";
import { formatAmount } from "@/hooks/invoices/useInvoiceStats";
import { useCheckPendingTransfers } from "@/hooks/shifts/useShifts";
import { formatDate } from "@/utils/formatters";
import { motion } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface Fund {
  fundType: string;
  invoiceCount: number;
  incomeTotal: number;
  expenseTotal: number;
  netTotal: number;
}

export interface ShiftSummaryData {
  shiftId: number;
  employeeName: string;
  openTime: string;
  fundSummaries: Fund[];
  totalNet: number;
  differenceStatus: "surplus" | "deficit";
  differenceValue: number;
}

interface CloseShiftModalProps {
  onClose: () => void;
  onConfirm: ({
    amount,
    status,
  }: {
    status: "surplus" | "deficit";
    amount: number;
  }) => void;
  shiftType: "صباحي" | "مسائي";
  shiftSummary?: ShiftSummaryData;
  isShiftClosing: boolean;
}

const CloseShiftModal: React.FC<CloseShiftModalProps> = ({
  onClose,
  onConfirm,
  shiftType,
  shiftSummary,
  isShiftClosing,
}) => {
  const [diffStatus, setDiffStatus] = useState<"surplus" | "deficit">(
    "surplus"
  );

  const [difference, setDifference] = useState<number>(0);
  const { data } = useCheckPendingTransfers();

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
        className="bg-slate-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 h-[90%] overflow-y-auto overflow-hidden no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-xl font-bold text-slate-100">
            تأكيد إغلاق الوردية
          </h2>
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

          {/* Shift Summary */}
          {shiftSummary && (
            <>
              {/* Current Shift Info */}
              <div className="p-4 rounded-lg bg-slate-700/50 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">الموظف:</span>
                  <span className="text-slate-200">
                    {shiftSummary.employeeName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">وقت الفتح:</span>
                  <span className="text-slate-200">
                    {formatDate(shiftSummary.openTime)}
                  </span>
                </div>
              </div>

              {/* Funds Summary */}
              <div className="space-y-2">
                {shiftSummary.fundSummaries.map((fund) => (
                  <div
                    key={fund.fundType}
                    className="p-4 rounded-lg bg-slate-700/30"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-200 font-medium">
                        {fund.fundType === "booth"
                          ? "البسطة"
                          : fund.fundType === "university"
                          ? "الجامعة"
                          : "الصندوق العام"}
                      </span>
                      <span className="text-slate-400">
                        ({fund.invoiceCount} فواتير)
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-1 text-sm">
                      <div className="text-emerald-400">
                        المدخول: {fund.incomeTotal}
                      </div>
                      <div className="text-red-400">
                        المصروف: {fund.expenseTotal}
                      </div>
                      <div className="col-span-2 text-slate-200">
                        الصافي: {fund.netTotal}
                      </div>
                    </div>
                  </div>
                ))}
                {/* Total Net */}
                <div className="p-4 rounded-lg bg-slate-700/50">
                  <div className="flex justify-between items-center font-medium">
                    <span className="text-slate-200">إجمالي الصناديق:</span>
                    <span className="text-emerald-400">
                      {formatAmount(shiftSummary.totalNet)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <label className="block text-slate-200 mb-2">
                  قيمة الفوارق
                </label>
                <input
                  type="number"
                  defaultValue={difference}
                  onChange={(e) => setDifference(parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 appearance-none"
                  placeholder="أدخل قيمة الفوارق"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-slate-200">نوع الفرق</label>
                <div className="flex items-center gap-2 bg-slate-700/30 p-1 rounded-lg">
                  <button
                    className={`px-3 py-1.5 rounded transition-colors ${
                      diffStatus == "surplus"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "text-slate-400 hover:text-slate-300"
                    }`}
                    onClick={() => setDiffStatus("surplus")}
                  >
                    زيادة
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded transition-colors ${
                      diffStatus == "deficit"
                        ? "bg-red-500/20 text-red-400"
                        : "text-slate-400 hover:text-slate-300"
                    }`}
                    onClick={() => setDiffStatus("deficit")}
                  >
                    نقصان
                  </button>
                </div>
              </div>
            </div>
            <p className="text-red-500">
              {data &&
                data.hasPendingTransfers &&
                "عالج التحويلات المعلقة قبل انهاء الوردية"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            {data && !data.hasPendingTransfers && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  onConfirm({ amount: difference, status: diffStatus })
                }
                className="flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg font-medium transition-colors border border-red-500/20"
              >
                {isShiftClosing ? "جارٍ إغلاق الوردية" : " تأكيد الإغلاق"}
              </motion.button>
            )}
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
