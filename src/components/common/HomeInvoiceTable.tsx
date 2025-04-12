import { formatSYP } from "@/hooks/invoices/useInvoiceStats";
import { Invoice } from "@/types/invoice.type";
import { formatDate } from "@/utils/formatters";
import { motion } from "framer-motion";
import { BellDot, Calendar, ChevronLeft, ChevronRight, Clipboard, CreditCard, FileText, User } from "lucide-react";
import { useEffect, useState } from "react";
import InvoicesActionsMenu from "./InvoicesActionsMenu";

interface HomeInvoiceTableProps {
  data: Invoice[];
  onViewDetails: (invoice: Invoice) => void;
  onEditInvoice: (invoice: Invoice) => void;
  onDeleteInvoice?: (invoice: Invoice) => void;
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

  // Show a limited range of page numbers on mobile
  const showPageNumbers = () => {
    // If 7 or fewer pages, show all
    if (totalPages <= 7) return pageNumbers;

    // Always show first, last, current, and pages immediately around current
    let visiblePages = [1, totalPages];

    // Pages around current
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      visiblePages.push(i);
    }

    // Add ellipsis indicators
    if (currentPage - 1 > 2) visiblePages.push(-1); // -1 as a flag for left ellipsis
    if (currentPage + 1 < totalPages - 1) visiblePages.push(-2); // -2 as a flag for right ellipsis

    return visiblePages.sort((a, b) => a - b);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center gap-1 md:gap-2 mt-4 p-2"
      dir="rtl"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-50 disabled:hover:bg-transparent"
        aria-label="الصفحة السابقة"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="flex flex-wrap items-center justify-center gap-1">
        {showPageNumbers().map((number, index) => {
          if (number === -1) {
            return <span key={`ellipsis-left-${index}`} className="text-slate-400">...</span>;
          }
          if (number === -2) {
            return <span key={`ellipsis-right-${index}`} className="text-slate-400">...</span>;
          }

          return (
            <motion.button
              key={number}
              onClick={() => onPageChange(number)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`min-w-[28px] px-2 py-1 rounded-lg text-sm transition-colors ${currentPage === number
                ? "bg-slate-700/50 text-slate-200"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/25"
                }`}
              aria-label={`الصفحة ${number}`}
              aria-current={currentPage === number ? "page" : undefined}
            >
              {number}
            </motion.button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-50 disabled:hover:bg-transparent"
        aria-label="الصفحة التالية"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
    </motion.div>
  );
};

export const HomeInvoiceTable: React.FC<HomeInvoiceTableProps> = ({
  data,
  onViewDetails,
  onEditInvoice,
  onDeleteInvoice,
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

  // Helper function to check if invoice has notes
  const hasNotes = (invoice: Invoice) => {
    return invoice.notes && invoice.notes.trim() !== '';
  };

  return (
    <>
      {/* Desktop view - Full table */}
      <div className="hidden md:block overflow-x-auto overflow-y-auto no-scrollbar">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="min-w-full bg-slate-800/50 rounded-lg border border-slate-700/50"
        >
          <table className="w-full text-right">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="p-3 text-slate-300 text-sm">رقم الفاتورة</th>
                <th className="p-3 text-slate-300 text-sm">التاريخ</th>
                <th className="p-3 text-slate-300 text-sm">النوع</th>
                <th className="p-3 text-slate-300 text-sm">العميل</th>
                <th className="p-3 text-slate-300 text-sm">المبلغ</th>
                <th className="p-3 text-slate-300 text-sm">الحالة</th>
                <th className="p-3 text-slate-300 text-sm">الإجراءات</th>
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
                  <td className="p-3 text-slate-300 text-sm">
                    <div className="flex items-center">
                      {invoice.invoiceNumber}
                      {hasNotes(invoice) && (
                        <div className="mx-2 text-red-500 " title="يحتوي على ملاحظات">
                          <BellDot className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-slate-300 text-sm">{formatDate(invoice.createdAt)}</td>
                  <td className="p-3 text-slate-300 text-sm">
                    {invoice.invoiceType === "income" ? "دخل" : "مصروف"}
                  </td>
                  <td className="p-3 text-slate-300 text-sm">
                    {invoice.customer ? invoice.customer.name : "-"}
                  </td>
                  <td className="p-3 text-slate-300 text-sm">
                    {formatSYP(invoice.totalAmount - invoice.discount)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs ${invoice.paidStatus
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-yellow-500/10 text-yellow-400"
                        }`}
                    >
                      {invoice.isBreak ? "كسر" : invoice.paidStatus ? "نقدي" : "آجل"}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <InvoicesActionsMenu
                      invoice={invoice}
                      onViewDetails={onViewDetails}
                      onEditInvoice={onEditInvoice}
                      onDeleteInvoice={onDeleteInvoice}
                    />
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
      </div>

      {/* Mobile view - Card Grid layout */}
      <div className="md:hidden">
        {paginatedData.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4 text-center text-slate-400"
          >
            لا توجد فواتير متطابقة مع معايير البحث
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {paginatedData.map((invoice) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-3 space-y-2 h-full flex flex-col justify-between hover:bg-slate-700/25 transition-colors active:bg-slate-700/40"
                  onClick={() => onViewDetails(invoice)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-slate-300 font-medium flex items-center gap-1">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span>{invoice.invoiceNumber}</span>
                        {hasNotes(invoice) && (
                          <div className="mx-1 text-sky-400" title="يحتوي على ملاحظات">
                            <Clipboard className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="text-slate-400 text-xs flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(invoice.createdAt)}</span>
                      </div>
                    </div>
                    <div onClick={(e) => e.stopPropagation()} className="p-1">
                      <InvoicesActionsMenu
                        invoice={invoice}
                        onViewDetails={onViewDetails}
                        onEditInvoice={onEditInvoice}
                        onDeleteInvoice={onDeleteInvoice}
                      />
                    </div>
                  </div>

                  <div className="py-1">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <User className="h-3 w-3" />
                      <span className="truncate max-w-[150px]">
                        {invoice.customer ? invoice.customer.name : "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${invoice.invoiceType === "income"
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-red-500/10 text-red-400"
                      }`}>
                      {invoice.invoiceType === "income" ? "دخل" : "مصروف"}
                    </span>

                    <div className="flex items-end flex-col">
                      <span className="text-emerald-400 font-medium text-sm">
                        {formatSYP(invoice.totalAmount - invoice.discount)}
                      </span>
                      <span
                        className={`mt-1 inline-flex items-center px-2 py-1 rounded-full text-xs ${invoice.paidStatus
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-yellow-500/10 text-yellow-400"
                          }`}
                      >
                        <CreditCard className="h-3 w-3 mx-1" />
                        {invoice.paidStatus ? "نقدي" : "آجل"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile Total */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-3 mt-3"
            >
              <div className="flex justify-between items-center">
                <div className="text-slate-300 font-medium">المجموع</div>
                <div className="text-emerald-400 font-semibold">
                  {formatSYP(totalAmount)}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>

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