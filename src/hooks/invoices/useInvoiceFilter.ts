import { InvoiceStatus } from "@/components/common/InvoiceTabs";
import { Invoice } from "@/types/invoice.type";
import { useState, useMemo } from "react";

// Define a DateFilter type to match what you're using in your component
interface DateFilter {
  startDate: Date | null;
  endDate: Date | null;
}

export function useInvoiceFilters(invoices: Invoice[] | undefined) {
  const [activeStatus, setActiveStatus] = useState<InvoiceStatus | "all">(
    "paid"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: null,
    endDate: null,
  });

  // Filter the invoices by search term and date
  const filteredInvoices = useMemo(() => {
    if (!invoices) return [];

    return invoices.filter((invoice) => {
      // Search filter
      const searchMatch = searchTerm
        ? invoice.customer?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          invoice.invoiceNumber
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          invoice.customer?.phone?.includes(searchTerm)
        : true;

      // Date filter
      let dateMatch = true;
      if (dateFilter.startDate || dateFilter.endDate) {
        const invoiceDate = new Date(invoice.createdAt);

        if (dateFilter.startDate && dateFilter.endDate) {
          dateMatch =
            invoiceDate >= dateFilter.startDate &&
            invoiceDate <= dateFilter.endDate;
        } else if (dateFilter.startDate) {
          dateMatch = invoiceDate >= dateFilter.startDate;
        } else if (dateFilter.endDate) {
          dateMatch = invoiceDate <= dateFilter.endDate;
        }
      }

      return searchMatch && dateMatch;
    });
  }, [invoices, searchTerm, dateFilter]);

  return {
    activeStatus,
    setActiveStatus,
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    filteredInvoices,
  };
}
