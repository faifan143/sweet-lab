"use client";
import ActionButton from "@/components/common/ActionButtons";
import CloseShiftModal from "@/components/common/CloseShiftModal";
import InvoiceForm from "@/components/common/InvoiceForm";
import Navbar from "@/components/common/Navbar";
import ShiftModal, { ShiftType } from "@/components/common/ShiftModal";
import SplineBackground from "@/components/common/SplineBackground";
import StatBox from "@/components/common/StatBox";
import TabContent, { TableItem } from "@/components/common/TableContent";
import TransactionTypeModal, {
  TransactionType,
  TransactionMode,
} from "@/components/common/TransactionTypeModal";
import { AnimatePresence, motion } from "framer-motion";
import {
  DollarSign,
  Package,
  Play,
  StopCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [activeTab, setActiveTab] = useState("بسطة");
  const [tableData, setTableData] = useState<{ [key: string]: TableItem[] }>({
    بسطة: [
      { id: 1, name: "منتج 1", quantity: 50, price: 100 },
      { id: 2, name: "منتج 2", quantity: 30, price: 150 },
    ],
    جامعة: [
      { id: 1, name: "كتاب", quantity: 20, price: 200 },
      { id: 2, name: "قرطاسية", quantity: 100, price: 50 },
    ],
    عام: [
      { id: 1, name: "منتج عام 1", quantity: 75, price: 80 },
      { id: 2, name: "منتج عام 2", quantity: 60, price: 120 },
    ],
  });
  const [isShiftOpen, setIsShiftOpen] = useState(false);
  const [currentShiftType, setCurrentShiftType] = useState<ShiftType>(null);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showCloseShiftModal, setShowCloseShiftModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionMode, setTransactionMode] =
    useState<TransactionMode>("income");
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [selectedTransactionType, setSelectedTransactionType] =
    useState<TransactionType>(null);

  const stats = [
    {
      title: "المبيعات اليومية",
      value: "12,500$",
      icon: TrendingUp,
      trend: 12,
    },
    { title: "العملاء النشطون", value: "320", icon: Users, trend: -5 },
    { title: "الإيرادات", value: "45,000$", icon: DollarSign, trend: 8 },
    { title: "المخزون", value: "1,250", icon: Package, trend: 3 },
  ];

  const handleShiftOpen = () => setShowShiftModal(true);

  const handleShiftTypeSelect = (type: ShiftType) => {
    setCurrentShiftType(type);
    setIsShiftOpen(true);
    setShowShiftModal(false);
  };

  const handleShiftClose = () => setShowCloseShiftModal(true);

  const handleConfirmShiftClose = () => {
    setIsShiftOpen(false);
    setCurrentShiftType(null);
    setActiveTab("بسطة");
    setShowCloseShiftModal(false);
  };

  const handleAddIncome = (type: string) => {
    console.log("types are : " + type);
    setTransactionMode("income");
    setShowTransactionModal(true);
  };

  const handleAddExpense = (type: string) => {
    console.log("types are : " + type);
    setTransactionMode("expense");
    setShowTransactionModal(true);
  };

  const handleTransactionTypeSelect = (type: TransactionType) => {
    setSelectedTransactionType(type);
    setShowTransactionModal(false);
    setShowInvoiceForm(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInvoiceSubmit = (data: any) => {
    if (!selectedTransactionType || !activeTab) return;

    const newItem = {
      id: tableData[activeTab].length + 1,
      name: data.customerName,
      quantity: data.quantity ?? 1,
      price: transactionMode === "expense" ? -data.amount : data.amount,
    };

    setTableData((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newItem],
    }));

    setShowInvoiceForm(false);
    setSelectedTransactionType(null);
  };

  return (
    <div className="min-h-screen bg-background relative transition-colors duration-300">
      <SplineBackground activeTab={activeTab} />

      {/* Modals */}
      <AnimatePresence>
        {showShiftModal && (
          <ShiftModal
            onClose={() => setShowShiftModal(false)}
            onSelect={handleShiftTypeSelect}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCloseShiftModal && currentShiftType && (
          <CloseShiftModal
            onClose={() => setShowCloseShiftModal(false)}
            onConfirm={handleConfirmShiftClose}
            shiftType={currentShiftType}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTransactionModal && (
          <TransactionTypeModal
            onClose={() => setShowTransactionModal(false)}
            onSelect={handleTransactionTypeSelect}
            mode={transactionMode}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInvoiceForm && selectedTransactionType && (
          <InvoiceForm
            type={selectedTransactionType}
            mode={transactionMode}
            onClose={() => {
              setShowInvoiceForm(false);
              setSelectedTransactionType(null);
            }}
            onSubmit={handleInvoiceSubmit}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <Navbar />
        <main className="py-32 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Stats Grid */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
              dir="rtl"
            >
              {stats.map((stat, index) => (
                <StatBox key={index} {...stat} />
              ))}
            </div>

            {/* Shift Control Buttons */}
            <div
              className="flex flex-wrap gap-4 mb-8 justify-end items-center"
              dir="rtl"
            >
              {currentShiftType && (
                <span className="text-muted-foreground">
                  الوردية الحالية: {currentShiftType}
                </span>
              )}
              {!isShiftOpen ? (
                <ActionButton
                  icon={<Play className="h-5 w-5" />}
                  label="فتح وردية"
                  onClick={handleShiftOpen}
                  variant="success"
                />
              ) : (
                <ActionButton
                  icon={<StopCircle className="h-5 w-5" />}
                  label="اغلاق وردية"
                  onClick={handleShiftClose}
                  variant="danger"
                />
              )}
            </div>

            {/* Tabs and Content */}
            {isShiftOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-8"
                dir="rtl"
              >
                <div className="flex space-x-4 border-b border-border">
                  {["بسطة", "جامعة", "عام"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 -mb-px text-sm font-medium transition-colors duration-200 ${
                        activeTab === tab
                          ? "text-primary border-b-2 border-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <TabContent
                  type={activeTab}
                  tableData={tableData[activeTab]}
                  onAddIncome={() => handleAddIncome(activeTab)}
                  onAddExpense={() => handleAddExpense(activeTab)}
                />
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
