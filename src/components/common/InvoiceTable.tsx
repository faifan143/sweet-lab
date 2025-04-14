// src/components/common/InvoiceTable.tsx
import { useState, useEffect } from "react";
import { Invoice } from "@/types/invoice.type";
import { formatCurrency, formatDate } from "@/utils/formatters";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowDownSquare,
  ArrowUpSquare
} from "lucide-react";
import { useMediaQuery } from "@mui/material";
import { Role, useRoles } from "@/hooks/users/useRoles";

interface InvoiceTableProps {
  invoices?: Invoice[];
  invoiceType?: "income" | "expense"; // Make this optional to work with existing code
  onViewDetail: (invoice: Invoice) => void;
  onStatusChange: (invoice: Invoice, status: "paid" | "debt") => void;
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
    <div className="flex items-center justify-center gap-2 mt-4 p-2" dir="rtl">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${currentPage === number
              ? "bg-slate-700/50 text-slate-200"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/25"
              }`}
          >
            {number}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
    </div>
  );
};

const StatusBadge: React.FC<{ invoice: Invoice }> = ({ invoice }) => (
  <span
    className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs ${invoice.paidStatus
      ? "bg-success/10 text-success"
      : invoice.invoiceCategory === "debt"
        ? "bg-warning/10 text-warning"
        : "bg-danger/10 text-danger"
      }`}
  >
    {invoice.paidStatus ? (
      <>
        <CheckCircle className="h-3 w-3" />
        <span>مدفوع</span>
      </>
    ) : !invoice.paidStatus && invoice.invoiceCategory === "debt" ? (
      <>
        <Clock className="h-3 w-3" />
        <span>دين</span>
      </>
    ) : (
      <>
        <AlertCircle className="h-3 w-3" />
        <span>غير مدفوع</span>
      </>
    )}
  </span>
);

export const InvoiceTable = ({
  invoices = [],
  invoiceType = "income", // Default to income for backward compatibility
  onViewDetail,
  onStatusChange,
}: InvoiceTableProps) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const { hasAnyRole } = useRoles();

  // Reset to first page when invoices change
  useEffect(() => {
    setCurrentPage(1);
  }, [invoices.length, invoiceType]);

  // Calculate pagination
  const totalPages = Math.ceil(invoices.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedInvoices = invoices.slice(startIndex, endIndex);

  // Get the appropriate icon for invoice type
  const TypeIcon = invoiceType === "income" ? ArrowDownSquare : ArrowUpSquare;
  const typeColorClass = invoiceType === "income"
    ? "text-emerald-400 bg-emerald-500/10"
    : "text-amber-400 bg-amber-500/10";

  const renderMobileView = () => (
    <>
      <div className="space-y-4">
        {paginatedInvoices.map((invoice) => (
          <div
            key={invoice.id}
            className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-slate-400">رقم الفاتورة</div>
                <div className="text-foreground">
                  #{invoice.invoiceNumber}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge invoice={invoice} />
                <span className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${typeColorClass}`}>
                  <TypeIcon className="h-3 w-3" />
                  {invoiceType === "income" ? "مبيعات" : "مشتريات"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm text-slate-400">العميل</div>
                <div className="text-foreground">
                  {invoice.customer ? invoice.customer.name : "-"}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400">الهاتف</div>
                <div className="text-foreground">
                  {invoice.customer ? invoice.customer.phone : "-"}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400">المبلغ</div>
                <div className="text-foreground">
                  {formatCurrency(invoice.totalAmount)}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400">التاريخ</div>
                <div className="text-foreground">
                  {formatDate(invoice.createdAt)}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {!invoice.paidStatus && hasAnyRole([Role.ADMIN]) && (
                <>
                  <button
                    onClick={() => onStatusChange(invoice, "paid")}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-success/10 text-success hover:bg-success/20 transition-colors flex-1"
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>تحويل لمدفوع</span>
                  </button>
                  <button
                    onClick={() => onStatusChange(invoice, "debt")}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-warning/10 text-warning hover:bg-warning/20 transition-colors flex-1"
                  >
                    <Clock className="h-4 w-4" />
                    <span>تحويل إلى دين</span>
                  </button>
                </>
              )}
              <button
                onClick={() => onViewDetail(invoice)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-slate-700/25 text-slate-300 hover:bg-slate-700/50 transition-colors flex-1"
              >
                <Eye className="h-4 w-4" />
                <span>عرض التفاصيل</span>
              </button>
            </div>
          </div>
        ))}
        {invoices.length === 0 && (
          <div className="text-center p-8 text-slate-400 bg-slate-800/50 rounded-lg">
            لا توجد فواتير متطابقة مع معايير البحث
          </div>
        )}
      </div>
      {invoices.length > PAGE_SIZE && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );

  const renderDesktopView = () => (
    <>
      <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full" dir="rtl">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-center text-muted-foreground font-medium p-4 w-24">
                  رقم الفاتورة
                </th>
                <th className="text-center text-muted-foreground font-medium p-4">
                  التاريخ
                </th>
                <th className="text-center text-muted-foreground font-medium p-4">
                  العميل
                </th>
                <th className="text-center text-muted-foreground font-medium p-4 w-28">
                  الهاتف
                </th>
                <th className="text-center text-muted-foreground font-medium p-4 w-28">
                  النوع
                </th>
                <th className="text-center text-muted-foreground font-medium p-4 w-28">
                  المبلغ
                </th>
                <th className="text-center text-muted-foreground font-medium p-4 w-32">
                  الحالة
                </th>
                <th className="text-center text-muted-foreground font-medium p-4 w-52">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {paginatedInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-slate-700/25 transition-colors"
                >
                  <td className="p-4 text-foreground text-center">
                    #{invoice.invoiceNumber}
                  </td>
                  <td className="p-4 text-foreground text-center">
                    {formatDate(invoice.createdAt)}
                  </td>
                  <td className="p-4 text-foreground text-center">
                    {invoice.customer ? invoice.customer.name : "-"}
                  </td>
                  <td className="p-4 text-foreground text-center">
                    {invoice.customer ? invoice.customer.phone : "-"}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-md text-xs flex items-center justify-center gap-1 ${typeColorClass} inline-flex mx-auto`}>
                      <TypeIcon className="h-3 w-3" />
                      {invoiceType === "income" ? "مبيعات" : "مشتريات"}
                    </span>
                  </td>
                  <td className="p-4 text-foreground text-center">
                    {formatCurrency(invoice.totalAmount)}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <StatusBadge invoice={invoice} />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col items-center gap-2">
                      {!invoice.paidStatus && hasAnyRole([Role.ADMIN]) && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => onStatusChange(invoice, "paid")}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-success/10 text-success hover:bg-success/20 transition-colors"
                          >
                            <DollarSign className="h-3 w-3" />
                            <span>تحويل لمدفوع</span>
                          </button>
                          <button
                            onClick={() => onStatusChange(invoice, "debt")}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-warning/10 text-warning hover:bg-warning/20 transition-colors"
                          >
                            <Clock className="h-3 w-3" />
                            <span>تحويل إلى دين</span>
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => onViewDetail(invoice)}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs bg-slate-700/25 text-slate-300 hover:bg-slate-700/50 transition-colors"
                      >
                        <Eye className="h-3 w-3" />
                        <span>عرض التفاصيل</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    لا توجد فواتير متطابقة مع معايير البحث
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {invoices.length > PAGE_SIZE && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );

  return isMobile ? renderMobileView() : renderDesktopView();
};

export default InvoiceTable;