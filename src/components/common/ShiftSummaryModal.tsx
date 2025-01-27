"use client";

import { motion } from "framer-motion";
import { ShiftSummaryData } from "./CloseShiftModal";
import { X } from "lucide-react";
import { formatDate } from "@/utils/formatters";

const ShiftSummaryModal = ({
  shiftId,
  summary,
  onClose,
}: {
  shiftId: number;
  summary: ShiftSummaryData | undefined;
  onClose: () => void;
}) => {
  if (!summary) return null;

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
        className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-bold text-white">
            تفاصيل الوردية #{shiftId}
          </h2>
        </div>

        <div className="space-y-6" dir="rtl">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-gray-400">الموظف</div>
              <div className="text-white">{summary.employeeName}</div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-400">وقت الفتح</div>
              <div className="text-white">{formatDate(summary.openTime)}</div>
            </div>
          </div>

          {/* Fund Summaries */}
          <div className="space-y-4">
            {summary.fundSummaries.map((fund) => (
              <div key={fund.fundType} className="p-4 rounded-lg bg-white/5">
                <div className="flex justify-between mb-2">
                  <span className="text-white font-medium">
                    {fund.fundType === "booth"
                      ? "البسطة"
                      : fund.fundType === "university"
                      ? "الجامعة"
                      : "الصندوق العام"}
                  </span>
                  <span className="text-gray-400">
                    ({fund.invoiceCount} فواتير)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-emerald-400">
                    المدخول: {fund.incomeTotal}
                  </div>
                  <div className="text-red-400">
                    المصروف: {fund.expenseTotal}
                  </div>
                  <div className="col-span-2 text-white">
                    الصافي: {fund.netTotal}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total and Difference */}
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/5">
              <div className="flex justify-between items-center font-medium">
                <span className="text-white">الإجمالي:</span>
                <span className="text-emerald-400">{summary.totalNet}</span>
              </div>
            </div>

            {summary.differenceStatus && (
              <div className="p-4 rounded-lg bg-white/5">
                <div className="flex justify-between items-center font-medium">
                  <span className="text-white">فارق الوردية:</span>
                  <span
                    className={
                      summary.differenceStatus === "surplus"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }
                  >
                    {summary.differenceValue}{" "}
                    {summary.differenceStatus === "surplus" ? "زيادة" : "نقصان"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShiftSummaryModal;
