import { Invoice } from "@/types/invoice.type";
import { useState, useMemo } from "react";

export function useInvoiceFilters(invoices: Invoice[] | undefined) {
  const [activeStatus, setActiveStatus] = useState<"paid" | "unpaid" | "debt">(
    "paid"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filteredInvoices = useMemo(() => {
    return invoices?.filter((invoice) => {
      // Status filter
      const statusMatch = (() => {
        if (activeStatus === "paid") {
          return invoice.paidStatus === true;
        } else if (activeStatus === "unpaid") {
          return (
            invoice.paidStatus === false && invoice.invoiceCategory !== "debt"
          );
        } else if (activeStatus === "debt") {
          return (
            invoice.invoiceCategory === "debt" && invoice.paidStatus === false
          );
        }
        return true;
      })();

      // Search filter
      const searchMatch = searchTerm
        ? invoice.customer?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          invoice.invoiceNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          invoice.customer?.phone?.includes(searchTerm)
        : true;

      // Date filter
      const dateMatch = dateFilter
        ? new Date(invoice.createdAt).toISOString().split("T")[0] === dateFilter
        : true;

      return statusMatch && searchMatch && dateMatch;
    });
  }, [invoices, activeStatus, searchTerm, dateFilter]);

  console.log("Filtered Invoices  :  ", filteredInvoices);

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
