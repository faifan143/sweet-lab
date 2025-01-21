"use client";
import InvoiceDetailModal from "@/components/common/InvoiceDetailModal";
import { InvoiceFilters } from "@/components/common/InvoiceFilters";
import { InvoiceTable } from "@/components/common/InvoiceTable";
import { InvoiceTabs } from "@/components/common/InvoiceTabs";
import Navbar from "@/components/common/Navbar";
import PageSpinner from "@/components/common/PageSpinner";
import SplineBackground from "@/components/common/SplineBackground";
import { StatusSummary } from "@/components/common/StatusSummary";
import StatusTransitionModal from "@/components/common/StatusTransitionModal";
import { useInvoices } from "@/hooks/invoices/useInvoice";
import { useInvoiceFilters } from "@/hooks/invoices/useInvoiceFilter";
import { Invoice } from "@/types/invoice.type";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

const InvoiceManagementPage = () => {
  const { data: invoices, isLoading, isError, error } = useInvoices();
  console.log("page invoices : ", invoices);

  const {
    activeStatus,
    setActiveStatus,
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    filteredInvoices,
  } = useInvoiceFilters(invoices);

  // Modal states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInvoiceForDetail, setSelectedInvoiceForDetail] =
    useState<Invoice | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [targetStatus, setTargetStatus] = useState<
    "paid" | "unpaid" | "debt" | null
  >(null);

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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <StatusSummary invoices={invoices} />
              <InvoiceFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                dateFilter={dateFilter}
                onDateFilterChange={setDateFilter}
              />
            </div>
            <InvoiceTabs
              activeStatus={activeStatus}
              onStatusChange={setActiveStatus}
            />
            <InvoiceTable
              invoices={filteredInvoices}
              onViewDetail={(invoice) => {
                setSelectedInvoiceForDetail(invoice);
                setIsDetailModalOpen(true);
              }}
              onStatusChange={(invoice, status) => {
                setSelectedInvoice(invoice);
                setTargetStatus(status);
              }}
            />
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
