import { motion } from "framer-motion";
import { X, User, Calendar, FileText, DollarSign } from "lucide-react";
import { EmployeeDebt } from "@/types/debts.type";
import { formatCurrency, formatDate } from "@/utils/formatters";

interface EmployeeDebtDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  debt: EmployeeDebt | null;
}

const EmployeeDebtDetailsModal: React.FC<EmployeeDebtDetailsModalProps> = ({
  isOpen,
  onClose,
  debt,
}) => {
  if (!isOpen || !debt) return null;

  const getStatusBadge = (status: string) => {
    const styles = status === "active"
      ? "bg-warning/10 text-warning"
      : "bg-success/10 text-success";

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${styles}`}>
        {status === "active" ? "نشط" : "مدفوع"}
      </span>
    );
  };

  const getInvoiceCategoryBadge = (category: string) => {
    const categoryMap: Record<string, { label: string; color: string }> = {
      'EMPLOYEE_DEBT': { label: 'دين موظف', color: 'bg-red-500/10 text-red-400' },
      'EMPLOYEE_WITHDRAWAL': { label: 'سحب موظف', color: 'bg-orange-500/10 text-orange-400' },
      'DAILY_EMPLOYEE_RENT': { label: 'أجر يومي', color: 'bg-blue-500/10 text-blue-400' },
      'EMPLOYEE': { label: 'موظف', color: 'bg-purple-500/10 text-purple-400' },
    };

    const config = categoryMap[category] || { label: category, color: 'bg-slate-500/10 text-slate-400' };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${config.color}`}>
        {config.label}
      </span>
    );
  };

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
        className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-xl font-bold text-slate-100">تفاصيل دين الموظف</h2>
        </div>

        {/* Content */}
        <div className="space-y-6" dir="rtl">
          {/* Employee Information */}
          <div className="bg-slate-700/25 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <User className="h-5 w-5" />
              معلومات الموظف
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">اسم الموظف:</span>
                <span className="text-slate-200 font-medium">{debt.employee.username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">الحالة:</span>
                {getStatusBadge(debt.status)}
              </div>
            </div>
          </div>

          {/* Debt Information */}
          <div className="bg-slate-700/25 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              معلومات الدين
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 block mb-1">المبلغ الكلي</span>
                <span className="text-emerald-400 font-semibold text-lg">
                  {formatCurrency(debt.totalAmount)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">المبلغ المتبقي</span>
                <span className="text-red-400 font-semibold text-lg">
                  {formatCurrency(debt.remainingAmount)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">تاريخ الإنشاء</span>
                <span className="text-slate-200">{formatDate(debt.createdAt)}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">آخر تحديث</span>
                <span className="text-slate-200">{formatDate(debt.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {debt.notes && (
            <div className="bg-slate-700/25 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                ملاحظات
              </h3>
              <p className="text-slate-300">{debt.notes}</p>
            </div>
          )}

          {/* Related Invoices */}
          <div className="bg-slate-700/25 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              الفواتير المرتبطة ({debt.relatedInvoices.length})
            </h3>
            <div className="space-y-3">
              {debt.relatedInvoices.map((invoice) => (
                <div key={invoice.id} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 font-medium">
                        فاتورة #{invoice.invoiceNumber}
                      </span>
                      {getInvoiceCategoryBadge(invoice.invoiceCategory)}
                    </div>
                    <span className={`text-sm ${invoice.invoiceType === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {invoice.invoiceType === 'income' ? 'دخل' : 'مصروف'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">المبلغ:</span>
                      <span className="text-slate-300 mx-2">
                        {formatCurrency(invoice.totalAmount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">التاريخ:</span>
                      <span className="text-slate-300 mx-2">
                        {formatDate(invoice.createdAt)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">الخزينة:</span>
                      <span className="text-slate-300 mx-2">
                        {invoice.fund.fundType}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">الموظف:</span>
                      <span className="text-slate-300 mx-2">
                        {invoice.employee.username}
                      </span>
                    </div>
                  </div>
                  {invoice.notes && (
                    <div className="mt-2 pt-2 border-t border-slate-700/50">
                      <span className="text-slate-500 text-sm">ملاحظات:</span>
                      <p className="text-slate-300 text-sm mt-1">{invoice.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EmployeeDebtDetailsModal;
