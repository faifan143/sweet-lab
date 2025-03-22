import { motion } from "framer-motion";
import { X } from "lucide-react";
import { formatDate } from "@/utils/formatters";
import { ShiftsInvoices } from "@/types/shifts.type";

interface InvoicesModalProps {
  type: "boothInvoices" | "universityInvoices" | "generalInvoices";
  data: ShiftsInvoices | undefined;
  onClose: () => void;
}

const InvoicesModal = ({ type, data, onClose }: InvoicesModalProps) => {
  const getTitle = () => {
    switch (type) {
      case "boothInvoices":
        return "فواتير البسطة";
      case "universityInvoices":
        return "فواتير الجامعة";
      case "generalInvoices":
        return "الفواتير العامة";
    }
  };

  const getInvoices = () => {
    if (!data) return [];
    switch (type) {
      case "boothInvoices":
        return data.boothInvoices;
      case "universityInvoices":
        return data.universityInvoices;
      case "generalInvoices":
        return data.generalInvoices;
    }
  };

  const invoices = getInvoices();
  const total = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-800 border border-white/10 rounded-xl w-full max-w-6xl max-h-[90dvh] overflow-hidden shadow-2xl"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-semibold text-white">{getTitle()}</h2>
          </div>
          <div className="text-gray-400">
            عدد الفواتير: {invoices.length} | الإجمالي: {total.toLocaleString()}{" "}
            ليرة
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto no-scrollbar">
          {invoices.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              لا توجد فواتير لعرضها
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="py-3 px-4 text-right text-gray-400 font-medium">
                      رقم الفاتورة
                    </th>
                    <th className="py-3 px-4 text-right text-gray-400 font-medium">
                      اسم العميل
                    </th>
                    <th className="py-3 px-4 text-right text-gray-400 font-medium">
                      التاريخ
                    </th>
                    <th className="py-3 px-4 text-right text-gray-400 font-medium">
                      المبلغ
                    </th>
                    <th className="py-3 px-4 text-right text-gray-400 font-medium">
                      التفاصيل
                    </th>
                    <th className="py-3 px-4 text-right text-gray-400 font-medium">
                      طريقة الدفع
                    </th>
                    <th className="py-3 px-4 text-right text-gray-400 font-medium">
                      النوع
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4 text-white">#{invoice.id}</td>
                      <td className="py-3 px-4 text-white">
                        {invoice.customer ? invoice.customer.name : ""}
                      </td>
                      <td className="py-3 px-4 text-white">
                        {formatDate(invoice.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-white">
                        {invoice.totalAmount.toLocaleString()} ليرة
                      </td>
                      <td className="py-3 px-4 text-white">{invoice.notes}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`
                            px-3 py-1 rounded-full text-sm font-medium
                            ${
                              invoice.paidStatus
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-red-500/10 text-red-400"
                            }
                          `}
                        >
                          {invoice.paidStatus ? "مدفوع" : "غير مدفوع"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`
                            px-3 py-1 rounded-full text-sm font-medium
                            ${
                              invoice.invoiceType === "expense"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-emerald-500/10 text-emerald-400"
                            }
                          `}
                        >
                          {invoice.invoiceType === "expense" ? "صرف" : "دخل"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InvoicesModal;
