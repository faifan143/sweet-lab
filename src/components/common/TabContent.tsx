import { Invoice } from "@/types/invoice.type";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { HomeInvoiceTable } from "./HomeInvoiceTable";
import { HomeInvoiceTableFilters } from "./HomeInvoiceTableFilters";
import { InvoiceDetailsModal } from "./InvoiceDetailsModal";
import EditInvoiceModal from "./EditInvoiceModal";
import { InvoiceStats } from "./InvoiceStats";
import { InvoiceTypeToggle } from "./InvoiceTypeToggle";
import { FundType } from "@/types/types";
import { useDeleteInvoice } from "@/hooks/invoices/useInvoice";
import { useMokkBar } from "@/components/providers/MokkBarContext";
import DeleteConfirmationModal from "./invoices/DeleteConfirmationModal";
import TransfersSection from "./shifts/TransfersSection";

interface TabContentProps {
  type: FundType;
  tableData: Invoice[];
  isLoading?: boolean;
  onAddIncome: () => void;
  onAddExpense: () => void;
  currentShiftId: number;
}

const TabContent: React.FC<TabContentProps> = ({
  tableData,
  isLoading,
  onAddIncome,
  onAddExpense,
  currentShiftId,
}) => {
  const { setSnackbarConfig } = useMokkBar();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | null>(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "unpaid">(
    "all"
  );
  const [activeType, setActiveType] = useState<"income" | "expense">("income");

  // Delete invoice mutation
  const deleteInvoice = useDeleteInvoice({
    onSuccess: () => {
      setInvoiceToDelete(null);
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم حذف الفاتورة بنجاح",
      });
    },
    onError: (error) => {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: error?.response?.data?.message || "فشل في حذف الفاتورة",
      });
    },
  });

  const handleConfirmDelete = async () => {
    if (invoiceToDelete) {
      await deleteInvoice.mutateAsync(invoiceToDelete.id);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-slate-400">جاري التحميل...</div>
    );
  }

  const filteredData = tableData.filter((invoice) => {
    // First filter by invoice type
    if (invoice.invoiceType !== activeType) return false;
    // Then apply date filter
    if (dateFilter) {
      const invoiceDate = new Date(invoice.createdAt)
        .toISOString()
        .split("T")[0];
      if (invoiceDate !== dateFilter) return false;
    }
    // Finally apply status filter
    if (statusFilter !== "all") {
      if (statusFilter === "paid" && !invoice.paidStatus) return false;
      if (statusFilter === "unpaid" && invoice.paidStatus) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-center overflow-hidden overflow-x-auto no-scrollbar mt-5">
        <div className="sm:ml-auto">
          <InvoiceTypeToggle activeType={activeType} onToggle={setActiveType} />
        </div>
        <HomeInvoiceTableFilters
          dateFilter={dateFilter}
          statusFilter={statusFilter}
          onDateFilterChange={setDateFilter}
          onStatusFilterChange={setStatusFilter}
          onAddIncome={onAddIncome}
          onAddExpense={onAddExpense}
        />
      </div>
      <HomeInvoiceTable
        data={filteredData}
        onViewDetails={(invoice) => setSelectedInvoice(invoice)}
        onEditInvoice={(invoice) => setInvoiceToEdit(invoice)}
        onDeleteInvoice={(invoice) => setInvoiceToDelete(invoice)}
      />
      <InvoiceStats data={filteredData} />
      <TransfersSection currentShiftId={currentShiftId} />

      <AnimatePresence>
        {selectedInvoice && (
          <InvoiceDetailsModal
            invoice={selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
          />
        )}
        {invoiceToEdit && (
          <EditInvoiceModal
            invoice={invoiceToEdit}
            onClose={() => setInvoiceToEdit(null)}
          />
        )}
        {invoiceToDelete && (
          <DeleteConfirmationModal
            invoice={invoiceToDelete}
            isDeleting={deleteInvoice.isPending}
            onConfirm={handleConfirmDelete}
            onCancel={() => setInvoiceToDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TabContent;
