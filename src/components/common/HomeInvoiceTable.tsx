import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { Invoice } from "@/types/invoice.type";
import { formatSYP } from "@/hooks/invoices/useInvoiceStats";
import { formatDate } from "@/utils/formatters";

interface HomeInvoiceTableProps {
  data: Invoice[];
  onViewDetails: (invoice: Invoice) => void;
}

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center gap-2 mt-4 p-2"
      dir="rtl"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((number) => (
          <motion.button
            key={number}
            onClick={() => onPageChange(number)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              currentPage === number
                ? "bg-slate-700/50 text-slate-200"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/25"
            }`}
          >
            {number}
          </motion.button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
    </motion.div>
  );
};

export const HomeInvoiceTable: React.FC<HomeInvoiceTableProps> = ({
  data,
  onViewDetails,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  // Calculate pagination
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedData = data.slice(startIndex, endIndex);

  // Calculate total for all data (not just paginated)
  const totalAmount = data.reduce(
    (sum, inv) => sum + (inv.totalAmount - inv.discount),
    0
  );

  return (
    <>
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
            {paginatedData.map((invoice) => (
              <motion.tr
                key={invoice.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                layout
                className="border-b border-slate-700/50 hover:bg-slate-700/25 transition-colors"
              >
                <td className="p-3 text-slate-300">{invoice.invoiceNumber}</td>
                <td className="p-3 text-slate-300">
                  {formatDate(invoice.createdAt)}
                </td>
                <td className="p-3 text-slate-300">
                  {invoice.invoiceType === "income" ? "دخل" : "مصروف"}
                </td>
                <td className="p-3 text-slate-300">
                  {invoice.customer.name || "-"}
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
                    onClick={() => onViewDetails(invoice)}
                    className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 text-sm"
                  >
                    <FileText className="h-4 w-4" />
                    عرض التفاصيل
                  </button>
                </td>
              </motion.tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-slate-400">
                  لا توجد فواتير متطابقة مع معايير البحث
                </td>
              </tr>
            )}
          </tbody>
          {data.length > 0 && (
            <motion.tfoot
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-800/50"
            >
              <tr>
                <td colSpan={4} className="p-3 text-slate-300 font-semibold">
                  المجموع
                </td>
                <td className="p-3 text-emerald-400 font-semibold">
                  {formatSYP(totalAmount)}
                </td>
                <td colSpan={2}></td>
              </tr>
            </motion.tfoot>
          )}
        </table>
      </motion.div>

      {data.length > PAGE_SIZE && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
};

export default HomeInvoiceTable;
