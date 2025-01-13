import { Invoice } from "@/types/invoice.type";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { HomeInvoiceTable } from "./HomeInvoiceTable";
import { HomeInvoiceTableFilters } from "./HomeInvoiceTableFilters";
import { InvoiceDetailsModal } from "./InvoiceDetailsModal";
import { InvoiceStats } from "./InvoiceStats";
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

  if (isLoading) {
    return (
      <div className="p-4 text-center text-slate-400">جاري التحميل...</div>
    );
  }

  const filteredData = tableData.filter((invoice) => {
    if (dateFilter) {
      const invoiceDate = new Date(invoice.createdAt)
        .toISOString()
        .split("T")[0];
      if (invoiceDate !== dateFilter) return false;
    }

    if (statusFilter !== "all") {
      if (statusFilter === "paid" && !invoice.paidStatus) return false;
      if (statusFilter === "unpaid" && invoice.paidStatus) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <HomeInvoiceTableFilters
        dateFilter={dateFilter}
        statusFilter={statusFilter}
        onDateFilterChange={setDateFilter}
        onStatusFilterChange={setStatusFilter}
        onAddIncome={onAddIncome}
        onAddExpense={onAddExpense}
      />

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
