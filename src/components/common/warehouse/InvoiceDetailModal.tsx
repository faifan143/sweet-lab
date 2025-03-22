"use client";
import { WareHouseInvoice } from "@/types/warehouse.type";
import { formatDate } from "@/utils/formatters";
import { motion } from "framer-motion";
import { X } from "lucide-react";

// Invoice Detail Modal Component
export const InvoiceDetailModal = ({
  isOpen,
  onClose,
  invoice,
}: {
  isOpen: boolean;
  onClose: () => void;
  invoice: WareHouseInvoice | null;
}) => {
  if (!isOpen || !invoice) return null;

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
        className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-bold text-slate-100">
            تفاصيل الفاتورة: {invoice.invoiceNumber}
          </h2>
        </div>

        {/* Invoice Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg">
            <div className="flex flex-col gap-3">
              <div>
                <div className="text-sm text-gray-400 mb-1">التاريخ</div>
                <div className="text-white">
                  {formatDate(invoice.createdAt)}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">المورد</div>
                <div className="text-white">{invoice.customer?.name}</div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">الموظف</div>
                <div className="text-white">{invoice.employee.username}</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg">
            <div className="flex flex-col gap-3">
              <div>
                <div className="text-sm text-gray-400 mb-1">إجمالي المبلغ</div>
                <div className="text-white">{invoice.totalAmount} ر.س</div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">هاتف المورد</div>
                <div className="text-white" dir="ltr">
                  {invoice.customer?.phone}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">ملاحظات</div>
                <div className="text-white">
                  {invoice.notes || "لا توجد ملاحظات"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden mb-6">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-lg font-medium text-white">المنتجات</h3>
          </div>
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-right text-slate-200 p-3">المنتج</th>
                <th className="text-right text-slate-200 p-3">الكمية</th>
                <th className="text-right text-slate-200 p-3">سعر الوحدة</th>
                <th className="text-right text-slate-200 p-3">المجموع</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-t border-white/10">
                  <td className="p-3 text-slate-300">{item.item.name}</td>
                  <td className="p-3 text-slate-300">
                    {item.quantity} {"item.unit"}
                  </td>
                  <td className="p-3 text-slate-300">{item.unitPrice}</td>
                  <td className="p-3 text-slate-300">{"item.subTotal"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};
