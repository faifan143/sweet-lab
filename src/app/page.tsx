"use client";
import ActionButton from "@/components/common/ActionButtons";
import CloseShiftModal from "@/components/common/CloseShiftModal";
import CustomizedSnackbars from "@/components/common/CustomizedSnackbars";
import InvoiceForm from "@/components/common/InvoiceForm";
import Navbar from "@/components/common/Navbar";
import ShiftModal from "@/components/common/ShiftModal";
import SplineBackground from "@/components/common/SplineBackground";
import TabContent from "@/components/common/TableContent";
import TransactionTypeModal from "@/components/common/TransactionTypeModal";
import { useCurrentInvoices } from "@/hooks/invoices/useInvoice";
import {
  useCloseShift,
  useOpenShift,
  useShifts,
  useShiftSummary,
} from "@/hooks/shifts/useShifts";
import useSnackbar from "@/hooks/useSnackbar";
import { InvoiceCategory } from "@/types/invoice.type";
import { FundType, InvoiceType, ShiftType } from "@/types/types";
import { getFundId } from "@/utils/fund_id";

import { AnimatePresence, motion } from "framer-motion";
import { Play, StopCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page() {
  const shifts = useShifts();
  const { data: currentInvoices, isLoading: isCurrentInvoicesLoading } =
    useCurrentInvoices();
  const lastShiftId =
    shifts.data &&
    shifts.data.reduce((medium, item) => {
      medium = item.id > medium ? item.id : medium;
      return medium;
    }, 0);
  const lastShift =
    shifts.data && shifts.data.find((item) => item.id == lastShiftId);

  // State
  const [activeTab, setActiveTab] = useState<FundType>(FundType.booth);
  const [currentShift, setCurrentShift] = useState<{
    shiftType: ShiftType.evening | ShiftType.morning;
  } | null>(null);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showCloseShiftModal, setShowCloseShiftModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionMode, setTransactionMode] = useState<InvoiceType>(
    InvoiceType.income
  );
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [selectedInvoiceCategory, setSelectedInvoiceCategory] =
    useState<InvoiceCategory | null>(null);

  useEffect(() => {
    console.log("invoicce category : ", selectedInvoiceCategory);
  }, [selectedInvoiceCategory]);

  const { setSnackbarConfig, snackbarConfig } = useSnackbar();

  const openShift = useOpenShift({
    onSuccess: () => {
      setShowShiftModal(false);
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم فتح وردية",
      });
    },
  });
  const closeShift = useCloseShift();

  useEffect(() => {
    if (shifts.isSuccess && lastShift) {
      setCurrentShift(
        lastShift.status === "closed"
          ? null
          : {
              shiftType:
                lastShift.shiftType === "morning"
                  ? ShiftType.morning
                  : ShiftType.evening,
            }
      );
    }
  }, [lastShift, shifts.isSuccess]);

  const {
    data: shiftSummary,
    isSuccess: shiftSummarySuccess,
    refetch: triggerShiftSummary,
  } = useShiftSummary();

  useEffect(() => {
    if (shiftSummary) {
      console.log(shiftSummary);
    }
  }, [shiftSummary]);

  const handleShiftOpen = () => {
    setShowShiftModal(true);
  };

  const handleShiftClose = () => {
    setShowCloseShiftModal(true);
    triggerShiftSummary();
  };

  const handleShiftTypeSelect = async (type: ShiftType) => {
    try {
      await openShift.mutateAsync({
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
      const result = await closeShift.refetch();
      if (!result.data) {
        throw new Error("No data received from server");
      }
      setCurrentShift(null);
      setShowCloseShiftModal(false);
      setActiveTab(FundType.booth);
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم اغلاق وردية",
      });
    } catch (error) {
      console.error("Error closing shift:", error);
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "فشل في اغلاق الوردية",
      });
    }
  };

  const handleAddTransaction = (type: FundType, mode: InvoiceType) => {
    setTransactionMode(mode);
    setShowTransactionModal(true);
  };

  const handleInvoiceCategorySelect = (category: InvoiceCategory) => {
    setSelectedInvoiceCategory(category);
    setShowTransactionModal(false);
    setShowInvoiceForm(true);
  };

  useEffect(() => {
    console.log("current invoices : ", currentInvoices);
  }, [currentInvoices]);

  const getFilteredInvoices = () => {
    if (!currentInvoices) return [];
    const section =
      currentInvoices[
        activeTab == FundType.booth
          ? "booth"
          : activeTab == FundType.general
          ? "general"
          : "university"
      ];
    return section?.invoices || [];
  };

  // Update the useEffect for logging
  useEffect(() => {
    if (currentInvoices) {
      console.log("Current invoices:", currentInvoices);
    }
  }, [currentInvoices]);

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
        {showCloseShiftModal && currentShift && shiftSummarySuccess && (
          <CloseShiftModal
            onClose={() => setShowCloseShiftModal(false)}
            onConfirm={handleConfirmShiftClose}
            shiftType={
              currentShift.shiftType === ShiftType.morning ? "صباحي" : "مسائي"
            }
            shiftSummary={shiftSummary}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTransactionModal && (
          <TransactionTypeModal
            onClose={() => setShowTransactionModal(false)}
            onSelect={handleInvoiceCategorySelect}
            mode={transactionMode}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
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
            {/* Stats Grid */}
            {/* <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
              dir="rtl"
            >
              {statsConfig.map((stat, index) => (
                <StatBox key={index} {...stat} />
              ))}
            </div> */}

            {isCurrentInvoicesLoading ? (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                dir="rtl"
              >
                {[1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className="bg-slate-700/30 rounded-lg p-4 animate-pulse"
                  >
                    <div className="h-4 bg-slate-600/50 rounded w-24 mb-2"></div>
                    <div className="h-6 bg-slate-600/50 rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                dir="rtl"
              >
                {/* {statsConfig.map((stat, index) => (
                  <StatBox key={index} {...stat} />
                ))} */}
              </div>
            )}
            {/* Shift Control Buttons */}
            <div
              className="flex flex-wrap gap-4 mb-8 justify-end items-center"
              dir="rtl"
            >
              {currentShift && (
                <span className="text-muted-foreground">
                  الوردية الحالية:{" "}
                  {currentShift.shiftType === ShiftType.morning
                    ? "صباحية"
                    : "مسائية"}
                </span>
              )}
              {!currentShift ? (
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
            {currentShift && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-8"
                dir="rtl"
              >
                <div className="flex space-x-4 border-b border-border">
                  {[
                    { id: FundType.booth, label: "بسطة" },
                    { id: FundType.university, label: "جامعة" },
                    { id: FundType.general, label: "عام" },
                  ].map((tab) => (
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
      <CustomizedSnackbars
        open={snackbarConfig.open}
        message={snackbarConfig.message}
        severity={snackbarConfig.severity}
        onClose={() => setSnackbarConfig((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
