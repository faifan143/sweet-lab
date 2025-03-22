/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Play, StopCircle } from "lucide-react";
import { useEffect, useState } from "react";

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
import { AnyToGeneralBody, GeneralToMainBody } from "@/types/transfer.type";
import { FundType, InvoiceType, ShiftType } from "@/types/types";

// Utils
import PageSpinner from "@/components/common/PageSpinner";
import {
  useTransferAnyToGeneral,
  useTransferGeneralToMain,
} from "@/hooks/invoices/useTransfers";
import { Role, useRoles } from "@/hooks/users/useRoles";
import { setLoading } from "@/redux/reducers/wrapper.slice";
import { AppDispatch } from "@/redux/store";
import { getFundId } from "@/utils/fund_id";
import { useDispatch } from "react-redux";

// Constants
const TABS = [
  { id: FundType.booth, label: "بسطة" },
  { id: FundType.university, label: "جامعة" },
  { id: FundType.general, label: "عام" },
];

// Transfer Modal Component
const TransferModal = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  isPending,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (data: { amount: number; notes: string }) => void;
  isPending: boolean;
  sourceType?: "booth" | "university" | null;
}) => {
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card p-6 rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <h2 className="text-xl font-bold text-foreground mb-4">{title}</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="amount"
              className="text-sm font-medium text-foreground"
            >
              المبلغ
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="أدخل المبلغ..."
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="notes"
              className="text-sm font-medium text-foreground"
            >
              ملاحظات
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[100px]"
              placeholder="أدخل الملاحظات..."
            />
          </div>

          <div className="flex gap-4 justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-secondary/20 text-secondary-foreground hover:bg-secondary/30 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={() => {
                if (!amount) return;
                onSubmit({ amount: Number(amount), notes });
              }}
              disabled={!amount || isPending}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"></span>
                  جاري التحويل...
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4" />
                  تحويل
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Page() {
  // Context and Queries
  const { setSnackbarConfig } = useMokkBar();
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const {
    data: shifts,
    isLoading: isShiftsLoading,
    isSuccess: isShiftsSuccess,
  } = useShifts();
  const [currentShift, setCurrentShift] = useState<{
    shiftType: ShiftType.evening | ShiftType.morning;
  } | null>(null);

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

  // Transfer State
  const [showTransferToGeneralModal, setShowTransferToGeneralModal] =
    useState(false);
  const [showTransferToMainModal, setShowTransferToMainModal] = useState(false);

  const { hasAnyRole } = useRoles();
  // Derived State
  const lastShiftId = shifts?.reduce(
    (maxId, item) => Math.max(maxId, item.id),
    0
  );
  const lastShift = shifts?.find((item) => item.id === lastShiftId);
  const theShiftIsOpen = !lastShift?.closeTime && isShiftsSuccess;
  const {
    data: currentInvoices,
    isLoading: isCurrentInvoicesLoading,
    refetch: refetchCUrrentInvoices,
  } = useCurrentInvoices(theShiftIsOpen);

  // Mutations and Queries
  const { mutateAsync: openShift, isPending: isOpeningShift } = useOpenShift({
    onSuccess: () => handleOpenShiftSuccess(),
    onError: (error) => handleOpenShiftError(error),
  });
  const { mutateAsync: closeShift, isPending: isClosingShift } = useCloseShift({
    onSuccess: () => {
      setCurrentShift(null);
      setShowCloseShiftModal(false);
      setActiveTab(FundType.booth);
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم اغلاق وردية",
      });
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
    onError: (error) => {
      console.error("Error closing shift:", error);
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: error?.response?.data?.message || "فشل في اغلاق الوردية",
      });
    },
  });

  // Transfer Mutations
  const { mutateAsync: transferToGeneral, isPending: isTransferringToGeneral } =
    useTransferAnyToGeneral({
      onSuccess: () => {
        setShowTransferToGeneralModal(false);
        setSnackbarConfig({
          open: true,
          severity: "success",
          message: "تم تحويل المبلغ بنجاح إلى الخزينة العامة",
        });
      },
      onError: (error) => {
        setSnackbarConfig({
          open: true,
          severity: "error",
          message: error?.response?.data?.message || "فشل في تحويل المبلغ",
        });
      },
    });

  const { mutateAsync: transferToMain, isPending: isTransferringToMain } =
    useTransferGeneralToMain({
      onSuccess: () => {
        setShowTransferToMainModal(false);
        setSnackbarConfig({
          open: true,
          severity: "success",
          message: "تم تحويل المبلغ بنجاح إلى الخزينة الرئيسية",
        });
      },
      onError: (error) => {
        setSnackbarConfig({
          open: true,
          severity: "error",
          message: error?.response?.data?.message || "فشل في تحويل المبلغ",
        });
      },
    });

  const {
    data: shiftSummary,
    isSuccess: shiftSummarySuccess,
    isLoading: isSummaryLoading,
    refetch: triggerShiftSummary,
  } = useShiftSummary();

  useEffect(() => {
    dispatch(setLoading(isShiftsLoading || isSummaryLoading));
    console.log(
      "from app : Loading is set to ( " +
        `${isShiftsLoading || isSummaryLoading}` +
        " )"
    );
  }, [dispatch, isShiftsLoading, isSummaryLoading]);

  useEffect(() => {
    if (isShiftsLoading && lastShift) {
      updateCurrentShift(lastShift);
    }
  }, [lastShift, isShiftsLoading]);
  useEffect(() => {
    if (isShiftsSuccess && lastShift) {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["currentInvoices"] });
    }
  }, [lastShift, isShiftsSuccess, queryClient]);

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
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    } catch (error) {
      console.error("Failed to open shift:", error);
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "فشل في فتح الوردية",
      });
    }
  };

  const handleConfirmShiftClose = async ({
    amount,
    status,
  }: {
    status: "surplus" | "deficit";
    amount: number;
  }) => {
    if (lastShift?.closeTime) return;
    try {
      await closeShift({ status, amount });
    } catch (error) {
      console.error("Failed to close shift:", error);
    }
  };

  const handleAddTransaction = (type: FundType, mode: InvoiceType) => {
    setTransactionMode(mode);
    setShowTransactionModal(true);
  };

  // Transfer Handlers
  const handleTransferToGeneral = async (data: {
    amount: number;
    notes: string;
  }) => {
    try {
      const transferData: AnyToGeneralBody = {
        sourceId: activeTab === FundType.booth ? 3 : 4, // booth: 3, university: 4
        amount: data.amount,
        notes: data.notes,
      };

      await transferToGeneral(transferData);
    } catch (error) {
      console.error("Failed to transfer to general:", error);
    }
  };

  const handleTransferToMain = async (data: {
    amount: number;
    notes: string;
  }) => {
    try {
      const transferData: GeneralToMainBody = {
        amount: data.amount,
        notes: data.notes,
      };

      await transferToMain(transferData);
    } catch (error) {
      console.error("Failed to transfer to main:", error);
    }
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
    <div className="flex flex-wrap gap-4 mb-8 items-center" dir="rtl">
      {!theShiftIsOpen ? (
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
      {theShiftIsOpen && (
        <span className="text-muted-foreground">
          الوردية الحالية:{" "}
          {currentShift && currentShift.shiftType === ShiftType.morning
            ? "صباحية"
            : "مسائية"}
        </span>
      )}

      {/* Transfer Controls - Only show when shift is open */}
      {theShiftIsOpen && hasAnyRole([Role.ADMIN, Role.ShiftManager]) && (
        <div className="flex gap-3 ml-auto">
          {/* Show transfer to general button only on booth and university tabs */}
          {(activeTab === FundType.booth ||
            activeTab === FundType.university) && (
            <ActionButton
              icon={<ArrowUpRight className="h-5 w-5" />}
              label={`تحويل إلى الخزينة العامة`}
              onClick={() => setShowTransferToGeneralModal(true)}
              variant="income"
            />
          )}

          {/* Show transfer to main button only on general tab */}
          {activeTab === FundType.general && (
            <ActionButton
              icon={<ArrowUpRight className="h-5 w-5" />}
              label="تحويل إلى الخزينة الرئيسية"
              onClick={() => setShowTransferToMainModal(true)}
              variant="expense"
            />
          )}
        </div>
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
      {(isShiftsLoading || isCurrentInvoicesLoading) && <PageSpinner />}
      <AnimatePresence>
        {/* Original Modals */}
        {showShiftModal && (
          <ShiftModal
            isSelecting={isOpeningShift}
            onClose={() => setShowShiftModal(false)}
            onSelect={handleShiftTypeSelect}
          />
        )}
        {showCloseShiftModal && theShiftIsOpen && shiftSummarySuccess && (
          <CloseShiftModal
            onClose={() => setShowCloseShiftModal(false)}
            onConfirm={({ amount, status }) =>
              handleConfirmShiftClose({ amount, status })
            }
            shiftType={
              currentShift && currentShift.shiftType === ShiftType.morning
                ? "صباحي"
                : "مسائي"
            }
            shiftSummary={shiftSummary || {}}
            isShiftClosing={isClosingShift}
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

        {/* Transfer Modals */}
        {showTransferToGeneralModal && (
          <TransferModal
            isOpen={showTransferToGeneralModal}
            onClose={() => setShowTransferToGeneralModal(false)}
            title={`تحويل من ${
              activeTab === FundType.booth ? "البسطة" : "الجامعة"
            } إلى الخزينة العامة`}
            onSubmit={handleTransferToGeneral}
            isPending={isTransferringToGeneral}
            sourceType={activeTab === FundType.booth ? "booth" : "university"}
          />
        )}

        {showTransferToMainModal && (
          <TransferModal
            isOpen={showTransferToMainModal}
            onClose={() => setShowTransferToMainModal(false)}
            title="تحويل من الخزينة العامة إلى الخزينة الرئيسية"
            onSubmit={handleTransferToMain}
            isPending={isTransferringToMain}
          />
        )}
      </AnimatePresence>
      <div className="relative z-10">
        <Navbar />
        <main className="py-16 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {hasAnyRole([Role.ADMIN, Role.ShiftManager]) &&
              renderShiftControls()}
            {theShiftIsOpen && (
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
                    currentShiftId={currentInvoices.shiftId}
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
