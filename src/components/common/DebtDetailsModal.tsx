import { Debt } from "@/types/debts.type";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import {
  Banknote,
  CalendarDays,
  ChevronLeft,
  Receipt,
  User,
} from "lucide-react";

// Types
interface DebtDetailsModalProps {
  debt: Debt | null;
  isOpen: boolean;
  onClose: () => void;
}

// Debt Details Modal Component
const DebtDetailsModal: React.FC<DebtDetailsModalProps> = ({
  debt,
  isOpen,
  onClose,
}) => {
  if (!debt) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: "rgb(30 41 59)",
          border: "1px solid rgb(51 65 85)",
          borderRadius: "0.5rem",
          maxWidth: "42rem",
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "rgb(226 232 240)",
          borderBottom: "1px solid rgba(51, 65, 85, 0.5)",
          padding: "1rem 1.5rem",
          direction: "rtl",
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">تفاصيل الدين</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700/50 rounded-full transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-slate-400" />
          </button>
        </div>
      </DialogTitle>

      <DialogContent sx={{ padding: "1.5rem", direction: "rtl" }}>
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <User className="h-5 w-5 text-slate-400" />
              معلومات العميل
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">اسم العميل</p>
                <p className="text-slate-200">{debt.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">رقم الهاتف</p>
                <p className="text-slate-200">{debt.customer.phone}</p>
              </div>
            </div>
          </div>

          {/* Debt Information */}
          <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <Banknote className="h-5 w-5 text-slate-400" />
              معلومات الدين
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-400">المبلغ الكلي</p>
                <p className="text-emerald-400 font-semibold">
                  {formatCurrency(debt.totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">المبلغ المتبقي</p>
                <p className="text-red-400 font-semibold">
                  {formatCurrency(debt.remainingAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">المبلغ المدفوع</p>
                <p className="text-blue-400 font-semibold">
                  {formatCurrency(debt.totalAmount - debt.remainingAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* Dates Information */}
          <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-slate-400" />
              التواريخ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">تاريخ الإنشاء</p>
                <p className="text-slate-200">{formatDate(debt.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">تاريخ آخر دفعة</p>
                <p className="text-slate-200">
                  {debt.lastPaymentDate
                    ? formatDate(debt.lastPaymentDate)
                    : "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Related Invoices */}
          <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <Receipt className="h-5 w-5 text-slate-400" />
              الفواتير المرتبطة
            </h3>
            <div className="space-y-2">
              {debt.relatedInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-700/25"
                >
                  <div className="space-y-1">
                    <p className="text-slate-200">#{invoice.invoiceNumber}</p>
                    <p className="text-sm text-slate-400">
                      {formatDate(invoice.createdAt)}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-emerald-400">
                      {formatCurrency(invoice.totalAmount)}
                    </p>
                    <p className="text-sm text-slate-400">
                      {invoice.invoiceType === "expense" ? "صرف" : "دخل"}
                    </p>
                  </div>
                </div>
              ))}
              {debt.relatedInvoices.length === 0 && (
                <p className="text-slate-400 text-center py-2">
                  لا توجد فواتير مرتبطة
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          {debt.notes && (
            <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
              <h3 className="text-lg font-semibold text-slate-200">ملاحظات</h3>
              <p className="text-slate-300">{debt.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DebtDetailsModal;
