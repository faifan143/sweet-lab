// src/components/invoices/InvoiceTable.tsx
import { Invoice } from "@/types/invoice.type";
import {
  AlertCircle,
  CalendarClock,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface InvoiceTableProps {
  invoices?: Invoice[];
  onViewDetail: (invoice: Invoice) => void;
  onStatusChange: (invoice: Invoice, status: "paid" | "debt") => void;
}

const translateInvoiceType = (type: "expense" | "income") => {
  return type === "expense" ? "صرف" : "دخل";
};

export const InvoiceTable = ({
  invoices = [],
  onViewDetail,
  onStatusChange,
}: InvoiceTableProps) => {
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full" dir="rtl">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-right text-muted-foreground font-medium p-4 w-24">
                رقم الفاتورة
              </th>
              <th className="text-right text-muted-foreground font-medium p-4">
                التاريخ
              </th>
              <th className="text-right text-muted-foreground font-medium p-4">
                العميل
              </th>
              <th className="text-right text-muted-foreground font-medium p-4 w-28">
                الهاتف
              </th>
              <th className="text-right text-muted-foreground font-medium p-4 w-28">
                النوع
              </th>
              <th className="text-right text-muted-foreground font-medium p-4 w-28">
                المبلغ
              </th>
              <th className="text-right text-muted-foreground font-medium p-4 w-32">
                الحالة
              </th>
              <th className="text-right text-muted-foreground font-medium p-4 w-52">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="hover:bg-slate-700/25 transition-colors"
              >
                <td className="p-4 text-foreground">
                  #{invoice.invoiceNumber}
                </td>
                <td className="p-4 text-foreground">
                  {new Date(invoice.createdAt).toLocaleDateString("ar-SA")}
                </td>
                <td className="p-4 text-foreground">{invoice.customerName}</td>
                <td className="p-4 text-foreground">{invoice.customerPhone}</td>
                <td className="p-4 text-foreground">
                  {translateInvoiceType(invoice.invoiceType)}
                </td>
                <td className="p-4 text-foreground">
                  {formatCurrency(invoice.totalAmount)}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs ${
                      invoice.paidStatus
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
                    ) : !invoice.paidStatus &&
                      invoice.invoiceCategory === "debt" ? (
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
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {!invoice.paidStatus && (
                      <button
                        onClick={() => onStatusChange(invoice, "paid")}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-success/10 text-success hover:bg-success/20 transition-colors"
                      >
                        <DollarSign className="h-4 w-4" />
                        <span>تحويل لمدفوع</span>
                      </button>
                    )}
                    {!invoice.paidStatus &&
                      invoice.invoiceCategory !== "debt" && (
                        <button
                          onClick={() => onStatusChange(invoice, "debt")}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-warning/10 text-warning hover:bg-warning/20 transition-colors"
                        >
                          <CalendarClock className="h-4 w-4" />
                          <span>تحويل لدين</span>
                        </button>
                      )}
                    <button
                      onClick={() => onViewDetail(invoice)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-slate-700/25 text-slate-300 hover:bg-slate-700/50 transition-colors mr-2"
                    >
                      <Eye className="h-4 w-4" />
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
  );
};
