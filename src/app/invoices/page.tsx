"use client";
import Navbar from "@/components/common/Navbar";
import SplineBackground from "@/components/common/SplineBackground";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CalendarClock,
  CheckCircle,
  Clock,
  DollarSign,
  X,
} from "lucide-react";
import React, { useState } from "react";

// Types
type InvoiceStatus = "paid" | "unpaid" | "debt";
type InvoiceType = "منتجات" | "مباشر" | "دين";

interface Invoice {
  id: number;
  date: string;
  customerName: string;
  amount: number;
  type: InvoiceType;
  status: InvoiceStatus;
  dueDate?: string;
}

interface StatusTransitionModalProps {
  invoice: Invoice;
  onClose: () => void;
  onConfirm: (
    invoice: Invoice,
    newStatus: InvoiceStatus,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paymentDetails?: any
  ) => void;
  targetStatus: InvoiceStatus;
}

const StatusTransitionModal: React.FC<StatusTransitionModalProps> = ({
  invoice,
  onClose,
  onConfirm,
  targetStatus,
}) => {
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");

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
        className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-100">
            {targetStatus === "paid" ? "تحويل إلى مدفوع" : "تحويل إلى دين"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-700/30 p-4 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">رقم الفاتورة</span>
              <span className="text-slate-200">#{invoice.id}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-slate-400">المبلغ</span>
              <span className="text-slate-200">${invoice.amount}</span>
            </div>
          </div>

          {targetStatus === "paid" ? (
            <>
              <div className="space-y-2">
                <label className="block text-slate-200">تاريخ الدفع</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-slate-200">طريقة الدفع</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
                >
                  <option value="cash">نقدي</option>
                  <option value="card">بطاقة</option>
                  <option value="transfer">تحويل بنكي</option>
                </select>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <label className="block text-slate-200">تاريخ الاستحقاق</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-slate-200">ملاحظات</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 resize-none h-24"
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() =>
                onConfirm(invoice, targetStatus, {
                  paymentDate,
                  paymentMethod,
                  dueDate,
                  note,
                })
              }
              className="flex-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 rounded-lg"
            >
              تأكيد
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-slate-700/50 text-slate-300 hover:bg-slate-700 px-4 py-2 rounded-lg"
            >
              إلغاء
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Sample data
const sampleInvoices: Invoice[] = [
  {
    id: 1,
    date: "2024-03-25",
    customerName: "أحمد محمد",
    amount: 1500,
    type: "منتجات",
    status: "paid",
  },
  {
    id: 2,
    date: "2024-03-24",
    customerName: "محمد علي",
    amount: 2000,
    type: "مباشر",
    status: "unpaid",
  },
  {
    id: 3,
    date: "2024-03-23",
    customerName: "خالد أحمد",
    amount: 3000,
    type: "دين",
    status: "debt",
    dueDate: "2024-04-23",
  },
];

const InvoiceManagementPage = () => {
  const [activeTab, setActiveTab] = useState<InvoiceStatus>("paid");
  const [invoices, setInvoices] = useState<Invoice[]>(sampleInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [targetStatus, setTargetStatus] = useState<InvoiceStatus | null>(null);

  const handleStatusChange = (
    invoice: Invoice,
    newStatus: InvoiceStatus
    // paymentDetails?: any
  ) => {
    const updatedInvoices = invoices.map((inv) =>
      inv.id === invoice.id ? { ...inv, status: newStatus } : inv
    );
    setInvoices(updatedInvoices);
    setSelectedInvoice(null);
    setTargetStatus(null);
  };

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return "text-emerald-400";
      case "unpaid":
        return "text-red-400";
      case "debt":
        return "text-yellow-400";
      default:
        return "text-slate-400";
    }
  };

  const getStatusIcon = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-5 w-5" />;
      case "unpaid":
        return <AlertCircle className="h-5 w-5" />;
      case "debt":
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative">
      {/* Spline Background */}
      <SplineBackground activeTab="عام" />

      {/* Main Content */}
      <div className="relative z-10">
        <Navbar />
        <main className="pt-32 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tabs */}
            <div
              className="flex border-b border-slate-700/50 overflow-x-auto no-scrollbar overflow-hidden"
              dir="rtl"
            >
              <div className="flex min-w-full sm:min-w-0 px-2">
                <button
                  onClick={() => setActiveTab("paid")}
                  className={`px-4 py-2 -mb-px text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === "paid"
                      ? "text-emerald-400 border-b-2 border-emerald-400"
                      : "text-slate-400 hover:text-slate-300"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>الفواتير المدفوعة</span>
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("unpaid")}
                  className={`px-4 py-2 -mb-px text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === "unpaid"
                      ? "text-red-400 border-b-2 border-red-400"
                      : "text-slate-400 hover:text-slate-300"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>الفواتير غير المدفوعة</span>
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("debt")}
                  className={`px-4 py-2 -mb-px text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === "debt"
                      ? "text-yellow-400 border-b-2 border-yellow-400"
                      : "text-slate-400 hover:text-slate-300"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>فواتير الدين</span>
                  </span>
                </button>
              </div>
            </div>
            <div className="mt-6">
              {/* Desktop Table - Hidden on Mobile */}
              <div className="hidden md:block bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden backdrop-blur-sm">
                <table className="w-full" dir="rtl">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-right text-slate-300 p-4 w-24">
                        رقم الفاتورة
                      </th>
                      <th className="text-right text-slate-300 p-4">التاريخ</th>
                      <th className="text-right text-slate-300 p-4">العميل</th>
                      <th className="text-right text-slate-300 p-4 w-28">
                        النوع
                      </th>
                      <th className="text-right text-slate-300 p-4 w-28">
                        المبلغ
                      </th>
                      <th className="text-right text-slate-300 p-4 w-32">
                        الحالة
                      </th>
                      <th className="text-right text-slate-300 p-4 w-52">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices
                      .filter((invoice) => invoice.status === activeTab)
                      .map((invoice) => (
                        <tr
                          key={invoice.id}
                          className="border-b border-slate-700/50 hover:bg-slate-700/25 transition-colors"
                        >
                          <td className="p-4 text-slate-300">#{invoice.id}</td>
                          <td className="p-4 text-slate-300">{invoice.date}</td>
                          <td className="p-4 text-slate-300">
                            {invoice.customerName}
                          </td>
                          <td className="p-4 text-slate-300">{invoice.type}</td>
                          <td className="p-4 text-slate-300">
                            ${invoice.amount}
                          </td>
                          <td className="p-4">
                            <span
                              className={`flex items-center gap-2 ${getStatusColor(
                                invoice.status
                              )}`}
                            >
                              {getStatusIcon(invoice.status)}
                              {invoice.status === "paid" && "مدفوع"}
                              {invoice.status === "unpaid" && "غير مدفوع"}
                              {invoice.status === "debt" && "دين"}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {invoice.status !== "paid" && (
                                <button
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setTargetStatus("paid");
                                  }}
                                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                >
                                  <DollarSign className="h-4 w-4" />
                                  <span>تحويل لمدفوع</span>
                                </button>
                              )}
                              {invoice.status === "unpaid" && (
                                <button
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setTargetStatus("debt");
                                  }}
                                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                                >
                                  <CalendarClock className="h-4 w-4" />
                                  <span>تحويل لدين</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards - Shown only on Mobile */}
              <div className="md:hidden space-y-4" dir="rtl">
                {invoices
                  .filter((invoice) => invoice.status === activeTab)
                  .map((invoice) => (
                    <div
                      key={invoice.id}
                      className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4 space-y-3 backdrop-blur-sm"
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-slate-400 text-sm">
                            رقم الفاتورة
                          </span>
                          <p className="text-slate-200 font-semibold">
                            #{invoice.id}
                          </p>
                        </div>
                        <span
                          className={`flex items-center gap-1 text-sm ${getStatusColor(
                            invoice.status
                          )}`}
                        >
                          {getStatusIcon(invoice.status)}
                          <span className="font-medium">
                            {invoice.status === "paid" && "مدفوع"}
                            {invoice.status === "unpaid" && "غير مدفوع"}
                            {invoice.status === "debt" && "دين"}
                          </span>
                        </span>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-slate-400">التاريخ</span>
                          <p className="text-slate-200">{invoice.date}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">المبلغ</span>
                          <p className="text-slate-200">${invoice.amount}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400">العميل</span>
                          <p className="text-slate-200">
                            {invoice.customerName}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400">النوع</span>
                          <p className="text-slate-200">{invoice.type}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {invoice.status !== "paid" && (
                          <button
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setTargetStatus("paid");
                            }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors flex-1"
                          >
                            <DollarSign className="h-4 w-4" />
                            <span>تحويل لمدفوع</span>
                          </button>
                        )}
                        {invoice.status === "unpaid" && (
                          <button
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setTargetStatus("debt");
                            }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors flex-1"
                          >
                            <CalendarClock className="h-4 w-4" />
                            <span>تحويل لدين</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Status Transition Modal */}
      <AnimatePresence>
        {selectedInvoice && targetStatus && (
          <StatusTransitionModal
            invoice={selectedInvoice}
            onClose={() => {
              setSelectedInvoice(null);
              setTargetStatus(null);
            }}
            onConfirm={handleStatusChange}
            targetStatus={targetStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InvoiceManagementPage;
