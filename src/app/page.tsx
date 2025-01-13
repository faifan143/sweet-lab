/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Play, StopCircle } from "lucide-react";

// Components
import ActionButton from "@/components/common/ActionButtons";
import CloseShiftModal from "@/components/common/CloseShiftModal";
import InvoiceForm from "@/components/common/InvoiceForm";
import Navbar from "@/components/common/Navbar";
import ShiftModal from "@/components/common/ShiftModal";
import SplineBackground from "@/components/common/SplineBackground";
import TabContent from "@/components/common/TabContent";
import TransactionTypeModal from "@/components/common/TransactionTypeModal";

// Hooks
import { useMokkBar } from "@/components/providers/MokkBarContext";
import { useCurrentInvoices } from "@/hooks/invoices/useInvoice";
import {
  QueryShiftType,
  useCloseShift,
  useOpenShift,
  useShifts,
  useShiftSummary,
} from "@/hooks/shifts/useShifts";

// Types
import { InvoiceCategory } from "@/types/invoice.type";
import { FundType, InvoiceType, ShiftType } from "@/types/types";

// Utils
import { getFundId } from "@/utils/fund_id";

// Constants
const TABS = [
  { id: FundType.booth, label: "بسطة" },
  { id: FundType.university, label: "جامعة" },
  { id: FundType.general, label: "عام" },
];

export default function Page() {
  // Context and Queries
  const { setSnackbarConfig } = useMokkBar();
  const queryClient = useQueryClient();
  const { data: shifts, isLoading: isShiftsLoading } = useShifts();
  const [currentShift, setCurrentShift] = useState<{
    shiftType: ShiftType.evening | ShiftType.morning;
  } | null>(null);

  const {
    data: currentInvoices,
    isLoading: isCurrentInvoicesLoading,
    refetch: refetchCUrrentInvoices,
  } = useCurrentInvoices(!!currentShift);
  // State Management
  const [activeTab, setActiveTab] = useState<FundType>(FundType.booth);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showCloseShiftModal, setShowCloseShiftModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionMode, setTransactionMode] = useState<InvoiceType>(
    InvoiceType.income
  );
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [selectedInvoiceCategory, setSelectedInvoiceCategory] =
    useState<InvoiceCategory | null>(null);

  // Derived State
  const lastShiftId = shifts?.reduce(
    (maxId, item) => Math.max(maxId, item.id),
    0
  );
  const lastShift = shifts?.find((item) => item.id === lastShiftId);
  console.log("last shift : ", lastShift);

  // Mutations and Queries
  const { mutateAsync: openShift, isPending: isOpeningShift } = useOpenShift({
    onSuccess: () => handleOpenShiftSuccess(),
    onError: (error) => handleOpenShiftError(error),
  });

  const { refetch: closingShift } = useCloseShift();
  const {
    data: shiftSummary,
    isSuccess: shiftSummarySuccess,
    refetch: triggerShiftSummary,
  } = useShiftSummary();

  useEffect(() => {
    if (isShiftsLoading && lastShift) {
      updateCurrentShift(lastShift);
    }
  }, [lastShift, isShiftsLoading]);

  // Event Handlers
  const handleOpenShiftSuccess = () => {
    setShowShiftModal(false);
    refetchCUrrentInvoices();
    queryClient.refetchQueries({ queryKey: ["invoices"] });
    queryClient.refetchQueries({ queryKey: ["currentInvoices"] });
    setSnackbarConfig({
      open: true,
      severity: "success",
      message: "تم فتح وردية",
    });
  };

  const handleOpenShiftError = (error: any) => {
    setSnackbarConfig({
      open: true,
      severity: "error",
      message: error?.response?.data?.message || "فشل في فتح الوردية",
    });
  };

  const handleShiftTypeSelect = async (type: ShiftType) => {
    try {
      await openShift({
        shiftType: type === "صباحي" ? "morning" : "evening",
      });
      setCurrentShift({
        shiftType: type === "صباحي" ? ShiftType.morning : ShiftType.evening,
      });
    } catch (error) {
      console.error("Failed to open shift:", error);
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "فشل في فتح الوردية",
      });
    }
  };

  const handleConfirmShiftClose = async () => {
    if (!currentShift) return;
    try {
      const result = await closingShift();
      if (!result.data) throw new Error("No data received from server");
      handleShiftCloseSuccess();
    } catch (error) {
      handleShiftCloseError(error);
    }
  };

  const handleShiftCloseSuccess = () => {
    setCurrentShift(null);
    setShowCloseShiftModal(false);
    setActiveTab(FundType.booth);
    setSnackbarConfig({
      open: true,
      severity: "success",
      message: "تم اغلاق وردية",
    });
  };

  const handleShiftCloseError = (error: any) => {
    console.error("Error closing shift:", error);
    setSnackbarConfig({
      open: true,
      severity: "error",
      message: error?.response?.data?.message || "فشل في اغلاق الوردية",
    });
  };

  const handleAddTransaction = (type: FundType, mode: InvoiceType) => {
    setTransactionMode(mode);
    setShowTransactionModal(true);
  };

  // Helper Functions
  const updateCurrentShift = (shift: QueryShiftType) => {
    setCurrentShift(
      shift.status === "closed"
        ? null
        : {
            shiftType:
              shift.shiftType === "morning"
                ? ShiftType.morning
                : ShiftType.evening,
          }
    );
  };

  const getFilteredInvoices = () => {
    if (!currentInvoices) return [];
    const section =
      currentInvoices[
        activeTab === FundType.booth
          ? "booth"
          : activeTab === FundType.general
          ? "general"
          : "university"
      ];
    return section?.invoices || [];
  };

  // Render Methods
  const renderShiftControls = () => (
    <div
      className="flex flex-wrap gap-4 mb-8 justify-end items-center"
      dir="rtl"
    >
      {currentShift && (
        <span className="text-muted-foreground">
          الوردية الحالية:{" "}
          {currentShift.shiftType === ShiftType.morning ? "صباحية" : "مسائية"}
        </span>
      )}
      {!currentShift ? (
        <ActionButton
          icon={<Play className="h-5 w-5" />}
          label="فتح وردية"
          onClick={() => setShowShiftModal(true)}
          variant="success"
        />
      ) : (
        <ActionButton
          icon={<StopCircle className="h-5 w-5" />}
          label="اغلاق وردية"
          onClick={() => {
            setShowCloseShiftModal(true);
            triggerShiftSummary();
          }}
          variant="danger"
        />
      )}
    </div>
  );

  const renderTabs = () => (
    <div className="flex space-x-4 border-b border-border">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 -mb-px text-sm font-medium transition-colors duration-200 ${
            activeTab === tab.id
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background relative transition-colors duration-300">
      <SplineBackground activeTab={activeTab} />
      <AnimatePresence>
        {showShiftModal && (
          <ShiftModal
            isSelecting={isOpeningShift}
            onClose={() => setShowShiftModal(false)}
            onSelect={handleShiftTypeSelect}
          />
        )}
        {showCloseShiftModal && currentShift && shiftSummarySuccess && (
          <CloseShiftModal
            onClose={() => setShowCloseShiftModal(false)}
            onConfirm={handleConfirmShiftClose}
            shiftType={
              currentShift.shiftType === ShiftType.morning ? "صباحي" : "مسائي"
            }
            shiftSummary={shiftSummary || {}}
          />
        )}

        {showTransactionModal && (
          <TransactionTypeModal
            onClose={() => setShowTransactionModal(false)}
            onSelect={(category) => {
              setSelectedInvoiceCategory(category);
              setShowTransactionModal(false);
              setShowInvoiceForm(true);
            }}
            mode={transactionMode}
          />
        )}
        {showInvoiceForm && selectedInvoiceCategory && (
          <InvoiceForm
            type={selectedInvoiceCategory}
            mode={transactionMode}
            onClose={() => {
              setShowInvoiceForm(false);
              setSelectedInvoiceCategory(null);
            }}
            fundId={getFundId(activeTab)}
          />
        )}
      </AnimatePresence>
      <div className="relative z-10">
        <Navbar />
        <main className="py-32 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {renderShiftControls()}
            {currentShift && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-8"
                dir="rtl"
              >
                {renderTabs()}
                {currentInvoices && (
                  <TabContent
                    type={activeTab}
                    tableData={
                      isCurrentInvoicesLoading ? [] : getFilteredInvoices()
                    }
                    onAddIncome={() =>
                      handleAddTransaction(activeTab, InvoiceType.income)
                    }
                    onAddExpense={() =>
                      handleAddTransaction(activeTab, InvoiceType.expense)
                    }
                  />
                )}
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
