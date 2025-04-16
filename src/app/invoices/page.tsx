"use client";
import InvoiceDetailModal from "@/components/common/InvoiceDetailModal";
import { InvoiceFilters } from "@/components/common/InvoiceFilters";
import { InvoiceTable } from "@/components/common/InvoiceTable";
import { InvoiceStatus, InvoiceTabs } from "@/components/common/InvoiceTabs";
import Navbar from "@/components/common/Navbar";
import PageSpinner from "@/components/common/PageSpinner";
import SplineBackground from "@/components/common/SplineBackground";
import { StatusSummary } from "@/components/common/StatusSummary";
import StatusTransitionModal from "@/components/common/StatusTransitionModal";
import { useInvoices, useMarkInvoiceAsBreak } from "@/hooks/invoices/useInvoice";
import { useInvoiceFilters } from "@/hooks/invoices/useInvoiceFilter";
import { Invoice } from "@/types/invoice.type";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import BreakageConversionModal from "@/components/common/invoices/BreakageConversionModal";
import { useMokkBar } from "@/components/providers/MokkBarContext";

const InvoiceManagementPage = () => {
  // Type toggle state - we'll add this without changing any hooks
  const [invoiceType, setInvoiceType] = useState<"income" | "expense">("income");
  const { setSnackbarConfig } = useMokkBar()
  // Use the filter status to fetch the appropriate invoices
  const {
    activeStatus,
    setActiveStatus,
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    filteredInvoices,
  } = useInvoiceFilters([]); // Start with empty array as we'll fetch data based on active status

  // Fetch invoices based on active status
  const {
    data: invoices,
    isLoading,
    isError,
    error,
  } = useInvoices(activeStatus as InvoiceStatus | "all");
  const [invoiceForBreak, setInvoiceForBreak] = useState<Invoice | null>(null);
  const markAsBreak = useMarkInvoiceAsBreak();

  // Modal states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInvoiceForDetail, setSelectedInvoiceForDetail] =
    useState<Invoice | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [targetStatus, setTargetStatus] = useState<
    "paid" | "unpaid" | "debt" | "breakage" | null
  >(null);

  // Filter invoices by type manually since we can't modify the hooks
  const typeFilteredInvoices = (invoices || []).filter(
    invoice => invoice.invoiceType === invoiceType
  );

  // Update the filtered invoices to include type filtering
  const displayInvoices =
    filteredInvoices && filteredInvoices.length > 0
      ? filteredInvoices.filter(invoice => invoice.invoiceType === invoiceType)
      : typeFilteredInvoices;

  // Type toggle handler
  const handleTypeToggle = () => {
    setInvoiceType(prev => prev === "income" ? "expense" : "income");
    // Also reset other filters for a cleaner experience
    setSearchTerm("");
    setDateFilter({ startDate: null, endDate: null });
  };


  // Handle conversion to breakage
  const handleConvertToBreak = (invoice: Invoice) => {
    setInvoiceForBreak(invoice);
  };

  // Handle confirm breakage conversion
  const handleConfirmBreakConversion = async (initialPayment: number, notes: string) => {
    if (!invoiceForBreak) return;

    try {
      await markAsBreak.mutateAsync({
        id: invoiceForBreak.id,
        data: {
          initialPayment,
          notes
        }
      });

      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم تحويل الفاتورة إلى فاتورة كسر بنجاح"
      });

      setInvoiceForBreak(null);
    } catch (error) {
      console.error("Error converting to breakage:", error);
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "حدث خطأ أثناء تحويل الفاتورة إلى فاتورة كسر"
      });
    }
  };
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-danger">
        {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative">
      <SplineBackground activeTab="عام" />
      {isLoading && <PageSpinner />}
      <div className="relative z-10">
        <Navbar />
        <main className="pt-32 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className=" mb-6">
              {/* <StatusSummary  /> */}
              <InvoiceFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                dateFilter={dateFilter}
                onDateFilterChange={setDateFilter}
              />
            </div>

            {/* Invoice Type Toggle */}
            <div className="mb-6 flex justify-between items-center" dir="rtl">
              <div className="text-xl font-bold text-slate-100">
                {invoiceType === "income" ? "فواتير الدخل" : "فواتير الصرف"}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTypeToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${invoiceType !== "income"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                  }`}
              >
                <ArrowLeftRight className="h-4 w-4" />
                <span>
                  {invoiceType === "income"
                    ? "عرض فواتير الصرف"
                    : "عرض فواتير الدخل"}
                </span>
              </motion.button>
            </div>

            {/* Status Tabs */}
            <InvoiceTabs
              activeStatus={activeStatus}
              onStatusChange={(status) => {
                setActiveStatus(status as InvoiceStatus);
                // When changing status, reset other filters for a cleaner experience
                setSearchTerm("");
                setDateFilter({ startDate: null, endDate: null });
              }}
            />

            {/* Invoices Table with type filtering */}
            <motion.div
              key={invoiceType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <InvoiceTable
                invoices={displayInvoices}
                invoiceType={invoiceType}
                onViewDetail={(invoice) => {
                  setSelectedInvoiceForDetail(invoice);
                  setIsDetailModalOpen(true);
                }}
                onStatusChange={(invoice, status) => {
                  setSelectedInvoice(invoice);
                  setTargetStatus(status);
                }}
                onConvertToBreak={handleConvertToBreak}
              />
            </motion.div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedInvoice && targetStatus && (
          <StatusTransitionModal
            invoice={selectedInvoice}
            onClose={() => {
              setSelectedInvoice(null);
              setTargetStatus(null);
            }}
            targetStatus={targetStatus}
          />
        )}


        {invoiceForBreak && (
          <BreakageConversionModal
            invoice={invoiceForBreak}
            onClose={() => setInvoiceForBreak(null)}
            onConfirm={handleConfirmBreakConversion}
            isProcessing={markAsBreak.isPending}
          />
        )}
      </AnimatePresence>

      {selectedInvoiceForDetail && (
        <InvoiceDetailModal
          invoice={selectedInvoiceForDetail}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedInvoiceForDetail(null);
          }}
        />
      )}
    </div>
  );
};

export default InvoiceManagementPage;