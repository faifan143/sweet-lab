"use client";
import { formatSYP } from "@/hooks/invoices/useInvoiceStats";
import { Invoice } from "@/types/invoice.type";
import { FundType } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  DollarSign,
  FileText,
} from "lucide-react";
import React, { useState } from "react";
import ActionButton from "./ActionButtons";
import { InvoiceDetailsModal } from "./InvoiceDetailsModal";

interface TabContentProps {
  type: FundType;
  tableData: Invoice[];
  isLoading?: boolean;
  onAddIncome: () => void;
  onAddExpense: () => void;
}

const TabContent: React.FC<TabContentProps> = ({
  tableData,
  isLoading,
  onAddIncome,
  onAddExpense,
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "unpaid">(
    "all"
  );

  if (isLoading) {
    return (
      <div className="p-4 text-center text-slate-400">جاري التحميل...</div>
    );
  }

  const filteredData = tableData.filter((invoice) => {
    // Date filter
    if (dateFilter) {
      const invoiceDate = new Date(invoice.createdAt)
        .toISOString()
        .split("T")[0];
      if (invoiceDate !== dateFilter) return false;
    }

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "paid" && !invoice.paidStatus) return false;
      if (statusFilter === "unpaid" && invoice.paidStatus) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-5">
        <div className="flex items-center gap-4 ">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-1.5 text-slate-200"
          />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | "paid" | "unpaid")
            }
            className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-1.5 text-slate-200"
          >
            <option value="all">جميع الحالات</option>
            <option value="paid">نقدي</option>
            <option value="unpaid">آجل</option>
          </select>
        </div>

        <div className="flex gap-4">
          <ActionButton
            icon={<ArrowUpCircle className="h-5 w-5" />}
            label="اضافة دخل"
            onClick={onAddIncome}
            variant="income"
          />
          <ActionButton
            icon={<ArrowDownCircle className="h-5 w-5" />}
            label="اضافة مصروف"
            onClick={onAddExpense}
            variant="expense"
          />
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="overflow-x-auto bg-slate-800/50 rounded-lg border border-slate-700/50"
      >
        <table className="w-full text-right">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="p-3 text-slate-300">رقم الفاتورة</th>
              <th className="p-3 text-slate-300">التاريخ</th>
              <th className="p-3 text-slate-300">النوع</th>
              <th className="p-3 text-slate-300">العميل</th>
              <th className="p-3 text-slate-300">المبلغ</th>
              <th className="p-3 text-slate-300">الحالة</th>
              <th className="p-3 text-slate-300">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-b border-slate-700/50 hover:bg-slate-700/25 transition-colors"
              >
                <td className="p-3 text-slate-300">{invoice.invoiceNumber}</td>
                <td className="p-3 text-slate-300">
                  {new Date(invoice.createdAt).toLocaleDateString("ar-SA")}
                </td>
                <td className="p-3 text-slate-300">
                  {invoice.invoiceType === "income" ? "دخل" : "مصروف"}
                </td>
                <td className="p-3 text-slate-300">
                  {invoice.customerName || "-"}
                </td>
                <td className="p-3 text-slate-300">
                  {formatSYP(invoice.totalAmount - invoice.discount)}
                </td>
                <td className="p-3">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs ${
                      invoice.paidStatus
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {invoice.paidStatus ? "نقدي" : "آجل"}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => setSelectedInvoice(invoice)}
                    className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 text-sm"
                  >
                    <FileText className="h-4 w-4" />
                    عرض التفاصيل
                  </button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-slate-400">
                  لا توجد فواتير متطابقة مع معايير البحث
                </td>
              </tr>
            )}
          </tbody>
          {filteredData.length > 0 && (
            <tfoot className="bg-slate-800/50">
              <tr>
                <td colSpan={4} className="p-3 text-slate-300 font-semibold">
                  المجموع
                </td>
                <td className="p-3 text-emerald-400 font-semibold">
                  {formatSYP(
                    filteredData.reduce(
                      (sum, inv) => sum + (inv.totalAmount - inv.discount),
                      0
                    )
                  )}
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          )}
        </table>
      </motion.div>

      {/* Invoice Details Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <InvoiceDetailsModal
            invoice={selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
          />
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">إجمالي المبيعات</p>
              <p className="text-emerald-400 text-lg font-semibold">
                {formatSYP(
                  filteredData
                    .filter((inv) => inv.invoiceType === "income")
                    .reduce(
                      (sum, inv) => sum + (inv.totalAmount - inv.discount),
                      0
                    )
                )}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-emerald-400/20" />
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">إجمالي المصروفات</p>
              <p className="text-red-400 text-lg font-semibold">
                {formatSYP(
                  filteredData
                    .filter((inv) => inv.invoiceType === "expense")
                    .reduce(
                      (sum, inv) => sum + (inv.totalAmount - inv.discount),
                      0
                    )
                )}
              </p>
            </div>
            <ArrowDownCircle className="h-8 w-8 text-red-400/20" />
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">معدل التحصيل</p>
              <p className="text-blue-400 text-lg font-semibold">
                {(
                  (filteredData.filter((inv) => inv.paidStatus).length /
                    Math.max(filteredData.length, 1)) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-400/20" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabContent;
