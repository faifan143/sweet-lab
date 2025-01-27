// TabContent.tsx
import { Invoice } from "@/types/invoice.type";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { HomeInvoiceTable } from "./HomeInvoiceTable";
import { HomeInvoiceTableFilters } from "./HomeInvoiceTableFilters";
import { InvoiceDetailsModal } from "./InvoiceDetailsModal";
import { InvoiceStats } from "./InvoiceStats";
import { InvoiceTypeToggle } from "./InvoiceTypeToggle";
import { FundType } from "@/types/types";

interface TabContentProps {
  type: FundType;
  tableData: Invoice[];
  isLoading?: boolean;
  onAddIncome: () => void;
  onAddExpense: () => void;
}

const TabContent: React.FC<TabContentProps> = ({
  tableData,
  isLoading,
  onAddIncome,
  onAddExpense,
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "unpaid">(
    "all"
  );
  const [activeType, setActiveType] = useState<"income" | "expense">("income");

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
      />

      <InvoiceStats data={filteredData} />

      <AnimatePresence>
        {selectedInvoice && (
          <InvoiceDetailsModal
            invoice={selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TabContent;
