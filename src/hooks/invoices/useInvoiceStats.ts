// src/hooks/invoices/useInvoiceStats.ts
import { Invoice } from "@/types/invoice.type";
import { apiClient } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

interface InvoiceStats {
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
  unpaidAmount: number;
  averageAmount: number;
  collectionRate: number;
  weeklyData: Array<{ name: string; total: number }>;
  totalAmount: number;
}

export const formatAmount = (value: number) => {
  return value.toFixed(2);
};
export const formatSYP = (amount: number) => {
  return new Intl.NumberFormat("ar-SY", {
    style: "currency",
    currency: "SYP",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatShortSYP = (amount: number) => {
  const value = amount;
  if (value >= 1000000) {
    return new Intl.NumberFormat("ar-SY", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  return new Intl.NumberFormat("ar-SY", {
    maximumFractionDigits: 0,
  }).format(value);
};

export const useInvoiceStats = () => {
  return useQuery<Invoice[], Error, InvoiceStats>({
    queryKey: ["invoices"],
    queryFn: async () => {
      const response = await apiClient.get<Invoice[]>("/invoices");
      return response;
    },
    select: (data) => {
      const totalInvoices = data.length;
      const paidInvoices = data.filter((inv) => inv.paidStatus).length;
      const unpaidAmount = data
        .filter((inv) => !inv.paidStatus)
        .reduce((sum, inv) => sum + inv.totalAmount, 0);
      const totalAmount = data.reduce((sum, inv) => sum + inv.totalAmount, 0);
      const averageAmount = totalAmount / totalInvoices;
      const collectionRate = (paidInvoices / totalInvoices) * 100;

      // Process weekly data
      const days = [
        "السبت",
        "الأحد",
        "الاثنين",
        "الثلاثاء",
        "الأربعاء",
        "الخميس",
        "الجمعة",
      ];
      //   const today = new Date();
      const weeklyData = days.map((day) => {
        const dayInvoices = data.filter((invoice) => {
          const invoiceDate = new Date(invoice.createdAt);
          return invoiceDate.getDay() === days.indexOf(day);
        });

        const total = dayInvoices.reduce(
          (sum, inv) => sum + inv.totalAmount,
          0
        );
        return {
          name: day,
          total,
        };
      });

      return {
        totalInvoices,
        paidInvoices,
        unpaidInvoices: totalInvoices - paidInvoices,
        unpaidAmount,
        averageAmount,
        collectionRate,
        weeklyData,
        totalAmount,
      };
    },
  });
};
