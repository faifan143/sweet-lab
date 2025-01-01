// First, let's create the InvoiceDetails modal component
"use client";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, X, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import React from "react";
import ActionButton from "./ActionButtons";

interface InvoiceDetailsModalProps {
  item: TableItem;
  onClose: () => void;
}

const InvoiceDetailsModal: React.FC<InvoiceDetailsModalProps> = ({
  item,
  onClose,
}) => {
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
        className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-100">تفاصيل الفاتورة</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6" dir="rtl">
          {/* Invoice Header */}
          <div className="bg-slate-700/30 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-slate-400">رقم الفاتورة</p>
                <p className="text-slate-200 font-semibold">#{item.id}</p>
              </div>
              <div className="space-y-2">
                <p className="text-slate-400">التاريخ</p>
                <p className="text-slate-200">2024/03/25</p>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="bg-slate-700/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">
              تفاصيل المنتج
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-slate-400">اسم المنتج</p>
                <p className="text-slate-200">{item.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-slate-400">الكمية</p>
                <p className="text-slate-200">{item.quantity}</p>
              </div>
              <div className="space-y-2">
                <p className="text-slate-400">سعر الوحدة</p>
                <p className="text-slate-200">${item.price}</p>
              </div>
              <div className="space-y-2">
                <p className="text-slate-400">المجموع</p>
                <p className="text-emerald-400 font-semibold">
                  ${item.price * item.quantity}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-slate-700/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">
              معلومات إضافية
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-slate-400">ملاحظات</p>
                <p className="text-slate-200">ملاحظات إضافية حول الفاتورة...</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Now let's update the TabContent component
export interface TableItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface TabContentProps {
  type: string;
  tableData: TableItem[];
  onAddIncome: () => void;
  onAddExpense: () => void;
}

const TabContent: React.FC<TabContentProps> = ({
  type,
  tableData,
  onAddIncome,
  onAddExpense,
}) => {
  const [selectedItem, setSelectedItem] = React.useState<TableItem | null>(
    null
  );

  return (
    <div>
      {/* Context-specific action buttons */}
      <div className="flex justify-end gap-4 mb-6 mt-6">
        <ActionButton
          icon={<ArrowUpCircle className="h-5 w-5" />}
          label={`اضافة دخل ${type}`}
          onClick={onAddIncome}
          variant="income"
        />
        <ActionButton
          icon={<ArrowDownCircle className="h-5 w-5" />}
          label={`اضافة خرج ${type}`}
          onClick={onAddExpense}
          variant="expense"
        />
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
              <th className="p-3 text-slate-300">المعرف</th>
              <th className="p-3 text-slate-300">الاسم</th>
              <th className="p-3 text-slate-300">الكمية</th>
              <th className="p-3 text-slate-300">السعر</th>
              <th className="p-3 text-slate-300">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-700/50 hover:bg-slate-700/25 transition-colors"
              >
                <td className="p-3 text-slate-300">{item.id}</td>
                <td className="p-3 text-slate-300">{item.name}</td>
                <td className="p-3 text-slate-300">{item.quantity}</td>
                <td className="p-3 text-slate-300">${item.price}</td>
                <td className="p-3">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 text-sm"
                  >
                    <FileText className="h-4 w-4" />
                    عرض التفاصيل
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Invoice Details Modal */}
      <AnimatePresence>
        {selectedItem && (
          <InvoiceDetailsModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TabContent;
